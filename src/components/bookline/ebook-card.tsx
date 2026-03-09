'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), {
  ssr: false,
});
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
        if (element) {
            resizeObserver.unobserve(element);
        }
    };
  }, []);

  const isPdf = ebook?.pdfDataUrl.startsWith('data:application/pdf');

  return (
    <div className={cn(ebook && onCardClick ? 'cursor-pointer' : '')} onClick={handleCardClick}>
      <Card 
        className={cn('bg-secondary border-0 rounded-[25px] overflow-hidden', !ebook && 'glass-form-element', className)}
      >
        <CardContent
          ref={containerRef}
          className={cn(
            'aspect-[210/297] p-0 flex items-center justify-center relative'
          )}
        >
          {ebook ? (
              <>
                  {ebook.pdfDataUrl && (
                    <div className="absolute inset-0 w-full h-full">
                      {isPdf ? (
                        <Document
                            file={ebook.pdfDataUrl}
                            loading={<div className="w-full h-full bg-secondary" />}
                            className="flex items-center justify-center overflow-hidden w-full h-full"
                        >
                            <Page
                                pageNumber={1}
                                width={containerWidth ? containerWidth : undefined}
                                className={cn(!containerWidth && 'invisible')}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </Document>
                      ) : (
                        <Image 
                          src={ebook.pdfDataUrl} 
                          alt={ebook.title || 'Ebook cover'} 
                          fill 
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                      )}
                    </div>
                  )}
                  
                  <button
                      onClick={handleFavoriteClick}
                      className="absolute top-0 right-0 m-4 p-0 z-20"
                      aria-label="Ajouter aux favoris"
                  >
                      <Heart
                        className={cn(
                          'h-7 w-7 transition-colors drop-shadow-md',
                          isFavorited
                            ? 'text-black fill-black'
                            : 'text-white fill-white'
                        )}
                      />
                  </button>
              </>
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
