//import { TournamentsMap } from '@/components/tournaments/tournaments-map';
import { TournamentsFilter } from '@/components/tournaments/tournaments-filter';

export const metadata = {
  title: 'Tournaments Map - EsportsHub',
  description: 'Find esports tournaments happening around the world',
};

export default function TournamentsMapPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Tournaments Map</h1>
      <TournamentsFilter />
      <div className="h-[600px] rounded-lg border">
        {/* <TournamentsMap /> */}
      </div>
    </div>
  );
}