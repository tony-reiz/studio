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

  // This new state tracks the active icon for instant UI feedback.
  const [activeIcon, setActiveIcon] = useState<'none' | 'profile' | 'menu'>('none');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This effect syncs both active states with the final URL after navigation.
  useEffect(() => {
    // Sync aheter/vendre toggle
    if (pathname === '/home') {
      setActiveToggle('acheter');
    } else if (pathname === '/sell') {
      setActiveToggle('vendre');
    }

    // Sync icon buttons
    if (pathname.startsWith('/settings')) {
        setActiveIcon('menu');
    } else if (pathname === '/profile') {
        setActiveIcon('profile');
    } else {
        setActiveIcon('none');
    }
  }, [pathname]);

  const handleNavigation = (tab: 'acheter' | 'vendre') => {
    const targetPath = tab === 'acheter' ? '/home' : '/sell';
    
    if (pathname === targetPath) {
        return;
    }

    // Set the visual state instantly to start the slider animation
    setActiveToggle(tab);

    // Reset the icon active state when switching main tabs
    setActiveIcon('none');
    
    // Use the transition handler from the layout
    handleNavigate(targetPath);
  };
  
  const isAcheter = activeToggle === 'acheter';

  const isSettingsActive = activeIcon === 'menu';
  const isProfileActive = activeIcon === 'profile';

  const menuButton = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('menu')}
      className={cn(
        "w-12 h-12 rounded-full hover:bg-transparent transition-colors duration-300 shadow-lg",
        // Background
        isSettingsActive 
          ? 'bg-black dark:bg-[#a3a3a3]' 
          : 'bg-white dark:bg-[#141414]',
      )}
    >
      <Menu className={cn(
          "h-7 w-7",
          // Icon Color
          isSettingsActive 
            ? 'text-white dark:text-black' 
            : 'text-black dark:text-white'
      )} strokeWidth={3} />
    </Button>
  );

  return (
    <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
      <div className="flex justify-center items-center gap-4 max-w-sm mx-auto">
        <div className="" onClick={() => setActiveIcon('menu')}>
            {isClient ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : <div className="w-12 h-12" />}
        </div>
        <div className="relative rounded-full flex items-center flex-grow shadow-lg bg-white dark:bg-[#141414]">
          <div
            className={cn(
              'absolute top-0 h-full w-1/2 rounded-full bg-black dark:bg-[#a3a3a3] z-10 transition-transform duration-500 ease-in-out',
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
          onClick={() => {
              setActiveIcon('profile');
              handleNavigate('/profile');
          }} 
          variant="ghost" 
          size="icon" 
          className={cn(
            "w-12 h-12 rounded-full hover:bg-transparent transition-colors duration-300 shadow-lg",
            // Background
            isProfileActive ? 'bg-black dark:bg-[#a3a3a3]' : 'bg-white dark:bg-[#141414]'
            )} 
          aria-label={t('user_profile')}
        >
            <User className={cn(
                "h-7 w-7",
                // Icon Color
                isProfileActive ? 'text-white dark:text-black' : 'text-black dark:text-white'
            )} strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
