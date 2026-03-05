'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';
import type { TranslationKeys } from '@/lib/translations';

const interestKeys: TranslationKeys[] = [
  'business', 'fiction', 'biographies', 'courses_revisions', 
  'career', 'sport', 'motivation', 'driving_code', 'prep_courses',
  'personal_development', 'science_fiction', 'technology', 
  'health_wellness', 'cooking', 'art_photography', 'travel',
  'history', 'psychology', 'finance', 'marketing', 'other'
];

export default function InterestsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { updateSelectedInterests, t } = useEbooks();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };
  
  const handleFinish = () => {
    updateSelectedInterests(selectedInterests);
    handleNavigate('/home');
  };

  const isButtonDisabled = selectedInterests.length < 5;

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-screen-lg mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
          <div className="flex flex-col items-start">
            <div>
              <p className="text-[24px] font-bold tracking-widest text-foreground">{t('almost_done')}</p>
              <h1 className="text-[46px] sm:text-[58px] font-extrabold text-primary -mt-4">{t('your_interests')}</h1>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {t('select_5_interests')}
          </p>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-4 sm:pt-8 pb-28">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {interestKeys.map((interestKey) => (
              <Button
                key={interestKey}
                variant={selectedInterests.includes(t(interestKey)) ? 'default' : 'secondary'}
                onClick={() => toggleInterest(t(interestKey))}
                className="rounded-full h-9 px-4 text-xs sm:h-10 sm:px-5 sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {t(interestKey)}
              </Button>
            ))}
          </div>
        </main>
      </div>

      <div className="fixed bottom-8 left-0 right-0 p-4 md:bottom-2 md:mb-4">
        <div className="w-full max-w-[16rem] mx-auto">
          <Button 
            onClick={handleFinish}
            disabled={isButtonDisabled}
            className={cn(
                "bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 disabled:bg-[#DFDFDF] disabled:text-muted-foreground",
                !isButtonDisabled && "animate-pulse-subtle"
            )}
          >
            {t('finish')}
          </Button>
        </div>
      </div>
    </div>
  );
}
