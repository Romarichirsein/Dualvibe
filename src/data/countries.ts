export interface Country {
  code: string;
  name: { fr: string; en: string };
  currency: string;
  symbol: string;
  rate: number;
}

export const COUNTRIES: Country[] = [
  { code: 'CI', name: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'SN', name: { fr: 'Sénégal', en: 'Senegal' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'CM', name: { fr: 'Cameroun', en: 'Cameroon' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'TG', name: { fr: 'Togo', en: 'Togo' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'BJ', name: { fr: 'Bénin', en: 'Benin' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'BF', name: { fr: 'Burkina Faso', en: 'Burkina Faso' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'ML', name: { fr: 'Mali', en: 'Mali' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'GA', name: { fr: 'Gabon', en: 'Gabon' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'CG', name: { fr: 'Congo-Brazzaville', en: 'Congo-Brazzaville' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'CD', name: { fr: 'RD Congo', en: 'DR Congo' }, currency: 'CDF', symbol: 'FC', rate: 4.5 },
  { code: 'GN', name: { fr: 'Guinée', en: 'Guinea' }, currency: 'GNF', symbol: 'FG', rate: 14.5 },
  { code: 'MA', name: { fr: 'Maroc', en: 'Morocco' }, currency: 'MAD', symbol: 'DH', rate: 0.017 },
  { code: 'DZ', name: { fr: 'Algérie', en: 'Algeria' }, currency: 'DZD', symbol: 'DA', rate: 0.23 },
  { code: 'TN', name: { fr: 'Tunisie', en: 'Tunisia' }, currency: 'TND', symbol: 'DT', rate: 0.0053 },
  { code: 'FR', name: { fr: 'France', en: 'France' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'BE', name: { fr: 'Belgique', en: 'Belgium' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'US', name: { fr: 'États-Unis', en: 'United States' }, currency: 'USD', symbol: '$', rate: 0.0016 },
  { code: 'CA', name: { fr: 'Canada', en: 'Canada' }, currency: 'CAD', symbol: 'CA$', rate: 0.0022 },
  { code: 'GB', name: { fr: 'Royaume-Uni', en: 'United Kingdom' }, currency: 'GBP', symbol: '£', rate: 0.0013 },
  { code: 'DE', name: { fr: 'Allemagne', en: 'Germany' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'ES', name: { fr: 'Espagne', en: 'Spain' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'IT', name: { fr: 'Italie', en: 'Italy' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
];
