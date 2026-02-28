'use client';

import { Feather, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';


// Chart data and config
const chartData = [
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

  useEffect(() => {
    setIsMounted(true);
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
    }, 300); // Match animation duration
  };

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-6">
            <h1 className="text-2xl font-bold">BookLine</h1>
            <div className="flex items-end gap-1.5 h-8 p-2">
              <span className={cn("w-2 bg-primary/40 rounded-full transition-all ease-out duration-500", isMounted ? "h-1/3" : "h-0")}></span>
              <span className={cn("w-2 bg-primary/70 rounded-full transition-all ease-out duration-500 delay-100", isMounted ? "h-full" : "h-0")}></span>
              <span className={cn("w-2 bg-primary rounded-full transition-all ease-out duration-500 delay-200", isMounted ? "h-2/3" : "h-0")}></span>
            </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[85vh] pt-40 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-secondary/30 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_80%)] -z-10"></div>
          
          <h2 className={cn(
            "text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 transition-all duration-700 ease-out",
            isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          )}>
            La Matrice de Vente
          </h2>

          <p className={cn(
            "mt-6 max-w-xl text-lg text-muted-foreground transition-all duration-700 ease-out delay-200",
            isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          )}>
            Libérez votre potentiel. Publiez vos ebooks, partagez votre savoir et générez des revenus en toute simplicité.
          </p>

          <Button 
            onClick={() => handleNavigate('/auth')} 
            className={cn(
                "mt-10 bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold transform transition-all duration-700 ease-out delay-300",
                "hover:bg-foreground/90 hover:scale-105",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            )}
          >
            Commencer
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
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md transition-transform duration-300 hover:scale-110">
                    <Feather className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Publication Facile</h3>
                <p className="text-muted-foreground">Mettez en ligne vos ebooks en quelques clics grâce à notre interface intuitive.</p>
              </div>

              <div className={cn(
                "flex flex-col items-center transition-all duration-700 ease-out delay-[550ms]",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              )}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md transition-transform duration-300 hover:scale-110">
                    <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Monétisation Simple</h3>
                <p className="text-muted-foreground">Fixez votre prix et suivez vos revenus directement depuis votre tableau de bord.</p>
              </div>

              <div className={cn(
                "flex flex-col items-center transition-all duration-700 ease-out delay-[700ms]",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              )}>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md transition-transform duration-300 hover:scale-110">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Paiements Sécurisés</h3>
                <p className="text-muted-foreground">Toutes les transactions sont sécurisées par notre partenaire de confiance, Stripe.</p>
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
                    Visualisez Votre Succès
                </h2>
                <p className={cn(
                    "mt-4 max-w-2xl mx-auto text-lg text-muted-foreground transition-all duration-700 ease-out delay-[900ms]",
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}>
                    Notre tableau de bord intuitif vous permet de suivre vos ventes, revenus et engagement en temps réel.
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
                                animationDuration={1500}
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
            )}>Prêt à vous lancer ?</h2>
            <p className={cn(
                "mt-4 max-w-2xl mx-auto text-lg text-muted-foreground transition-all duration-700 ease-out delay-500",
                isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            )}>
                Rejoignez des milliers de créateurs et commencez à vendre vos ebooks dès aujourd'hui.
            </p>
            <Button 
                onClick={() => handleNavigate('/auth')} 
                className={cn(
                    "mt-8 bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold transform transition-all duration-700 ease-out delay-700",
                    "hover:bg-foreground/90 hover:scale-105",
                    isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
                )}
            >
                Publier mon premier ebook
            </Button>
        </section>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto text-center text-muted-foreground py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} BookLine. Tous droits réservés.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-foreground mx-2">Conditions d'utilisation</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-foreground mx-2">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
