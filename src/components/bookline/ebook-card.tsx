'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';

interface EbookCardProps {
  ebook?: Ebook;
  className?: string;
  isActive?: boolean;
}

export function EbookCard({ ebook, className, isActive }: EbookCardProps) {
  const { favoritedEbooks, toggleFavoriteEbook } = useEbooks();
  const transitionRouter = useTransitionRouter();
  
  const isFavorited = ebook ? favoritedEbooks.some(favEbook => favEbook.id === ebook.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ebook) {
      toggleFavoriteEbook(ebook);
    }
  };
  
  const handleCardClick = () => {
    if (ebook) {
      transitionRouter.handleNavigate(`/ebook/${ebook.id}`);
    }
  };

  const cardContent = (
    <Card 
      className={cn('bg-transparent border-0 shadow-none', className)}
      onClick={handleCardClick}
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
        
        {ebook && (
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
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn(ebook ? 'cursor-pointer' : '')}>
      {cardContent}
    </div>
  );
}
