'use client';

import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Share2, Trash2, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, type TouchEvent } from 'react';
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
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center justify-center space-x-1">
            <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
        </div>
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

  // For pinch-to-zoom
  const [scale, setScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const initialDistance = useRef(0);

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

    // Use a timeout to allow the object to render before starting the transition
    const timer = setTimeout(() => {
        setIsPdfVisible(true);
    }, 50);

    // Cleanup resize listener on component unmount
    return () => {
        window.removeEventListener('resize', setWidth)
        clearTimeout(timer);
    };
  };
  
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePages = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visiblePages.length > 0) {
          const topMostVisiblePage = visiblePages[0];
          const pageIndex = parseInt(topMostVisiblePage.target.getAttribute('data-page-number') || '1', 10);
          setCurrentPage(pageIndex);
        }
      },
      { root: viewer, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
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
  }, [numPages]);


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
  
  const getDistance = (touches: TouchList) => {
    return Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY
    );
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsZooming(true);
      initialDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isZooming && e.touches.length === 2) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const newScale = scale * (newDistance / initialDistance.current);
      setScale(Math.min(Math.max(1, newScale), 4)); // Clamp scale
      initialDistance.current = newDistance;
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (isZooming) {
      setIsZooming(false);
      initialDistance.current = 0;
    }
    // Snap back if zoom is very small
    if (scale < 1.05) {
        setScale(1);
    }
  };

  const handleViewerClick = () => {
      if (isMobile && scale <= 1) {
          setIsSheetOpen(true);
      }
  };

  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <main className="flex-1 flex w-full items-center justify-center">
          <div className="relative w-full max-w-sm">
              <div className="aspect-[210/297]">
                  <div 
                    ref={viewerRef} 
                    className="w-full h-full overflow-auto rounded-lg bg-secondary"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{touchAction: 'pan-y'}}
                  >
                    <div 
                      onClick={handleViewerClick}
                      className="w-full"
                      style={{ 
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: isZooming ? 'none' : 'transform 0.2s ease-out',
                        cursor: 'grab'
                     }}
                    >
                          <Document
                              file={ebook.pdfDataUrl}
                              onLoadSuccess={onDocumentLoadSuccess}
                              loading={null}
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
                                      className="mb-2 last:mb-0"
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
                      </div>
                  </div>
                  {numPages && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs rounded-full px-3 py-1 z-10">
                          {currentPage}/{numPages}
                      </div>
                  )}
              </div>
          </div>
        </main>

        <footer className="w-full max-w-[16rem] pb-8 pt-4">
          {isClient && isMobile ? (
              <Button onClick={() => setIsSheetOpen(true)} className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90">
                  Détail
              </Button>
            ) : (
              <Button onClick={() => handleNavigate(`/ebook/${ebook!.id}/details`)} className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90">
                  Détail
              </Button>
          )}
        </footer>
      </div>
      {isClient && isMobile && (
        <EbookDetailsSheet ebook={ebook} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      )}
    </>
  );
}
