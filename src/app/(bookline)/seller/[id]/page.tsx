'use client';

import { User, Share2, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';

export default function SellerProfilePage() {
  const { handleNavigate, handleBack } = useTransitionRouter();
  const { allEbooks, publishedEbooks } = useEbooks(); // In a real app, this would be filtered by seller ID
  
  // The seller's publications are all ebooks that are NOT published by the current user.
  // In this app's context, this means the placeholder ebooks.
  const publishedEbookIds = new Set(publishedEbooks.map(ebook => ebook.id));
  const sellerPublications = allEbooks.filter(ebook => !publishedEbookIds.has(ebook.id));


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between w-full py-6">
          <Button onClick={handleBack} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Retour">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col items-center gap-3">
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Partager le profil">
              <Share2 className="h-6 w-6" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Signaler le profil">
              <AlertCircle className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-16 pb-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-28 w-28 bg-foreground">
              <AvatarImage src="https://picsum.photos/seed/seller-profile/200" alt="Photo de profil du vendeur" />
              <AvatarFallback className="bg-transparent">
                <User className="h-16 w-16 text-background" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-foreground text-background text-sm font-semibold rounded-full px-16 py-1.5 mt-4">
              Book-Lover
            </div>
          </div>
          
          <div className="w-full max-w-sm md:max-w-4xl mt-4">
            {sellerPublications.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                {sellerPublications.map((ebook) => (
                  <EbookCard key={ebook.id} ebook={ebook} onCardClick={(e) => handleNavigate(`/buy/${e.id}`)} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-8">
                Ce vendeur n'a aucune publication pour le moment.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
