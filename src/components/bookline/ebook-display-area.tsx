'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EbookCard } from './ebook-card';
import { cn } from '@/lib/utils';

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
    }, 300);

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

  return (
    <div
      className={cn(
        'flex-1 w-full flex flex-col justify-center items-center pb-20 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'center',
          loop: true,
          startIndex: 2,
        }}
        className="w-full max-w-4xl px-14 relative"
      >
        <CarouselContent className="-ml-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pl-8 basis-1/3">
              <div className="p-1">
                <EbookCard
                  isActive={index === current}
                  className={`transition-transform duration-500 ease-in-out ${
                    index === current
                      ? 'transform scale-100'
                      : 'transform scale-75 opacity-40'
                  }`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-foreground h-20 w-20 rounded-none absolute left-0 top-1/2 -translate-y-1/2 z-10 border-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-10 [&_svg]:w-10">
          <ChevronLeft />
        </CarouselPrevious>
        <CarouselNext className="text-foreground h-20 w-20 rounded-none absolute right-0 top-1/2 -translate-y-1/2 z-10 border-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-10 [&_svg]:w-10">
          <ChevronRight />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
