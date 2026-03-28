'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { GlassEffect } from '@/components/bookline/glass-effect';

export default function NotificationsPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t, notificationSettings, updateNotificationSettings } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const notificationOptions = [
    { id: 'news', labelKey: "news_and_recommendations", descriptionKey: "receive_ebook_suggestions" },
    { id: 'offers', labelKey: "special_offers_and_promotions", descriptionKey: "be_informed_of_discounts" },
    { id: 'updates', labelKey: "app_updates", descriptionKey: "notifications_on_new_features" },
    { id: 'sales', labelKey: "sales_activity", descriptionKey: "receive_notification_for_each_sale" },
  ] as const;

  return (
    <div className={cn("min-h-screen text-foreground bg-background")}>
      <div className="w-full max-w-screen-md mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center w-full py-6">
          <div className="justify-self-start">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <GlassEffect />
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('notifications')}</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-4">
          <div className="w-full space-y-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{t('manage_your_notifications')}</h2>
                <p className="text-muted-foreground mt-1">{t('choose_what_to_receive')}</p>
            </div>

            <ul className="w-full space-y-2">
              {notificationOptions.map(option => (
                <li key={option.id}>
                    <div className="w-full rounded-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center gap-4">
                             <div className="flex flex-col">
                                <label htmlFor={`${option.id}-switch`} className="font-semibold text-foreground cursor-pointer">{t(option.labelKey)}</label>
                                <span className="text-sm text-muted-foreground">{t(option.descriptionKey)}</span>
                            </div>
                        </div>
                        <Switch
                          id={`${option.id}-switch`}
                          checked={notificationSettings[option.id]}
                          onCheckedChange={(checked) => updateNotificationSettings({ [option.id]: checked })}
                        />
                    </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
