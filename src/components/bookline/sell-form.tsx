'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { KeywordInput } from './keyword-input';
import { useEbooks } from '@/context/ebook-provider';
import { BVCouleur } from './BVCouleur';

export function SellForm() {
    const { control, watch } = useFormContext();
    const { t } = useEbooks();

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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">T</span>
                        <FormControl>
                            <Input placeholder={t('ebook_title_placeholder')} {...field} className={inputClasses}/>
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
                         <span className="absolute left-4 top-[24px] -translate-y-1/2 text-sm font-bold text-foreground z-10">D</span>
                        <FormControl>
                            <Textarea placeholder={t('ebook_description_placeholder')} {...field} className={cn(inputClasses, "h-28 rounded-[30px] py-3.5 leading-snug")} />
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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">M</span>
                        <FormControl>
                            <KeywordInput placeholder={t('keywords_placeholder')} {...field}/>
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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground z-10">€</span>
                        <FormControl>
                            <Input type="text" inputMode="decimal" placeholder={t('price_placeholder')} {...field} className={inputClasses}/>
                        </FormControl>
                    </div>
                    <FormMessage className="pl-4" />
                    </FormItem>
                )}
            />
        </div>

        <div className="w-full glass-form-element rounded-[30px] grid grid-cols-[1fr_auto] mt-4 overflow-hidden">
            <div className='pl-6 py-4 text-sm text-foreground space-y-1 flex flex-col justify-center'>
                <p>{t('ebook_price')}</p>
                <p>{t('your_net_gain')}</p>
                <p>{t('total_ebook_price')}</p>
            </div>
            <div className='relative overflow-hidden rounded-l-[30px] flex flex-col justify-center'>
                <BVCouleur id="sell-form-price-canvas" className="bv-couleur-canvas" />
                <div className='relative z-[2] px-8 py-4 text-sm text-right space-y-1'>
                    <p className="font-semibold text-white">{formatPrice(ebookPrice)}</p>
                    <p className="font-semibold text-white">{formatPrice(netGain)}</p>
                    <p className="font-semibold text-white">{formatPrice(totalPriceForCustomer)}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
