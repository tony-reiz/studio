'use client';

import { ChevronLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';

const monthlyInvoicesData = [
  { id: '2026-07', month: 'Juillet 2026' },
  { id: '2026-06', month: 'Juin 2026' },
  { id: '2026-05', month: 'Mai 2026' },
];

export default function InvoicesPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <GlassEffect />
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('invoices')}</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-8">
            <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">{t('total_purchases_this_month')}</p>
                    <p className="text-2xl font-bold">0,00 €</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">{t('earnings_this_month')}</p>
                    <p className="text-2xl font-bold">0,00 €</p>
                </div>
            </div>

            <div className="w-full">
                <h2 className="text-xl font-semibold mb-4">{t('documents')}</h2>
                <ul className="space-y-2">
                {monthlyInvoicesData.map(invoice => (
                    <li key={invoice.id}>
                        <button className="w-full bg-secondary px-4 py-3 rounded-lg flex items-center justify-between text-left hover:bg-accent transition-colors">
                            <div className='flex items-center gap-3'>
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold">{invoice.month}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8">
                                <Download className="h-5 w-5" />
                            </Button>
                        </button>
                    </li>
                ))}
                </ul>
            </div>
        </main>
      </div>
    </div>
  );
}
