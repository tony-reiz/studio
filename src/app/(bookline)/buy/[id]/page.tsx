'use client';

import { useParams } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { useEffect, useState } from 'react';
import { ChevronLeft, Share2, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

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


export default function BuyEbookPage() {
  const params = useParams();
  const { handleBack } = useTransitionRouter();
  const { allEbooks } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const [numPages, setNumPages] = useState<number | null>(null);


  useEffect(() => {
    if (params.id && allEbooks.length > 0) {
      const foundEbook = allEbooks.find((e) => e.id === params.id);
      setEbook(foundEbook);
    }
  }, [params.id, allEbooks]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleCardClick = (ebook: Ebook) => {
    // On this page, clicking the card does nothing.
  };

  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
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

  const inputClasses = "pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full flex items-center";
  const textareaClasses = "pl-11 pr-4 h-32 w-full text-base bg-secondary border-0 rounded-[30px] py-3.5 leading-snug flex items-start overflow-y-auto";

  return (
    <div className="min-h-screen bg-background text-foreground">
       {ebook.pdfDataUrl.startsWith('data:application/pdf') && (
        <div className="hidden">
          <Document file={ebook.pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess} />
        </div>
      )}
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between w-full py-6">
          <Button onClick={handleBack} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
              <Share2 className="h-6 w-6" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
              <AlertCircle className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pt-12 md:pt-20 pb-28 gap-8">
          <div className="grid md:grid-cols-2 items-start gap-4 w-full max-w-5xl">
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-[18rem] md:max-w-xs">
                <div className="flex justify-center gap-1 mb-4">
                    <Star className="w-8 h-8 text-foreground fill-foreground" />
                    <Star className="w-8 h-8 text-foreground fill-foreground" />
                    <Star className="w-8 h-8 text-foreground fill-foreground" />
                    <Star className="w-8 h-8 text-border fill-border" />
                    <Star className="w-8 h-8 text-border fill-border" />
                </div>
                <EbookCard ebook={ebook} onCardClick={handleCardClick} />
              </div>
            </div>
            <div className="flex justify-center md:justify-start">
              <div className="w-full max-w-[18rem] md:max-w-xs flex flex-col items-center">
                <div className="w-full bg-foreground text-background rounded-full py-2 text-sm font-semibold text-center mb-4">
                    vendeur
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
                    <div className={cn(inputClasses, "truncate")}>
                      <p className="text-foreground">{ebook.title}</p>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">D</span>
                    <div className={cn(textareaClasses, 'whitespace-pre-wrap')}>
                      <p className="text-foreground">{ebook.description}</p>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">M</span>
                    <div className={cn(inputClasses, "truncate")}>
                      <p className="text-foreground">{ebook.keywords}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-secondary rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden">
                  <div className='pl-6 py-4 text-sm text-muted-foreground space-y-1 flex flex-col justify-center'>
                    <p>prix de l'ebook</p>
                    <p>frais de service</p>
                    <p>total de l'ebook</p>
                  </div>
                  <div className='bg-foreground text-background rounded-l-[30px] px-12 py-4 text-sm flex flex-col justify-center text-right space-y-1'>
                    <p>{formatPrice(ebookPriceNumber)}</p>
                    <p>{formatPrice(CUSTOMER_FEE)}</p>
                    <p>{formatPrice(totalPriceForCustomer)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[16rem] w-full">
            <Button className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90">
              payer
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
