'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { translations, type Locale } from '@/lib/translations';
import { pdfjs } from 'react-pdf';

// Set the workerSrc to a CDN to ensure it's always available. This is the fix.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Define the shape of an ebook
export interface Ebook {
  id: string;
  title: string;
  description: string;
  keywords: string;
  price: string;
  pdfDataUrl: string;
  originalSize?: number | null;
  compressedSize?: number | null;
}

// Define the shape of a user profile
export interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string | null;
  usernameLastChanged?: number;
}

const placeholderEbooks: Ebook[] = PlaceHolderImages.map((img, index) => ({
    id: img.id,
    title: `Ebook ${img.imageHint.charAt(0).toUpperCase() + img.imageHint.slice(1)} ${index + 1}`,
    description: `Une exploration fascinante sur le thème de "${img.imageHint}".`,
    keywords: img.imageHint,
    price: `${(10 + index * 3.5).toFixed(2).replace('.', ',')}`,
    pdfDataUrl: img.imageUrl,
}));

type TranslationKeys = keyof typeof translations.fr;

// Define the context type
interface EbookContextType {
  publishedEbooks: Ebook[];
  addPublishedEbook: (ebook: Omit<Ebook, 'id'>) => void;
  removePublishedEbook: (id: string) => void;
  favoritedEbooks: Ebook[];
  toggleFavoriteEbook: (ebook: Ebook) => void;
  allEbooks: Ebook[];
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  selectedInterests: string[];
  updateSelectedInterests: (interests: string[]) => void;
  purchasedEbooks: Ebook[];
  purchaseEbook: (ebook: Ebook) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  canChangeUsername: boolean;
  t: (key: TranslationKeys) => string;
}

// Create the context
const EbookContext = createContext<EbookContextType | undefined>(undefined);


// Create the provider component
export function EbookProvider({ children }: { children: ReactNode }) {
  const [publishedEbooks, setPublishedEbooks] = useState<Ebook[]>([]);
  const [favoritedEbooks, setFavoritedEbooks] = useState<Ebook[]>([]);
  const [purchasedEbooks, setPurchasedEbooks] = useState<Ebook[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'user',
    bio: '',
    avatarUrl: null,
    usernameLastChanged: undefined,
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [locale, setLocaleState] = useState<Locale>('fr');
  const pathname = usePathname();

  useEffect(() => {
    const storedTheme = localStorage.getItem('bookline-theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    const storedLocale = localStorage.getItem('bookline-locale') as Locale;
    if (storedLocale && translations[storedLocale]) {
      setLocale(storedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0] as Locale;
      setLocale(translations[browserLang] ? browserLang : 'fr');
    }
  }, []);

  useEffect(() => {
    const fluidBgRoutes = [
      '/',
      '/home',
      '/buy',
      '/profile',
      '/sell',
      '/seller',
      '/settings'
    ];

    const needsFluidBg = fluidBgRoutes.some(route => {
        if (route === '/') return pathname === '/';
        return pathname.startsWith(route);
    });

    if (needsFluidBg) {
      document.body.classList.add('has-fluid-background');
      return () => {
        document.body.classList.remove('has-fluid-background');
      };
    }
  }, [pathname]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('bookline-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('bookline-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: TranslationKeys): string => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  const canChangeUsername = (() => {
    if (!userProfile.usernameLastChanged) {
      return true;
    }
    const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return (now - userProfile.usernameLastChanged) > thirtyDaysInMillis;
  })();

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const newProfile = { ...prev, ...profileUpdate };
      if (profileUpdate.username && profileUpdate.username.trim() !== '' && profileUpdate.username !== prev.username) {
        newProfile.usernameLastChanged = Date.now();
      }
      return newProfile;
    });
  };

  const updateSelectedInterests = (interests: string[]) => {
    const cleanedInterests = interests.map(interest => {
        // The emoji is always the last char, separated by a space.
        const lastSpaceIndex = interest.lastIndexOf(' ');
        if (lastSpaceIndex === -1) return interest.toLowerCase();
        return interest.substring(0, lastSpaceIndex).trim().toLowerCase();
    });
    setSelectedInterests(cleanedInterests);
  };


  const addPublishedEbook = (ebookData: Omit<Ebook, 'id'>) => {
    const newEbook: Ebook = {
      ...ebookData,
      id: crypto.randomUUID(), // Use built-in crypto for unique ID
    };
    setPublishedEbooks((prev) => [...prev, newEbook]);
  };

  const removePublishedEbook = (id: string) => {
    setPublishedEbooks((prev) => prev.filter((ebook) => ebook.id !== id));
    setFavoritedEbooks((prev) => prev.filter((ebook) => ebook.id !== id));
  };

  const toggleFavoriteEbook = (ebookToToggle: Ebook) => {
    setFavoritedEbooks((prev) => {
      const isFavorited = prev.some((ebook) => ebook.id === ebookToToggle.id);
      if (isFavorited) {
        return prev.filter((ebook) => ebook.id !== ebookToToggle.id);
      } else {
        return [...prev, ebookToToggle];
      }
    });
  };
  
  const purchaseEbook = (ebookToPurchase: Ebook) => {
    setPurchasedEbooks((prev) => {
      if (prev.some(ebook => ebook.id === ebookToPurchase.id)) {
        return prev;
      }
      return [...prev, ebookToPurchase];
    });
  };

  const allEbooksMap = new Map<string, Ebook>();
  // Add placeholder ebooks first
  placeholderEbooks.forEach(ebook => allEbooksMap.set(ebook.id, ebook));
  // Then add user's published ebooks, potentially overwriting placeholders if IDs match (unlikely with UUID)
  publishedEbooks.forEach(ebook => allEbooksMap.set(ebook.id, ebook));
  const allEbooks = Array.from(allEbooksMap.values());


  return (
    <EbookContext.Provider value={{ publishedEbooks, addPublishedEbook, removePublishedEbook, favoritedEbooks, toggleFavoriteEbook, allEbooks, userProfile, updateUserProfile, selectedInterests, updateSelectedInterests, purchasedEbooks, purchaseEbook, theme, setTheme, locale, setLocale, canChangeUsername, t }}>
      {children}
    </EbookContext.Provider>
  );
}

// Create a custom hook to use the ebook context
export function useEbooks() {
  const context = useContext(EbookContext);
  if (context === undefined) {
    throw new Error('useEbooks must be used within an EbookProvider');
  }
  return context;
}
