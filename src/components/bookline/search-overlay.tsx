'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EbookCard } from './ebook-card';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ebooks: Ebook[];
}

export function SearchOverlay({ isOpen, onClose, ebooks }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [recommendedEbooks, setRecommendedEbooks] = useState<Ebook[]>([]);
  const [otherEbooks, setOtherEbooks] = useState<Ebook[]>([]);
  const [searchResults, setSearchResults] = useState<Ebook[]>([]);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleNavigate } = useTransitionRouter();
  const { publishedEbooks, selectedInterests } = useEbooks();

  useEffect(() => {
    let visibilityTimer: NodeJS.Timeout;
    let renderTimer: NodeJS.Timeout;

    if (isOpen) {
      setShouldRenderContent(true);
      visibilityTimer = setTimeout(() => setIsContentVisible(true), 20);

      if (query.length > 0) {
        setRecommendedEbooks([]);
        setOtherEbooks([]);
        const lowerCaseQuery = query.toLowerCase();
        const filtered = ebooks.filter(
          (ebook) =>
            ebook.title.toLowerCase().includes(lowerCaseQuery) ||
            ebook.description.toLowerCase().includes(lowerCaseQuery) ||
            ebook.keywords.toLowerCase().includes(lowerCaseQuery)
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
        const recommended: Ebook[] = [];
        const others: Ebook[] = [];

        if (selectedInterests.length > 0) {
            ebooks.forEach(ebook => {
                const ebookKeywords = ebook.keywords.toLowerCase().split(',').map(k => k.trim());
                const isRecommended = selectedInterests.some(interest => ebookKeywords.includes(interest));

                if (isRecommended) {
                    recommended.push(ebook);
                } else {
                    others.push(ebook);
                }
            });
        } else {
            others.push(...ebooks);
        }
        
        setRecommendedEbooks(recommended);
        setOtherEbooks(others);
      }
    } else {
      setIsContentVisible(false);
      renderTimer = setTimeout(() => {
        setShouldRenderContent(false);
        setRecommendedEbooks([]);
        setOtherEbooks([]);
        setSearchResults([]);
        if (query) setQuery('');
      }, 300); // Match animation duration
    }
    
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(renderTimer);
    };
  }, [query, ebooks, isOpen, selectedInterests]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleEbookClick = (ebook: Ebook) => {
    const isOwnPublication = publishedEbooks.some(p => p.id === ebook.id);
    if (isOwnPublication) {
        handleNavigate(`/ebook/${ebook.id}`);
    } else {
        handleNavigate(`/buy/${ebook.id}`);
    }
  };

  const getEmptyStateMessage = () => {
    if (query) {
      return `Aucun résultat trouvé pour "${query}".`
    }
    if (selectedInterests.length > 0) {
      return "Aucun ebook ne correspond à vos intérêts pour le moment."
    }
    return "Saisissez une recherche pour trouver des ebooks."
  }

  const showEmptyState = query.length === 0 && recommendedEbooks.length === 0 && otherEbooks.length === 0;

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
            'flex items-center gap-2 p-4 pt-6 mb-2 transition-all duration-300 ease-in-out max-w-4xl mx-auto w-full',
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
                {query.length > 0 ? (
                  <>
                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                        {searchResults.map((ebook) => (
                          <EbookCard key={ebook.id} ebook={ebook} onCardClick={handleEbookClick} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground mt-12">
                        {`Aucun résultat trouvé pour "${query}".`}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {recommendedEbooks.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Suggestions pour vous</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                          {recommendedEbooks.map((ebook) => (
                            <EbookCard key={ebook.id} ebook={ebook} onCardClick={handleEbookClick} />
                          ))}
                        </div>
                      </div>
                    )}

                    {otherEbooks.length > 0 && (
                      <div>
                        {recommendedEbooks.length > 0 && (
                          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Autres ebooks</h3>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                          {otherEbooks.map((ebook) => (
                            <EbookCard key={ebook.id} ebook={ebook} onCardClick={handleEbookClick} />
                          ))}
                        </div>
                      </div>
                    )}

                    {showEmptyState && (
                        <div className="text-center text-muted-foreground mt-12">
                            {getEmptyStateMessage()}
                        </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
