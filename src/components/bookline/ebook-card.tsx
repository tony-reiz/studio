'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
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
    loading: () => null,
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when ebook prop changes
    setIsLoaded(false);
  }, [ebook?.id]);
  
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

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const cardContent = (
    <Card 
      className={cn('bg-transparent border-0 rounded-[25px]', !ebook && 'glass-form-element', className)}
    >
      <CardContent
        ref={containerRef}
        className={cn(
          'aspect-[210/297] p-0 flex items-center justify-center rounded-[25px] overflow-hidden relative bg-transparent'
        )}
      >
        {ebook ? (
            <>
                {/* Gray placeholder that fades out */}
                <div className={cn(
                    "absolute inset-0 bg-secondary transition-opacity duration-500 z-10 overflow-hidden",
                    isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                )}>
                    <div className="absolute inset-0 -translate-x-full animate-shimmer-card bg-gradient-to-r from-transparent via-muted to-transparent"></div>
                </div>
                
                {/* Content that fades in */}
                {ebook.pdfDataUrl && (
                  <div className={cn(
                      "absolute inset-0 w-full h-full transition-opacity duration-500",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {isPdf ? (
                      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
                        <Document
                            file={ebook.pdfDataUrl}
                            loading={null}
                            className="flex items-center justify-center overflow-hidden w-full h-full"
                        >
                            <Page
                                pageNumber={1}
                                width={containerWidth ? containerWidth * 1.1 : undefined} // Mimic scale-110
                                className={cn(!containerWidth && 'invisible')}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                onRenderSuccess={handleLoad}
                            />
                        </Document>
                      </div>
                    ) : (
                      <Image 
                        src={ebook.pdfDataUrl} 
                        alt={ebook.title || 'Ebook cover'} 
                        fill 
                        style={{ objectFit: 'cover' }}
                        onLoad={handleLoad}
                        unoptimized
                      />
                    )}
                  </div>
                )}
                
                {/* Heart button */}
                <button
                    onClick={handleFavoriteClick}
                    className={cn(
                        "absolute top-0 right-0 m-4 p-0 z-20 transition-opacity duration-500",
                        isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    )}
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
            </>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn(ebook && onCardClick ? 'cursor-pointer' : '')} onClick={handleCardClick}>
      {cardContent}
    </div>
  );
}
