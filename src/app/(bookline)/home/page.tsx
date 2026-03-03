'use client';

import { useState, useEffect } from 'react';
import { Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
import { SearchOverlay } from '@/components/bookline/search-overlay';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSettingsSheet } from '@/components/bookline/mobile-settings-sheet';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { handleNavigate } = useTransitionRouter();
  const { allEbooks, theme } = useEbooks();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.body.classList.add('has-fluid-background');
    return () => {
      document.body.classList.remove('has-fluid-background');
    };
  }, []);

  const menuButton = (
    <Button
      onClick={!isMobile ? () => handleNavigate('/settings') : undefined}
      variant="ghost"
      aria-label="Menu"
      className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7"
    >
      <Menu />
    </Button>
  );

  return (
    <div className={cn("flex flex-col h-screen overflow-hidden text-foreground bg-transparent")}>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start">
              {isClient && isMobile ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : menuButton}
              <div className="-mt-1">
                <p className="text-[24px] font-bold tracking-widest text-foreground">BIENVENUE SUR</p>
                <h1 className="text-5xl sm:text-6xl font-extrabold text-primary -mt-1">BOOKLINE !</h1>
              </div>
            </div>
            <div className="flex items-start sm:items-center shrink-0 gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                  <button
                      onClick={() => setIsSearchOpen(true)}
                      className="relative flex items-center pl-11 pr-4 h-11 w-40 sm:w-64 text-sm bg-secondary border-0 rounded-full text-left text-muted-foreground focus:outline-none"
                  >
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                      <span className="truncate">recherchez vos ebook...</span>
                  </button>
              </div>
              <Button onClick={() => handleNavigate('/profile?tab=achats')} variant="ghost" size="icon" className="-mt-2 sm:mt-0 w-11 h-11 rounded-full glass-icon-button" aria-label="Profil Utilisateur">
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          <div className="relative w-full mt-2 sm:hidden">
              <button
                  onClick={() => setIsSearchOpen(true)}
                  className="relative flex items-center pl-11 pr-4 h-11 w-full text-sm bg-secondary border-0 rounded-full text-left text-muted-foreground focus:outline-none"
              >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <span className="truncate">recherchez vos ebook...</span>
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
