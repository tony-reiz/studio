'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { Share2, AlertCircle, Star, ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), {
  ssr: false,
  loading: () => null,
});

interface BuyEbookDialogProps {
    ebook: Ebook | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BuyEbookDialog({ ebook, open, onOpenChange }: BuyEbookDialogProps) {
  const { handleNavigate } = useTransitionRouter();
  const { favoritedEbooks, purchasedEbooks, purchaseEbook, allEbooks, publishedEbooks, userProfile, t, theme } = useEbooks();
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();
  const [view, setView] = useState<'purchase' | 'seller'>('purchase');
  const [isCopied, setIsCopied] = useState(false);
  const [currentEbook, setCurrentEbook] = useState<Ebook | null>(ebook);

  useEffect(() => {
    if (open) {
      setCurrentEbook(ebook);
      setView('purchase');
    }
  }, [ebook, open]);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  
  const handleSellerEbookClick = (selectedEbook: Ebook) => {
    setCurrentEbook(selectedEbook);
    setView('purchase');
  };

  const handleCardClick = (ebook: Ebook) => {
    // On this page, clicking the card does nothing.
  };

  const isPurchased = currentEbook ? purchasedEbooks.some(p => p.id === currentEbook.id) : false;

  const handlePayment = () => {
    if (!currentEbook) return;

    if (isPurchased) {
      onOpenChange(false);
      handleNavigate(`/ebook/${currentEbook.id}`);
    } else {
      purchaseEbook(currentEbook);
      toast({
        title: t('payment_successful'),
        description: `${t('you_can_now_read')} "${currentEbook.title}".`,
      });
      onOpenChange(false);
      handleNavigate('/profile?tab=achats');
    }
  };
  
  if (!currentEbook) {
    return null;
  }

  const CUSTOMER_FEE = 3.5;
  const ebookPriceNumber = parseFloat(currentEbook.price.replace(',', '.')) || 0;
  const totalPriceForCustomer = ebookPriceNumber + CUSTOMER_FEE;

  const formatPrice = (value: number | null): string => {
    if (value === null || isNaN(value)) {
      return '-- €';
    }
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base rounded-full flex items-center";
  const textareaClasses = "pl-11 pr-4 h-[148px] w-full text-base rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto";

  const handleDialogChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

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

  return (
    <>
       {currentEbook.pdfDataUrl.startsWith('data:application/pdf') && (
        <div className="hidden">
          <Document file={currentEbook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
        </div>
      )}
      
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none shadow-xl">
          <DialogTitle className="sr-only">{t('buy_ebook')} {currentEbook.title}</DialogTitle>
          <div className="h-[80vh] max-h-[800px] bg-background rounded-[50px] overflow-hidden">
            <div
              className={cn(
                "flex w-[200%] h-full transition-transform duration-500 ease-in-out",
                view === 'seller' ? '-translate-x-1/2' : 'translate-x-0'
              )}
            >
              {/* Purchase View */}
              <div className="w-1/2 h-full flex-shrink-0 p-8 flex flex-col">
                <main className="flex-1 w-full flex flex-col items-center justify-center gap-8 overflow-y-auto scrollbar-hide">
                  <div className="grid md:grid-cols-2 items-start gap-4 w-full">
                    <div className="flex justify-center md:justify-end">
                      <div className="w-full max-w-[18rem] md:max-w-xs">
                        <div className="flex justify-center gap-1 mb-4">
                            <Star className="w-8 h-8 text-foreground fill-foreground" />
                            <Star className="w-8 h-8 text-foreground fill-foreground" />
                            <Star className="w-8 h-8 text-foreground fill-foreground" />
                            <Star className={cn("w-8 h-8", theme === 'light' ? 'text-[#DFDFDF] fill-[#DFDFDF]' : 'text-[#171717] fill-[#171717]')} />
                            <Star className={cn("w-8 h-8", theme === 'light' ? 'text-[#DFDFDF] fill-[#DFDFDF]' : 'text-[#171717] fill-[#171717]')} />
                        </div>
                        <EbookCard ebook={currentEbook} onCardClick={handleCardClick} />
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-start">
                      <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
                        <button onClick={() => setView('seller')} className="w-full group">
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
                              <p className="text-foreground whitespace-nowrap">{currentEbook.title}</p>
                            </div>
                          </div>
                          <div className="relative w-full">
                            <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-foreground">D</span>
                            <div className={cn(textareaClasses, 'whitespace-pre-wrap', theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                              <p className="text-foreground">{currentEbook.description}</p>
                            </div>
                          </div>
                          <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">M</span>
                            <div className={cn("h-12 w-full text-base border-0 rounded-full flex items-center p-0 overflow-hidden", theme === 'dark' ? 'bg-[#393939]' : 'bg-[#DFDFDF]')}>
                              <div className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-4 scrollbar-hide">
                                {currentEbook.keywords.split(',').map((keyword, index) => (
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
              </div>

              {/* Seller View */}
              <div className="w-1/2 h-full flex-shrink-0 p-8 flex flex-col">
                  <header className="flex items-center w-full pb-4 shrink-0">
                      <Button onClick={() => setView('purchase')} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label={t('back')}>
                          <ChevronLeft className="h-6 w-6" />
                      </Button>
                  </header>
                  <main className="flex-1 w-full flex flex-col items-center pt-8 overflow-y-auto scrollbar-hide">
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
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
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
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
