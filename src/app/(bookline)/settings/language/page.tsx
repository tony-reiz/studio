'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

export default function LanguageSettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Default to French

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
    // In a real app, this would be saved and i18n would be handled.
    // For now, it's a visual selection.
    handleBack();
  };

  return (
    <div className={cn("min-h-screen text-foreground bg-transparent")}>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-center w-full py-6 relative">
          <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11 absolute left-0" aria-label="Retour">
              <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Langue</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-16 pb-28 gap-2">
          <ul className="w-full space-y-2">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button 
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                >
                  <span className="font-semibold text-foreground">
                    {lang.name}
                  </span>
                  {selectedLanguage === lang.code && <Check className="h-6 w-6 text-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
