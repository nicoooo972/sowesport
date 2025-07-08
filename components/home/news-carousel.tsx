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
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
};

type EsportSlide = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
};

// Images esport par défaut
const defaultEsportSlides: EsportSlide[] = [
  {
    id: 'cs2-major',
    title: 'Counter-Strike 2 Major Championship',
    excerpt: 'Les plus grandes équipes mondiales s\'affrontent dans le tournoi le plus prestigieux de CS2',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&crop=center',
    link: '/evenements'
  },
  {
    id: 'lol-worlds',
    title: 'League of Legends World Championship',
    excerpt: 'La compétition ultime de League of Legends réunit les meilleures équipes internationales',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop&crop=center',
    link: '/evenements'
  },
  {
    id: 'valorant-masters',
    title: 'VALORANT Masters Tournament',
    excerpt: 'L\'élite mondiale de VALORANT se dispute les titres les plus convoités de l\'esport tactique',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600&fit=crop&crop=center',
    link: '/evenements'
  },
  {
    id: 'dota2-international',
    title: 'The International Dota 2',
    excerpt: 'Le tournoi de Dota 2 le plus prestigieux avec les plus gros prize pools de l\'esport',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=1200&h=600&fit=crop&crop=center',
    link: '/evenements'
  },
  {
    id: 'rocket-league',
    title: 'Rocket League Championship Series',
    excerpt: 'Les meilleurs pilotes de Rocket League s\'affrontent dans des matchs spectaculaires',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop&crop=center',
    link: '/evenements'
  }
];

export function NewsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<(NewsItem | EsportSlide)[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, excerpt, featured_image')
        .eq('is_breaking', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching breaking news:', error);
        setNews([]);
      } else {
        setNews(data as NewsItem[]);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Combiner les articles et les slides esport par défaut
    if (news.length > 0) {
      // Si on a des articles, on mélange avec quelques slides esport
      const combinedSlides = [
        ...news.slice(0, 3), // 3 premiers articles
        ...defaultEsportSlides.slice(0, 2) // 2 slides esport
      ];
      setSlides(combinedSlides);
    } else {
      // Si pas d'articles, on utilise uniquement les slides esport
      setSlides(defaultEsportSlides);
    }
  }, [news]);

  useEffect(() => {
    if (!api) return;
    
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return (
      <section className="relative">
        <div className="mx-auto w-full max-w-5xl">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const isNewsItem = (item: NewsItem | EsportSlide): item is NewsItem => {
    return 'slug' in item;
  };

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
          {slides.map((item) => (
            <CarouselItem key={item.id}>
              <Link href={isNewsItem(item) ? `/articles/${item.slug}` : item.link}>
                <Card className="overflow-hidden">
                  <CardContent className="relative h-[400px] w-full p-0">
                    <Image
                      src={isNewsItem(item) ? (item.featured_image || defaultEsportSlides[0].image) : item.image}
                      alt={item.title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 p-6 text-white">
                      <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-primary/20 shadow-lg" />
        <CarouselNext className="right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-primary/20 shadow-lg" />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                current === index 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}