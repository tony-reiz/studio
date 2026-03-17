'use client';

import { ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
}

const salesInvoices: Invoice[] = [
  { id: 'sale-1', date: '25/07/2026', description: 'Vente - "Le guide du cosmos"', amount: '17,00 €' },
  { id: 'sale-2', date: '23/07/2026', description: 'Achat - "Cuisiner comme un chef"', amount: '-23,50 €' },
  { id: 'sale-3', date: '15/07/2026', description: 'Vente - "L\'art de la photographie"', amount: '22,00 €' },
];

const subscriptionInvoices: Invoice[] = [
  { id: 'sub-1', date: '01/07/2026', description: 'Abonnement BookLine Pro', amount: '-10,00 €' },
  { id: 'sub-2', date: '01/06/2026', description: 'Abonnement BookLine Pro', amount: '-10,00 €' },
];

const referralInvoices: Invoice[] = [
    { id: 'ref-1', date: '20/07/2026', description: 'Gain de parrainage', amount: '1,00 €' },
];


function InvoiceList({ invoices }: { invoices: Invoice[] }) {
    const { t } = useEbooks();
    if (invoices.length === 0) {
        return <p className="text-muted-foreground text-center pt-8">{t('no_invoices_in_category')}</p>;
    }
    return (
        <ul className="space-y-3">
            {invoices.map(invoice => (
                <li key={invoice.id} className="bg-secondary p-4 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-semibold">{invoice.description}</span>
                        <span className="text-sm text-muted-foreground">{invoice.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg">{invoice.amount}</span>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Download className="h-5 w-5" />
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default function InvoicesPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'ventes' | 'abonnements' | 'parrainage'>('ventes');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLeftPosition = () => {
    switch (activeTab) {
      case 'ventes':
        return '0%';
      case 'abonnements':
        return '33.3333%';
      case 'parrainage':
        return '66.6666%';
      default:
        return '0%';
    }
  };

  const handleTabChange = (newTab: 'ventes' | 'abonnements' | 'parrainage') => {
    if (activeTab === newTab) {
      return;
    }
    setActiveTab(newTab);
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
          <h1 className="text-2xl font-bold text-center">{t('invoices')}</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-4">
          <div className="flex justify-center w-full">
            <div className="relative isolate overflow-hidden rounded-full flex items-center w-full max-w-md mx-auto mb-6">
              <GlassEffect />
              <div
                className="absolute top-0 h-full w-1/3 rounded-full bg-foreground dark:bg-white transition-all duration-500 ease-in-out z-10"
                style={{ left: getLeftPosition() }}
              />
              <button
                onClick={() => handleTabChange('ventes')}
                className={cn(
                  'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
                  activeTab === 'ventes' ? 'text-background dark:text-black' : 'text-foreground'
                )}
              >
                {t('invoices_sales')}
              </button>
              <button
                onClick={() => handleTabChange('abonnements')}
                className={cn(
                  'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
                  activeTab === 'abonnements' ? 'text-background dark:text-black' : 'text-foreground'
                )}
              >
                {t('invoices_subscriptions')}
              </button>
              <button
                onClick={() => handleTabChange('parrainage')}
                className={cn(
                  'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
                  activeTab === 'parrainage' ? 'text-background dark:text-black' : 'text-foreground'
                )}
              >
                {t('invoices_referrals')}
              </button>
            </div>
          </div>
          
          <div className="w-full">
            {activeTab === 'ventes' && <InvoiceList invoices={salesInvoices} />}
            {activeTab === 'abonnements' && <InvoiceList invoices={subscriptionInvoices} />}
            {activeTab === 'parrainage' && <InvoiceList invoices={referralInvoices} />}
          </div>
        </main>
      </div>
    </div>
  );
}