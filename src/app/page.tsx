import { Header } from '@/components/bookline/header';
import { SearchSection } from '@/components/bookline/search-section';
import { EbookDisplayArea } from '@/components/bookline/ebook-display-area';
import { BottomNav } from '@/components/bookline/bottom-nav';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <Header />
        <main className="flex flex-col items-center w-full flex-1 pb-28">
          <SearchSection />
          <EbookDisplayArea />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
