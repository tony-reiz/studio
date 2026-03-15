'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Loader2, Share2, Trash2, ChevronLeft, MoreHorizontal, FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { EbookDetailsSheet } from '@/components/bookline/ebook-details-sheet';
import { EbookDetailsDialog } from '@/components/bookline/ebook-details-dialog';
import { Document, Page } from 'react-pdf';
import { GlassEffect } from '@/components/bookline/glass-effect';


export default function EbookViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const { handleBack } = useTransitionRouter();
  const { publishedEbooks, removePublishedEbook, t, allEbooks } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const widthRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isOwner = ebook ? publishedEbooks.some(p => p.id === ebook.id) : false;

  useEffect(() => {
    if (id && allEbooks.length > 0) {
      const foundEbook = allEbooks.find((e) => e.id === id);
      setEbook(foundEbook);
    }
  }, [id, allEbooks]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Set the width for the PDF pages
  useEffect(() => {
    const setWidth = () => {
      if (widthRef.current) {
        setContainerWidth(widthRef.current.offsetWidth);
      }
    };
    setWidth();
    window.addEventListener('resize', setWidth);
    return () => window.removeEventListener('resize', setWidth);
  }, []);

  const handleDelete = () => {
    if (ebook) {
      removePublishedEbook(ebook.id);
      toast({
        title: t('ebook_deleted'),
        description: t('ebook_deleted_description'),
      });
      handleBack();
    }
  };
  
  const handleShare = async () => {
    if (!ebook) return;

    const isPdf = ebook.pdfDataUrl.startsWith('data:application/pdf');

    if (isMobile && isPdf && navigator.share && navigator.canShare) {
      try {
        const response = await fetch(ebook.pdfDataUrl);
        const blob = await response.blob();
        const fileName = ebook.title.replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-').toLowerCase();
        const file = new File([blob], `${fileName || 'ebook'}.pdf`, { type: 'application/pdf' });
        
        const shareData = {
          files: [file],
          title: ebook.title,
          text: `${t('heres_the_ebook')} ${ebook.title}`,
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (error) {
        // Fallback
      }
    }

    const urlShareData = {
      title: ebook.title,
      text: `${t('discover_this_ebook')} ${ebook.title}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(urlShareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: t('link_copied') });
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: t('link_copied') });
      } catch (copyError) {
        // Silent fail
      }
    }
  };
  
  const handleDownload = async () => {
    if (!ebook?.pdfDataUrl) return;
    try {
        const response = await fetch(ebook.pdfDataUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = ebook.title.replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-').toLowerCase();
        link.setAttribute('download', `${fileName || 'ebook'}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        toast({
            variant: "destructive",
            title: t('download_error_title'),
            description: t('download_error_desc'),
        });
    }
  };

  const PdfError = () => (
    <div className="flex flex-col items-center justify-center text-center text-destructive p-8 h-full mt-20">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold">{t('pdf_load_error_title')}</h3>
        <p className="text-sm">{t('pdf_load_error_desc')}</p>
    </div>
  );

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary">
        <p>{t('ebook_not_found')}</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="h-screen bg-secondary flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-2 sm:px-4 h-16">
            <Button onClick={handleBack} variant="ghost" size="icon" className="text-foreground">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="font-semibold text-base sm:text-lg truncate flex-1 text-center mx-2">{ebook.title}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>{t('share')}</span>
                </DropdownMenuItem>
                {isClient && !isMobile && (
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>{t('download')}</span>
                  </DropdownMenuItem>
                )}
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t('delete')}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {numPages && (
          <div className="fixed left-1/2 -translate-x-1/2 z-20 bg-background/80 backdrop-blur-xl rounded-full flex items-center gap-2 px-3 py-1.5" style={{ top: `calc(env(safe-area-inset-top) + 5rem)`}}>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground tabular-nums">{numPages} {t('pages')}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto" style={{ paddingTop: `calc(env(safe-area-inset-top) + 4rem)`, paddingBottom: '8rem' }}>
            <div ref={widthRef} className="w-full max-w-xl mx-auto">
                <Document
                    file={ebook.pdfDataUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex h-full w-full items-center justify-center pt-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    }
                    error={<PdfError />}
                    className="flex flex-col items-center"
                >
                    {Array.from(new Array(numPages || 0), (el, index) => (
                        <div
                            key={`page_${index + 1}`}
                            className="w-full mb-4 flex justify-center"
                        >
                            <Page
                                pageNumber={index + 1}
                                width={containerWidth > 0 ? containerWidth : undefined}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </main>

        {isOwner && (
          <footer className="fixed bottom-8 left-0 right-0 z-30 p-4 md:bottom-2 md:mb-4" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
            <div className="relative w-full max-w-[16rem] h-12 mx-auto isolate overflow-hidden rounded-full">
                {isClient && (
                    <>
                        <GlassEffect />
                        <div className="absolute inset-0 z-20 flex items-center justify-around px-4">
                            <Button onClick={() => isMobile ? setIsSheetOpen(true) : setIsDetailsDialogOpen(true)} variant="ghost" size="icon" className="text-foreground hover:bg-transparent" aria-label={t('details')}>
                                <FileText className="h-6 w-6" />
                            </Button>
                            <Button onClick={handleShare} variant="ghost" size="icon" className="text-foreground hover:bg-transparent" aria-label={t('share')}>
                                <Share2 className="h-6 w-6" />
                            </Button>
                            <Button onClick={handleDelete} variant="ghost" size="icon" className="text-destructive hover:bg-transparent hover:text-destructive/80" aria-label={t('delete')}>
                                <Trash2 className="h-6 w-6" />
                            </Button>
                        </div>
                    </>
                )}
            </div>
          </footer>
        )}
      </div>
      {isOwner && isClient && isMobile && (
        <EbookDetailsSheet ebook={ebook} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      )}
      {isOwner && isClient && !isMobile && (
        <EbookDetailsDialog ebook={ebook} open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
      )}
    </>
  );
}
