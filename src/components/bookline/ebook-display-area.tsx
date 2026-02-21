'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function EbookDisplayArea() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

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
    <div className="flex-1 w-full flex flex-col justify-center items-center py-12">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        className="w-full max-w-5xl px-12"
      >
        <CarouselContent className="-ml-8">
          {PlaceHolderImages.map((img, index) => (
            <CarouselItem key={index} className="pl-8 basis-1/3">
              <div className="p-1">
                <Card
                  className={`border-0 shadow-none bg-transparent transition-transform duration-500 ease-in-out ${
                    index === current ? 'transform scale-105' : 'transform scale-75 opacity-40'
                  }`}
                >
                  <CardContent
                    className={`flex aspect-[3/4] items-center justify-center p-0 rounded-[25px] overflow-hidden bg-contain bg-no-repeat bg-center ${
                      index === current ? 'bg-[#AFAFAF]' : 'bg-[#D4D4D4]'
                    }`}
                  ></CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-foreground/50 hover:text-foreground h-14 w-14 rounded-none" />
        <CarouselNext className="text-foreground/50 hover:text-foreground h-14 w-14 rounded-none" />
      </Carousel>
    </div>
  );
}
