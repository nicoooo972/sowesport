'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: 'The Rise of Mobile Esports: A New Era of Competition',
    category: 'Mobile Gaming',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&q=80',
    excerpt: 'Exploring the explosive growth of mobile esports and its impact on the gaming industry.',
  },
  {
    id: 2,
    title: 'Top Teams Prepare for World Championship',
    category: 'Tournament',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    excerpt: 'An inside look at how professional teams are preparing for the biggest event of the year.',
  },
  {
    id: 3,
    title: 'The Evolution of Esports Broadcasting',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?w=800&q=80',
    excerpt: 'How streaming technology is transforming the way we watch competitive gaming.',
  },
];

export function FeaturedArticles() {
  return (
    <section>
      <h2 className="mb-6 text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Featured Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:scale-[1.02]">
              <div className="relative h-48 w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {article.category}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-foreground">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}