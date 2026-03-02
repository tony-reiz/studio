'use client';

import { useState } from 'react';
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
  const [fileSize, setFileSize] = useState<{ original: number | null, compressed: number | null }>({ original: null, compressed: null });
  const { toast } = useToast();
  const { handleNavigate } = useTransitionRouter();
  const { addPublishedEbook } = useEbooks();
  const isMobile = useIsMobile();

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
    if (file) {
      setFileSize({ original: file.size, compressed: null });
    } else {
      setFileSize({ original: null, compressed: null });
    }
  };

  async function onSubmit(values: z.infer<typeof sellFormSchema>) {
    if (!pdfFile) {
      toast({
        variant: "destructive",
        title: "Fichier PDF manquant",
        description: "Veuillez ajouter le fichier de votre ebook.",
      });
      return;
    }
    
    if (submissionStep !== 'idle') return;

    setSubmissionStep('compressing');

    try {
      // Real compression step
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, {
        // This option can sometimes help with corrupted files
        ignoreEncryption: true,
      });

      // Saving the document with pdf-lib can perform some optimizations
      // and remove unnecessary objects.
      const compressedPdfBytes = await pdfDoc.save();

      setFileSize(prev => ({ ...prev, compressed: compressedPdfBytes.byteLength }));

      const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

      setSubmissionStep('publishing');

      // Convert compressed PDF to data URL
      const reader = new FileReader();
      reader.readAsDataURL(compressedPdfBlob);
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        addPublishedEbook({
          title: values.title,
          description: values.description,
          keywords: values.keywords,
          price: values.price,
          pdfDataUrl: base64String,
        });
        
        setTimeout(() => {
            handleNavigate('/profile');
        }, 2000);
      }

      reader.onerror = () => {
          throw new Error("Impossible de lire le fichier PDF compressé.");
      }

    } catch (error) {
        console.error("PDF compression failed:", error);
        toast({
            variant: "destructive",
            title: "Erreur de compression",
            description: "Le fichier PDF n'a pas pu être traité. Il est peut-être corrompu ou protégé.",
        });
        setSubmissionStep('idle');
    }
  }

  const isButtonDisabled = !form.formState.isValid || !pdfFile || submissionStep !== 'idle';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-screen bg-background text-foreground">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between w-full py-6">
            {isMobile ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : menuButton}
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
                {submissionStep === 'compressing' ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Compression...
                    </>
                  ) : submissionStep === 'publishing' ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Publication...
                    </>
                  ) : (
                    'publier'
                  )}
                </Button>
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
}
