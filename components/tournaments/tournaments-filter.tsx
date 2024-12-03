'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const games = ['All Games', 'League of Legends', 'CS:GO', 'Dota 2', 'Valorant'];
const regions = ['All Regions', 'North America', 'Europe', 'Asia', 'South America'];

export function TournamentsFilter() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            className="pl-9"
          />
        </div>
      </div>
      
      <Select defaultValue="all-games">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Game" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game) => (
            <SelectItem
              key={game}
              value={game.toLowerCase().replace(/\s+/g, '-')}
            >
              {game}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all-regions">
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

      <Button variant="outline">This Month</Button>
      <Button variant="outline">Next 3 Months</Button>
    </div>
  );
}