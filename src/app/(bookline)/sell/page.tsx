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
import { PDFDocument } from 'pdf-lib';
import { MobileSettingsSheet } from '@/components/bookline/mobile-settings-sheet';
import { LightFluidBackground } from '@/components/bookline/light-fluid-background';
import { DarkFluidBackground } from '@/components/bookline/dark-fluid-background';


export default function SellPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submissionStep, setSubmissionStep] = useState<'idle' | 'compressing' | 'publishing'>('idle');
  const [compressedPdfBytes, setCompressedPdfBytes] = useState<Uint8Array | null>(null);
  const [fileSize, setFileSize] = useState<{ original: number | null, compressed: number | null }>({ original: null, compressed: null });
  const { toast } = useToast();
  const { handleNavigate } = useTransitionRouter();
  const { addPublishedEbook, theme, t } = useEbooks();
  const [isClient, setIsClient] = useState(false);

  const sellFormSchema = z.object({
    title: z.string().min(1, { message: t('title_required') }),
    description: z.string().min(1, { message: t('description_required') }),
    keywords: z.string().min(1, { message: t('keywords_required') }),
    price: z.string().min(1, { message: t('price_required') })
      .refine((val) => !/[a-zA-Z]/.test(val), { message: t('price_no_letters') })
      .refine((val) => {
          const n = parseFloat(val.replace(',', '.'));
          return !isNaN(n) && isFinite(n);
      }, { message: t('price_must_be_number') })
      .refine((val) => parseFloat(val.replace(',', '.')) >= 10, { message: t('price_min_10') })
      .refine((val) => parseFloat(val.replace(',', '.')) <= 1000, { message: t('price_max_1000') }),
  });

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
                title: t('compression_error'),
                description: t('pdf_process_error'),
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
        title: t('compressing'),
        description: t('wait_for_optimization'),
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
            title: t('publication_error'),
            description: t('error_try_again'),
        });
        setSubmissionStep('idle');
    }
  }

  const isProcessing = submissionStep !== 'idle';
  const isFormComplete = form.formState.isValid && !!pdfFile;
  const isButtonDisabled = isProcessing || !isFormComplete;

  const menuButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t('menu')}
      className="w-11 h-11 rounded-full glass-icon-button -mt-2 sm:mt-0"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );

  const getButtonText = () => {
    if (submissionStep === 'publishing') return t('publishing');
    if (submissionStep === 'compressing') return t('compressing');
    return t('publish');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col min-h-screen text-foreground bg-transparent")}>
        {isClient && (
          <>
            <LightFluidBackground isActive={theme === 'light'} />
            <DarkFluidBackground isActive={theme === 'dark'} />
          </>
        )}
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto scrollbar-hide">
          <header className="sticky top-0 z-10 flex items-start justify-between w-full pb-6" style={{ paddingTop: `calc(1.5rem + env(safe-area-inset-top))` }}>
            {isClient ? <MobileSettingsSheet>{menuButton}</MobileSettingsSheet> : menuButton}
            <Button type="button" onClick={() => handleNavigate('/profile?tab=achats')} variant="ghost" size="icon" className="-mt-2 sm:mt-0 w-11 h-11 rounded-full glass-icon-button" aria-label={t('user_profile')}>
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
                  isCompressing={submissionStep === 'compressing'}
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
                    !isFormComplete && !isProcessing ? 'glass-button' : '',
                    isProcessing ? 'bg-[#DFDFDF] text-muted-foreground cursor-not-allowed' : '',
                    isFormComplete && !isProcessing ? 'bg-foreground text-background hover:bg-foreground/90' : ''
                )}
                >
                {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                <span>{getButtonText()}</span>
                </Button>
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
}
