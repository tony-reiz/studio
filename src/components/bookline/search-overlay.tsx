'use client';

import { useState } from 'react';
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

  return (
    <div
      className={cn(
        'fixed inset-0 bg-background z-50 transform transition-transform duration-500 ease-in-out',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex flex-col h-full p-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
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
          {query.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} className="bg-secondary border-0 rounded-2xl shadow-none">
                  <CardContent className="aspect-[3/4] p-2 flex items-start justify-end">
                    <Heart className="h-5 w-5 text-muted-foreground/50" />
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
