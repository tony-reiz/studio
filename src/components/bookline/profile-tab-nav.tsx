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
    <div className="bg-secondary rounded-full flex relative items-center w-full max-w-sm mx-auto shadow-inner my-4">
      <div
        className="absolute top-0 h-full w-1/3 rounded-full bg-foreground transition-all duration-300 ease-in-out"
        style={{ left: getLeftPosition() }}
      />
      <button
        onClick={() => setActiveTab('achats')}
        className={cn(
          'relative z-10 w-1/3 py-1.5 text-center text-sm font-semibold transition-colors duration-300',
          activeTab === 'achats' ? 'text-background' : 'text-foreground'
        )}
      >
        achats
      </button>
      <button
        onClick={() => setActiveTab('publications')}
        className={cn(
          'relative z-10 w-1/3 py-1.5 text-center text-sm font-semibold transition-colors duration-300',
          activeTab === 'publications' ? 'text-background' : 'text-foreground'
        )}
      >
        publications
      </button>
      <button
        onClick={() => setActiveTab('favoris')}
        className={cn(
          'relative z-10 w-1/3 py-1.5 text-center text-sm font-semibold transition-colors duration-300',
          activeTab === 'favoris' ? 'text-background' : 'text-foreground'
        )}
      >
        favoris
      </button>
    </div>
  );
}
