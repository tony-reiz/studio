'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { GlassEffect } from './glass-effect';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { MobileSettingsSheet } from './mobile-settings-sheet';

export function BottomNav() {
  const pathname = usePathname();
  const { handleNavigate } = useTransitionRouter();
  const { t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCurrentTab = () => (pathname === '/sell' ? 'vendre' : 'acheter');

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Update visual state if URL changes by other means (e.g. browser back/forward)
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [pathname]);

  const handleNavigation = (tab: 'acheter' | 'vendre') => {
    const targetPath = tab === 'acheter' ? '/home' : '/sell';
    
    if (pathname === targetPath || (pathname === '/' && targetPath === '/home')) {
        return;
    }

    // Set the visual state instantly to start the slider animation
    setActiveTab(tab);
    
    // Use the transition handler from the layout
    handleNavigate(targetPath);
  };
  
  const isAcheter = activeTab === 'acheter';

  const menuButton = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('menu')}
      className="w-12 h-12 rounded-full relative isolate overflow-hidden hover:bg-transparent"
    >
      <GlassEffect />
      <Menu className="h-6 w-6 relative z-20" />
    </Button>
  );

  return (
    <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4">
      <div className="relative max-w-[16rem] mx-auto">
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2">
            {isClient ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : <div className="w-12 h-12" />}
        </div>
        <div className="relative isolate overflow-hidden rounded-full flex items-center">
          <GlassEffect />
          <div
            className={cn(
              'absolute top-0 h-full w-1/2 rounded-full transition-all duration-500 ease-in-out bg-black dark:bg-[#a3a3a3] z-10',
              isAcheter ? 'left-0' : 'left-1/2'
            )}
          >
          </div>
          <button
            onClick={() => handleNavigation('acheter')}
            className={cn(
              'relative z-20 w-1/2 py-3 text-center text-base font-bold transition-colors duration-150',
              isAcheter ? 'text-white dark:text-black' : 'text-foreground'
            )}
          >
            {t('buy')}
          </button>
          <button
            onClick={() => handleNavigation('vendre')}
            className={cn(
              'relative z-20 w-1/2 py-3 text-center text-base font-bold transition-colors duration-150',
              !isAcheter ? 'text-white dark:text-black' : 'text-foreground'
            )}
          >
            {t('sell')}
          </button>
        </div>
      </div>
    </div>
  );
}
