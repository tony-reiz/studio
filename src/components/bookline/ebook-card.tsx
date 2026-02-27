'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import Image from 'next/image';

interface EbookCardProps {
  ebook?: Ebook;
  className?: string;
  isActive?: boolean;
  onCardClick?: (ebook: Ebook) => void;
}

export function EbookCard({ ebook, className, isActive, onCardClick }: EbookCardProps) {
  const { favoritedEbooks, toggleFavoriteEbook } = useEbooks();
  
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

  const isPdf = ebook?.pdfDataUrl.startsWith('data:application/pdf');

  const cardContent = (
    <Card 
      className={cn('bg-transparent border-0 shadow-none', className)}
    >
      <CardContent
        className={cn(
          'aspect-[210/297] p-0 flex items-start justify-end rounded-[25px] overflow-hidden relative',
          !ebook && (isActive ? 'bg-[#AFAFAF]' : 'bg-[#DFDFDF]')
        )}
      >
        {ebook?.pdfDataUrl && (
          isPdf ? (
            <object data={`${ebook.pdfDataUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110" title="Aperçu du PDF" />
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
