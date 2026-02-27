'use client';

import { useParams } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { ChevronLeft, Share2, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';

export default function BuyEbookPage() {
  const params = useParams();
  const { handleBack, handleNavigate } = useTransitionRouter();
  const { allEbooks } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);

  useEffect(() => {
    if (params.id && allEbooks.length > 0) {
      const foundEbook = allEbooks.find((e) => e.id === params.id);
      setEbook(foundEbook);
    }
  }, [params.id, allEbooks]);

  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
  }

  // Dummy data based on image
  const rating = 3;
  const pageCount = 120; // Example
  const publishDate = "01/01/2024"; // Example

  const handleCardClick = (ebook: Ebook) => {
    const isOwnPublication = false; // On buy page, we assume we can't click to our own ebook details
    if (isOwnPublication) {
        handleNavigate(`/ebook/${ebook.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="relative flex items-center justify-between w-full max-w-5xl mx-auto mb-8">
        <Button onClick={handleBack} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
            <Share2 className="h-6 w-6" />
          </Button>
          <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
            <AlertCircle className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col items-center">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-8 w-8",
                    i < rating ? "text-foreground fill-foreground" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <div className="w-full max-w-sm">
                <EbookCard ebook={ebook} onCardClick={handleCardClick} />
            </div>
            <div className="bg-foreground text-background text-sm font-semibold rounded-full px-16 py-1.5 mt-4">
              @utilisateur
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-semibold">{ebook.price} €</div>
              <div className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-semibold">{pageCount} p</div>
              <div className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-semibold">{publishDate}</div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-secondary rounded-2xl p-4 flex items-center">
                <span className="font-bold text-muted-foreground mr-4">T</span>
                <p className="text-foreground">{ebook.title}</p>
              </div>
              <div className="bg-secondary rounded-2xl p-4 flex items-start">
                <span className="font-bold text-muted-foreground mr-4">D</span>
                <p className="text-foreground leading-relaxed">{ebook.description}</p>
              </div>
              <div className="bg-secondary rounded-2xl p-4 flex items-center">
                <span className="font-bold text-muted-foreground mr-4">M</span>
                <p className="text-foreground">{ebook.keywords}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex justify-center mt-12 pb-8">
        <Button className="bg-foreground text-background rounded-full h-14 px-20 text-lg font-semibold hover:bg-foreground/90">
          payer
        </Button>
      </footer>
    </div>
  );
}
