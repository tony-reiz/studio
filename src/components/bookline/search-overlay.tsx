'use client';

import { useState, useEffect } from 'react';
import { Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [hasQuery, setHasQuery] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setHasQuery(query.length > 0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      if (hasQuery) {
        setShouldRender(true);
      } else {
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, 300); // Corresponds to the animation duration
        return () => clearTimeout(timer);
      }
    } else {
      setShouldRender(false);
    }
  }, [hasQuery, isOpen]);

  return (
    <div
      className={cn(
        'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col h-full p-4 pt-6">
        <div
          className={cn(
            'flex items-center gap-2 mb-6 transition-all duration-300 ease-in-out',
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          )}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="recherchez vos ebook..."
              className="pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" onClick={onClose} className="text-sm">
            Annuler
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {shouldRender && (
            <div
              className={cn(
                'grid grid-cols-3 gap-6',
                hasQuery
                  ? 'animate-in fade-in duration-300'
                  : 'animate-out fade-out duration-300'
              )}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} className="bg-secondary border-0 rounded-[25px] shadow-none">
                  <CardContent className="aspect-[3/4] p-0 flex items-start justify-end rounded-[25px] overflow-hidden">
                    <Heart className="h-5 w-5 text-muted-foreground/50 m-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
