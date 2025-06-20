"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, Euro, Filter } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types pour les événements
interface Event {
  id: string;
  title: string;
  game: string;
  description: string;
  teams: number;
  prize: string;
  location: string;
  date: string;
  status: "online" | "closed";
  image: string;
  gameType: string;
}

// Données mock pour les événements
const currentEvents: Event[] = [
  {
    id: "1",
    title: "LFL Spring Split",
    game: "League of Legends",
    description: "Le plus grand tournoi français de League of Legends revient pour une nouvelle édition !",
    teams: 16,
    prize: "1 000 000 €",
    location: "Paris",
    date: "20 Fév 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "MOBA"
  },
  {
    id: "2", 
    title: "Rocket League World Cup",
    game: "Rocket League",
    description: "Les meilleures équipes de Rocket League s'affrontent pour le titre de champion du monde.",
    teams: 12,
    prize: "500 000 €",
    location: "Lyon",
    date: "25 Février 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "Sports"
  },
  {
    id: "3",
    title: "Valorant Champions Tour",
    game: "Valorant",
    description: "La scène compétitive de Valorant atteint de nouveaux sommets avec cet événement international.",
    teams: 20,
    prize: "750 000 €",
    location: "Bordeaux",
    date: "13 Février 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "FPS"
  },
  {
    id: "4",
    title: "Call of Duty Mobile Championship",
    game: "Call of Duty Mobile",
    description: "Les légendes de Call of Duty Mobile se battent pour l'ultime victoire.",
    teams: 10,
    prize: "300 000 €",
    location: "Paris",
    date: "18 Mars 2025",
    status: "closed",
    image: "/api/placeholder/400/200",
    gameType: "FPS"
  }
];

const upcomingEvents: Event[] = [
  {
    id: "5",
    title: "Clash Royale Crown Championship",
    game: "Clash Royale",
    description: "Le tournoi ultime pour les fans de Clash Royale, avec des affrontements épiques.",
    teams: 64,
    prize: "200 000 €",
    location: "Toulouse",
    date: "10 Mars 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "Mobile"
  },
  {
    id: "6",
    title: "PUBG Global Invitational",
    game: "PUBG",
    description: "Préparez-vous à vivre une bataille royale comme jamais auparavant.",
    teams: 24,
    prize: "2 000 000 €",
    location: "Nantes",
    date: "15 Mars 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "Battle Royale"
  },
  {
    id: "7",
    title: "Apex Legends Global Series",
    game: "Apex Legends",
    description: "Les champions d'Apex Legends se rassemblent pour cette compétition épique.",
    teams: 40,
    prize: "1 000 000 €",
    location: "Montpellier",
    date: "18 Mars 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "Battle Royale"
  },
  {
    id: "8",
    title: "StarCraft II Global Championship",
    game: "StarCraft II",
    description: "Le rendez-vous stratégique de l'année pour les amateurs de temps réel.",
    teams: 32,
    prize: "800 000 €",
    location: "En ligne",
    date: "22 Mars 2025",
    status: "online",
    image: "/api/placeholder/400/200",
    gameType: "RTS"
  }
];

// Composant pour les cartes d'événements
function EventCard({ event }: { event: Event }) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${event.image}')`
        }}
      >
        {/* Badges de statut */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant={event.status === "online" ? "default" : "secondary"}
            className={event.status === "online" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}
          >
            En ligne
          </Badge>
          <Badge 
            variant="outline" 
            className="border-red-500 text-red-400 bg-red-500/10"
          >
            Close
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 text-white">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-white">{event.title}</h3>
            <p className="text-purple-400 font-medium">{event.game}</p>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {event.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span>{event.teams} équipes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Euro className="w-4 h-4" />
              <span>{event.prize}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [gameTypeFilter, setGameTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const recentSearches = ["League of Legends", "CS:GO", "Valorant", "Dota 2"];

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
                  <SelectItem value="online">En ligne</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Type de jeux" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Type de jeux</SelectItem>
                  <SelectItem value="moba">MOBA</SelectItem>
                  <SelectItem value="fps">FPS</SelectItem>
                  <SelectItem value="battle-royale">Battle Royale</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="rts">RTS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Lieu" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Lieu</SelectItem>
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
                <span className="text-gray-300 font-medium">Vos dernières recherches :</span>
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

      {/* Événements à venir */}
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
    </div>
  );
} 