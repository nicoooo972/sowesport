"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Euro, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";

// Types pour les événements
interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  game: string;
  teams_count: number;
  prize_pool?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
  status: string;
  image_url?: string;
  format_description?: string;
  organizer_name?: string;
  organizer_logo?: string;
  registration_open: boolean;
  created_at?: string;
  updated_at?: string;
}

// Composant pour les cartes d'événements
function EventCard({ event }: { event: Event }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date à confirmer";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string, registrationOpen: boolean) => {
    if (status === 'completed') {
      return (
        <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-700">
          Terminé
        </Badge>
      );
    }
    if (status === 'live') {
      return (
        <Badge className="bg-red-600 hover:bg-red-700 animate-pulse">
          En cours
        </Badge>
      );
    }
    if (registrationOpen) {
      return (
        <Badge className="bg-green-600 hover:bg-green-700">
          Inscriptions ouvertes
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10">
        À venir
      </Badge>
    );
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${event.image_url || '/api/placeholder/400/200'}')`
        }}
      >
        {/* Badges de statut */}
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(event.status, event.registration_open)}
        </div>
      </div>
      
      <CardContent className="p-4 text-white">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-white">{event.title}</h3>
            <p className="text-purple-400 font-medium">{event.game}</p>
            {event.subtitle && (
              <p className="text-gray-400 text-sm">{event.subtitle}</p>
            )}
          </div>
          
          {event.description && (
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span>{event.teams_count} équipes</span>
            </div>
            {event.prize_pool && (
              <div className="flex items-center gap-2 text-gray-300">
                <Euro className="w-4 h-4" />
                <span>{event.prize_pool}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {event.location && (
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.event_date)}</span>
            </div>
          </div>
          
          <Link href={`/evenements/${event.id}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium">
              En savoir plus !
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EvenementsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [gameTypeFilter, setGameTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const { isAdmin, loading: adminLoading } = useAdmin();

  const recentSearches = ["League of Legends", "Valorant", "CS:GO", "Rocket League"];

  // Récupérer les événements depuis Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        let query = supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        const { data, error } = await query;

        if (error) {
          console.error('Erreur lors du chargement des événements:', error);
          return;
        }

        setEvents(data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.game.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEventFilter = eventFilter === "all" || 
      (eventFilter === "online" && event.registration_open) ||
      (eventFilter === "offline" && !event.registration_open);
    
    const matchesGameType = gameTypeFilter === "all" || 
      event.game.toLowerCase().includes(gameTypeFilter.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || 
      (event.location && event.location.toLowerCase().includes(locationFilter.toLowerCase())) ||
      (locationFilter === "online" && !event.location);

    return matchesSearch && matchesEventFilter && matchesGameType && matchesLocation;
  });

  // Séparer les événements actuels et à venir
  const currentDate = new Date();
  const currentEvents = filteredEvents.filter(event => {
    if (!event.event_date) return event.status === 'live';
    const eventDate = new Date(event.event_date);
    return event.status === 'live' || 
           (eventDate <= currentDate && event.status !== 'completed');
  });

  const upcomingEvents = filteredEvents.filter(event => {
    if (!event.event_date) return event.status === 'upcoming';
    const eventDate = new Date(event.event_date);
    return eventDate > currentDate && event.status !== 'completed';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec dégradé */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Événements Esport
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les événements esport en France !
          </p>
          
          {/* Bouton Admin */}
          {isAdmin && !adminLoading && (
            <div className="mt-8">
              <Link href="/admin/evenements">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  Gérer les événements
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Section de recherche et filtres */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un jeu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filtres */}
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Tous les événements" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous les événements</SelectItem>
                  <SelectItem value="online">Inscriptions ouvertes</SelectItem>
                  <SelectItem value="offline">Inscriptions fermées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Type de jeux" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous les jeux</SelectItem>
                  <SelectItem value="league">League of Legends</SelectItem>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="cs">Counter-Strike</SelectItem>
                  <SelectItem value="rocket">Rocket League</SelectItem>
                  <SelectItem value="apex">Apex Legends</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Lieu" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous les lieux</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="lyon">Lyon</SelectItem>
                  <SelectItem value="bordeaux">Bordeaux</SelectItem>
                  <SelectItem value="online">En ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recherches récentes */}
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-300 font-medium">Recherches populaires :</span>
                <div className="flex gap-2 flex-wrap">
                  {recentSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Événements en cours */}
      {currentEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Événements en cours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Événements à venir */}
      {upcomingEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Événements à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun événement */}
      {!loading && filteredEvents.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-16 text-center">
          <div className="text-white text-xl mb-4">Aucun événement trouvé</div>
          <p className="text-gray-300">
            Essayez de modifier vos critères de recherche ou revenez plus tard pour de nouveaux événements.
          </p>
        </div>
      )}
    </div>
  );
} 