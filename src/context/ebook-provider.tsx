'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Define the shape of an ebook
export interface Ebook {
  id: string;
  title: string;
  description: string;
  keywords: string;
  price: string;
  pdfDataUrl: string;
}

// Define the shape of a user profile
export interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string | null;
}

const placeholderEbooks: Ebook[] = PlaceHolderImages.map((img, index) => ({
    id: img.id,
    title: `Ebook ${img.imageHint.charAt(0).toUpperCase() + img.imageHint.slice(1)} ${index + 1}`,
    description: `Une exploration fascinante sur le thème de "${img.imageHint}".`,
    keywords: img.imageHint,
    price: `${(10 + index * 3.5).toFixed(2).replace('.', ',')}`,
    pdfDataUrl: img.imageUrl,
}));

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
}

// Create the context
const EbookContext = createContext<EbookContextType | undefined>(undefined);

// Create the provider component
export function EbookProvider({ children }: { children: ReactNode }) {
  const [publishedEbooks, setPublishedEbooks] = useState<Ebook[]>([]);
  const [favoritedEbooks, setFavoritedEbooks] = useState<Ebook[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'utilisateur',
    bio: '',
    avatarUrl: null,
  });

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
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

  const allEbooksMap = new Map<string, Ebook>();
  // Add placeholder ebooks first
  placeholderEbooks.forEach(ebook => allEbooksMap.set(ebook.id, ebook));
  // Then add user's published ebooks, potentially overwriting placeholders if IDs match (unlikely with UUID)
  publishedEbooks.forEach(ebook => allEbooksMap.set(ebook.id, ebook));
  const allEbooks = Array.from(allEbooksMap.values());


  return (
    <EbookContext.Provider value={{ publishedEbooks, addPublishedEbook, removePublishedEbook, favoritedEbooks, toggleFavoriteEbook, allEbooks, userProfile, updateUserProfile }}>
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
