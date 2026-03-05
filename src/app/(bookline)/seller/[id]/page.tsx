'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Share2, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { BuyEbookSheet } from '@/components/bookline/buy-ebook-sheet';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';

export default function SellerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { handleNavigate, handleBack } = useTransitionRouter();
  const { publishedEbooks, allEbooks, userProfile, theme } = useEbooks();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const isMobile = useIsMobile();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // The seller's ebooks are all ebooks that are not the current user's published ebooks.
  const publishedEbookIds = new Set(publishedEbooks.map(e => e.id));
  const sellerEbooks = allEbooks.filter(ebook => !publishedEbookIds.has(ebook.id));
  
  // The seller profile is static for now, but uses the user's bio and avatar.
  const sellerProfile = {
      username: 'bookline',
      bio: userProfile.bio || 'Découvrez notre collection d\'ebooks exclusifs sur des sujets variés.',
      avatarUrl: userProfile.avatarUrl
  };

  const handleCopyUsername = () => {
    if (isCopied) return;
    if (!sellerProfile.username) return;
    navigator.clipboard.writeText(sellerProfile.username).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    }).catch(err => {
      console.error("Failed to copy username: ", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le nom d'utilisateur.",
      });
    });
  };

  const handleEbookClick = (ebook: Ebook) => {
    if (isMobile) {
        setSelectedEbook(ebook);
    } else {
        handleNavigate(`/buy/${ebook.id}`);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
        setSelectedEbook(null);
    }
  };


  return (
    <>
      {isClient && (
        <>
          <LightFluidBackground isActive={theme === 'light'} />
          <DarkFluidBackground isActive={theme === 'dark'} />
        </>
      )}
      <div className={cn("flex flex-col min-h-screen text-foreground bg-transparent")}>
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between w-full py-6">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label="Retour">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label="Partager le profil">
                <Share2 className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label="Signaler le profil">
                <AlertCircle className="h-6 w-6" />
              </Button>
            </div>
          </header>

          <main className="flex-1 w-full flex flex-col items-center pt-16 pb-8">
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28 bg-foreground">
                <AvatarImage src={sellerProfile.avatarUrl || ''} alt="Photo de profil du vendeur" />
                <AvatarFallback className="bg-transparent">
                  <User className="h-12 w-12 text-background" />
                </AvatarFallback>
              </Avatar>
              <div 
                className={cn(
                  "text-sm font-semibold rounded-full px-16 py-1.5 mt-4 cursor-pointer select-none transition-colors duration-300",
                  isCopied ? 'bg-green-500 text-white' : 'bg-foreground text-background'
                )}
                onClick={handleCopyUsername}
                onContextMenu={(e) => e.preventDefault()}
              >
                {sellerProfile.username}
              </div>
              {sellerProfile.bio && (
                <p className="text-center text-muted-foreground mt-4 max-w-sm break-words">{sellerProfile.bio}</p>
              )}
            </div>
            
            <div className="w-full max-w-sm md:max-w-4xl mt-4">
              {sellerEbooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {sellerEbooks.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} onCardClick={handleEbookClick} />
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
      <BuyEbookSheet ebook={selectedEbook} onOpenChange={handleSheetOpenChange} />
    </>
  );
}
