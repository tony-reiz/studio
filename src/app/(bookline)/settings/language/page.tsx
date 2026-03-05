'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/languages';

export default function LanguageSettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Default to French
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.body.classList.add('has-fluid-background');
    return () => {
      document.body.classList.remove('has-fluid-background');
    };
  }, []);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setSearchQuery('');
    // In a real app, this would be saved and i18n would be handled.
    // For now, it's a visual selection.
    handleBack();
  };

  const filteredLanguages = searchQuery
    ? languages.filter(
        (lang) =>
          lang.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          lang.nativeName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          lang.flag.includes(searchQuery)
      )
    : [];

  const selectedLanguageObject = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className={cn("min-h-screen text-foreground bg-transparent")}>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center w-full py-6">
          <div className="justify-self-start">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label="Retour">
                <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">Langue</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Rechercher une langue..."
              className="pl-11 pr-4 h-12 w-full text-base glass-form-element bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full text-center py-2">
            <p className="text-sm text-muted-foreground">Langue sélectionnée</p>
            <div className="text-lg font-semibold text-foreground flex justify-center items-center gap-2">
                <span>{selectedLanguageObject?.flag}</span>
                <span>{selectedLanguageObject?.name || 'Français'}</span>
            </div>
          </div>

          {searchQuery && (
            <ul className="w-full space-y-2">
              {filteredLanguages.map((lang) => (
                <li key={lang.code}>
                  <button 
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{lang.name}</span>
                        <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                      </div>
                    </div>
                    {selectedLanguage === lang.code && <Check className="h-6 w-6 text-foreground" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
