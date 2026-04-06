'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

interface EbookCardProps {
  ebook?: Ebook;
  className?: string;
  onCardClick?: (ebook: Ebook) => void;
}

export function EbookCard({ ebook, className, onCardClick }: EbookCardProps) {
  const { favoritedEbooks, toggleFavoriteEbook, t } = useEbooks();
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set the width of the container for the PDF page
  useEffect(() => {
    const measureAndSetWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    measureAndSetWidth();
    window.addEventListener('resize', measureAndSetWidth);
    return () => window.removeEventListener('resize', measureAndSetWidth);
  }, []);

  const isFavorited = ebook ? favoritedEbooks.some(favEbook => favEbook.id === ebook.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
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

  const isPdf = ebook?.pdfDataUrl?.startsWith('data:application/pdf');

  // Simple loading state component
  const LoadingState = () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  // Simple error state component
  const ErrorState = () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary p-4">
      <p className="text-center text-sm text-destructive">{t('pdf_display_error')}</p>
    </div>
  );

  return (
    <div className={cn(ebook && onCardClick ? 'cursor-pointer' : '', className)} onClick={handleCardClick}>
      <Card className='bg-secondary border-0 rounded-[25px] overflow-hidden shadow-lg'>
        <CardContent ref={containerRef} className='aspect-[210/297] p-0 flex items-center justify-center relative'>
          {!ebook ? (
            <div className="w-full h-full bg-secondary" />
          ) : (
            <>
              <div className="absolute inset-0 w-full h-full">
                {isPdf ? (
                  <Document
                    file={ebook.pdfDataUrl}
                    loading={<LoadingState />}
                    error={<ErrorState />}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <Page 
                      pageNumber={1} 
                      width={width > 0 ? width : undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<LoadingState />} 
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
              <button
                onClick={handleFavoriteClick}
                className="absolute top-0 right-0 m-4 p-0 z-20"
                aria-label={t('add_to_favorites')}
              >
                <Heart
                  className={cn(
                    'h-7 w-7 transition-colors drop-shadow-md',
                    isFavorited ? 'text-black fill-black' : 'text-white fill-white'
                  )}
                />
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
