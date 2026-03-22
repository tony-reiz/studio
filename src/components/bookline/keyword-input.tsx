'use client';

import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';
import { getEbookSearchSuggestions } from '@/ai/flows/ai-powered-search-suggestions';
import { useToast } from '@/hooks/use-toast';
import { useEbooks } from '@/context/ebook-provider';
import { GlassEffect } from './glass-effect';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

type KeywordState = 'entering' | 'visible' | 'removing';
interface Keyword {
  id: string;
  text: string;
  state: KeywordState;
}

interface KeywordInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function KeywordInput({ value, onChange, placeholder }: KeywordInputProps) {
  const { error } = useFormField();
  const { t, allEbooks } = useEbooks();
  const [keywords, setKeywords] = useState<Keyword[]>(() =>
    value ? value.split(',').map(k => ({ id: k.trim(), text: k.trim(), state: 'visible' })).filter(k => k.text) : []
  );
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ text: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalValueRef = useRef(value);

  const debouncedInputValue = useDebounce(inputValue, 300);
  const { toast } = useToast();

  // Sync keywords state up to the parent form controller.
  useEffect(() => {
    const newValue = keywords.filter(k => k.state !== 'removing').map(k => k.text).join(', ');
    if (newValue !== internalValueRef.current) {
        internalValueRef.current = newValue;
        onChange(newValue);
    }
  }, [keywords, onChange]);

  // Sync from parent if value changes externally (e.g. form.reset())
  useEffect(() => {
    const newParentValue = value || '';
    if (newParentValue !== internalValueRef.current) {
        setKeywords(
            newParentValue ? newParentValue.split(',').map(k => ({ id: k.trim(), text: k.trim(), state: 'visible' })).filter(k => k.text) : []
        );
        internalValueRef.current = newParentValue;
    }
  }, [value]);

  // Fetch suggestions from AI flow
  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedInputValue.trim().length > 0) {
        setIsLoading(true);
        setSuggestions([]);
        try {
          const result = await getEbookSearchSuggestions({ partialQuery: debouncedInputValue });
          const existingKeywords = new Set(keywords.map(k => k.text.toLowerCase()));
          
          let filteredSuggestions = result.suggestions.filter(s => !existingKeywords.has(s.toLowerCase()));

          // If no suggestions match, but the user typed something, suggest what they typed.
          if (filteredSuggestions.length === 0 && debouncedInputValue.trim().length > 0) {
              if (!existingKeywords.has(debouncedInputValue.trim().toLowerCase())) {
                  filteredSuggestions = [debouncedInputValue.trim()];
              }
          }
          
          const suggestionsWithCounts = filteredSuggestions.map(suggestion => {
            const count = allEbooks.filter(ebook => 
              ebook.keywords.split(',').map(k => k.trim().toLowerCase()).includes(suggestion.toLowerCase())
            ).length;
            return { text: suggestion, count };
          });

          setSuggestions(suggestionsWithCounts);
        } catch (error) {
          console.error('Failed to fetch keyword suggestions:', error);
          toast({
            variant: "destructive",
            title: t('error'),
            description: t('cant_fetch_suggestions'),
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }
    if(debouncedInputValue.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [debouncedInputValue, keywords, toast, t, allEbooks]);


  // Handle entry animation
  useEffect(() => {
    const hasEntering = keywords.some(k => k.state === 'entering');
    if (hasEntering) {
      const timer = setTimeout(() => {
        setKeywords(current => current.map(k => (k.state === 'entering' ? { ...k, state: 'visible' } : k)));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [keywords]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [keywords.length]);


  const addKeyword = (text: string) => {
    let newKeywordText = text.trim();
    if (newKeywordText.endsWith(',')) {
      newKeywordText = newKeywordText.slice(0, -1).trim();
    }
    if (newKeywordText && !keywords.some(k => k.text.toLowerCase() === newKeywordText.toLowerCase())) {
      const newKeywords = [...keywords, { id: crypto.randomUUID(), text: newKeywordText, state: 'entering' }];
      setKeywords(newKeywords);
    }
    setInputValue('');
    setSuggestions([]);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addKeyword(inputValue);
    } else if (event.key === 'Backspace' && inputValue === '' && keywords.length > 0) {
      const lastKeyword = keywords.findLast(k => k.state !== 'removing');
      if (lastKeyword) {
        event.preventDefault();
        removeKeyword(lastKeyword.id);
      }
    }
  };

  const removeKeyword = (idToRemove: string) => {
    setKeywords(current =>
      current.map(k => (k.id === idToRemove ? { ...k, state: 'removing' } : k))
    );

    setTimeout(() => {
      setKeywords(current => {
        const newKeywords = current.filter(k => k.id !== idToRemove);
        return newKeywords;
      });
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addKeyword(suggestion);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsSuggestionsVisible(true);
  }

  const handleBlur = () => {
    setTimeout(() => {
        if(containerRef.current && !containerRef.current.contains(document.activeElement)) {
            setIsSuggestionsVisible(false);
            if (inputValue.trim()) {
                addKeyword(inputValue);
            }
        }
    }, 200);
  }
  
  return (
    <div ref={containerRef} className="relative">
        <div 
            className={cn(
                "flex items-center h-12 w-full rounded-full p-0 relative isolate overflow-hidden",
                error ? 'ring-2 ring-destructive ring-offset-2' : ''
            )}
            onClick={() => inputRef.current?.focus()}
        >
            <GlassEffect />
            <div ref={scrollContainerRef} className="relative z-20 flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-12">
                {keywords.map((keyword) => (
                    <Badge 
                        key={keyword.id} 
                        variant="default" 
                        className={cn(
                            "flex-shrink-0 whitespace-nowrap rounded-full py-1 px-3 transition-opacity duration-500",
                            keyword.state !== 'visible' && 'opacity-0'
                        )}
                    >
                    {keyword.text}
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeKeyword(keyword.id);
                        }} 
                        className="ml-1.5 rounded-full outline-none hover:bg-primary/80 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <X className="h-3 w-3" />
                    </button>
                    </Badge>
                ))}
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={keywords.length === 0 ? placeholder : ''}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="bg-transparent border-0 h-full p-0 m-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[100px] flex-grow"
                />
            </div>
            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>

        {isSuggestionsVisible && (suggestions.length > 0) && (
            <div className="absolute z-30 w-full mt-2 bg-secondary rounded-xl p-2 shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <p className="px-2 py-1 text-xs text-muted-foreground">{t('search_suggestions')}</p>
                <ul className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        <button
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-background/70 transition-colors flex justify-between items-center"
                        >
                          <span>{suggestion.text}</span>
                          <span className="text-xs text-muted-foreground">{suggestion.count} {t('publications')}</span>
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}
