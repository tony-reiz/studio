'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { ProfileTabNav } from '@/components/bookline/profile-tab-nav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { BuyEbookSheet } from '@/components/bookline/buy-ebook-sheet';
import { BuyEbookDialog } from '@/components/bookline/buy-ebook-dialog';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';

type ActiveTab = 'achats' | 'publications' | 'favoris';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTabQuery = searchParams.get('tab');
  const initialTab: ActiveTab = initialTabQuery === 'achats' || initialTabQuery === 'publications' || initialTabQuery === 'favoris' 
                                    ? initialTabQuery 
                                    : 'publications';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [displayedTab, setDisplayedTab] = useState<ActiveTab>(initialTab);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const { publishedEbooks, favoritedEbooks, userProfile, purchasedEbooks, theme, t } = useEbooks();
  const { handleNavigate, handleBack } = useTransitionRouter();
  const userPublications = publishedEbooks;
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const isMobile = useIsMobile();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        title: t('error'),
        description: t('cannot_copy_username'),
      });
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Profil de ${userProfile.username} sur BookLine`,
      text: `Découvrez le profil de ${userProfile.username} sur BookLine !`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: t('link_copied') });
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('error_try_again'),
      });
    }
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
    }, 500);
  };

  const handleEbookClick = (ebook: Ebook, path: 'buy' | 'read') => {
    if (path === 'buy') {
        setSelectedEbook(ebook);
        if (isMobile) {
            // The BuyEbookSheet component handles its own visibility based on the 'ebook' prop.
        } else {
            setIsBuyDialogOpen(true);
        }
    } else {
        handleNavigate(`/ebook/${ebook.id}`);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
        setSelectedEbook(null);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsBuyDialogOpen(open);
    if (!open) {
        setSelectedEbook(null);
    }
  };

  const renderContent = () => {
    switch (displayedTab) {
      case 'achats':
        return purchasedEbooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {purchasedEbooks.map((ebook) => (
              <EbookCard key={`achat-${ebook.id}`} ebook={ebook} onCardClick={(e) => handleEbookClick(e, 'read')} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            {t('no_purchased_ebooks')}
          </div>
        );
      case 'publications':
        return userPublications.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {userPublications.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} onCardClick={(e) => handleEbookClick(e, 'read')} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            {t('no_published_ebooks')}
          </div>
        );
      case 'favoris':
        return favoritedEbooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {favoritedEbooks.map((ebook) => (
              <EbookCard key={`fav-${ebook.id}`} ebook={ebook} onCardClick={(e) => handleEbookClick(e, 'buy')} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            {t('no_favorited_ebooks')}
          </div>
        );
      default:
        return null;
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
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label={t('back')}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleShare} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label={t('share_profile')}>
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
                  isCopied ? 'bg-green-500 text-white' : 'glass-form-element'
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
            
            <div className={cn("w-full max-w-sm md:max-w-4xl mt-4 transition-opacity duration-500", isContentVisible ? 'opacity-100' : 'opacity-0')}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      {isMobile ? (
        <BuyEbookSheet ebook={selectedEbook} onOpenChange={handleSheetOpenChange} />
      ) : (
        <BuyEbookDialog ebook={selectedEbook} open={isBuyDialogOpen} onOpenChange={handleDialogOpenChange} />
      )}
    </>
  );
}
