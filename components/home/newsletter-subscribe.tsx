'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Successfully subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    });
    setEmail('');
  };

  return (
    <section className="py-8">
      <Card className="mx-auto max-w-2xl bg-gradient-to-br from-background-light to-background border border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-primary">Stay Updated</CardTitle>
          <p className="text-center text-gray-400">
            Subscribe to our newsletter for the latest esports news and updates.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background-light border-primary/20 focus:border-primary text-white placeholder:text-gray-500"
            />
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
              Subscribe
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}