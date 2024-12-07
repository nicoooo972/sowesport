'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche :', searchQuery);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="search"
          placeholder="Rechercher des tournois, équipes, joueurs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-3 bg-background border-primary/20 focus:border-primary/50 rounded-lg"
        />
        <Button 
          type="submit" 
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
