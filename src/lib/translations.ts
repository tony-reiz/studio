export const translations = {
  fr: {
    // General
    'buy': 'acheter',
    'sell': 'vendre',
    'search_ebooks': 'recherchez vos ebook...',
    'user_profile': "Profil Utilisateur",
    'menu': 'Menu',
    'back': 'Retour',
    'cancel': 'Annuler',
    'loading': 'Chargement...',
    'pay': 'Payer',
    'view': 'Voir',
    'payment_successful': 'Achat réussi !',
    'you_can_now_read': 'Vous pouvez maintenant lire',

    // Home Page
    'welcome_to': 'BIENVENUE SUR',
    'bookline': 'BOOKLINE !',
    'suggestions_for_you': 'Suggestions pour vous',
    'other_ebooks': 'Autres ebooks',
    'no_results_for': 'Aucun résultat trouvé pour',
    'no_ebooks_match_interests': 'Aucun ebook ne correspond à vos intérêts pour le moment.',
    'enter_search_to_find_ebooks': 'Saisissez une recherche pour trouver des ebooks.',


    // Settings Page
    'settings': 'Paramètres',
    'account_settings': 'Paramètres du compte',
    'notifications': 'Notifications',
    'security': 'Sécurité',
    'language': 'Langue',
    'currency': 'Devise',
    'transfer': 'Virement',
    'invoices': 'Factures',
    'help': 'Aide',
    'delete_account': 'Supprimer mon compte',
    'logout': 'Déconnexion',
    'theme': 'Thème',
    'change_theme': 'Changer le thème',

    // Language Page
    'search_language': 'Rechercher une langue...',
    'selected_language': 'Langue sélectionnée',
  },
  en: {
    // General
    'buy': 'buy',
    'sell': 'sell',
    'search_ebooks': 'search for your ebooks...',
    'user_profile': "User Profile",
    'menu': 'Menu',
    'back': 'Back',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'pay': 'Pay',
    'view': 'View',
    'payment_successful': 'Payment successful!',
    'you_can_now_read': 'You can now read',

    // Home Page
    'welcome_to': 'WELCOME TO',
    'bookline': 'BOOKLINE!',
    'suggestions_for_you': 'Suggestions for you',
    'other_ebooks': 'Other ebooks',
    'no_results_for': 'No results found for',
    'no_ebooks_match_interests': "No ebooks match your interests at the moment.",
    'enter_search_to_find_ebooks': 'Enter a search to find ebooks.',

    // Settings Page
    'settings': 'Settings',
    'account_settings': 'Account settings',
    'notifications': 'Notifications',
    'security': 'Security',
    'language': 'Language',
    'currency': 'Currency',
    'transfer': 'Wire transfer',
    'invoices': 'Invoices',
    'help': 'Help',
    'delete_account': 'Delete my account',
    'logout': 'Logout',
    'theme': 'Theme',
    'change_theme': 'Change theme',

    // Language Page
    'search_language': 'Search for a language...',
    'selected_language': 'Selected language',
  },
};

export type Locale = keyof typeof translations | 'es' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'ja' | 'zh' | 'ar' | 'ko' | 'hi' | 'sv' | 'da' | 'fi' | 'no' | 'pl' | 'tr' | 'el' | 'he' | 'id' | 'th' | 'vi' | 'cs' | 'hu' | 'ro' | 'uk' | 'ta' | 'af' | 'sq' | 'am' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'bs' | 'bg' | 'ca' | 'hr' | 'et' | 'tl' | 'gl' | 'ka' | 'gu' | 'ha' | 'is' | 'ig' | 'ga' | 'jv' | 'kn' | 'kk' | 'km' | 'ku' | 'ky' | 'lo' | 'lv' | 'lt' | 'lb' | 'mk' | 'mg' | 'ms' | 'ml' | 'mt' | 'mi' | 'mr' | 'mn' | 'my' | 'ne' | 'ps' | 'fa' | 'pa' | 'sr' | 'si' | 'sk' | 'sl' | 'so' | 'sw' | 'tg' | 'te' | 'ur' | 'uz' | 'cy' | 'xh' | 'yi' | 'yo' | 'zu';

type TranslationKeys = keyof (typeof translations)['fr'];
type TranslationsType = { [L in Locale]?: { [K in TranslationKeys]?: string } };

// Add other languages with english as fallback
const fallbacks: TranslationsType = {};
const allLangs: Locale[] = ['es', 'de', 'it', 'pt', 'nl', 'ru', 'ja', 'zh', 'ar', 'ko', 'hi', 'sv', 'da', 'fi', 'no', 'pl', 'tr', 'el', 'he', 'id', 'th', 'vi', 'cs', 'hu', 'ro', 'uk', 'ta', 'af', 'sq', 'am', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'hr', 'et', 'tl', 'gl', 'ka', 'gu', 'ha', 'is', 'ig', 'ga', 'jv', 'kn', 'kk', 'km', 'ku', 'ky', 'lo', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'ps', 'fa', 'pa', 'sr', 'si', 'sk', 'sl', 'so', 'sw', 'tg', 'te', 'ur', 'uz', 'cy', 'xh', 'yi', 'yo', 'zu'];

for (const lang of allLangs) {
    fallbacks[lang] = translations.en;
}

Object.assign(translations, fallbacks);
