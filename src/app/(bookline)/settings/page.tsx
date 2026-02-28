'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { SettingsList } from '@/components/bookline/settings-list';

export default function SettingsPage() {
  const { handleBack } = useTransitionRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between w-full py-6">
          <Button onClick={handleBack} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
            <ChevronLeft className="h-6 w-6" />
          </Button>
           <h1 className="text-2xl font-bold invisible sm:visible">Paramètres</h1>
          <div className="w-11"></div> {/* Placeholder for spacing */}
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-2">
          <div className="w-full">
            <SettingsList />
          </div>
        </main>
      </div>
    </div>
  );
}
