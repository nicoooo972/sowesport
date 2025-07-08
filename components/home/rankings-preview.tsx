'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type Team = {
  id: string;
  name: string;
  rank_position: number;
  points: number;
  trend: 'up' | 'down' | 'same';
};

const trendTranslation: Record<Team['trend'], string> = {
  up: 'En hausse',
  down: 'En baisse',
  same: 'Stable',
};

export function RankingsPreview() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, rank_position, points, trend')
        .order('rank_position', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching rankings:', error);
      } else {
        setTeams(data as Team[]);
      }
      setLoading(false);
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Classements Actuels
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Meilleures Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-5 w-36 mx-auto mt-6" />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Classements Actuels
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Meilleures Équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">{team.rank_position}</span>
                  <span className="text-foreground">{team.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{team.points} pts</span>
                  <Badge
                    variant={
                      team.trend === 'up'
                        ? 'default'
                        : team.trend === 'down'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className={`${
                      team.trend === 'up'
                        ? 'bg-primary text-primary-foreground'
                        : team.trend === 'down'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {trendTranslation[team.trend]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/rankings"
            className="mt-4 block text-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Voir le classement complet →
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}