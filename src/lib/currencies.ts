export interface Currency {
  code: string;
  name: string;
  nativeName: string;
  symbol: string;
}

export const currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', nativeName: 'Euro', symbol: '€' },
    { code: 'USD', name: 'Dollar américain', nativeName: 'Dollar américain', symbol: '$' },
    { code: 'CHF', name: 'Franc suisse', nativeName: 'Franc suisse', symbol: 'CHF' },
];
