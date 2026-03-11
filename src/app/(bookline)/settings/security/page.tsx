'use client';

import { ChevronLeft, KeyRound, Smartphone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { GlassEffect } from '@/components/bookline/glass-effect';


export default function SecurityPage() {
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
          <h1 className="text-2xl font-bold text-center">{t('security')}</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-4">
          <div className="w-full space-y-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{t('security_and_login')}</h2>
                <p className="text-muted-foreground mt-1">{t('manage_account_security')}</p>
            </div>

            <ul className="w-full space-y-2">
                <li>
                    <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                            <KeyRound className="h-6 w-6 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{t('password')}</span>
                                <span className="text-sm text-muted-foreground">{t('password_last_changed')}</span>
                            </div>
                        </div>
                    </button>
                </li>
                <li>
                    <div className="w-full rounded-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center gap-4">
                            <Smartphone className="h-6 w-6 text-muted-foreground" />
                             <div className="flex flex-col">
                                <label htmlFor="2fa-switch" className="font-semibold text-foreground cursor-pointer">{t('two_factor_auth')}</label>
                                <span className="text-sm text-muted-foreground">{t('two_factor_auth_desc')}</span>
                            </div>
                        </div>
                        <Switch id="2fa-switch" />
                    </div>
                </li>
                <li>
                    <button className="w-full rounded-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                            <LogOut className="h-6 w-6 text-destructive" />
                            <span className="font-semibold text-destructive">{t('logout_all_devices')}</span>
                        </div>
                    </button>
                </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
