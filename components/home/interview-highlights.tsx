'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const interviews = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Pro Player',
    team: 'Team Elite',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
    excerpt: 'Discussing strategies and the future of competitive gaming',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Team Coach',
    team: 'Victory Squad',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    excerpt: 'Behind the scenes of building a championship team',
  },
];

export function InterviewHighlights() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Latest Interviews</h2>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <Card key={interview.id} className="transition-all hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={interview.avatar} alt={interview.name} />
                <AvatarFallback>{interview.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{interview.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {interview.role} at {interview.team}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{interview.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}