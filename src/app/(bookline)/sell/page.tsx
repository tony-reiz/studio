'use client';

import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/components/bookline/pdf-uploader';
import { SellForm } from '@/components/bookline/sell-form';

export default function SellPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between w-full py-6">
           <Button variant="ghost" size="icon" aria-label="Menu" className="hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7">
              <Menu />
            </Button>
          <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
            <User className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 w-full grid md:grid-cols-2 gap-10 lg:gap-20 items-start pb-28 pt-16">
          <PdfUploader pdfFile={pdfFile} onFileChange={setPdfFile} />
          <div className="w-full flex justify-center md:justify-start">
             <SellForm pdfFile={pdfFile} />
          </div>
        </main>
      </div>
    </div>
  );
}
