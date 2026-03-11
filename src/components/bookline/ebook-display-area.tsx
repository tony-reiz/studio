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

const LiquidGlassSVG = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      <defs>
          <filter id="liquid-glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
              <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency="0.01 0.01" 
                  numOctaves="1" 
                  seed="5" 
                  result="turbulence" 
              />
              <feComponentTransfer in="turbulence" result="mapped">
                  <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                  <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                  <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
              </feComponentTransfer>
              <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
              <feSpecularLighting 
                  in="softMap" 
                  surfaceScale="5" 
                  specularConstant="1" 
                  specularExponent="100" 
                  lightingColor="white" 
                  result="specLight"
              >
                  <fePointLight x="-200" y="-200" z="300" />
              </feSpecularLighting>
              <feComposite 
                  in="specLight" 
                  operator="arithmetic" 
                  k1="0" k2="1" k3="1" k4="0" 
                  result="litImage" 
              />
              <feDisplacementMap 
                  in="SourceGraphic" 
                  in2="softMap" 
                  scale="50" 
                  xChannelSelector="R" 
                  yChannelSelector="G" 
              />
          </filter>
        </defs>
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
                      className="absolute -inset-6 z-0"
                      style={{
                        backdropFilter: 'blur(3px)',
                        WebkitBackdropFilter: 'blur(3px)',
                        filter: 'url(#liquid-glass-distortion)',
                      }}
                    />
                    
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
