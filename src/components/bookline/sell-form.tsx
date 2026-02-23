'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const sellFormSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis." }),
  description: z.string().min(1, { message: "La description est requise." }),
  keywords: z.string().min(1, { message: "Les mots-clés sont requis." }),
  price: z.coerce.number().min(0, { message: "Le prix doit être positif." }),
});

interface SellFormProps {
  pdfFile: File | null;
}

export function SellForm({ pdfFile }: SellFormProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof sellFormSchema>>({
        resolver: zodResolver(sellFormSchema),
        defaultValues: {
            title: '',
            description: '',
            keywords: '',
            price: undefined,
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
        console.log({ ...values, pdfFileName: pdfFile.name });
        toast({
            title: "Ebook soumis !",
            description: "Votre ebook est en cours de validation.",
        });
    }

    const inputClasses = "pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col items-center gap-4">
            <div className="w-full space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">T</span>
                            <FormControl>
                                <Input placeholder="titre de l'ebook..." {...field} className={inputClasses}/>
                            </FormControl>
                        </div>
                        <FormMessage className="pl-4" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative w-full">
                             <span className="absolute left-4 top-5 -translate-y-1/2 text-sm font-bold text-muted-foreground">D</span>
                            <FormControl>
                                <Textarea placeholder="description de l'ebook..." {...field} className={cn(inputClasses, "h-28 rounded-[30px] py-3.5 leading-snug")} />
                            </FormControl>
                        </div>
                        <FormMessage className="pl-4" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                        <FormItem>
                         <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">M</span>
                            <FormControl>
                                <Input placeholder="mots clés..." {...field} className={inputClasses}/>
                            </FormControl>
                        </div>
                        <FormMessage className="pl-4" />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</span>
                            <FormControl>
                                <Input type="number" placeholder="prix..." {...field} className={inputClasses}/>
                            </FormControl>
                        </div>
                        <FormMessage className="pl-4" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="w-full bg-secondary rounded-[30px] flex items-stretch my-4 overflow-hidden">
                <div className='pl-6 py-4 text-sm text-muted-foreground space-y-1 flex flex-col justify-center flex-grow'>
                    <p>prix de l'ebook</p>
                    <p>votre gain net</p>
                    <p>total de l'ebook</p>
                </div>
                <div className='flex-shrink-0 bg-foreground text-background rounded-l-[30px] px-10 py-4 space-y-1 text-sm text-right flex flex-col justify-center'>
                    <p>-- €</p>
                    <p>-- €</p>
                    <p>-- €</p>
                </div>
            </div>


            <Button type="submit" className="w-full max-w-xs h-14 text-lg font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90">
                publier
            </Button>
        </form>
    </Form>
  );
}
