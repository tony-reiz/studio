'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EbookCardProps {
  className?: string;
  isActive?: boolean;
}

export function EbookCard({ className, isActive }: EbookCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className={cn('bg-transparent border-0 shadow-none', className)}>
      <CardContent
        className={cn(
          'aspect-[210/297] p-0 flex items-start justify-end rounded-[25px] overflow-hidden relative',
          isActive ? 'bg-[#AFAFAF]' : 'bg-[#DFDFDF]'
        )}
      >
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
