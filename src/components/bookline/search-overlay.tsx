'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EbookCard } from './ebook-card';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { BuyEbookSheet } from './buy-ebook-sheet';

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
  const isMobile = useIsMobile();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

  useEffect(() => {
    let visibilityTimer: NodeJS.Timeout;
    let renderTimer: NodeJS.Timeout;

    if (isOpen) {
      setShouldRenderContent(true);
      // Wait a moment for the content structure to render before starting the animation
      visibilityTimer = setTimeout(() => setIsContentVisible(true), 50);

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
                const isRecommended = selectedInterests.some(interest => ebookKeywords.some(keyword => interest.includes(keyword) || keyword.includes(interest)));

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
      // Wait for exit animation to complete before unmounting content
      renderTimer = setTimeout(() => {
        setShouldRenderContent(false);
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleEbookClick = (ebook: Ebook) => {
    const isOwnPublication = publishedEbooks.some(p => p.id === ebook.id);
    if (isOwnPublication) {
        onClose();
        setTimeout(() => handleNavigate(`/ebook/${ebook.id}`), 300);
    } else {
        if (isMobile) {
            setSelectedEbook(ebook);
        } else {
            onClose();
            setTimeout(() => handleNavigate(`/buy/${ebook.id}`), 300);
        }
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
        setSelectedEbook(null);
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

  const showEmptyState = !query && recommendedEbooks.length === 0 && otherEbooks.length === 0;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out',
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
              'flex items-center gap-2 p-4 pt-6 mb-2 transition-all duration-300 ease-out max-w-4xl mx-auto w-full',
              isContentVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
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
              className='max-w-4xl mx-auto w-full'
            >
              {shouldRenderContent && (
                <>
                  {query.length > 0 ? (
                    <>
                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                          {searchResults.map((ebook, index) => (
                            <div
                              key={`search-${ebook.id}`}
                              className={cn(
                                  "transition-all duration-300 ease-out",
                                  isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                              )}
                              style={{ transitionDelay: `${index * 75}ms` }}
                            >
                              <EbookCard ebook={ebook} onCardClick={() => handleEbookClick(ebook)} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={cn("text-center text-muted-foreground mt-12 transition-all duration-300 ease-out", isContentVisible ? 'opacity-100' : 'opacity-0')}>
                          {`Aucun résultat trouvé pour "${query}".`}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {recommendedEbooks.length > 0 && (
                        <div className="mb-8">
                          <h3 className={cn("text-sm font-semibold text-muted-foreground mb-4 transition-all duration-300 ease-out", isContentVisible ? 'opacity-100' : 'opacity-0' )} style={{transitionDelay: '100ms'}}>Suggestions pour vous</h3>
                          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                            {recommendedEbooks.map((ebook, index) => (
                              <div
                                  key={`rec-${ebook.id}`}
                                  className={cn(
                                      "transition-all duration-300 ease-out flex-shrink-0 w-[45%] sm:w-1/3",
                                      isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                  )}
                                  style={{ transitionDelay: `${150 + index * 75}ms` }}
                              >
                                  <EbookCard ebook={ebook} onCardClick={() => handleEbookClick(ebook)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {otherEbooks.length > 0 && (
                        <div>
                          {recommendedEbooks.length > 0 && (
                            <h3 className={cn("text-sm font-semibold text-muted-foreground mb-4 transition-all duration-300 ease-out", isContentVisible ? 'opacity-100' : 'opacity-0' )} style={{transitionDelay: `${150 + recommendedEbooks.length * 75}ms`}}>Autres ebooks</h3>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                            {otherEbooks.map((ebook, index) => (
                              <div
                                  key={`other-${ebook.id}`}
                                  className={cn(
                                      "transition-all duration-300 ease-out",
                                      isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                  )}
                                  style={{ transitionDelay: `${200 + recommendedEbooks.length * 75 + index * 75}ms` }}
                              >
                                  <EbookCard ebook={ebook} onCardClick={() => handleEbookClick(ebook)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showEmptyState && (
                          <div className={cn("text-center text-muted-foreground mt-12 transition-all duration-300 ease-out", isContentVisible ? 'opacity-100' : 'opacity-0' )}>
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
      <BuyEbookSheet ebook={selectedEbook} onOpenChange={handleSheetOpenChange} />
    </>
  );
}
