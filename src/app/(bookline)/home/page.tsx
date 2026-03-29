'use client';

import { useState, useEffect, useMemo } from 'react';
import { Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
import { SearchOverlay } from '@/components/bookline/search-overlay';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { MobileSettingsSheet } from '@/components/bookline/mobile-settings-sheet';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { handleNavigate } = useTransitionRouter();
  const { allEbooks, theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const menuButton = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('menu')}
      className="w-11 h-11 rounded-full relative isolate overflow-hidden -mt-2 sm:mt-0 hover:bg-transparent"
    >
      <GlassEffect />
      <Menu className="h-6 w-6 relative z-20" />
    </Button>
  );

  const transactionsData = useMemo(() => [
    { id: '1', date: '01 juil. 2026', amount: 0 },
    { id: '2', date: '02 juil. 2026', amount: 17.00 },
    { id: '3', date: '03 juil. 2026', amount: -23.50 },
    { id: '4', date: '04 juil. 2026', amount: 0 },
    { id: '5', date: '05 juil. 2026', amount: 22.00 },
    { id: '6', date: '06 juil. 2026', amount: 0 },
    { id: '7', date: '07 juil. 2026', amount: -10.00 },
    { id: '8', date: '08 juil. 2026', amount: 1.00 },
    { id: '9', date: '09 juil. 2026', amount: 12.00 },
    { id: '10', date: '10 juil. 2026', amount: 0 },
    { id: '11', date: '11 juil. 2026', amount: 17.00 },
    { id: '12', date: '12 juil. 2026', amount: -18.50 },
    { id: '13', date: '13 juil. 2026', amount: 0 },
    { id: '14', date: '14 juil. 2026', amount: 0 },
    { id: '15', date: '15 juil. 2026', amount: 22.00 },
    { id: '16', date: '18 juil. 2026', amount: 17.00 },
    { id: '17', date: '20 juil. 2026', amount: -35.00 },
    { id: '18', date: '22 juil. 2026', amount: 1.00 },
    { id: '19', date: '25 juil. 2026', amount: 22.00 },
    { id: '20', date: '28 juil. 2026', amount: 12.00 },
    { id: '21', date: '30 juil. 2026', amount: -15.50 },
  ], []);

  const balanceData = useMemo(() => {
    const dailyNet: { [key: number]: number } = {};

    transactionsData.forEach(t => {
        const day = parseInt(t.date.split(' ')[0]);
        if (!dailyNet[day]) {
            dailyNet[day] = 0;
        }
        dailyNet[day] += t.amount;
    });

    const result = [];
    let cumulativeBalance = 0;
    for (let i = 1; i <= 31; i++) {
        cumulativeBalance += dailyNet[i] || 0;
        result.push({
            day: String(i),
            solde: cumulativeBalance,
        });
    }
    return result;
  }, [transactionsData]);

  const SimpleBalanceChart = () => (
    <div className="w-full h-[200px] max-w-[672px] mx-auto md:hidden mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))'} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2}/>
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                  tick={{ dy: 5 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${'\'\'\''}${value}€`}
                  domain={['dataMin - 20', 'dataMax + 20']}
                  allowDecimals={false}
                  width={40}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background/95 p-2 shadow-sm">
                                    <div className="grid grid-cols-1 gap-1">
                                        <span className="text-[10px] text-muted-foreground">{t('balance_date_label').replace('{day}', label)}</span>
                                        <div className="flex items-baseline">
                                            <p className="font-bold text-base">{`${'\'\'\''}${payload[0].value?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="solde" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#balanceGradient)" 
                    name={t('balance')}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );

  return (
    <div className={cn("flex flex-col h-screen text-foreground bg-background")}>
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <header className="sticky top-0 z-10 w-full pb-6" style={{ paddingTop: `calc(1.5rem + env(safe-area-inset-top))` }}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start gap-3">
              {isClient ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : menuButton}
              <div className="-mt-1">
                <p className="text-[24px] font-bold tracking-widest text-foreground dark:text-[#a3a3a3]">{t('welcome_to')}</p>
                <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground dark:text-[#a3a3a3] -mt-1">{t('bookline')}</h1>
              </div>
            </div>
            <div className="flex items-start sm:items-center shrink-0 gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                  <button
                      onClick={() => setIsSearchOpen(true)}
                      className="relative flex items-center pl-11 pr-4 h-11 w-40 sm:w-64 text-sm rounded-full text-left focus:outline-none isolate overflow-hidden"
                  >
                      <GlassEffect />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-20" />
                      <span className="truncate relative z-20">{t('search_ebooks')}</span>
                  </button>
              </div>
              <Button onClick={() => handleNavigate('/profile?tab=achats')} variant="ghost" size="icon" className="-mt-2 sm:mt-0 w-11 h-11 rounded-full relative isolate overflow-hidden hover:bg-transparent" aria-label={t('user_profile')}>
                <GlassEffect />
                <User className="h-6 w-6 relative z-20" />
              </Button>
            </div>
          </div>
          
          <div className="relative w-full mt-2 sm:hidden">
              <button
                  onClick={() => setIsSearchOpen(true)}
                  className="relative flex items-center pl-11 pr-4 h-11 w-full text-sm rounded-full text-left focus:outline-none isolate overflow-hidden"
              >
                  <GlassEffect />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-20" />
                  <span className="truncate relative z-20">{t('search_ebooks')}</span>
              </button>
          </div>
        </header>

        <main className="flex flex-col w-full flex-1 pb-28">
          <SimpleBalanceChart />
          <EbookDisplayArea />
        </main>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} ebooks={allEbooks} />
    </div>
  );
}
