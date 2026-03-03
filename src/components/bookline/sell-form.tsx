'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { KeywordInput } from './keyword-input';

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

    const inputClasses = "pl-11 pr-4 h-12 w-full text-base glass-form-element placeholder:text-muted-foreground border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="w-full max-w-[18rem] md:w-80 flex flex-col items-center">
        <div className="w-full space-y-4">
            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-10">T</span>
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
                         <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-muted-foreground z-10">D</span>
                        <FormControl>
                            <Textarea placeholder="description de l'ebook..." {...field} className={cn(inputClasses, "h-28 rounded-[30px] py-3.5 leading-snug")} />
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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-10">M</span>
                        <FormControl>
                            <KeywordInput placeholder="mots clés..." {...field}/>
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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground z-10">€</span>
                        <FormControl>
                            <Input type="text" inputMode="decimal" placeholder="prix..." {...field} className={inputClasses}/>
                        </FormControl>
                    </div>
                    <FormMessage className="pl-4" />
                    </FormItem>
                )}
            />
        </div>

        <div className="w-full glass-form-element rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden">
            <div className='pl-6 py-4 text-sm text-muted-foreground space-y-1 flex flex-col justify-center'>
                <p>prix de l'ebook</p>
                <p>votre gain net</p>
                <p>total de l'ebook</p>
            </div>
            <div className='bg-black/5 dark:bg-white/5 text-foreground rounded-l-[30px] px-8 py-4 text-sm flex flex-col justify-center text-right space-y-1'>
                <p className="font-semibold">{formatPrice(ebookPrice)}</p>
                <p className="font-semibold">{formatPrice(netGain)}</p>
                <p className="font-semibold">{formatPrice(totalPriceForCustomer)}</p>
            </div>
        </div>
    </div>
  );
}
