'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';

const Document = dynamic(
  () =>
    import('react-pdf').then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      return mod.Document;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
});


interface EbookCardProps {
  ebook?: Ebook;
  className?: string;
  isActive?: boolean;
  onCardClick?: (ebook: Ebook) => void;
}

export function EbookCard({ ebook, className, isActive, onCardClick }: EbookCardProps) {
  const { favoritedEbooks, toggleFavoriteEbook } = useEbooks();
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isFavorited = ebook ? favoritedEbooks.some(favEbook => favEbook.id === ebook.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ebook) {
      toggleFavoriteEbook(ebook);
    }
  };
  
  const handleCardClick = () => {
    if (ebook && onCardClick) {
      onCardClick(ebook);
    }
  };

  useEffect(() => {
    const setWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    const element = containerRef.current;
    if (!element) return;
    
    setWidth();
    
    const resizeObserver = new ResizeObserver(setWidth);
    resizeObserver.observe(element);

    return () => {
        resizeObserver.unobserve(element);
    };
  }, []);

  const isPdf = ebook?.pdfDataUrl.startsWith('data:application/pdf');

  const cardContent = (
    <Card 
      className={cn('bg-transparent border-0 shadow-lg', className)}
    >
      <CardContent
        ref={containerRef}
        className={cn(
          'aspect-[210/297] p-0 flex items-start justify-end rounded-[25px] overflow-hidden relative',
          !ebook && (isActive ? 'bg-[#AFAFAF]' : 'bg-[#DFDFDF]')
        )}
      >
        {ebook?.pdfDataUrl && (
          isPdf ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
              <Document
                  file={ebook.pdfDataUrl}
                  loading={null}
                  className="flex items-center justify-center overflow-hidden w-full h-full"
              >
                  <Page
                      pageNumber={1}
                      width={containerWidth ? containerWidth * 1.1 : undefined} // Mimic scale-110
                      className={cn(!containerWidth && 'invisible', 'drop-shadow-lg')}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                  />
              </Document>
            </div>
          ) : (
            <Image src={ebook.pdfDataUrl} alt={ebook.title || 'Ebook cover'} fill style={{ objectFit: 'cover' }} />
          )
        )}
        
        {ebook && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-0 right-0 m-4 p-0 z-10"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={cn(
                'h-7 w-7 transition-colors drop-shadow-md',
                isFavorited
                  ? 'text-foreground fill-foreground'
                  : 'text-white fill-white'
              )}
            />
          </button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn(ebook && onCardClick ? 'cursor-pointer' : '')} onClick={handleCardClick}>
      {cardContent}
    </div>
  );
}
