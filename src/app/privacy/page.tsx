'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { PrivacyContent } from '@/components/bookline/privacy-content';

export default function PrivacyPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleBack = () => {
    setIsMounted(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };


  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground transition-opacity duration-300 ease-in-out", isMounted ? "opacity-100" : "opacity-0")}>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center p-6">
            <Button onClick={handleBack} variant="ghost" size="icon" className="mr-4">
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold">Politique de Confidentialité</h1>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-6">
          <PrivacyContent />
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto text-center text-muted-foreground py-6 text-sm">
          <p>&copy; {new Date().getFullYear()} BookLine. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
