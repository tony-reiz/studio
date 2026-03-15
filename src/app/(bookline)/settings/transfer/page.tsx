'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';
import { Input } from '@/components/ui/input';

export default function TransferSettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you'd fetch these values.
    const storedIban = localStorage.getItem('bookline-iban') || '';
    const storedBic = localStorage.getItem('bookline-bic') || '';
    setIban(storedIban);
    setBic(storedBic);
  }, []);
  
  useEffect(() => {
      if (!isClient) return;
      const storedIban = localStorage.getItem('bookline-iban') || '';
      const storedBic = localStorage.getItem('bookline-bic') || '';
      setIsChanged(iban !== storedIban || bic !== storedBic);
  }, [iban, bic, isClient]);


  const handleSave = () => {
    // In a real app, you'd save these to a secure backend.
    localStorage.setItem('bookline-iban', iban);
    localStorage.setItem('bookline-bic', bic);
    setIsChanged(false);
    handleBack();
  };
  
  const totalRevenue = 0; // This would come from context/backend

  return (
    <div className={cn("min-h-screen text-foreground bg-transparent")}>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className="w-full max-w-sm mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center w-full py-6">
          <div className="justify-self-start">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <GlassEffect />
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('transfer')}</h1>
        </header>

        <main className="w-full flex flex-col items-center pt-8 pb-32 gap-8">
            <div className="w-full text-center">
                <p className="text-muted-foreground">{t('current_balance')}</p>
                <p className="text-4xl font-bold">{totalRevenue.toFixed(2).replace('.', ',')} €</p>
                <p className="text-sm text-muted-foreground mt-1">{t('next_payout_date')}</p>
            </div>

            <div className="w-full space-y-4">
                <div className="relative w-full">
                    <p className="font-semibold mb-2 px-2">{t('bank_details')}</p>
                    <div className="relative w-full isolate overflow-hidden rounded-full mb-4">
                        <GlassEffect />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-30">IBAN</span>
                        <Input 
                            placeholder="FR76..." 
                            value={iban} 
                            onChange={(e) => setIban(e.target.value.toUpperCase())}
                            className="pl-16 pr-4 h-12 w-full text-base bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground relative z-20"
                        />
                    </div>
                     <div className="relative w-full isolate overflow-hidden rounded-full">
                        <GlassEffect />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-30">BIC</span>
                        <Input 
                            placeholder="SOGEFRPP..." 
                            value={bic} 
                            onChange={(e) => setBic(e.target.value.toUpperCase())} 
                            className="pl-16 pr-4 h-12 w-full text-base bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground relative z-20"
                        />
                    </div>
                </div>
            </div>

             <div className="w-full bg-secondary text-secondary-foreground rounded-2xl p-4 flex items-start gap-3">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                <p className="text-xs">{t('payout_info_text')}</p>
             </div>
        </main>
      </div>

       <div className="fixed bottom-0 left-0 right-0 p-4 pb-8">
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
