'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ActiveMode = 'buy' | 'sell';

export function BottomNav() {
  const [activeMode, setActiveMode] = useState<ActiveMode>('buy');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
      <div className="flex gap-4 max-w-md mx-auto">
        <Button
          onClick={() => setActiveMode('buy')}
          className="flex-1 rounded-full text-lg h-14 font-semibold transition-all duration-300"
          variant={activeMode === 'buy' ? 'default' : 'secondary'}
        >
          Acheter
        </Button>
        <Button
          onClick={() => setActiveMode('sell')}
          className="flex-1 rounded-full text-lg h-14 font-semibold transition-all duration-300"
          variant={activeMode === 'sell' ? 'default' : 'secondary'}
        >
          Vendre
        </Button>
      </div>
    </div>
  );
}
