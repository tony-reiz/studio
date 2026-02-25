'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEbooks, type Ebook } from '@/context/ebook-provider';
import { Share2, Trash2, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
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
    loading: () => (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
});
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


export default function EbookViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { publishedEbooks, removePublishedEbook } = useEbooks();
  const [ebook, setEbook] = useState<Ebook | undefined>(undefined);
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (params.id && publishedEbooks.length > 0) {
      const foundEbook = publishedEbooks.find((e) => e.id === params.id);
      setEbook(foundEbook);
    }
  }, [params.id, publishedEbooks]);

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

    // Cleanup resize listener on component unmount
    return () => window.removeEventListener('resize', setWidth);
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
      router.push('/profile');
    }
  };
  
  if (!ebook) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <main className="flex-1 flex w-full items-center justify-center">
        <div className="relative w-full max-w-sm">
            <div className="absolute top-4 -left-16">
                <Button onClick={() => router.back()} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="h-[70vh]">
                <div className="w-full h-full relative">
                    <div ref={viewerRef} className="w-full h-full overflow-y-auto rounded-lg bg-secondary">
                        <Document
                            file={ebook.pdfDataUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={null}
                            className="flex flex-col items-center"
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
                                    />
                                </div>
                            ))}
                        </Document>
                    </div>
                    {numPages && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs rounded-full px-3 py-1 z-10">
                            {currentPage}/{numPages}
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute top-4 -right-16 flex flex-col gap-3">
                <Button onClick={handleDelete} variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
                    <Trash2 className="h-6 w-6" />
                </Button>
                <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11">
                    <Share2 className="h-6 w-6" />
                </Button>
            </div>
        </div>
      </main>

      <footer className="w-full max-w-[16rem] pb-8 pt-4">
        <Button className="bg-foreground text-background rounded-full w-full h-12 text-lg font-semibold hover:bg-foreground/90">
          Détail
        </Button>
      </footer>
    </div>
  );
}
