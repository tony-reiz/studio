'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Ebook } from '@/context/ebook-provider';

interface EbookCardProps {
  ebook?: Ebook;
  className?: string;
  isActive?: boolean;
  isInitiallyFavorited?: boolean;
}

export function EbookCard({ ebook, className, isActive, isInitiallyFavorited = false }: EbookCardProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(prev => !prev);
  };

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
          <object data={`${ebook.pdfDataUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110" title="Aperçu du PDF" />
        )}
        
        <button
          onClick={handleFavoriteClick}
          className="absolute top-0 right-0 m-4 p-0 z-10"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={cn(
              'h-7 w-7 transition-colors',
              isFavorited
                ? 'text-foreground fill-foreground'
                : 'text-white fill-white'
            )}
          />
        </button>
      </CardContent>
    </Card>
  );

  if (!ebook) {
    return cardContent;
  }

  return (
    <Link href={`/ebook/${ebook.id}`} className="block">
      {cardContent}
    </Link>
  );
}
