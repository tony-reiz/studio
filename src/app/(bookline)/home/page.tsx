'use client';

import { useState, useEffect } from 'react';
import { Menu, User, Search, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
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

export default function HomePage() {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between w-full py-6">
          <div className="flex flex-col items-start">
            <Button variant="ghost" size="icon" aria-label="Menu" className="-ml-[6px] hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7">
              <Menu />
            </Button>
            <div className="-mt-1">
              <p className="text-[24px] font-bold tracking-widest text-foreground">BIENVENUE</p>
              <h1 className="text-6xl font-extrabold text-primary -mt-1">PRENOM !</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="recherchez vos ebook..."
                        className="pl-11 pr-4 h-11 w-64 text-sm bg-secondary border-0 rounded-full focus-visible:ring-primary focus-visible:ring-2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {isLoading && <LoaderCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
                </div>

                {debouncedQuery && (suggestions.length > 0 || isLoading) && (
                    <div className="absolute top-full mt-2 w-full z-10">
                        <div className="bg-secondary rounded-lg p-4 animate-in fade-in-50 shadow-lg">
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
                    </div>
                )}
            </div>
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
              <User className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex flex-col w-full flex-1 pb-28">
          <EbookDisplayArea />
        </main>
      </div>
    </div>
  );
}
