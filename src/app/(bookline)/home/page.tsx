'use client';

import { useState, useEffect } from 'react';
import { User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
import { SearchOverlay } from '@/components/bookline/search-overlay';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { GlassEffect } from '@/components/bookline/glass-effect';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { handleNavigate } = useTransitionRouter();
  const { allEbooks, t } = useEbooks();

  return (
    <div className={cn("flex flex-col h-screen text-foreground bg-background")}>
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <header className="sticky top-0 z-10 w-full pb-6" style={{ paddingTop: `calc(1.5rem + env(safe-area-inset-top))` }}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start gap-3">
              <div className="mt-5">
                <p className="text-[24px] font-bold tracking-widest text-foreground dark:text-[#a3a3a3] pl-1">{t('welcome_to')}</p>
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
          <EbookDisplayArea />
        </main>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} ebooks={allEbooks} />
    </div>
  );
}
