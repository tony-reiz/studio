'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { ProfileTabNav } from '@/components/bookline/profile-tab-nav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'achats' | 'publications' | 'favoris';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTabQuery = searchParams.get('tab');
  const initialTab: ActiveTab = initialTabQuery === 'achats' || initialTabQuery === 'publications' || initialTabQuery === 'favoris' 
                                    ? initialTabQuery 
                                    : 'publications';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [displayedTab, setDisplayedTab] = useState<ActiveTab>(initialTab);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const { publishedEbooks, favoritedEbooks, userProfile, purchasedEbooks } = useEbooks();
  const { handleNavigate } = useTransitionRouter();
  const userPublications = publishedEbooks;
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

  const handleTabChange = (newTab: ActiveTab) => {
    if (activeTab === newTab) {
      return;
    }

    setActiveTab(newTab);
    setIsContentVisible(false);

    setTimeout(() => {
      setDisplayedTab(newTab);
      setIsContentVisible(true);
    }, 300);
  };

  const renderContent = () => {
    switch (displayedTab) {
      case 'achats':
        return purchasedEbooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {purchasedEbooks.map((ebook) => (
              <EbookCard key={`achat-${ebook.id}`} ebook={ebook} onCardClick={(e) => handleNavigate(`/ebook/${e.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            Vous n’avez aucun ebook acheté
          </div>
        );
      case 'publications':
        return userPublications.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {userPublications.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} onCardClick={(e) => handleNavigate(`/ebook/${e.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            Vous n’avez aucun ebook publié
          </div>
        );
      case 'favoris':
        return favoritedEbooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {favoritedEbooks.map((ebook) => (
              <EbookCard key={`fav-${ebook.id}`} ebook={ebook} onCardClick={(e) => handleNavigate(`/buy/${e.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            Vous n’avez aucun ebook en favoris
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between w-full py-6">
          <Button variant="ghost" size="icon" aria-label="Menu" className="p-0 h-auto invisible">
            <Share2 />
          </Button>
          <div className="flex flex-col items-center gap-3">
            <Button onClick={() => handleNavigate('/home')} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Accueil">
                <Home className="h-6 w-6" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Partager le profil">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pb-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-28 w-28 bg-foreground">
              <AvatarImage src={userProfile.avatarUrl || ''} alt="Photo de profil de l'utilisateur" />
              <AvatarFallback className="bg-transparent">
                <User className="h-12 w-12 text-background" />
              </AvatarFallback>
            </Avatar>
            <div 
              className={cn(
                "text-sm font-semibold rounded-full px-12 mt-4 h-9 flex items-center justify-center cursor-pointer select-none transition-colors duration-300",
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

          <ProfileTabNav activeTab={activeTab} setActiveTab={handleTabChange} />
          
          <div className={cn("w-full max-w-sm md:max-w-4xl mt-4 transition-opacity duration-300", isContentVisible ? 'opacity-100' : 'opacity-0')}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
