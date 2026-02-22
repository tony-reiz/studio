'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageIcon, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sellFormSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  price: z.coerce.number().min(0, { message: "Le prix ne peut pas être négatif." }),
});

export function SellForm() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof sellFormSchema>>({
        resolver: zodResolver(sellFormSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
        },
    });

    function onSubmit(values: z.infer<typeof sellFormSchema>) {
        console.log(values);
        toast({
            title: "Ebook soumis !",
            description: "Votre ebook est en cours de validation.",
        });
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-6 mt-2 pb-8">
            <div className="w-full max-w-xs aspect-[3/4] bg-secondary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors p-4">
                <ImageIcon className="h-10 w-10 text-primary/50" />
                <p className="text-muted-foreground text-sm mt-2 text-center">Appuyez pour ajouter la couverture de votre ebook</p>
            </div>
            
            <div className="w-full max-w-xs space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Titre de l'ebook</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: Le guide de la méditation" {...field} className="h-12"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Décrivez votre ebook en quelques mots..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prix de vente (en €)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="10" {...field} className="h-12"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="w-full max-w-xs h-32 bg-secondary rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors p-4 mt-2">
                <Download className="h-8 w-8 text-primary/50" />
                <p className="text-muted-foreground text-sm mt-2 text-center">Appuyez pour ajouter le fichier de votre ebook</p>
            </div>

            <div className="w-full max-w-xs mt-4">
                <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-full" size="lg">
                    Mettre en vente
                </Button>
            </div>
        </form>
    </Form>
  );
}
