'use client';

import { useState } from 'react';
import { User, Share2, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SellerProfilePage() {
  const { handleNavigate, handleBack } = useTransitionRouter();
  const { publishedEbooks, userProfile } = useEbooks();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUsername = () => {
    if (isCopied) return;
    if (!userProfile.username) return;
    navigator.clipboard.writeText(userProfile.username).then(() => {
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
              <AvatarImage src={userProfile.avatarUrl || ''} alt="Photo de profil du vendeur" />
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
              {userProfile.username}
            </div>
             {userProfile.bio && (
              <p className="text-center text-muted-foreground mt-4 max-w-sm break-words">{userProfile.bio}</p>
            )}
          </div>
          
          <div className="w-full max-w-sm md:max-w-4xl mt-4">
            {publishedEbooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                {publishedEbooks.map((ebook) => (
                  <EbookCard key={ebook.id} ebook={ebook} onCardClick={(e) => handleNavigate(`/ebook/${e.id}`)} />
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
