'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type ActiveMode = 'buy' | 'sell';

export function BottomNav() {
  const [activeMode, setActiveMode] = useState<ActiveMode>('buy');

  return (
    <div className="fixed bottom-2 left-0 right-0 p-4">
      <div className="bg-secondary p-1 rounded-full flex items-center max-w-sm mx-auto shadow-lg">
        <button
          onClick={() => setActiveMode('buy')}
          className={cn(
            "w-full rounded-full py-3 text-base font-semibold transition-all duration-300 ease-in-out",
            activeMode === 'buy'
              ? "bg-primary text-primary-foreground"
              : "text-secondary-foreground bg-transparent"
          )}
        >
          Acheter
        </button>
        <button
          onClick={() => setActiveMode('sell')}
          className={cn(
            "w-full rounded-full py-3 text-base font-semibold transition-all duration-300 ease-in-out",
            activeMode === 'sell'
              ? "bg-primary text-primary-foreground"
              : "text-secondary-foreground bg-transparent"
          )}
        >
          Vendre
        </button>
      </div>
    </div>
  );
}
