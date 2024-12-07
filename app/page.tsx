import { FeaturedArticles } from '@/components/home/featured-articles';
import { NewsCarousel } from '@/components/home/news-carousel';
import { InterviewHighlights } from '@/components/home/interview-highlights';
import { RankingsPreview } from '@/components/home/rankings-preview';
import { NewsletterSubscribe } from '@/components/home/newsletter-subscribe';
import { SearchBar } from '@/components/search/search-bar';

export default function Home() {
  return (
    <main className="container mx-auto space-y-8 py-8">
      <SearchBar />
      <NewsCarousel />
      <FeaturedArticles />
      <div className="grid gap-8 md:grid-cols-2">
        <InterviewHighlights />
        <RankingsPreview />
      </div>
      <NewsletterSubscribe />
    </main>
  );
}