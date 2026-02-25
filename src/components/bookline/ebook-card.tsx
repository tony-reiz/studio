'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EbookCardProps {
  className?: string;
  isActive?: boolean;
  isInitiallyFavorited?: boolean;
  pdfDataUrl?: string;
}

export function EbookCard({ className, isActive, isInitiallyFavorited = false, pdfDataUrl }: EbookCardProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);

  return (
    <Card className={cn('bg-transparent border-0 shadow-none', className)}>
      <CardContent
        className={cn(
          'aspect-[210/297] p-0 flex items-start justify-end rounded-[25px] overflow-hidden relative',
          !pdfDataUrl && (isActive ? 'bg-[#AFAFAF]' : 'bg-[#DFDFDF]')
        )}
      >
        {pdfDataUrl && (
          <object data={`${pdfDataUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110" title="Aperçu du PDF" />
        )}
        <button
          onClick={() => setIsFavorited(prev => !prev)}
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
}
