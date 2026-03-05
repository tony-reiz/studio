'use client';

import { useEffect, useState, useRef, type TouchEvent } from 'react';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isComponentOpen, setIsComponentOpen] = useState(!!ebook);
  const [isSheetMounted, setIsSheetMounted] = useState(!!ebook);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [activeEbook, setActiveEbook] = useState<Ebook | null>(ebook);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const { handleNavigate } = useTransitionRouter();
  const { purchasedEbooks, purchaseEbook } = useEbooks();
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (ebook) {
      setActiveEbook(ebook);
    }
  }, [ebook]);

  useEffect(() => {
    setIsComponentOpen(!!ebook);
  }, [ebook]);

  useEffect(() => {
    if (isComponentOpen) {
      document.body.style.overflow = 'hidden';
      setIsSheetMounted(true);
      const timer = setTimeout(() => {
        setIsAnimationOpen(true);
        setTranslateY(0);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'auto';
      setIsAnimationOpen(false);
      const timer = setTimeout(() => {
        setIsSheetMounted(false);
      }, 500); // This must match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isComponentOpen]);

  const closeSheet = () => {
    onOpenChange(false);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!sheetRef.current) return;
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    const style = window.getComputedStyle(sheetRef.current);
    const matrix = new DOMMatrix(style.transform);
    setTranslateY(matrix.m42);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    let deltaY = currentY - dragStartY;
    
    // Only allow dragging down
    if (deltaY < 0) {
      deltaY = 0;
    }
    setTranslateY(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const sheetHeight = sheetRef.current?.clientHeight || 0;
    // If dragged more than a quarter of the way down, close it
    if (translateY > sheetHeight / 4) {
      closeSheet();
    } else {
      // Otherwise, snap it back to the top
      setTranslateY(0);
    }
  };


  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleCardClick = (ebook: Ebook) => {
    // In sheet, clicking card does nothing.
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
        title: "Achat réussi !",
        description: `Vous pouvez maintenant lire "${activeEbook.title}".`,
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
  
  const handleSellerNavigate = () => {
      closeSheet();
      setTimeout(() => handleNavigate('/seller/1'), 500);
  }

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
        className="absolute bottom-0 left-0 right-0 flex max-h-[80vh] w-full flex-col bg-background rounded-t-[50px] touch-none"
        style={{
          transform: `translateY(${isAnimationOpen ? translateY : window.innerHeight}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
        }}
      >
        <h2 id="sheet-title" className="sr-only">Acheter l'ebook {activeEbook?.title}</h2>
        <div
            className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 my-3"
        />

        <div className="overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {activeEbook && (
                <main className="w-full flex flex-col items-center pt-2 pb-16 gap-8 px-4">
                <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-start md:justify-center md:gap-4">
                    <div className="flex justify-center md:justify-end">
                        <div className="w-full max-w-[18rem] md:max-w-xs">
                            <div className="flex justify-center gap-1 mb-4">
                                <Star className="w-8 h-8 text-foreground fill-foreground" />
                                <Star className="w-8 h-8 text-foreground fill-foreground" />
                                <Star className="w-8 h-8 text-foreground fill-foreground" />
                                <Star className="w-8 h-8 text-[#DFDFDF] fill-[#DFDFDF]" />
                                <Star className="w-8 h-8 text-[#DFDFDF] fill-[#DFDFDF]" />
                            </div>
                            <EbookCard ebook={activeEbook} onCardClick={handleCardClick} />
                        </div>
                    </div>
                    <div className="flex justify-center md:justify-start pt-8 md:pt-0">
                        <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
                            <div className="w-full">
                                <button onClick={handleSellerNavigate} className="w-full group">
                                    <div className="w-full bg-background text-foreground rounded-full py-2 text-sm font-semibold text-center mb-4 group-hover:bg-muted transition-colors">
                                        vendeur
                                    </div>
                                </button>
                            </div>
                            <div className="w-full grid grid-cols-3 gap-2 mb-4">
                                <div className="bg-background text-foreground rounded-full py-2 text-sm font-semibold text-center">
                                    {formatPrice(totalPriceForCustomer)}
                                </div>
                                <div className="bg-background text-foreground rounded-full py-2 text-sm font-semibold text-center">
                                    {numPages ? `${numPages} p` : '178 p'}
                                </div>
                                <div className="bg-background text-foreground rounded-full py-2 text-sm font-semibold text-center">
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
                                    <p>prix de l'ebook</p>
                                    <p>frais de service</p>
                                    <p>total de l'ebook</p>
                                </div>
                                <div className='bg-background text-foreground rounded-l-[30px] px-8 py-4 text-sm flex flex-col justify-center text-right space-y-1'>
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
                            : "bg-background text-foreground hover:bg-background/90"
                    )}
                    >
                    {isPurchased ? 'Voir' : 'Payer'}
                    </Button>
                </div>
                </main>
            )}
        </div>
      </div>
    </div>
  );
}
