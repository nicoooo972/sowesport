import { FeaturedArticles } from '@/components/home/featured-articles';
import { NewsCarousel } from '@/components/home/news-carousel';
import { InterviewHighlights } from '@/components/home/interview-highlights';
import { RankingsPreview } from '@/components/home/rankings-preview';
import { NewsletterSubscribe } from '@/components/home/newsletter-subscribe';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12 py-8">
      <div className="max-w-6xl space-y-12 w-full">
        <NewsCarousel />
        <FeaturedArticles />
        <div className="grid gap-8 md:grid-cols-2">
          <InterviewHighlights />
          <RankingsPreview />
        </div>
        <NewsletterSubscribe />
      </div>
    </div>
  );
}