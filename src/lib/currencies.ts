import type { TranslationKeys } from './translations';

export interface Currency {
  code: string;
  nameKey: TranslationKeys;
  symbol: string;
}

export const currencies: Currency[] = [
    { code: 'EUR', nameKey: 'currency_eur_name', symbol: '€' },
    { code: 'USD', nameKey: 'currency_usd_name', symbol: '$' },
    { code: 'CHF', nameKey: 'currency_chf_name', symbol: 'CHF' },
];
