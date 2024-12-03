'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const rankings = [
  {
    id: 1,
    rank: 1,
    teamName: 'Nova Esports',
    logo: 'https://images.unsplash.com/photo-1534488972407-5a4aa1e47d83?w=48&h=48&q=80',
    points: 2500,
    winRate: '78%',
    recentResults: ['W', 'W', 'L', 'W', 'W'],
    change: 'up',
  },
  {
    id: 2,
    rank: 2,
    teamName: 'Team Elite',
    logo: 'https://images.unsplash.com/photo-1534488972407-5a4aa1e47d83?w=48&h=48&q=80',
    points: 2450,
    winRate: '75%',
    recentResults: ['W', 'L', 'W', 'W', 'L'],
    change: 'down',
  },
  {
    id: 3,
    rank: 3,
    teamName: 'Victory Squad',
    logo: 'https://images.unsplash.com/photo-1534488972407-5a4aa1e47d83?w=48&h=48&q=80',
    points: 2400,
    winRate: '72%',
    recentResults: ['W', 'W', 'W', 'L', 'W'],
    change: 'same',
  },
];

export function RankingsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Win Rate</TableHead>
            <TableHead>Recent Results</TableHead>
            <TableHead>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={team.logo} alt={team.teamName} />
                    <AvatarFallback>{team.teamName[0]}</AvatarFallback>
                  </Avatar>
                  {team.teamName}
                </div>
              </TableCell>
              <TableCell>{team.points}</TableCell>
              <TableCell>{team.winRate}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {team.recentResults.map((result, index) => (
                    <Badge
                      key={index}
                      variant={result === 'W' ? 'default' : 'secondary'}
                    >
                      {result}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    team.change === 'up'
                      ? 'default'
                      : team.change === 'down'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {team.change}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}