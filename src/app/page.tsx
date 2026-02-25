import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center p-6 sm:p-8">
        <h1 className="text-2xl font-bold">BookLine</h1>
        <div className="bg-foreground text-background p-2 rounded-full flex items-center space-x-1">
          <GraduationCap className="h-5 w-5" />
          <GraduationCap className="h-5 w-5 opacity-70" />
          <GraduationCap className="h-5 w-5 opacity-50" />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center relative px-4">
        {/* Background cards */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 flex items-center justify-center">
            <div className="relative w-full max-w-lg h-96">
                <div className="absolute -left-20 top-10 bg-secondary rounded-3xl w-48 h-72 transform -rotate-12"></div>
                <div className="absolute -right-20 top-20 bg-secondary rounded-3xl w-48 h-72 transform rotate-15"></div>
                <div className="absolute left-10 -bottom-10 bg-secondary rounded-3xl w-56 h-80 transform rotate-6"></div>
                <div className="absolute right-10 -bottom-5 bg-secondary rounded-3xl w-40 h-64 transform -rotate-12"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-3xl w-64 h-96"></div>
            </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter whitespace-nowrap">
            La Matrice de Vente
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            Libérez votre potentiel. Publiez et générez des revenus en toute simplicité.
          </p>
        </div>
      </main>
      <footer className="px-6 pt-6 pb-28 sm:px-8 sm:pt-8 sm:pb-12 flex justify-center">
        <Link href="/home" passHref>
          <Button className="bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold hover:bg-foreground/90">
            commencer
          </Button>
        </Link>
      </footer>
    </div>
  );
}
