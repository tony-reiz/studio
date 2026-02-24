'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerificationPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Vérification en cours</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Votre ebook a bien été soumis. Il est maintenant en cours de vérification par nos équipes.
          </p>
          <p className="mt-2 text-muted-foreground">
            Vous recevrez une notification par email une fois le processus terminé.
          </p>
          <div className="mt-8">
            <Link href="/home" passHref>
              <Button className="bg-foreground text-background rounded-full h-12 px-10 text-base font-semibold hover:bg-foreground/90">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
