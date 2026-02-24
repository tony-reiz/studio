'use client';

import { useState } from 'react';
import { Menu, User, Home, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EbookCard } from '@/components/bookline/ebook-card';
import { ProfileTabNav } from '@/components/bookline/profile-tab-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

type ActiveTab = 'achats' | 'publications' | 'favoris';

const userPurchases: any[] = Array.from({ length: 6 });
const userPublications: any[] = [];
const userFavorites: any[] = Array.from({ length: 2 });

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('achats');

  const renderContent = () => {
    switch (activeTab) {
      case 'achats':
        return userPurchases.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 animate-in fade-in-50">
            {userPurchases.map((_, index) => (
              <EbookCard key={`achat-${index}`} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            Vous n’avez aucun achat
          </div>
        );
      case 'publications':
        return userPublications.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 animate-in fade-in-50">
            {userPublications.map((_, index) => (
              <EbookCard key={`pub-${index}`} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            Vous n’avez aucun ebook publié
          </div>
        );
      case 'favoris':
        return userFavorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 animate-in fade-in-50">
            {userFavorites.map((_, index) => (
              <EbookCard key={`fav-${index}`} isInitiallyFavorited={true} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            Vous n’avez aucun ebook en favoris
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between w-full py-6">
          <Button variant="ghost" size="icon" aria-label="Menu" className="hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-7 [&_svg]:w-7">
            <Menu />
          </Button>
          <div className="flex flex-col items-center gap-3">
            <Link href="/home" passHref>
                <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Accueil">
                    <Home className="h-6 w-6" />
                </Button>
            </Link>
            <Button variant="default" size="icon" className="rounded-full bg-foreground text-background w-11 h-11" aria-label="Partager le profil">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col items-center pb-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-28 w-28 bg-foreground">
              <AvatarFallback className="bg-transparent">
                <User className="h-16 w-16 text-background" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-foreground text-background text-sm font-semibold rounded-full px-4 py-1.5 mt-4">
              utilisateur
            </div>
          </div>

          <ProfileTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="w-full max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
