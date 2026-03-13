export interface Currency {
  code: string;
  name: string;
  nativeName: string;
  symbol: string;
}

export const currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', nativeName: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', nativeName: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', nativeName: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', nativeName: '日本円', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', nativeName: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', nativeName: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', nativeName: 'Schweizer Franken', symbol: 'CHF' },
];
