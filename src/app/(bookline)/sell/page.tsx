import { SellHeader } from '@/components/bookline/sell-header';
import { SellForm } from '@/components/bookline/sell-form';

export default function SellPage() {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <SellHeader />
        <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-6 pb-28">
          <SellForm />
        </main>
      </div>
    </div>
  );
}
