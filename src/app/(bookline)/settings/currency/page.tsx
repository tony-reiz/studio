'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
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
    <div className={cn("min-h-screen text-foreground bg-transparent")}>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className="w-full max-w-screen-md mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
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
                    <div className="flex flex-col">
                      <span className="font-semibold">{curr.name}</span>
                      <span className={cn(
                        "text-sm",
                         selectedCurrency.code === curr.code ? 'text-background/70' : 'text-muted-foreground'
                      )}>{curr.nativeName}</span>
                    </div>
                  </div>
                  <span className="font-semibold">{curr.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>

       <div className="fixed bottom-8 left-0 right-0 p-4" style={{ paddingBottom: `calc(2rem + env(safe-area-inset-bottom))` }}>
          <div className="w-full max-w-[16rem] mx-auto">
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
