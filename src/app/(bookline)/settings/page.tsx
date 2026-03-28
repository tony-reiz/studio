'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { SettingsList } from '@/components/bookline/settings-list';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className={cn("min-h-screen text-foreground bg-background")}>
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-center w-full py-6 relative">
          <h1 className="text-2xl font-bold invisible sm:visible">{t('settings')}</h1>
          <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 hover:bg-transparent text-foreground absolute top-1/2 right-0 -translate-y-1/2 [&_svg]:h-8 [&_svg]:w-8">
            <X />
          </Button>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-16 pb-28 gap-2">
          <div className="w-full">
            <SettingsList />
          </div>
        </main>
      </div>
    </div>
  );
}
