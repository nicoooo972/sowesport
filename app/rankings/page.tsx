import { RankingsTable } from '@/components/rankings/rankings-table';
import { RankingsFilter } from '@/components/rankings/rankings-filter';

export default function RankingsPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Global Rankings</h1>
      <RankingsFilter />
      <RankingsTable />
    </div>
  );
}