export interface Currency {
  code: string;
  name: string;
  nativeName: string;
  symbol: string;
}

export const currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', nativeName: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', nativeName: 'US Dollar', symbol: '$' },
    { code: 'CHF', name: 'Swiss Franc', nativeName: 'Schweizer Franken', symbol: 'CHF' },
];
