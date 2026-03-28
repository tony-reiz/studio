'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { currencies, type Currency } from '@/lib/currencies';
import { GlassEffect } from '@/components/bookline/glass-effect';

export default function CurrencySettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, currency: currentGlobalCurrency, setCurrency, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currentGlobalCurrency);
  const [initialCurrency, setInitialCurrency] = useState<Currency>(currentGlobalCurrency);

  useEffect(() => {
    setIsClient(true);
    setInitialCurrency(currentGlobalCurrency);
    setSelectedCurrency(currentGlobalCurrency);
  }, [currentGlobalCurrency]);

  const handleSave = () => {
    setCurrency(selectedCurrency);
    handleBack();
  };

  const isChanged = selectedCurrency.code !== initialCurrency.code;

  return (
    <div className={cn("min-h-screen text-foreground bg-background")}>
      <div className="w-full max-w-sm mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center w-full py-6">
          <div className="justify-self-start">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <GlassEffect />
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('currency')}</h1>
        </header>

        <main className="w-full flex flex-col items-center pt-8 pb-32 gap-4">
          <ul className="w-full space-y-[17px]">
            {currencies.map((curr) => (
              <li key={curr.code}>
                <button
                  onClick={() => setSelectedCurrency(curr)}
                  className={cn(
                    "w-full rounded-full flex items-center justify-between px-4 h-12 text-left transition-colors",
                    selectedCurrency.code === curr.code
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-foreground'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{t(curr.nameKey)}</span>
                  </div>
                  <span className="font-semibold">{curr.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>

       <div className="fixed bottom-0 left-0 right-0 p-4 pb-8">
          <div className="w-full max-w-sm mx-auto">
              <Button 
                  onClick={handleSave}
                  disabled={!isChanged}
                  className={cn(
                    "rounded-full w-full h-12 text-lg font-semibold transition-colors",
                    isChanged 
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-secondary text-muted-foreground"
                  )}
              >
                  {t('save')}
              </Button>
          </div>
      </div>
    </div>
  );
}
