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
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
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
  const { publishedEbooks, removePublishedEbook } = useEbooks();
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

  useEffect(() => {
    if (id && publishedEbooks.length > 0) {
      const foundEbook = publishedEbooks.find((e) => e.id === id);
      setEbook(foundEbook);
    }
  }, [id, publishedEbooks]);

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
    }, 50);

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
        const visiblePages = entries.filter((entry) => entry.isIntersecting);

        if (visiblePages.length > 0) {
          // Determine the center of the viewport (the scrolling container)
          const viewerCenterY = viewer.getBoundingClientRect().top + viewer.clientHeight / 2;

          let closestPage: IntersectionObserverEntry | null = null;
          let minDistance = Infinity;

          visiblePages.forEach((page) => {
            // Determine the center of the page element
            const pageRect = page.target.getBoundingClientRect();
            const pageCenterY = pageRect.top + pageRect.height / 2;
            const distance = Math.abs(viewerCenterY - pageCenterY);

            if (distance < minDistance) {
              minDistance = distance;
              closestPage = page;
            }
          });

          if (closestPage) {
            const pageIndex = parseInt(
              closestPage.target.getAttribute('data-page-number') || '1',
              10
            );
            setCurrentPage(pageIndex);
          }
        }
      },
      { root: viewer, threshold: 0.01 } // Low threshold to detect any visibility
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
        title: "Ebook supprimé",
        description: "Votre ebook a été supprimé de vos publications.",
      });
      handleNavigate('/profile');
    }
  };
  
  const handleShare = async () => {
    if (navigator.share && ebook) {
      try {
        await navigator.share({
          title: ebook.title,
          text: `Découvrez cet ebook : ${ebook.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Lien copié dans le presse-papiers !" });
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
        <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
                  <span>Partager</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Supprimer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {numPages && (
          <div className="fixed left-1/2 -translate-x-1/2 z-20 bg-background/80 backdrop-blur-lg shadow-lg rounded-full flex items-center gap-2 px-3 py-1.5" style={{ top: `calc(env(safe-area-inset-top) + 5rem)`}}>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground tabular-nums">{currentPage}/{numPages}</span>
          </div>
        )}

        <main ref={viewerRef} className="flex-1 overflow-y-auto" style={{ paddingTop: `calc(env(safe-area-inset-top) + 8rem)`, paddingBottom: '8rem' }}>
            <Document
                file={ebook.pdfDataUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex h-full w-full items-center justify-center pt-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
                className={cn(
                    "flex flex-col items-center transition-opacity duration-300 ease-in-out",
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
                            className={cn(!containerWidth && 'invisible', 'shadow-lg')}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-background/80 backdrop-blur-lg" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
          <div className="w-full max-w-[16rem] mx-auto">
              {isClient && isMobile ? (
                  <Button onClick={() => setIsSheetOpen(true)} className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 shadow-lg">
                      Détail
                  </Button>
                ) : (
                  <Button onClick={() => handleNavigate(`/ebook/${ebook!.id}/details`)} className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90 shadow-lg">
                      Détail
                  </Button>
              )}
          </div>
        </footer>
      </div>
      {isClient && isMobile && (
        <EbookDetailsSheet ebook={ebook} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      )}
    </>
  );
}
