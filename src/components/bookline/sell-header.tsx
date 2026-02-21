import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SellHeader() {
  return (
    <header className="flex flex-col p-4 w-full">
        <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Profil Utilisateur">
                <User className="h-6 w-6" />
            </Button>
        </div>
        <div className="text-left mt-4">
            <p className="text-sm text-primary/80 font-semibold tracking-widest">BIENVENUE</p>
            <h1 className="text-4xl font-bold text-primary">PRENOM !</h1>
        </div>
    </header>
  );
}
