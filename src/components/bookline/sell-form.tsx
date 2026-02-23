'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export function SellForm() {
    const { control, watch } = useFormContext();

    const watchedPrice = watch('price');
    
    let priceAsNumber: number = NaN;
    if (watchedPrice && typeof watchedPrice === 'string' && watchedPrice.trim() !== '') {
        const cleanedPrice = watchedPrice.replace(',', '.');
        if (!/[a-zA-Z]/.test(cleanedPrice) && !isNaN(parseFloat(cleanedPrice))) {
            priceAsNumber = parseFloat(cleanedPrice);
        }
    }

    const SELLER_FEE = 3;
    const CUSTOMER_FEE = 3.5;

    const ebookPrice = !isNaN(priceAsNumber) ? priceAsNumber : null;
    const netGain = ebookPrice !== null ? ebookPrice - SELLER_FEE : null;
    const totalPriceForCustomer = ebookPrice !== null ? ebookPrice + CUSTOMER_FEE : null;

    const formatPrice = (value: number | null): string => {
        if (value === null || isNaN(value)) {
          return '-- €';
        }
        
        const formatted = value.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return `${formatted} €`;
    };

    const inputClasses = "pl-11 pr-4 h-12 w-full text-base bg-secondary border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
        <div className="w-full space-y-4">
            <FormField
                control={control}
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
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <div className="relative w-full">
                         <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground">D</span>
                        <FormControl>
                            <Textarea placeholder="description de l'ebook..." {...field} className={cn(inputClasses, "h-32 rounded-[30px] py-3.5 leading-snug")} />
                        </FormControl>
                    </div>
                    <FormMessage className="pl-4" />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
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
                control={control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</span>
                        <FormControl>
                            <Input type="text" inputMode="decimal" placeholder="prix..." {...field} className={inputClasses}/>
                        </FormControl>
                    </div>
                    <FormMessage className="pl-4" />
                    </FormItem>
                )}
            />
        </div>

        <div className="w-full bg-secondary rounded-[30px] flex items-stretch mt-4 overflow-hidden">
            <div className='pl-6 py-4 text-sm text-muted-foreground space-y-1 flex flex-col justify-center flex-grow'>
                <p>prix de l'ebook</p>
                <p>votre gain net</p>
                <p>total de l'ebook</p>
            </div>
            <div className='flex-shrink-0 bg-foreground text-background rounded-l-[30px] px-16 py-4 space-y-1 text-sm flex flex-col justify-center items-end'>
                <p className="text-right">{formatPrice(ebookPrice)}</p>
                <p className="text-right">{formatPrice(netGain)}</p>
                <p className="text-right">{formatPrice(totalPriceForCustomer)}</p>
            </div>
        </div>
    </div>
  );
}
