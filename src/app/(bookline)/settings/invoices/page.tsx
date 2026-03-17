'use client';

import { ChevronLeft, ArrowUpCircle, ArrowDownCircle, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';

const transactionsData = [
  { id: '1', type: 'income', description: 'Vente - "Le guide du cosmos"', date: '25 juil. 2026', amount: 17.00 },
  { id: '2', type: 'expense', description: 'Achat - "Cuisiner comme un chef"', date: '23 juil. 2026', amount: -23.50 },
  { id: '3', type: 'income', description: 'Vente - "L\'art de la photographie"', date: '15 juil. 2026', amount: 22.00 },
  { id: '4', type: 'expense', description: 'Abonnement BookLine Pro', date: '01 juil. 2026', amount: -10.00 },
  { id: '5', type: 'income', description: 'Gain parrainage', date: '28 juin 2026', amount: 1.00 },
  { id: '6', type: 'income', description: 'Vente - "Le guide du cosmos"', date: '25 juin 2026', amount: 17.00 },
  { id: '7', type: 'expense', description: 'Achat - "Cuisiner comme un chef"', date: '23 juin 2026', amount: -23.50 },
];


export default function InvoicesPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formatCurrency = (amount: number) => {
    const sign = amount > 0 ? '+' : '';
    return `${sign}${amount.toFixed(2).replace('.', ',')} €`;
  }

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
          <h1 className="text-2xl font-bold text-center">{t('history')}</h1>
          <div className="justify-self-end">
            <Button variant="outline" className="rounded-full">
                <Receipt className="h-5 w-5 mr-2" />
                {t('invoices')}
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col pt-8 pb-28">
            <ul className="space-y-2">
            {transactionsData.map(transaction => (
                <li key={transaction.id}>
                    <div className="w-full bg-secondary/80 p-3 rounded-lg flex items-center justify-between text-left">
                        <div className='flex items-center gap-3'>
                            {transaction.type === 'income' ? (
                                <ArrowUpCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                            ) : (
                                <ArrowDownCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                            )}
                            <div className='flex flex-col'>
                                <span className="font-semibold text-sm leading-tight">{transaction.description}</span>
                                <span className="text-xs text-muted-foreground">{transaction.date}</span>
                            </div>
                        </div>
                        <span className={cn(
                            "font-bold text-sm",
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        )}>
                            {formatCurrency(transaction.amount)}
                        </span>
                    </div>
                </li>
            ))}
            </ul>
        </main>
      </div>
    </div>
  );
}
