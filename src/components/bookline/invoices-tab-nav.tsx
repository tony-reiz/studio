'use client';

import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';

export type ActiveInvoiceTab = 'sales' | 'subscriptions' | 'referrals';

interface InvoicesTabNavProps {
  activeTab: ActiveInvoiceTab;
  setActiveTab: (tab: ActiveInvoiceTab) => void;
}

export function InvoicesTabNav({ activeTab, setActiveTab }: InvoicesTabNavProps) {
  const { t } = useEbooks();

  const getLeftPosition = () => {
    switch (activeTab) {
      case 'sales':
        return '0%';
      case 'subscriptions':
        return '33.33%';
      case 'referrals':
        return '66.66%';
      default:
        return '0%';
    }
  };

  return (
    <div className="relative bg-secondary rounded-full flex items-center w-full max-w-sm md:max-w-lg mx-auto">
      <div
        className="absolute top-0 h-full w-1/3 rounded-full bg-foreground dark:bg-white transition-all duration-500 ease-in-out z-10"
        style={{ left: getLeftPosition() }}
      />
      <button
        onClick={() => setActiveTab('sales')}
        className={cn(
          'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'sales' ? 'text-background dark:text-black' : 'text-foreground'
        )}
      >
        {t('invoices_sales')}
      </button>
      <button
        onClick={() => setActiveTab('subscriptions')}
        className={cn(
          'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'subscriptions' ? 'text-background dark:text-black' : 'text-foreground'
        )}
      >
        {t('invoices_subscriptions')}
      </button>
      <button
        onClick={() => setActiveTab('referrals')}
        className={cn(
          'relative z-20 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'referrals' ? 'text-background dark:text-black' : 'text-foreground'
        )}
      >
        {t('invoices_referrals')}
      </button>
    </div>
  );
}
