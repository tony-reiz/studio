export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'Anglais', nativeName: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italien', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portugais', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Néerlandais', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Russe', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japonais', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinois', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'ko', name: 'Coréen', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'sv', name: 'Suédois', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'da', name: 'Danois', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Finlandais', nativeName: 'Suomi', flag: '🇫🇮' },
    { code: 'no', name: 'Norvégien', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'pl', name: 'Polonais', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'tr', name: 'Turc', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'el', name: 'Grec', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'he', name: 'Hébreu', nativeName: 'עברית', flag: '🇮🇱' },
    { code: 'id', name: 'Indonésien', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', name: 'Thaï', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamien', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'cs', name: 'Tchèque', nativeName: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Hongrois', nativeName: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Roumain', nativeName: 'Română', flag: '🇷🇴' },
    { code: 'uk', name: 'Ukrainien', nativeName: 'Українська', flag: '🇺🇦' },
    { code: 'ta', name: 'Tamoul', nativeName: 'தமிழ்', flag: '🇮🇳' },
];
