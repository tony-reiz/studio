'use client';

import { GraduationCap, Feather, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-6">
            <h1 className="text-2xl font-bold">BookLine</h1>
            <div className="bg-foreground text-background p-2 rounded-full flex items-center space-x-1">
                <GraduationCap className="h-5 w-5" />
                <GraduationCap className="h-5 w-5 opacity-70" />
                <GraduationCap className="h-5 w-5 opacity-50" />
            </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[85vh] pt-20 pb-20 px-4">
          <div className="absolute inset-0 bg-secondary/30 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_80%)] -z-10"></div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            La Matrice de Vente
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Libérez votre potentiel. Publiez vos ebooks, partagez votre savoir et générez des revenus en toute simplicité.
          </p>
          <Button onClick={() => handleNavigate('/home')} className="mt-10 bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold hover:bg-foreground/90 transform hover:scale-105 transition-transform">
            Commencer
          </Button>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md">
                    <Feather className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Publication Facile</h3>
                <p className="text-muted-foreground">Mettez en ligne vos ebooks en quelques clics grâce à notre interface intuitive.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md">
                    <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Monétisation Simple</h3>
                <p className="text-muted-foreground">Fixez votre prix et suivez vos revenus directement depuis votre tableau de bord.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6 shadow-md">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Paiements Sécurisés</h3>
                <p className="text-muted-foreground">Toutes les transactions sont sécurisées par notre partenaire de confiance, Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
         <section className="py-24 text-center px-4">
            <h2 className="text-4xl font-bold tracking-tight">Prêt à vous lancer ?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Rejoignez des milliers de créateurs et commencez à vendre vos ebooks dès aujourd'hui.
            </p>
            <Button onClick={() => handleNavigate('/home')} className="mt-8 bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold hover:bg-foreground/90 transform hover:scale-105 transition-transform">
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
