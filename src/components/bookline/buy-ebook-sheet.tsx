'use client';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useState, useEffect } from 'react';
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
    ebook: Ebook;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function BuyEbookSheet({ ebook, open, onOpenChange }: BuyEbookSheetProps) {
  const { handleNavigate } = useTransitionRouter();
  const { purchasedEbooks, purchaseEbook } = useEbooks();
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleCardClick = (ebook: Ebook) => {
    // In sheet, clicking card does nothing.
  };

  const isPurchased = purchasedEbooks.some(p => p.id === ebook.id);

  const handlePayment = () => {
    if (isPurchased) {
      if (onOpenChange) onOpenChange(false);
      setTimeout(() => handleNavigate(`/ebook/${ebook.id}`), 300);
    } else {
      purchaseEbook(ebook);
      toast({
        title: "Achat réussi !",
        description: `Vous pouvez maintenant lire "${ebook.title}".`,
      });
    }
  };

  const CUSTOMER_FEE = 3.5;
  const ebookPriceNumber = parseFloat(ebook.price.replace(',', '.')) || 0;
  const totalPriceForCustomer = ebookPriceNumber + CUSTOMER_FEE;

  const formatPrice = (value: number | null): string => {
    if (value === null || isNaN(value)) {
      return '-- €';
    }
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full flex items-center";
  const textareaClasses = "pl-11 pr-4 h-[148px] w-full text-base bg-secondary border-0 rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto";
  const closeSheet = () => onOpenChange && onOpenChange(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-[50px] max-h-[80vh] flex flex-col bg-background p-0 border-0">
        <DrawerTitle className="sr-only">Achat de l'ebook: {ebook.title}</DrawerTitle>
        {ebook.pdfDataUrl.startsWith('data:application/pdf') && (
            <div className="hidden">
                <Document file={ebook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
            </div>
        )}
        <header className="flex items-center justify-center w-full p-4 pt-3 flex-shrink-0">
            <div className="w-20 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50" />
        </header>

        <div className="overflow-y-auto">
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
                        <EbookCard ebook={ebook} onCardClick={handleCardClick} />
                    </div>
                </div>
                <div className="flex justify-center md:justify-start pt-8 md:pt-0">
                    <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
                        <div className="w-full">
                            <button onClick={() => { closeSheet(); setTimeout(() => handleNavigate('/seller/1'), 300); }} className="w-full group">
                                <div className="w-full bg-foreground text-background rounded-full py-2 text-sm font-semibold text-center mb-4 group-hover:bg-foreground/90 transition-colors">
                                    vendeur
                                </div>
                            </button>
                        </div>
                        <div className="w-full grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-foreground text-background rounded-full py-2 text-sm font-semibold text-center">
                                {formatPrice(totalPriceForCustomer)}
                            </div>
                            <div className="bg-foreground text-background rounded-full py-2 text-sm font-semibold text-center">
                                {numPages ? `${numPages} p` : '178 p'}
                            </div>
                            <div className="bg-foreground text-background rounded-full py-2 text-sm font-semibold text-center">
                                12/07/2024
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="relative w-full">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">T</span>
                                <div className={cn(inputClasses, "overflow-x-auto scrollbar-hide")}>
                                <p className="text-foreground whitespace-nowrap">{ebook.title}</p>
                                </div>
                            </div>
                            <div className="relative w-full">
                                <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">D</span>
                                <div className={cn(textareaClasses, 'whitespace-pre-wrap')}>
                                <p className="text-foreground">{ebook.description}</p>
                                </div>
                            </div>
                            <div className="relative w-full">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-10">M</span>
                                <div className="h-12 w-full text-base bg-secondary border-0 rounded-full flex items-center p-0 overflow-hidden">
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

                        <div className="w-full bg-secondary rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden">
                            <div className='pl-6 py-4 text-sm text-muted-foreground space-y-1 flex flex-col justify-center'>
                                <p>prix de l'ebook</p>
                                <p>frais de service</p>
                                <p>total de l'ebook</p>
                            </div>
                            <div className='bg-foreground text-background rounded-l-[30px] px-8 py-4 text-sm flex flex-col justify-center text-right space-y-1'>
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
                        : "bg-foreground text-background hover:bg-foreground/90"
                )}
                >
                {isPurchased ? 'Voir' : 'Payer'}
                </Button>
            </div>
            </main>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
