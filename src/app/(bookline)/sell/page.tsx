'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PdfUploader } from '@/components/bookline/pdf-uploader';
import { SellForm } from '@/components/bookline/sell-form';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    .refine((val) => parseFloat(val.replace(',', '.')) >= 10, { message: 'Le prix doit être de 10€ minimum.' }),
});

export default function SellPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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

  function onSubmit(values: z.infer<typeof sellFormSchema>) {
    if (!pdfFile) {
      toast({
        variant: "destructive",
        title: "Fichier PDF manquant",
        description: "Veuillez ajouter le fichier de votre ebook.",
      });
      return;
    }
    router.push('/verification');
  }

  const isButtonDisabled = !form.formState.isValid || !pdfFile;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-screen bg-background text-foreground">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between w-full py-6">
            <Button variant="ghost" aria-label="Menu" className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7">
              <Menu />
            </Button>
            <Link href="/profile" passHref>
              <Button variant="default" size="icon" className="-mt-2 sm:mt-0 rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
                <User className="h-6 w-6" />
              </Button>
            </Link>
          </header>

          <main className="flex-1 w-full flex flex-col items-center pt-12 md:pt-20 pb-28 gap-8">
            <div className="grid md:grid-cols-2 items-start gap-4">
              <div className="flex justify-center md:justify-end">
                <PdfUploader pdfFile={pdfFile} onFileChange={setPdfFile} />
              </div>
              <div className="flex justify-start">
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
                publier
                </Button>
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
}
