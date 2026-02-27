'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EbookCard } from './ebook-card';
import { type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ebooks: Ebook[];
}

export function SearchOverlay({ isOpen, onClose, ebooks }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleNavigate } = useTransitionRouter();

  useEffect(() => {
    let visibilityTimer: NodeJS.Timeout;
    let renderTimer: NodeJS.Timeout;

    if (query.length > 0) {
      setShouldRenderContent(true);
      visibilityTimer = setTimeout(() => setIsContentVisible(true), 20); // Small delay for rendering
      
      const lowerCaseQuery = query.toLowerCase();
      const filtered = ebooks.filter(
        (ebook) =>
          ebook.title.toLowerCase().includes(lowerCaseQuery) ||
          ebook.description.toLowerCase().includes(lowerCaseQuery) ||
          ebook.keywords.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredEbooks(filtered);

    } else {
      setIsContentVisible(false);
      renderTimer = setTimeout(() => {
        setShouldRenderContent(false)
        setFilteredEbooks([]);
      }, 300); // Match animation duration
    }
    
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(renderTimer);
    };
  }, [query, ebooks]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Reset query which will trigger the fade out effect
      if (query) setQuery('');
    }
  }, [isOpen, query]);

  const handleEbookClick = (ebook: Ebook) => {
    handleNavigate(`/buy/${ebook.id}`);
  };


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
          <Button variant="ghost" onClick={onClose} className="text-sm hover:bg-transparent">
            Annuler
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div
            className={cn(
              'max-w-4xl mx-auto w-full transition-opacity duration-300',
              isContentVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
             {shouldRenderContent && (
              <>
                {filteredEbooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {filteredEbooks.map((ebook) => (
                      <EbookCard key={ebook.id} ebook={ebook} onCardClick={handleEbookClick} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground mt-12">
                    Aucun résultat trouvé pour "{query}".
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
