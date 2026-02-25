'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function EbookViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { publishedEbooks, removePublishedEbook } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id && publishedEbooks.length > 0) {
      const foundEbook = publishedEbooks.find((e) => e.id === params.id);
      setEbook(foundEbook);
    }
  }, [params.id, publishedEbooks]);

  const handleDelete = () => {
    if (ebook) {
      removePublishedEbook(ebook.id);
      toast({
        title: "Ebook supprimé",
        description: "Votre ebook a été supprimé de vos publications.",
      });
      router.push('/profile');
    }
  };
  
  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-4 flex flex-col gap-3 z-10">
        <Button onClick={handleDelete} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
          <Trash2 className="h-6 w-6" />
        </Button>
        <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
          <Share2 className="h-6 w-6" />
        </Button>
      </div>

      <main className="w-full h-[70vh] max-w-sm flex items-center justify-center">
         <div className="w-full h-full relative">
            <iframe
                src={ebook.pdfDataUrl}
                className="w-full h-full border-0 rounded-lg bg-secondary"
                title={ebook.title}
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs rounded-full px-3 py-1">
                X/P
            </div>
         </div>
      </main>

      <footer className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <Button className="bg-foreground text-background rounded-full h-14 px-12 text-lg font-semibold hover:bg-foreground/90">
          Détail
        </Button>
      </footer>
    </div>
  );
}
