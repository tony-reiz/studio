'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, LoaderCircle } from 'lucide-react';
import { getEbookSearchSuggestions } from '@/ai/flows/ai-powered-search-suggestions';
import { useToast } from '@/hooks/use-toast';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchSection() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.trim().length > 1) {
        setIsLoading(true);
        setSuggestions([]);
        try {
          const result = await getEbookSearchSuggestions({ partialQuery: debouncedQuery });
          setSuggestions(result.suggestions);
        } catch (error) {
          console.error('Failed to fetch search suggestions:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les suggestions de recherche.",
          })
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery, toast]);

  return (
    <div className="w-full py-8">
      <div className="text-left mb-6">
        <p className="text-muted-foreground text-lg">Bonjour Alex,</p>
        <h1 className="text-4xl font-bold font-headline text-primary">Bookline</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des Ebooks..."
          className="pl-10 h-12 text-base bg-input border-0 focus-visible:ring-primary focus-visible:ring-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
      </div>
      {debouncedQuery && (suggestions.length > 0 || isLoading) && (
        <div className="mt-4 bg-secondary rounded-lg p-4 animate-in fade-in-50">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Suggestions de recherche</h3>
          <ul className="space-y-1">
            {isLoading && !suggestions.length ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="h-8 bg-accent rounded-md animate-pulse"></li>
              ))
            ) : (
              suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    {suggestion}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
