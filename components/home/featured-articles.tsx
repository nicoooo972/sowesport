'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type Article = {
  id: string;
  slug: string;
  title:string;
  category: string;
  featured_image: string | null;
  excerpt: string | null;
};

export function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, category, featured_image, excerpt')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured articles:', error);
      } else {
        setArticles(data as Article[]);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="mb-6 text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Articles à la une
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-full overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-full mt-2" />
                <Skeleton className="h-5 w-4/5 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Articles à la une
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card className="h-full overflow-hidden transition-all hover:scale-[1.02]">
              {article.featured_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
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