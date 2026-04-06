'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { Button } from '../ui/button';
import { Menu, User } from 'lucide-react';
import { MobileSettingsSheet } from './mobile-settings-sheet';
import { GlassEffect } from './glass-effect';

export function BottomNav() {
  const pathname = usePathname();
  const { handleNavigate } = useTransitionRouter();
  const { t, theme } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  // This state now persists the last active tab of the toggle.
  const [activeToggle, setActiveToggle] = useState<'acheter' | 'vendre'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/sell') return 'vendre';
    }
    return 'acheter';
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This effect updates the toggle state only when navigating to home or sell.
  // On other pages, it does nothing, preserving the last state.
  useEffect(() => {
    if (pathname === '/home') {
      setActiveToggle('acheter');
    } else if (pathname === '/sell') {
      setActiveToggle('vendre');
    }
  }, [pathname]);

  const handleNavigation = (tab: 'acheter' | 'vendre') => {
    const targetPath = tab === 'acheter' ? '/home' : '/sell';
    
    if (pathname === targetPath) {
        return;
    }

    // Set the visual state instantly to start the slider animation
    setActiveToggle(tab);
    
    // Use the transition handler from the layout
    handleNavigate(targetPath);
  };
  
  const isAcheter = activeToggle === 'acheter';

  const isSettingsActive = pathname.startsWith('/settings');
  const isProfileActive = pathname === '/profile';

  const menuButton = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('menu')}
      className={cn(
        "w-12 h-12 rounded-full relative isolate overflow-hidden hover:bg-transparent",
        isSettingsActive && "dark:bg-[#4d4d4d]",
        !isSettingsActive && "dark:bg-[#141414]"
      )}
    >
      {theme === 'light' && <GlassEffect />}
      <Menu className="h-6 w-6 relative z-20" />
    </Button>
  );

  return (
    <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4">
      <div className="flex justify-center items-center gap-4 max-w-sm mx-auto">
        <div className="">
            {isClient ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : <div className="w-12 h-12" />}
        </div>
        <div className="relative isolate overflow-hidden rounded-full flex items-center flex-grow">
          {theme === 'light' && <GlassEffect />}
           <div className="absolute inset-0 bg-transparent dark:bg-[#141414] -z-10"></div>
          <div
            className={cn(
              'absolute top-0 left-0 h-full w-1/2 rounded-full bg-black dark:bg-[#a3a3a3] z-10 transition-transform duration-500 ease-in-out',
              isAcheter ? 'translate-x-0' : 'translate-x-full'
            )}
          >
          </div>
          <button
            onClick={() => handleNavigation('acheter')}
            className={cn(
              'relative z-20 w-1/2 py-3 text-center text-base font-bold transition-colors duration-150',
              activeToggle === 'acheter' ? 'text-white dark:text-black' : 'text-foreground'
            )}
          >
            {t('buy')}
          </button>
          <button
            onClick={() => handleNavigation('vendre')}
            className={cn(
              'relative z-20 w-1/2 py-3 text-center text-base font-bold transition-colors duration-150',
              activeToggle === 'vendre' ? 'text-white dark:text-black' : 'text-foreground'
            )}
          >
            {t('sell')}
          </button>
        </div>
        <Button 
          onClick={() => handleNavigate('/profile')} 
          variant="ghost" 
          size="icon" 
          className={cn(
            "w-12 h-12 rounded-full relative isolate overflow-hidden hover:bg-transparent",
            isProfileActive && "dark:bg-[#4d4d4d]",
            !isProfileActive && "dark:bg-[#141414]"
            )} 
          aria-label={t('user_profile')}
        >
            {theme === 'light' && <GlassEffect />}
            <User className="h-6 w-6 relative z-20" />
        </Button>
      </div>
    </div>
  );
}
