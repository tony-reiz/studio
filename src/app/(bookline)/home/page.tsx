'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
import { SearchOverlay } from '@/components/bookline/search-overlay';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="w-full py-6">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start">
              <Button variant="ghost" aria-label="Menu" className="p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7 justify-start">
                <Menu />
              </Button>
              <div className="-mt-1">
                <p className="text-[24px] font-bold tracking-widest text-foreground">BIENVENUE SUR</p>
                <h1 className="text-5xl sm:text-6xl font-extrabold text-primary -mt-1">BOOKLINE</h1>
              </div>
            </div>
            <div className="flex items-center shrink-0 gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                  <button
                      onClick={() => setIsSearchOpen(true)}
                      className="relative flex items-center pl-11 pr-4 h-11 w-40 sm:w-64 text-sm bg-secondary border-0 rounded-full text-left text-muted-foreground focus:outline-none"
                  >
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                      <span className="truncate">recherchez vos ebook...</span>
                  </button>
              </div>
              <Link href="/profile" passHref>
                <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Profil Utilisateur">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative w-full mt-2 sm:hidden">
              <button
                  onClick={() => setIsSearchOpen(true)}
                  className="relative flex items-center pl-11 pr-4 h-11 w-full text-sm bg-secondary border-0 rounded-full text-left text-muted-foreground focus:outline-none"
              >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <span className="truncate">recherchez vos ebook...</span>
              </button>
          </div>
        </header>

        <main className="flex flex-col w-full flex-1 pb-28">
          <EbookDisplayArea />
        </main>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
