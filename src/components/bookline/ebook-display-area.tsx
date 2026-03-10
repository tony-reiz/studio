'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, BadgeCheck, DollarSign } from 'lucide-react';

const infoCards = [
  {
    title: "Idées d'Ebooks",
    icon: Lightbulb,
  },
  {
    title: 'Devenez Vendeur Certifié',
    icon: BadgeCheck,
  },
  {
    title: "Gagnez de l'argent ensemble",
    icon: DollarSign,
  },
];

export function EbookDisplayArea() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(2);
  const [isVisible, setIsVisible] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  const displayItems = Array(5).fill(null);

  return (
    <div
      className={cn(
        'flex-1 w-full hidden md:flex flex-col justify-center items-center pb-20 transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="glass-distortion">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.012" 
            numOctaves="3" 
            result="noise"
          >
            <animate 
              attributeName="seed" 
              from="1" 
              to="1000" 
              dur="60s" 
              repeatCount="indefinite" 
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
        </filter>
      </svg>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'center',
          loop: true,
          startIndex: 2,
        }}
        className="w-full max-w-4xl px-36 sm:px-4 md:px-14 relative"
      >
        <CarouselContent className="-ml-8">
          {displayItems.map((_, index) => {
            const card = infoCards[index % 3];
            return (
              <CarouselItem key={index} className="pl-8 basis-full sm:basis-1/2 md:basis-1/3">
                <div className="p-1">
                  <Card
                    className={cn('bg-transparent border-0 rounded-[25px] transition-transform duration-500 ease-in-out relative overflow-hidden',
                      index === current
                        ? 'transform scale-100'
                        : 'hidden sm:block sm:transform sm:scale-75 sm:opacity-40'
                    )}
                  >
                    {/* 1. Le calque "Vitre" amélioré */}
                    <div 
                      className="absolute inset-0 z-1 overflow-hidden rounded-[25px] border border-white/20 bg-white/5 shadow-lg"
                      style={{ 
                        backdropFilter: 'blur(12px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                      }} 
                    >
                      {/* Calque de distorsion : il doit AUSSI avoir un backdrop-filter pour "aspirer" le fond et le tordre */}
                      <div 
                        className="absolute -inset-10" // On déborde pour éviter les bords nets
                        style={{
                          backdropFilter: 'blur(12px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                          filter: 'url(#glass-distortion)',
                        }} 
                      />
                    </div>
                    
                    {/* 2. Le contenu (Icône + Texte) par-dessus, non déformé */}
                    <CardContent
                      className={cn(
                        'relative z-10 aspect-[210/297] p-6 flex flex-col items-center justify-center text-center'
                      )}
                    >
                      <card.icon className="w-16 h-16 text-foreground mb-4" />
                      <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
