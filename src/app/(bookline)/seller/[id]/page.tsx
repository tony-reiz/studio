'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { cn } from '@/lib/utils';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { GlassEffect } from '@/components/bookline/glass-effect';
import { BuyEbookSheet } from '@/components/bookline/buy-ebook-sheet';
import { BuyEbookDialog } from '@/components/bookline/buy-ebook-dialog';

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string; // Will be unused for now

  const { allEbooks, publishedEbooks, t, theme } = useEbooks();
  const { handleBack } = useTransitionRouter();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const isMobile = useIsMobile();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Logic to determine seller's ebooks
  const publishedEbookIds = new Set(publishedEbooks.map(e => e.id));
  const sellerEbooks = allEbooks.filter(e => !publishedEbookIds.has(e.id));
  
  // Hardcoded seller profile for now
  const sellerProfile = {
      username: 'BookLine',
      bio: t('seller_default_bio'),
      avatarUrl: '/icon.svg' 
  };


  const handleCopyUsername = () => {
    if (isCopied) return;
    if (!sellerProfile.username) return;
    navigator.clipboard.writeText(sellerProfile.username).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    }).catch(err => {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('cannot_copy_username'),
      });
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: t('profile_of_on_bookline').replace('{username}', sellerProfile.username),
      text: t('discover_profile_of_on_bookline').replace('{username}', sellerProfile.username),
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
      // Silently fail
    }
  };

  const handleEbookClick = (ebook: Ebook) => {
    // When clicking an ebook on the seller page, it should open the buy page/dialog
    setSelectedEbook(ebook);
    if (!isMobile) {
      setIsBuyDialogOpen(true);
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
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
                <GlassEffect />
                <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleShare} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('share_profile')}>
                <GlassEffect />
                <Share2 className="h-6 w-6 relative z-20" />
              </Button>
            </div>
          </header>

          <main className="flex-1 w-full flex flex-col items-center pb-8">
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28 bg-foreground dark:bg-white">
                <AvatarImage src={sellerProfile.avatarUrl || ''} alt={t('user_profile_picture')} />
                <AvatarFallback className="bg-transparent">
                  <User className="h-12 w-12 text-background dark:text-black" />
                </AvatarFallback>
              </Avatar>
              <div 
                className={cn(
                  "text-sm font-semibold rounded-full px-12 mt-4 h-9 flex items-center justify-center cursor-pointer select-none transition-colors duration-300 relative isolate overflow-hidden",
                  isCopied ? 'bg-green-500 text-white' : ''
                )}
                onClick={handleCopyUsername}
                onContextMenu={(e) => e.preventDefault()}
              >
                {!isCopied && <GlassEffect />}
                <span className="relative z-20">{sellerProfile.username}</span>
              </div>
              {sellerProfile.bio && (
                <p className="text-center text-muted-foreground mt-4 max-w-sm break-words">{sellerProfile.bio}</p>
              )}
            </div>

            <div className="w-full max-w-sm md:max-w-4xl mt-8">
              {sellerEbooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {sellerEbooks.map((ebook) => (
                      <EbookCard key={`seller-${ebook.id}`} ebook={ebook} onCardClick={handleEbookClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground mt-8">
                  {t('seller_no_publications')}
                </div>
              )}
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
