'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const rankings = [
  {
    id: 1,
    team: 'Nova Esports',
    rank: 1,
    points: 2500,
    change: 'up',
  },
  {
    id: 2,
    team: 'Team Elite',
    rank: 2,
    points: 2450,
    change: 'down',
  },
  {
    id: 3,
    team: 'Victory Squad',
    rank: 3,
    points: 2400,
    change: 'same',
  },
];

export function RankingsPreview() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Current Rankings
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Top Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">{team.rank}</span>
                  <span className="text-foreground">{team.team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{team.points} pts</span>
                  <Badge
                    variant={
                      team.change === 'up'
                        ? 'default'
                        : team.change === 'down'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className={`${
                      team.change === 'up'
                        ? 'bg-primary text-primary-foreground'
                        : team.change === 'down'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {team.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/rankings"
            className="mt-4 block text-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View Full Rankings →
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}