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
}

// Create the context
const EbookContext = createContext<EbookContextType | undefined>(undefined);

// Create the provider component
export function EbookProvider({ children }: { children: ReactNode }) {
  const [publishedEbooks, setPublishedEbooks] = useState<Ebook[]>([]);

  const addPublishedEbook = (ebookData: Omit<Ebook, 'id'>) => {
    const newEbook: Ebook = {
      ...ebookData,
      id: crypto.randomUUID(), // Use built-in crypto for unique ID
    };
    setPublishedEbooks((prev) => [...prev, newEbook]);
  };

  return (
    <EbookContext.Provider value={{ publishedEbooks, addPublishedEbook }}>
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
