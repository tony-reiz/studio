'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of an ebook
export interface Ebook {
  id: string;
  title: string;
  description: string;
  keywords: string;
  price: string;
  pdfDataUrl: string;
}

// Define the context type
interface EbookContextType {
  publishedEbooks: Ebook[];
  addPublishedEbook: (ebook: Omit<Ebook, 'id'>) => void;
  removePublishedEbook: (id: string) => void;
  favoritedEbooks: Ebook[];
  toggleFavoriteEbook: (ebook: Ebook) => void;
}

// Create the context
const EbookContext = createContext<EbookContextType | undefined>(undefined);

// Create the provider component
export function EbookProvider({ children }: { children: ReactNode }) {
  const [publishedEbooks, setPublishedEbooks] = useState<Ebook[]>([]);
  const [favoritedEbooks, setFavoritedEbooks] = useState<Ebook[]>([]);

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


  return (
    <EbookContext.Provider value={{ publishedEbooks, addPublishedEbook, removePublishedEbook, favoritedEbooks, toggleFavoriteEbook }}>
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
