'use client';

import { useEffect, useState, useRef, type TouchEvent } from 'react';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Star, ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Document = dynamic(
  () =>
    import('react-pdf').then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      return mod.Document;
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

interface BuyEbookSheetProps {
    ebook: Ebook | null;
    onOpenChange: (open: boolean) => void;
}

export function BuyEbookSheet({ ebook, onOpenChange }: BuyEbookSheetProps) {
  const [isComponentOpen, setIsComponentOpen] = useState(!!ebook);
  const [isSheetMounted, setIsSheetMounted] = useState(!!ebook);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [activeEbook, setActiveEbook] = useState<Ebook | null>(ebook);

  const [animationCurve, setAnimationCurve] = useState('cubic-bezier(0.32, 0.72, 0, 1)');

  const [view, setView] = useState<'purchase' | 'seller'>('purchase');
  const { handleNavigate } = useTransitionRouter();
  const { purchasedEbooks, purchaseEbook, t, allEbooks, publishedEbooks, userProfile } = useEbooks();
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const dragState = useRef({ isDragging: false, startY: 0, isSheetDrag: false });

  useEffect(() => {
    if (ebook) {
      setActiveEbook(ebook);
      setView('purchase');
    }
  }, [ebook]);

  useEffect(() => {
    setIsComponentOpen(!!ebook);
  }, [ebook]);

  useEffect(() => {
    if (isComponentOpen) {
      document.body.style.overflow = 'hidden';
      setIsSheetMounted(true);
      setIsContentVisible(false);
      setAnimationCurve('cubic-bezier(0.32, 0.72, 0, 1)'); // Entry curve
      const timer = setTimeout(() => {
        setIsAnimationOpen(true);
        setTranslateY(0);
      }, 10);
      const contentTimer = setTimeout(() => {
        setIsContentVisible(true);
      }, 700);
      return () => {
        clearTimeout(timer);
        clearTimeout(contentTimer);
      };
    } else {
      if (!isSheetMounted) return;
      document.body.style.overflow = 'auto';
      setAnimationCurve('cubic-bezier(0.55, 0.085, 0.68, 0.53)'); // Exit curve
      setIsAnimationOpen(false);
      setIsContentVisible(false);
      const timer = setTimeout(() => {
        setIsSheetMounted(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isComponentOpen, isSheetMounted]);

  const closeSheet = () => {
    onOpenChange(false);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      if (dragState.current.isDragging) return;
      dragState.current = { isDragging: true, startY: e.touches[0].clientY, isSheetDrag: false };
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      if (!dragState.current.isDragging) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - dragState.current.startY;

      const target = e.target as HTMLElement;
      const scrollableContent = target.closest<HTMLElement>('[data-scrollable-sheet="true"]');
      const isAtTop = !scrollableContent || scrollableContent.scrollTop <= 0;

      if (isAtTop && deltaY > 0) {
          dragState.current.isSheetDrag = true;
          if (sheetRef.current) {
              sheetRef.current.style.transition = 'none';
          }
          setTranslateY(deltaY);
          
          if (e.cancelable) e.preventDefault(); 
      } 
      else {
          dragState.current.isSheetDrag = false;
      }
  };
  
  const handleTouchEnd = () => {
      if (!dragState.current.isDragging) return;

      if (sheetRef.current) {
          sheetRef.current.style.transition = '';
      }

      if (dragState.current.isSheetDrag) {
          const sheetHeight = sheetRef.current?.clientHeight || 0;
          if (translateY > sheetHeight / 4) {
              closeSheet();
          } else {
              setTranslateY(0);
          }
      }
      
      dragState.current = { isDragging: false, startY: 0, isSheetDrag: false };
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleCardClick = (ebook: Ebook) => {
    // In sheet, clicking card does nothing in purchase view.
  };

  const isPurchased = activeEbook ? purchasedEbooks.some(p => p.id === activeEbook.id) : false;

  const handlePayment = () => {
    if (!activeEbook) return;
    if (isPurchased) {
      closeSheet();
      handleNavigate(`/ebook/${activeEbook.id}`);
    } else {
      purchaseEbook(activeEbook);
      toast({
        title: t('payment_successful'),
        description: `${t('you_can_now_read')} "${activeEbook.title}".`,
      });
    }
  };

  const CUSTOMER_FEE = 3.5;
  const ebookPriceNumber = activeEbook ? parseFloat(activeEbook.price.replace(',', '.')) || 0 : 0;
  const totalPriceForCustomer = ebookPriceNumber + CUSTOMER_FEE;

  const formatPrice = (value: number | null): string => {
    if (value === null || isNaN(value)) {
      return '-- €';
    }
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };
  
  const handleSellerEbookClick = (selectedEbook: Ebook) => {
    setActiveEbook(selectedEbook);
    setView('purchase');
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

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base rounded-full flex items-center glass-form-element";
  const textareaClasses = "pl-11 pr-4 h-[148px] w-full text-base rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto glass-form-element";

  if (!isSheetMounted) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
    >
      <div className="hidden">
        {activeEbook?.pdfDataUrl.startsWith('data:application/pdf') && (
            <Document file={activeEbook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
        )}
      </div>
      
      <div
        className={cn(
          "fixed inset-0 bg-black/60 transition-opacity duration-500",
          isAnimationOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeSheet}
      />
      
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute bottom-0 left-0 right-0 flex max-h-[80vh] w-full flex-col bg-background rounded-t-[50px] pt-6"
        style={{
          transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
          transition: `transform 0.8s ${animationCurve}`,
        }}
      >
        <h2 id="sheet-title" className="sr-only">{t('buy_ebook')} {activeEbook?.title}</h2>
        
        <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className={cn("flex w-[200%] h-full transition-transform duration-500 ease-in-out", view === 'seller' ? '-translate-x-1/2' : 'translate-x-0')}>
            
            {/* Purchase View */}
            <div className={cn("w-1/2 h-full flex-shrink-0 flex flex-col transition-opacity", isContentVisible ? "opacity-100 duration-300" : "opacity-0 duration-[800ms]")}>
              {activeEbook && (
                  <div className="overflow-y-auto" data-scrollable-sheet="true">
                      <main className="w-full flex flex-col items-center pt-2 pb-16 gap-8 px-4">
                      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-start md:justify-center md:gap-4">
                          <div className="flex justify-center md:justify-end">
                              <div className="w-full max-w-[18rem] md:max-w-xs">
                                  <div className="flex justify-center gap-1 mb-4">
                                      <Star className="w-8 h-8 text-black fill-black" />
                                      <Star className="w-8 h-8 text-black fill-black" />
                                      <Star className="w-8 h-8 text-black fill-black" />
                                      <Star className="w-8 h-8 text-white fill-white stroke-white" />
                                      <Star className="w-8 h-8 text-white fill-white stroke-white" />
                                  </div>
                                  <EbookCard ebook={activeEbook} onCardClick={handleCardClick} />
                              </div>
                          </div>
                          <div className="flex justify-center md:justify-start pt-8 md:pt-0">
                              <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
                                  <div className="w-full">
                                      <button onClick={() => setView('seller')} className="w-full group">
                                          <div className="w-full bg-black text-white rounded-full py-2 text-sm font-semibold text-center mb-4 group-hover:bg-black/90 transition-colors">
                                              {t('seller')}
                                          </div>
                                      </button>
                                  </div>
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
                                          <div className={cn(inputClasses, "overflow-x-auto scrollbar-hide")}>
                                          <p className="text-foreground whitespace-nowrap">{activeEbook.title}</p>
                                          </div>
                                      </div>
                                      <div className="relative w-full">
                                          <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-foreground">D</span>
                                          <div className={cn(textareaClasses, 'whitespace-pre-wrap')}>
                                          <p className="text-foreground">{activeEbook.description}</p>
                                          </div>
                                      </div>
                                      <div className="relative w-full">
                                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">M</span>
                                          <div className="h-12 w-full text-base rounded-full flex items-center p-0 overflow-hidden glass-form-element">
                                          <div className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-4 scrollbar-hide">
                                              {activeEbook.keywords.split(',').map((keyword, index) => (
                                              <Badge key={index} variant="default" className="flex-shrink-0 whitespace-nowrap rounded-full py-1 px-3">
                                                  {keyword.trim()}
                                              </Badge>
                                              ))}
                                          </div>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="w-full rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden glass-form-element">
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
              )}
            </div>

            {/* Seller View */}
            <div className="w-1/2 h-full flex-shrink-0 flex flex-col">
                <header className="flex items-center w-full px-4 pt-4 pb-4 shrink-0">
                    <Button onClick={() => setView('purchase')} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11" aria-label={t('back')}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </header>
                <main data-scrollable-sheet="true" className="flex-1 w-full flex flex-col items-center pt-8 overflow-y-auto px-4 pb-8 scrollbar-hide">
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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
