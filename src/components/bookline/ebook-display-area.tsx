'use client';

import * as React from 'react';
import Image from 'next/image';
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
        className="w-full"
      >
        <CarouselContent className="-ml-8">
          {PlaceHolderImages.map((img, index) => (
            <CarouselItem key={index} className="pl-8 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card
                  className={`border-0 shadow-none bg-transparent transition-transform duration-500 ease-in-out ${
                    index === current ? 'transform scale-105' : 'transform scale-90 opacity-40'
                  }`}
                >
                  <CardContent className="flex aspect-[3/4] items-center justify-center p-0 rounded-[25px] overflow-hidden bg-secondary">
                     <Image
                        src={img.imageUrl}
                        alt={img.description}
                        width={300}
                        height={400}
                        data-ai-hint={img.imageHint}
                        className="w-full h-full object-cover"
                     />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-10 w-10 text-foreground" />
        <CarouselNext className="h-10 w-10 text-foreground" />
      </Carousel>
    </div>
  );
}
