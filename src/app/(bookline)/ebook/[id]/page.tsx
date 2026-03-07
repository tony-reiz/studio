'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Loader2, Share2, Trash2, ChevronLeft, MoreHorizontal, FileText } from 'lucide-react';
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
import dynamic from 'next/dynamic';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { EbookDetailsSheet } from '@/components/bookline/ebook-details-sheet';

const Document = dynamic(
  () =>
    import('react-pdf').then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.js`;
      return mod.Document;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
});


export default function EbookViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const { handleNavigate, handleBack } = useTransitionRouter();
  const { publishedEbooks, removePublishedEbook, t, allEbooks } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    pageRefs.current = Array(numPages).fill(null);

    const setWidth = () => {
      if (viewerRef.current) {
        setContainerWidth(viewerRef.current.clientWidth);
      }
    };
    setWidth();
    window.addEventListener('resize', setWidth);

    const timer = setTimeout(() => {
        setIsPdfVisible(true);
    }, 100);

    return () => {
        window.removeEventListener('resize', setWidth)
        clearTimeout(timer);
    };
  };
  
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !numPages || !isPdfVisible) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePages = entries.filter(entry => entry.isIntersecting);
  
        if (visiblePages.length > 0) {
          const viewerRect = viewer.getBoundingClientRect();
          const viewerCenterY = viewerRect.top + viewerRect.height / 2;
  
          let closestPage = 1;
          let minDistance = Infinity;
  
          pageRefs.current.forEach((pageEl, index) => {
            if (pageEl) {
              const pageRect = pageEl.getBoundingClientRect();
              const pageCenterY = pageRect.top + pageRect.height / 2;
              const distance = Math.abs(viewerCenterY - pageCenterY);
  
              if (distance < minDistance) {
                minDistance = distance;
                closestPage = index + 1;
              }
            }
          });
          setCurrentPage(closestPage);
        }
      },
      {
        root: viewer,
        threshold: [0.2, 0.5, 0.8],
      }
    );
  
    const currentRefs = pageRefs.current;
    currentRefs.forEach((pageEl) => {
      if (pageEl) observer.observe(pageEl);
    });
  
    return () => {
      currentRefs.forEach((pageEl) => {
        if (pageEl) observer.unobserve(pageEl);
      });
    };
  }, [numPages, isPdfVisible]);


  const handleDelete = () => {
    if (ebook) {
      removePublishedEbook(ebook.id);
      toast({
        title: t('ebook_deleted'),
        description: t('ebook_deleted_description'),
      });
      handleNavigate('/profile');
    }
  };
  
  const handleShare = async () => {
    if (!ebook) return;
    const shareData = {
      title: ebook.title,
      text: `Découvrez cet ebook : ${ebook.title}`,
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
        // Fallback to copying
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: t('link_copied') });
      } catch (copyError) {
        // If everything fails, just ignore it and don't show an error.
      }
    }
  };

  if (!ebook) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-secondary flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
            <span className="text-sm font-medium text-foreground tabular-nums">{currentPage}/{numPages}</span>
          </div>
        )}

        <main ref={viewerRef} className="flex-1 overflow-y-auto" style={{ paddingTop: `calc(env(safe-area-inset-top) + 4rem)`, paddingBottom: '8rem' }}>
            <Document
                file={ebook.pdfDataUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex h-full w-full items-center justify-center pt-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
                className={cn(
                    "flex flex-col items-center transition-opacity duration-500 ease-in-out",
                    isPdfVisible ? "opacity-100" : "opacity-0"
                )}
            >
                {Array.from(new Array(numPages || 0), (el, index) => (
                    <div
                        key={`page_${index + 1}`}
                        ref={(el) => (pageRefs.current[index] = el)}
                        data-page-number={index + 1}
                        className="w-full px-0 sm:px-4 mb-4 flex justify-center"
                    >
                        <Page
                            pageNumber={index + 1}
                            width={containerWidth ? containerWidth : undefined}
                            className={cn(!containerWidth && 'invisible')}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </main>

        {isOwner && (
          <footer className="fixed bottom-8 left-0 right-0 z-30 p-4 md:bottom-2 md:mb-4" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
            <div className="w-full max-w-[16rem] mx-auto">
                {isClient && isMobile ? (
                    <Button onClick={() => setIsSheetOpen(true)} className="glass-button rounded-full w-full h-12 text-lg font-semibold">
                        {t('details')}
                    </Button>
                  ) : (
                    <Button onClick={() => handleNavigate(`/ebook/${ebook!.id}/details`)} className="glass-button rounded-full w-full h-12 text-lg font-semibold">
                        {t('details')}
                    </Button>
                )}
            </div>
          </footer>
        )}
      </div>
      {isOwner && isClient && isMobile && (
        <EbookDetailsSheet ebook={ebook} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      )}
    </>
  );
}
