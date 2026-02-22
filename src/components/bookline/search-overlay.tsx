'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<boolean[]>([]);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFavorites(new Array(PlaceHolderImages.length).fill(false));
  }, []);

  const toggleFavorite = (index: number) => {
    setFavorites(prev => {
      const newFavorites = [...prev];
      newFavorites[index] = !newFavorites[index];
      return newFavorites;
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (query.length > 0) {
      setShouldRenderContent(true);
    } else {
      timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 300); // Match animation duration
    }
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to allow for the animation to start
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    >
      <div 
        className="flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'flex items-center gap-2 p-4 pt-6 mb-6 transition-all duration-300 ease-in-out max-w-4xl mx-auto w-full',
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          )}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="recherchez vos ebook..."
              className="pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" onClick={onClose} className="text-sm">
            Annuler
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div
            className={cn(
              'max-w-4xl mx-auto w-full transition-opacity duration-300',
              shouldRenderContent ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="grid grid-cols-3 gap-8">
              {PlaceHolderImages.map((image, index) => (
                <Card key={image.id} className="bg-transparent border-0 rounded-[25px] shadow-none">
                  <CardContent
                    className="aspect-[3/4] p-0 flex items-start justify-end rounded-[25px] overflow-hidden relative"
                    style={{ backgroundColor: '#DFDFDF' }}
                  >
                    <button
                      onClick={() => toggleFavorite(index)}
                      className="absolute top-0 right-0 m-4 p-0 z-10"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart
                        className={cn(
                          'h-7 w-7 transition-colors',
                          favorites[index]
                            ? 'text-foreground fill-foreground'
                            : 'text-white fill-white'
                        )}
                      />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
