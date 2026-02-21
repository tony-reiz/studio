'use client';

import { Button } from '@/components/ui/button';
import { ImageIcon, Download } from 'lucide-react';

export function SellForm() {
  return (
    <div className="w-full flex flex-col items-center gap-6 mt-8">
      {/* Ebook Cover Upload */}
      <div className="w-full max-w-xs aspect-[3/4] bg-secondary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors p-4">
        <ImageIcon className="h-10 w-10 text-primary/50" />
        <p className="text-muted-foreground text-sm mt-2 text-center">Appuyez pour ajouter la couverture de votre ebook</p>
      </div>

      {/* Ebook File Upload */}
      <div className="w-full max-w-xs h-32 bg-secondary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors p-4">
        <Download className="h-8 w-8 text-primary/50" />
        <p className="text-muted-foreground text-sm mt-2 text-center">Appuyez pour ajouter le fichier de votre ebook</p>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-xs mt-4">
        <Button className="w-full h-14 text-lg font-semibold rounded-full" size="lg">
          Continuer
        </Button>
      </div>
    </div>
  );
}
