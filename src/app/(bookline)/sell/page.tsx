'use client';

import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SellPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between w-full py-6">
          <div className="flex flex-col items-start pl-[6px]">
            <Button variant="ghost" size="icon" aria-label="Menu" className="hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7 justify-start">
              <Menu />
            </Button>
            <div className="-mt-1">
              <p className="text-[24px] font-bold tracking-widest text-foreground">BIENVENUE</p>
              <h1 className="text-6xl font-extrabold text-primary -mt-1">PRENOM !</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
              <User className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex flex-col w-full flex-1 pb-28 items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-muted-foreground">Bientôt disponible</h2>
          <p className="mt-2 text-lg text-muted-foreground">La section "Vendre" est en cours de construction.</p>
        </main>
      </div>
    </div>
  );
}
