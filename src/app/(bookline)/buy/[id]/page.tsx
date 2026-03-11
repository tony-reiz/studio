'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Share2, AlertCircle, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlassEffect } from '@/components/bookline/glass-effect';

const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  {
    ssr: false,
    loading: () => null,
  }
);


export default function BuyEbookPage() {
  const params = useParams();
  const id = params.id as string;
  const { handleBack, handleNavigate } = useTransitionRouter();
  const { allEbooks, purchasedEbooks, purchaseEbook, theme, t, publishedEbooks, userProfile } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'purchase' | 'seller'>('purchase');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isMobile) {
      setIsDialogOpen(true);
    }
  }, [isClient, isMobile]);

  useEffect(() => {
    if (id && allEbooks.length > 0) {
      const foundEbook = allEbooks.find((e) => e.id === id);
      setEbook(foundEbook);
    }
  }, [id, allEbooks]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleShare = async () => {
    if (!ebook) return;
    const shareData = {
      title: ebook.title,
      text: `${t('discover_this_ebook')} ${ebook.title}`,
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: t('link_copied') });
      } catch (copyError) {
        // silent fail
      }
    }
  };

  const handleCardClick = (ebook: Ebook) => {
    // On this page, clicking the card does nothing.
  };
  
  const handleSellerEbookClick = (selectedEbook: Ebook) => {
    handleNavigate(`/buy/${selectedEbook.id}`);
  };

  const isPurchased = ebook ? purchasedEbooks.some(p => p.id === ebook.id) : false;

  const handlePayment = () => {
    if (!ebook) return;

    if (isPurchased) {
      if (!isMobile) setIsDialogOpen(false);
      handleNavigate(`/ebook/${ebook.id}`, { replace: true });
    } else {
      purchaseEbook(ebook);
      toast({
        title: t('payment_successful'),
        description: `${t('you_can_now_read')} "${ebook.title}".`,
      });
      handleNavigate(`/ebook/${ebook.id}`, { replace: true });
    }
  };
  
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && !isMobile) {
      setTimeout(() => handleBack(), 300);
    }
  };

  if (!isClient || !ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">{t('loading')}</div>;
  }

  const CUSTOMER_FEE = 3.5;
  const ebookPriceNumber = parseFloat(ebook.price.replace(',', '.')) || 0;
  const totalPriceForCustomer = ebookPriceNumber + CUSTOMER_FEE;

  const formatPrice = (value: number | null): string => {
    if (value === null || isNaN(value)) {
      return '-- €';
    }
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base rounded-full flex items-center";
  const textareaClasses = "pl-11 pr-4 h-[148px] w-full text-base rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto";
  
  // --- Seller Logic ---
  const publishedEbookIds = new Set(publishedEbooks.map(e => e.id));
  const sellerEbooks = allEbooks.filter(e => !publishedEbookIds.has(e.id));
  const sellerProfile = {
      username: 'bookline',
      bio: userProfile.bio || t('seller_default_bio'),
      avatarUrl: userProfile.avatarUrl
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
  // --- End Seller Logic ---

  const SellerContent = (
    <main className="flex-1 w-full flex flex-col items-center pt-8 overflow-y-auto px-4 pb-8 scrollbar-hide">
      <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 bg-foreground dark:bg-white">
              <AvatarImage src={sellerProfile.avatarUrl || ''} alt="Photo de profil du vendeur" />
              <AvatarFallback className="bg-transparent">
                  <User className="h-12 w-12 text-background dark:text-black" />
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
      
      <div className="w-full max-w-sm md:max-w-4xl mt-8">
          {sellerEbooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
              {sellerEbooks.map((ebook) => (
                  <EbookCard key={ebook.id} ebook={ebook} onCardClick={() => handleSellerEbookClick(ebook)} />
              ))}
              </div>
          ) : (
              <div className="text-center text-muted-foreground mt-8">
                {t('seller_no_publications')}
              </div>
          )}
      </div>
    </main>
  );

  const PurchaseDetailsContent = (
      <main className="flex-1 w-full flex flex-col items-center pt-2 sm:pt-0 pb-8 sm:pb-0 gap-8">
        <div className="grid md:grid-cols-2 items-start gap-4 w-full max-w-5xl">
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[18rem] md:max-w-xs">
              <div className="flex justify-center gap-1 mb-4">
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className={cn("w-8 h-8", theme === 'light' ? 'text-[#DFDFDF] fill-[#DFDFDF]' : 'text-[#171717] fill-[#171717]')} />
                  <Star className={cn("w-8 h-8", theme === 'light' ? 'text-[#DFDFDF] fill-[#DFDFDF]' : 'text-[#171717] fill-[#171717]')} />
              </div>
              <EbookCard ebook={ebook} onCardClick={handleCardClick} />
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
              <button onClick={() => { if(isMobile) { setView('seller'); } else { handleDialogChange(false); setTimeout(() => handleNavigate('/seller/1'), 300); } }} className="w-full group">
                <div className="w-full bg-black text-white rounded-full py-2 text-sm font-semibold text-center mb-4 group-hover:bg-black/90 transition-colors">
                    {t('seller')}
                </div>
              </button>
              <div className="w-full grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-black text-white rounded-full py-2 text-sm font-semibold text-center">
                      {formatPrice(totalPriceForCustomer)}
                  </div>
                  <div className="bg-black text-white rounded-full py-2 text-sm font-semibold text-center">
                      {numPages ? `${numPages} p` : '178 p'}
                  </div>
                  <div className="bg-black text-white rounded-full py-2 text-sm font-semibold text-center">
                      12/07/2024
                  </div>
              </div>

              <div className="w-full space-y-4">
                <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground">T</span>
                  <div className={cn(inputClasses, "overflow-x-auto scrollbar-hide", theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                    <p className="text-foreground whitespace-nowrap">{ebook.title}</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-foreground">D</span>
                  <div className={cn(textareaClasses, 'whitespace-pre-wrap', theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                    <p className="text-foreground">{ebook.description}</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">M</span>
                  <div className={cn("h-12 w-full text-base border-0 rounded-full flex items-center p-0 overflow-hidden", theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                    <div className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-4 scrollbar-hide">
                      {ebook.keywords.split(',').map((keyword, index) => (
                        <Badge key={index} variant="default" className="flex-shrink-0 whitespace-nowrap rounded-full py-1 px-3">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn("w-full rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden", theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                <div className='pl-6 py-4 text-sm text-foreground space-y-1 flex flex-col justify-center'>
                  <p>{t('ebook_price')}</p>
                  <p>{t('service_fee')}</p>
                  <p>{t('total_ebook_price')}</p>
                </div>
                <div className='bg-black text-white rounded-l-[30px] px-8 py-4 text-sm flex flex-col justify-center text-right space-y-1'>
                  <p>{formatPrice(ebookPriceNumber)}</p>
                  <p>{formatPrice(CUSTOMER_FEE)}</p>
                  <p>{formatPrice(totalPriceForCustomer)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[16rem] w-full">
          <Button
            onClick={handlePayment}
            className={cn(
              "rounded-full w-full h-12 text-lg font-semibold",
              isPurchased 
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-black text-white hover:bg-black/90"
            )}
          >
            {isPurchased ? t('view') : t('pay')}
          </Button>
        </div>
      </main>
  );

  return (
    <div className={cn("min-h-screen text-foreground bg-transparent")}>
       <LightFluidBackground isActive={theme === 'light'} />
       <DarkFluidBackground isActive={theme === 'dark'} />
       {ebook.pdfDataUrl.startsWith('data:application/pdf') && (
        <div className="hidden">
          <Document file={ebook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
        </div>
      )}
      
      {!isMobile ? (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none shadow-xl">
             <DialogTitle className="sr-only">{t('buy_ebook')} {ebook.title}</DialogTitle>
            <div className="h-auto flex flex-col bg-background rounded-[50px] overflow-hidden p-8">
              {PurchaseDetailsContent}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <header className="flex items-start justify-between w-full py-6">
            <Button onClick={view === 'purchase' ? handleBack : () => setView('purchase')} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('back')}>
              <GlassEffect />
              <ChevronLeft className="h-6 w-6 relative z-20" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleShare} variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('share')}>
                <GlassEffect />
                <Share2 className="h-6 w-6 relative z-20" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full w-11 h-11 relative isolate overflow-hidden" aria-label={t('report_profile')}>
                <GlassEffect />
                <AlertCircle className="h-6 w-6 relative z-20" />
              </Button>
            </div>
          </header>
          <div className={cn("flex-1 flex w-[200%] h-full transition-transform duration-500 ease-in-out", view === 'seller' ? '-translate-x-1/2' : 'translate-x-0')}>
            <div className="w-1/2 h-full flex-shrink-0 flex flex-col">{PurchaseDetailsContent}</div>
            <div className="w-1/2 h-full flex-shrink-0 flex flex-col">{SellerContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}
