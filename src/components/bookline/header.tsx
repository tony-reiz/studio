import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 w-full">
      <Button variant="ghost" size="icon" aria-label="Menu">
        <Menu className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Profil Utilisateur">
        <User className="h-6 w-6" />
      </Button>
    </header>
  );
}
