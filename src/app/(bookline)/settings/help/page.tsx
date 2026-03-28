'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useEbooks } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassEffect } from '@/components/bookline/glass-effect';

export default function HelpPage() {
  const { handleBack } = useTransitionRouter();
  const { theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const faqs = [
    { id: "faq-1", question: t('faq_q1'), answer: t('faq_a1') },
    { id: "faq-2", question: t('faq_q2'), answer: t('faq_a2') },
    { id: "faq-3", question: t('faq_q3'), answer: t('faq_a3') },
    { id: "faq-4", question: t('faq_q4'), answer: t('faq_a4') },
  ];

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
          <h1 className="text-2xl font-bold text-center">{t('help')}</h1>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-8 pb-28 gap-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{t('help_center_title')}</h2>
            <p className="text-muted-foreground mt-1">{t('help_center_subtitle')}</p>
          </div>

          <Accordion type="single" collapsible className="w-full mt-4">
            {faqs.map(faq => (
              <AccordionItem value={faq.id} key={faq.id}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </main>
      </div>
    </div>
  );
}
