'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function TransferSettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    setIsClient(true);
    const storedIban = localStorage.getItem('bookline-iban') || '';
    const storedBic = localStorage.getItem('bookline-bic') || '';
    setIban(storedIban);
    setBic(storedBic);
    if (!storedIban || !storedBic) {
      setIsEditing(true);
    }
  }, []);

  const handleSaveOrEdit = () => {
    if (isEditing) {
      // Save logic
      if (iban.trim() === '' || bic.trim() === '') return;
      
      localStorage.setItem('bookline-iban', iban);
      localStorage.setItem('bookline-bic', bic);
      setSaveStatus('success');
      setIsEditing(false);

      setTimeout(() => {
          setSaveStatus('idle');
      }, 2000);
    } else {
      // Edit logic
      setIsEditing(true);
    }
  };
  
  const totalRevenue = 0;
  const payoutThreshold = 20;

  const canSave = iban.trim() !== '' && bic.trim() !== '';

  return (
    <div className={cn("min-h-screen text-foreground bg-background")}>
      <div className="w-full max-w-sm mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center w-full py-6">
          <div className="justify-self-start">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <div className="glass-container"><div className="glass-effect-backdrop"></div></div>
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('transfer')}</h1>
        </header>

        <main className="w-full flex flex-col items-center pt-8 pb-32 gap-8">
            <div className="w-full text-center space-y-4">
                <div>
                    <p className="text-muted-foreground">{t('current_balance')}</p>
                    <p className="text-4xl font-bold">{totalRevenue.toFixed(2).replace('.', ',')} €</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('payout_threshold_info')}</p>
                </div>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-4">
                <div className="w-full flex flex-col gap-4">
                    <p className="font-semibold px-2">{t('bank_details')}</p>
                    <div className="relative w-full rounded-full bg-secondary">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-30">IBAN</span>
                        <Input 
                            placeholder="FR76..." 
                            value={iban} 
                            onChange={(e) => setIban(e.target.value.toUpperCase())}
                            disabled={!isEditing}
                            className="pl-16 pr-4 h-12 w-full text-base bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground relative z-20"
                        />
                    </div>
                     <div className="relative w-full rounded-full bg-secondary">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-30">BIC</span>
                        <Input 
                            placeholder="SOGEFRPP..." 
                            value={bic} 
                            onChange={(e) => setBic(e.target.value.toUpperCase())} 
                            disabled={!isEditing}
                            className="pl-16 pr-4 h-12 w-full text-base bg-transparent border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground relative z-20"
                        />
                    </div>
                    <Button 
                        onClick={handleSaveOrEdit}
                        disabled={isEditing && !canSave}
                        className={cn(
                            "rounded-full w-full h-12 text-lg font-semibold transition-colors duration-300 disabled:opacity-100",
                             saveStatus === 'success' 
                                ? "bg-green-600 text-white hover:bg-green-700" 
                                : (isEditing && !canSave)
                                    ? "bg-secondary text-muted-foreground"
                                    : "bg-foreground text-background hover:bg-foreground/90"
                        )}
                    >
                        {saveStatus === 'success' ? t('saved') : (isEditing ? t('save') : t('modify'))}
                    </Button>
                </div>

                 <div className="w-full bg-secondary text-secondary-foreground rounded-2xl p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                    <p className="text-xs">{t('payout_info_text')}</p>
                 </div>
            </div>
        </main>
      </div>

       <div className="fixed bottom-0 left-0 right-0 p-4 pb-8">
          <div className="w-full max-w-[16rem] mx-auto">
              <Button
                  disabled={totalRevenue < payoutThreshold}
                  className={cn(
                      "rounded-full w-full h-12 text-lg font-semibold transition-colors",
                      totalRevenue >= payoutThreshold
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "bg-secondary text-muted-foreground"
                  )}
              >
                  {t('request_payout')}
              </Button>
          </div>
      </div>
    </div>
  );
}
