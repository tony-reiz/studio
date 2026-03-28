'use client';

import { Feather, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { TermsSheet } from '@/components/bookline/terms-sheet';
import { PrivacySheet } from '@/components/bookline/privacy-sheet';
import { useEbooks } from '@/context/ebook-provider';
import { BusinessPlanSheet } from '@/components/bookline/business-plan-sheet';


// Chart data and config
const initialChartData = [
  { month: "Janvier", sales: 186 },
  { month: "Février", sales: 250 },
  { month: "Mars", sales: 310 },
  { month: "Avril", sales: 390 },
  { month: "Mai", sales: 460 },
  { month: "Juin", sales: 520 },
];

const chartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const [chartData, setChartData] = useState(initialChartData);
  const { theme, t } = useEbooks();

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);

    const interval = setInterval(() => {
      setChartData(
        initialChartData.map((item) => ({
          ...item,
          sales: Math.floor(Math.random() * 500) + 100,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleNavigate = (path: string) => {
    // Start fade-out animation
    const appContainer = document.querySelector('.transition-opacity');
    if (appContainer) {
      appContainer.classList.remove('opacity-100');
      appContainer.classList.add('opacity-0');
    }
    setTimeout(() => {
      router.push(path);
    }, 500); // Match animation duration
  };

  return (
    <div className={cn("flex flex-col min-h-screen text-foreground bg-background transition-opacity duration-500 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-6">
            <button onClick={() => handleNavigate('/background')}>
              <div className="text-2xl font-bold">BookLine</div>
            </button>
            <button onClick={() => handleNavigate('/blank')}>
              <div className="flex items-end gap-1.5 h-8 p-2">
                <span className={cn("w-2 bg-primary/40 rounded-full transition-all ease-out duration-500", isMounted ? "h-1/3" : "h-0")}></span>
                <span className={cn("w-2 bg-primary/70 rounded-full transition-all ease-out duration-500 delay-100", isMounted ? "h-full" : "h-0")}></span>
                <span className={cn("w-2 bg-primary rounded-full transition-all ease-out duration-500 delay-200", isMounted ? "h-2/3" : "h-0")}></span>
              </div>
            </button>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[95vh] pt-40 pb-20 px-4 overflow-hidden">
          
          <h2 className={cn(
            "text-5xl md:text-7xl font-bold tracking-tighter text-foreground transition-all duration-700 ease-out",
            isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          )}>
            {t('sales_matrix')}
          </h2>

          <p className={cn(
            "mt-6 max-w-xl text-lg text-muted-foreground transition-all duration-700 ease-out delay-200",
            isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          )}>
            {t('hero_subtitle')}
          </p>

          <Button
            onClick={() => handleNavigate('/auth')}
            className={cn(
              "mt-10 h-14 w-56 rounded-full font-semibold text-lg bg-white text-black hover:bg-white/90",
              "transform",
              "transition-all duration-700 ease-out",
              isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95",
              isMounted && "delay-300"
            )}
          >
            {t('get_started')}
          </Button>
          

        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              
              <div className={cn(
                "flex flex-col items-center transition-all duration-700 ease-out delay-[400ms]",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              )}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6 transition-transform duration-300 hover:scale-110">
                    <Feather className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('easy_publication')}</h3>
                <p className="text-muted-foreground">{t('easy_publication_desc')}</p>
              </div>

              <div className={cn(
                "flex flex-col items-center transition-all duration-700 ease-out delay-[550ms]",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              )}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6 transition-transform duration-300 hover:scale-110">
                    <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('simple_monetization')}</h3>
                <p className="text-muted-foreground">{t('simple_monetization_desc')}</p>
              </div>

              <div className={cn(
                "flex flex-col items-center transition-all duration-700 ease-out delay-[700ms]",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              )}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6 transition-transform duration-300 hover:scale-110">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('secure_payments')}</h3>
                <p className="text-muted-foreground">{t('secure_payments_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Chart Section */}
        <section className="py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className={cn(
                    "text-4xl font-bold tracking-tight transition-all duration-700 ease-out delay-[800ms]",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                    {t('visualize_success')}
                </h2>
                <p className={cn(
                    "mt-4 max-w-2xl mx-auto text-lg text-muted-foreground transition-all duration-700 ease-out delay-[900ms]",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                    {t('visualize_success_desc')}
                </p>
                <div className={cn(
                    "mt-12 max-w-4xl mx-auto h-[24rem] transition-all duration-1000 ease-out delay-[1000ms]",
                    isMounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}>
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                stroke="hsl(var(--muted-foreground))"
                                tickFormatter={(value) => `${value}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar 
                                dataKey="sales" 
                                fill="var(--color-sales)" 
                                radius={8} 
                                animationDuration={500}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
         <section className="py-24 text-center px-4">
            <h2 className={cn(
                "text-4xl font-bold tracking-tight transition-all duration-700 ease-out delay-300",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            )}>{t('ready_to_start')}</h2>
            <p className={cn(
                "mt-4 max-w-2xl mx-auto text-lg text-muted-foreground transition-all duration-700 ease-out delay-500",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            )}>
                {t('ready_to_start_desc')}
            </p>
            <Button 
                onClick={() => handleNavigate('/auth')} 
                className={cn(
                    "mt-8 bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold transform transition-all duration-700 ease-out delay-700",
                    "hover:bg-foreground/90 hover:scale-105",
                    isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
                )}
            >
                {t('publish_first_ebook')}
            </Button>
        </section>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto text-center text-muted-foreground py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} BookLine. {t('all_rights_reserved')}</p>
          <div className="mt-2">
            {isClient && isMobile ? (
              <TermsSheet>
                <button className="underline hover:text-foreground mx-2">{t('terms_of_use')}</button>
              </TermsSheet>
            ) : (
              <a href="/terms" className="underline hover:text-foreground mx-2">{t('terms_of_use')}</a>
            )}
            <span className="mx-2">|</span>
            {isClient && isMobile ? (
              <PrivacySheet>
                <button className="underline hover:text-foreground mx-2">{t('privacy_policy')}</button>
              </PrivacySheet>
            ) : (
              <a href="/privacy" className="hover:text-foreground mx-2">{t('privacy_policy')}</a>
            )}
            <span className="mx-2">|</span>
            {isClient && isMobile ? (
              <BusinessPlanSheet>
                <button className="underline hover:text-foreground mx-2">{t('business_model')}</button>
              </BusinessPlanSheet>
            ) : (
              <a href="/business-plan" className="underline hover:text-foreground mx-2">{t('business_model')}</a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
