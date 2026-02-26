'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    setIsMounted(false);
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  return (
    <div className={cn("grid h-screen place-items-center bg-background text-foreground overflow-hidden transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <main className="max-w-md w-full text-center p-4">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Vérification en cours</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Votre ebook a bien été soumis. Il est maintenant en cours de vérification par nos équipes.
        </p>
        <div className="mt-8">
          <Button onClick={() => handleNavigate('/home')} className="bg-foreground text-background rounded-full h-12 px-10 text-base font-semibold hover:bg-foreground/90">
            Retour à l'accueil
          </Button>
        </div>
      </main>
    </div>
  );
}
