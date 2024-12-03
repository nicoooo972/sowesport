'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const games = [
  'All Games',
  'League of Legends',
  'Dota 2',
  'CS:GO',
  'Valorant',
  'Overwatch',
];

const regions = ['Global', 'North America', 'Europe', 'Asia', 'South America'];

export function RankingsFilter() {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Game" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game) => (
            <SelectItem key={game} value={game.toLowerCase().replace(/\s+/g, '-')}>
              {game}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="global">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem
              key={region}
              value={region.toLowerCase().replace(/\s+/g, '-')}
            >
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline">Last Week</Button>
      <Button variant="outline">Last Month</Button>
      <Button variant="outline">Last Year</Button>
    </div>
  );
}