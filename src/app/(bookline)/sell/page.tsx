'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SellPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPdfFile(null);
      setPreviewUrl(null);
    }
  };

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

        <main className="flex flex-col w-full flex-1 pb-28 items-center justify-center space-y-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
          <div
            className="w-72 cursor-pointer group"
            onClick={handleUploadClick}
          >
            <div
              className={cn(
                'aspect-[210/297] p-0 flex items-center justify-center rounded-[25px] overflow-hidden relative bg-[#DFDFDF] transition-colors',
                {'group-hover:bg-[#d0d0d0]': !pdfFile}
              )}
            >
              {previewUrl ? (
                <object data={`${previewUrl}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full border-0 pointer-events-none" title="Aperçu du PDF" />
              ) : (
                <Download className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <Button
            className={cn(
              "rounded-full h-14 px-12 text-lg font-semibold transition-colors",
              pdfFile
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-[#DFDFDF] text-[#AFAFAF] cursor-not-allowed'
            )}
            disabled={!pdfFile}
          >
            continuer
          </Button>
        </main>
      </div>
    </div>
  );
}
