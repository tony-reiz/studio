'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Share2, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
  const { allEbooks, purchasedEbooks, purchaseEbook, theme, t } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleCardClick = (ebook: Ebook) => {
    // On this page, clicking the card does nothing.
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
      handleNavigate('/profile?tab=achats');
    }
  };
  
  const handleDialogChange = (open: boolean) => {
    if (!open && !isMobile) {
      // Use a timeout to allow animation to finish before navigating
      setTimeout(() => handleBack(), 300);
    }
    setIsDialogOpen(open);
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

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base rounded-full flex items-center glass-form-element";
  const textareaClasses = "pl-11 pr-4 h-[148px] w-full text-base rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto glass-form-element";

  const PurchaseDetailsContent = (
      <main className="flex-1 w-full flex flex-col items-center pt-2 sm:pt-0 pb-8 sm:pb-0 gap-8">
        <div className="grid md:grid-cols-2 items-start gap-4 w-full max-w-5xl">
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[18rem] md:max-w-xs">
              <div className="flex justify-center gap-1 mb-4">
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className="w-8 h-8 text-foreground fill-foreground" />
                  <Star className="w-8 h-8 text-white fill-white stroke-white" />
                  <Star className="w-8 h-8 text-white fill-white stroke-white" />
              </div>
              <EbookCard ebook={ebook} onCardClick={handleCardClick} />
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
              <button onClick={() => { if(!isMobile) handleDialogChange(false); handleNavigate('/seller/1'); }} className="w-full group">
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
                  <div className={cn(inputClasses, "overflow-x-auto")}>
                    <p className="text-foreground whitespace-nowrap">{ebook.title}</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-foreground">D</span>
                  <div className={cn(textareaClasses, 'whitespace-pre-wrap')}>
                    <p className="text-foreground">{ebook.description}</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">M</span>
                  <div className="h-12 w-full text-base border-0 rounded-full flex items-center p-0 overflow-hidden glass-form-element">
                    <div className="flex-1 flex items-center gap-2 h-full overflow-x-auto pl-11 pr-4">
                      {ebook.keywords.split(',').map((keyword, index) => (
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
  );

  return (
    <div className={cn("min-h-screen text-foreground bg-background")}>
       {ebook.pdfDataUrl.startsWith('data:application/pdf') && (
        <div className="hidden">
          <Document file={ebook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
        </div>
      )}
      
      {!isMobile ? (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none shadow-xl">
            <div className="h-auto flex flex-col bg-background rounded-[40px] overflow-hidden p-8">
              {PurchaseDetailsContent}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between w-full py-6">
            <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11">
                <Share2 className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full glass-icon-button w-11 h-11">
                <AlertCircle className="h-6 w-6" />
              </Button>
            </div>
          </header>
          {PurchaseDetailsContent}
        </div>
      )}
    </div>
  );
}
