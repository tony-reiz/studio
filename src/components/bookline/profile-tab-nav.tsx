'use client';

import { cn } from '@/lib/utils';

type ActiveTab = 'achats' | 'publications' | 'favoris';

interface ProfileTabNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function ProfileTabNav({ activeTab, setActiveTab }: ProfileTabNavProps) {
  const getLeftPosition = () => {
    switch (activeTab) {
      case 'achats':
        return '0%';
      case 'publications':
        return '33.33%';
      case 'favoris':
        return '66.66%';
      default:
        return '0%';
    }
  };

  return (
    <div className="glass-form-element rounded-full flex relative items-center w-full max-w-sm md:max-w-lg mx-auto mt-4 mb-4">
      <div
        className="absolute top-0 h-full w-1/3 rounded-full bg-foreground dark:bg-[#393939] transition-all duration-500 ease-in-out"
        style={{ left: getLeftPosition() }}
      />
      <button
        onClick={() => setActiveTab('achats')}
        className={cn(
          'relative z-10 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'achats' ? 'text-background dark:text-foreground' : 'text-foreground'
        )}
      >
        achats
      </button>
      <button
        onClick={() => setActiveTab('publications')}
        className={cn(
          'relative z-10 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'publications' ? 'text-background dark:text-foreground' : 'text-foreground'
        )}
      >
        publications
      </button>
      <button
        onClick={() => setActiveTab('favoris')}
        className={cn(
          'relative z-10 w-1/3 py-2 text-center text-sm font-semibold transition-colors duration-500',
          activeTab === 'favoris' ? 'text-background dark:text-foreground' : 'text-foreground'
        )}
      >
        favoris
      </button>
    </div>
  );
}
