'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';


type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const news: NewsItem[] = [
  {
    id: '1',
    title: 'Sample News',
    description: 'Sample description',
    image: 'https://img.freepik.com/photos-gratuite/createur-contenu-direct-depuis-salon-eclaire-rgb-enregistrement-guide-jeux-video-pour-public_482257-77084.jpg?t=st=1733182773~exp=1733186373~hmac=3772dfd4f96bcd75ddce0898a447a8bb15cac1d245a4ff25500a7dd174457948&w=1380',
  },
  {
    id: '2',
    title: 'Sample News 2',
    description: 'Sample description',
    image: 'https://img.freepik.com/photos-gratuite/createur-contenu-direct-depuis-salon-eclaire-rgb-enregistrement-guide-jeux-video-pour-public_482257-77084.jpg?t=st=1733182773~exp=1733186373~hmac=3772dfd4f96bcd75ddce0898a447a8bb15cac1d245a4ff25500a7dd174457948&w=1380',
  },
];


export function NewsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative">
      <Carousel 
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="mx-auto w-full max-w-5xl"
      >
        <CarouselContent>
          {news.map((item) => (
            <CarouselItem key={item.id}>
              <Link href={`/news/${item.id}`}>
                <Card className="overflow-hidden">
                  <CardContent className="relative h-[400px] w-full p-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 p-6 text-white">
                      <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Enhanced navigation buttons with better visibility */}
        <CarouselPrevious className="left-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-primary/20 shadow-lg" />
        <CarouselNext className="right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-primary/20 shadow-lg" />

        {/* Enhanced dot indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                current === index 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}