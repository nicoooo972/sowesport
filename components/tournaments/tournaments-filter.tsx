'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Filter, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const games = [
  'Tous les jeux',
  'League of Legends',
  'Valorant',
  'Counter-Strike 2',
  'Rocket League',
  'Apex Legends',
  'Overwatch 2',
];

const statuses = [
  { value: 'all', label: 'Tous les événements' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'live', label: 'En direct' },
  { value: 'open', label: 'Inscriptions ouvertes' },
  { value: 'near', label: 'Près de moi' },
];

const distances = [
  { value: 'all', label: 'Toutes distances' },
  { value: '10', label: '10 km' },
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' },
  { value: '100', label: '100 km' },
];

export function TournamentsFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('Tous les jeux');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGame('Tous les jeux');
    setSelectedStatus('all');
    setSelectedDistance('all');
  };

  const hasActiveFilters = searchQuery || selectedGame !== 'Tous les jeux' || selectedStatus !== 'all' || selectedDistance !== 'all';

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-4">
        {/* Barre de recherche et bouton mobile */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un jeu, lieu ou organisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>
          
          {/* Bouton pour afficher/masquer les filtres sur mobile */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden border-slate-600 hover:bg-slate-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {hasActiveFilters && (
              <Badge className="ml-2 bg-purple-500 text-xs h-4 w-4 p-0 rounded-full flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
        </div>

        {/* Filtres - toujours visibles sur desktop, conditionnels sur mobile */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showMobileFilters ? 'block' : 'hidden lg:grid'}`}>
          {/* Filtre par jeu */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              <Users className="w-4 h-4 inline mr-1" />
              Jeu
            </label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {games.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par statut */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              <Calendar className="w-4 h-4 inline mr-1" />
              Statut
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par distance */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              <MapPin className="w-4 h-4 inline mr-1" />
              Distance
            </label>
            <Select value={selectedDistance} onValueChange={setSelectedDistance}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {distances.map((distance) => (
                  <SelectItem key={distance.value} value={distance.value}>
                    {distance.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bouton pour réinitialiser */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full border-slate-600 hover:bg-slate-700 disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Filtres actifs en badges (mobile) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 lg:hidden">
            {searchQuery && (
              <Badge variant="secondary" className="bg-purple-600">
                "{searchQuery}"
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setSearchQuery('')}
                />
              </Badge>
            )}
            {selectedGame !== 'Tous les jeux' && (
              <Badge variant="secondary" className="bg-blue-600">
                {selectedGame}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedGame('Tous les jeux')}
                />
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="bg-green-600">
                {statuses.find(s => s.value === selectedStatus)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedStatus('all')}
                />
              </Badge>
            )}
            {selectedDistance !== 'all' && (
              <Badge variant="secondary" className="bg-orange-600">
                {distances.find(d => d.value === selectedDistance)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedDistance('all')}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Info sur la géolocalisation */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-sm text-blue-300 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pour filtrer par distance, autorisez la géolocalisation dans votre navigateur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}