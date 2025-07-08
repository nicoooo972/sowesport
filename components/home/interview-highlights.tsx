'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type Interview = {
  id: string;
  interviewee_name: string;
  interviewee_role: string;
  interviewee_team: string | null;
  interviewee_avatar: string | null;
  description: string | null;
};

export function InterviewHighlights() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('interviews')
        .select('id, interviewee_name, interviewee_role, interviewee_team, interviewee_avatar, description')
        .order('published_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching interviews:', error);
      } else {
        setInterviews(data as Interview[]);
      }
      setLoading(false);
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Dernières Interviews
        </h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="w-full">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Dernières Interviews
      </h2>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <Link key={interview.id} href={`/interviews/${interview.id}`} className="block">
            <Card className="transition-all hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  {interview.interviewee_avatar && <AvatarImage src={interview.interviewee_avatar} alt={interview.interviewee_name} />}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {interview.interviewee_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-foreground">{interview.interviewee_name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-primary font-medium">{interview.interviewee_role}</span>
                    {interview.interviewee_team && (
                      <>
                        <span className="text-muted-foreground">chez</span>
                        <span className="text-foreground">{interview.interviewee_team}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{interview.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}