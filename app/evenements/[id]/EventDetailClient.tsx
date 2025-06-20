"use client";

import { ArrowLeft, Clock, MapPin, Users, Euro, Calendar, Share2, Instagram, Twitter, Facebook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Types pour les équipes et classements
interface Team {
  id: string;
  name: string;
  logo: string;
  rank?: number;
  matchesJoues?: number;
  victoires?: number;
  defaites?: number;
  points?: number;
  tendance?: "up" | "down" | "stable";
}

interface Event {
  id: string;
  title: string;
  game: string;
  subtitle: string;
  description: string;
  teams: number;
  prize: string;
  location: string;
  date: string;
  time: string;
  status: "online" | "closed";
  registered: boolean;
  image: string;
  format: string;
  organizer: string;
  organizerLogo: string;
}

function TendanceIcon({ tendance }: { tendance: "up" | "down" | "stable" }) {
  const getColor = () => {
    switch (tendance) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getSymbol = () => {
    switch (tendance) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return <span className={`${getColor()} font-bold`}>{getSymbol()}</span>;
}

interface EventDetailClientProps {
  eventData: Event;
  participatingTeams: Team[];
  currentRanking: Team[];
}

export default function EventDetailClient({ 
  eventData, 
  participatingTeams, 
  currentRanking 
}: EventDetailClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec bouton retour */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/evenements"
            className="inline-flex items-center gap-2 text-white hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux événements</span>
          </Link>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {eventData.title}
            </h1>
            <p className="text-xl text-gray-300">
              {eventData.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Image principale avec informations */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="overflow-hidden bg-slate-800/50 border-slate-700">
          <div 
            className="h-80 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${eventData.image}')`
            }}
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">
                En ligne
              </Badge>
              <Badge className="bg-green-600 hover:bg-green-700">
                Inscrit
              </Badge>
            </div>

            {/* Informations principales */}
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold mb-2">{eventData.title}</h2>
              <p className="text-purple-300 font-medium mb-4">{eventData.game}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{eventData.teams} équipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{eventData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{eventData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  <span>{eventData.prize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{eventData.date}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
        {/* À propos */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">À propos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{eventData.description}</p>
          </CardContent>
        </Card>

        {/* Format du tournoi */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Format du tournoi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{eventData.format}</p>
          </CardContent>
        </Card>

        {/* Équipes participantes */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Équipes participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {participatingTeams.map((team) => (
                <div 
                  key={team.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white text-sm font-medium">{team.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grid pour organisateur et classement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organisateur */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Organisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img 
                  src={eventData.organizerLogo} 
                  alt={eventData.organizer}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-white font-medium">{eventData.organizer}</span>
              </div>
            </CardContent>
          </Card>

          {/* Classement actuel */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Classement actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Header du tableau */}
                <div className="grid grid-cols-6 gap-2 text-xs text-gray-400 font-medium mb-2">
                  <span>Position</span>
                  <span>Équipe</span>
                  <span className="text-center">MJ</span>
                  <span className="text-center">V</span>
                  <span className="text-center">D</span>
                  <span className="text-center">Points</span>
                </div>
                
                {/* Lignes du classement */}
                {currentRanking.map((team) => (
                  <div 
                    key={team.id}
                    className="grid grid-cols-6 gap-2 items-center p-2 bg-slate-700/30 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{team.rank}</span>
                      <TendanceIcon tendance={team.tendance!} />
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={team.logo} 
                        alt={team.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white">{team.name}</span>
                    </div>
                    <span className="text-center text-gray-300">{team.matchesJoues}</span>
                    <span className="text-center text-green-400">{team.victoires}</span>
                    <span className="text-center text-red-400">{team.defaites}</span>
                    <span className="text-center text-white font-bold">{team.points}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partager */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Partager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="border-slate-600 text-white hover:bg-slate-700">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-600 text-white hover:bg-slate-700">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-600 text-white hover:bg-slate-700">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-600 text-white hover:bg-slate-700">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message d'inscription */}
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">Inscription au tournois impossible</p>
        </div>
      </div>
    </div>
  );
} 