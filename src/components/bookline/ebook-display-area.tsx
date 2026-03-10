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

// SVG filter based on the user-provided code
const LiquidGlassSVG = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      <filter id="liquid-glass-distortion">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
        <feDisplacementMap in="SourceGraphic" in2="blur" scale="77" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
);


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
      <LiquidGlassSVG />
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
                    className={cn(
                      'bg-transparent border-0 rounded-[25px] transition-transform duration-500 ease-in-out relative overflow-hidden',
                      index === current
                        ? 'transform scale-100'
                        : 'hidden sm:block sm:transform sm:scale-75 sm:opacity-40'
                    )}
                  >
                    {/* The glass effect layer */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        filter: 'url(#liquid-glass-distortion)',
                      }}
                    />

                    {/* The inner border */}
                    <div className="absolute inset-0 z-10 rounded-[25px] shadow-[inset_2px_2px_0px_-2px_rgba(255,255,255,0.7),_inset_0_0_3px_1px_rgba(255,255,255,0.7)] pointer-events-none" />
                    
                    <CardContent
                      className={cn(
                        'relative z-20 aspect-[210/297] p-6 flex flex-col items-center justify-center text-center'
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
