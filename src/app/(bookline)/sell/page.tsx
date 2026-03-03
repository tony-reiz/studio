'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Menu, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PdfUploader } from '@/components/bookline/pdf-uploader';
import { SellForm } from '@/components/bookline/sell-form';
import { cn } from '@/lib/utils';
import { useEbooks } from '@/context/ebook-provider';
import { useTransitionRouter } from '@/app/(bookline)/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { PDFDocument } from 'pdf-lib';
import { MobileSettingsSheet } from '@/components/bookline/mobile-settings-sheet';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';

const sellFormSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis." }),
  description: z.string().min(1, { message: "La description est requise." }),
  keywords: z.string().min(1, { message: "Les mots-clés sont requis." }),
  price: z.string().min(1, { message: "Le prix est requis." })
    .refine((val) => !/[a-zA-Z]/.test(val), { message: 'Le prix ne doit pas contenir de lettres.' })
    .refine((val) => {
        const n = parseFloat(val.replace(',', '.'));
        return !isNaN(n) && isFinite(n);
    }, { message: 'Le prix doit être un nombre.' })
    .refine((val) => parseFloat(val.replace(',', '.')) >= 10, { message: 'Le prix doit être de 10€ minimum.' })
    .refine((val) => parseFloat(val.replace(',', '.')) <= 1000, { message: 'Le prix ne doit pas dépasser 1000€.' }),
});

export default function SellPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submissionStep, setSubmissionStep] = useState<'idle' | 'compressing' | 'publishing'>('idle');
  const [compressedPdfBytes, setCompressedPdfBytes] = useState<Uint8Array | null>(null);
  const [fileSize, setFileSize] = useState<{ original: number | null, compressed: number | null }>({ original: null, compressed: null });
  const { toast } = useToast();
  const { handleNavigate } = useTransitionRouter();
  const { addPublishedEbook, theme } = useEbooks();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.body.classList.add('has-fluid-background');
    return () => {
      document.body.classList.remove('has-fluid-background');
    };
  }, []);

  const form = useForm<z.infer<typeof sellFormSchema>>({
    resolver: zodResolver(sellFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      price: '',
    },
  });

  const handleFileChange = (file: File | null) => {
    setPdfFile(file);
    setCompressedPdfBytes(null);
    if (file) {
      setFileSize({ original: file.size, compressed: null });
    } else {
      setFileSize({ original: null, compressed: null });
    }
  };

  useEffect(() => {
    if (!pdfFile) return;

    const processPdf = async () => {
        setSubmissionStep('compressing');
        try {
            const pdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            // This is the compression step. Using object streams can reduce file size.
            const newCompressedBytes = await pdfDoc.save({ useObjectStreams: true });

            setCompressedPdfBytes(newCompressedBytes);
            setFileSize(prev => ({ ...prev, compressed: newCompressedBytes.byteLength }));
        } catch (error) {
            console.error("PDF compression failed:", error);
            toast({
                variant: "destructive",
                title: "Erreur de compression",
                description: "Le fichier PDF n'a pas pu être traité. Il est peut-être corrompu ou protégé.",
            });
            handleFileChange(null);
        } finally {
            setSubmissionStep('idle');
        }
    };

    processPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfFile]);


  async function onSubmit(values: z.infer<typeof sellFormSchema>) {
    if (!compressedPdfBytes) {
      toast({
        variant: "destructive",
        title: "Compression en cours...",
        description: "Veuillez attendre la fin de l'optimisation du fichier.",
      });
      return;
    }
    
    if (submissionStep !== 'idle') return;

    setSubmissionStep('publishing');

    try {
      const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedPdfBlob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
        
      addPublishedEbook({
        title: values.title,
        description: values.description,
        keywords: values.keywords,
        price: values.price,
        pdfDataUrl: base64String,
      });
        
      handleNavigate('/profile');

    } catch (error) {
        console.error("PDF publication failed:", error);
        toast({
            variant: "destructive",
            title: "Erreur de publication",
            description: "Une erreur est survenue, veuillez réessayer.",
        });
        setSubmissionStep('idle');
    }
  }

  const isCompressing = submissionStep === 'compressing';
  const isButtonDisabled = isCompressing || submissionStep === 'publishing' || !form.formState.isValid || !pdfFile;

  const menuButton = (
    <Button
      type="button"
      onClick={!isMobile ? () => handleNavigate('/settings') : undefined}
      variant="ghost"
      aria-label="Menu"
      className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7"
    >
      <Menu />
    </Button>
  );

  const getButtonText = () => {
    if (submissionStep === 'publishing') return 'Publication...';
    if (isCompressing) return 'Compression...';
    return 'publier';
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col min-h-screen text-foreground bg-transparent")}>
        {isClient && (
          <>
            <LightFluidBackground className={cn("transition-opacity duration-300", theme === 'light' ? 'opacity-100' : 'opacity-0 pointer-events-none')} />
            <DarkFluidBackground className={cn("transition-opacity duration-300", theme === 'dark' ? 'opacity-100' : 'opacity-0 pointer-events-none')} />
          </>
        )}
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between w-full py-6">
            {isClient && isMobile ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : menuButton}
            <Button type="button" onClick={() => handleNavigate('/profile?tab=achats')} variant="default" size="icon" className="-mt-2 sm:mt-0 rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
              <User className="h-6 w-6" />
            </Button>
          </header>

          <main className="flex-1 w-full flex flex-col items-center pt-12 md:pt-20 pb-28 gap-8">
            <div className="grid md:grid-cols-2 items-start gap-4">
              <div className="flex justify-center md:justify-end">
                <PdfUploader
                  pdfFile={pdfFile}
                  onFileChange={handleFileChange}
                  originalSize={fileSize.original}
                  compressedSize={fileSize.compressed}
                  isCompressing={isCompressing}
                />
              </div>
              <div className="flex justify-center md:justify-start">
                <SellForm />
              </div>
            </div>
            <div className="max-w-[16rem] w-full">
                <Button
                type="submit"
                disabled={isButtonDisabled}
                className={cn(
                    "w-full h-12 text-lg font-semibold rounded-full",
                    "transition-colors duration-300",
                    isButtonDisabled
                    ? "bg-[#DFDFDF] text-muted-foreground cursor-not-allowed"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
                >
                {(submissionStep !== 'idle') && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {getButtonText()}
                </Button>
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
}
