"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, Users, Euro, Calendar, Settings, Trophy, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import EventRankingManager from "@/components/admin/event-ranking-manager";

// Types pour les équipes et classements
interface Team {
  id: string | number;
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
  teams_count: number;
  prize_pool: string;
  location: string;
  event_date: string;
  event_time: string;
  status: "upcoming" | "live" | "completed";
  image_url: string;
  format_description: string;
  organizer_name: string;
  organizer_logo: string;
  registration_open: boolean;
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
  eventId: string;
}

export default function EventDetailClient({ eventId }: EventDetailClientProps) {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [participatingTeams, setParticipatingTeams] = useState<Team[]>([]);
  const [currentRanking, setCurrentRanking] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      
      // Charger les données de l'événement
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      setEventData(event);

      // Charger les équipes participantes
      const { data: teams, error: teamsError } = await supabase
        .from('event_teams')
        .select('*')
        .eq('event_id', eventId)
        .order('position');

      if (teamsError) throw teamsError;

      const formattedTeams: Team[] = teams.map(team => ({
        id: team.id,
        name: team.team_name,
        logo: team.team_logo || '/placeholder-team.png',
        rank: team.position,
        matchesJoues: team.matches_played,
        victoires: team.wins,
        defaites: team.losses,
        points: team.points,
        tendance: team.trend as "up" | "down" | "stable"
      }));

      setParticipatingTeams(formattedTeams);
      setCurrentRanking(formattedTeams.sort((a, b) => (a.rank || 999) - (b.rank || 999)));

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données de l'événement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, registrationOpen: boolean) => {
    if (status === 'completed') {
      return <Badge className="bg-gray-600">Terminé</Badge>;
    }
    if (status === 'live') {
      return <Badge className="bg-red-600">En cours</Badge>;
    }
    if (registrationOpen) {
      return <Badge className="bg-green-600">Inscriptions ouvertes</Badge>;
    }
    return <Badge variant="outline">À venir</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white text-xl">
          <Loader2 className="w-8 h-8 animate-spin" />
          Chargement de l'événement...
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Événement introuvable</h1>
          <Link href="/evenements">
            <Button>Retour aux événements</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {eventData.title}
              </h1>
              <p className="text-xl text-gray-300">
                {eventData.subtitle}
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                <Link href={`/admin/evenements`}>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Gérer
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image principale avec informations */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="overflow-hidden bg-slate-800/50 border-slate-700">
          <div 
            className="h-80 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${eventData.image_url || '/placeholder-event.jpg'}')`
            }}
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {getStatusBadge(eventData.status, eventData.registration_open)}
            </div>

            {/* Informations principales */}
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold mb-2">{eventData.title}</h2>
              <p className="text-purple-300 font-medium mb-4">{eventData.game}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{eventData.teams_count} équipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{eventData.event_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{eventData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  <span>{eventData.prize_pool}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(eventData.event_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Tabs defaultValue="info" className="space-y-8">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="teams">Équipes ({participatingTeams.length})</TabsTrigger>
            <TabsTrigger value="ranking">Classement</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin">
                <Settings className="w-4 h-4 mr-2" />
                Administration
              </TabsTrigger>
            )}
          </TabsList>

          {/* Onglet Informations */}
          <TabsContent value="info" className="space-y-8">
            {/* À propos */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">À propos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{eventData.description || "Aucune description disponible."}</p>
              </CardContent>
            </Card>

            {/* Format du tournoi */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Format du tournoi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{eventData.format_description || "Format non spécifié."}</p>
              </CardContent>
            </Card>

            {/* Organisateur */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Organisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {eventData.organizer_logo && (
                    <img 
                      src={eventData.organizer_logo} 
                      alt={eventData.organizer_name}
                      className="w-16 h-16 rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-bold text-lg">{eventData.organizer_name || "Organisateur non spécifié"}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Équipes */}
          <TabsContent value="teams">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Équipes participantes</CardTitle>
              </CardHeader>
              <CardContent>
                {participatingTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune équipe inscrite</h3>
                    <p className="text-gray-400">
                      Les équipes participantes apparaîtront ici une fois inscrites.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {participatingTeams.map((team) => (
                      <div 
                        key={team.id}
                        className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <img 
                          src={team.logo} 
                          alt={team.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-team.png';
                          }}
                        />
                        <div>
                          <span className="text-white text-sm font-medium block">{team.name}</span>
                          {team.rank && (
                            <span className="text-gray-400 text-xs">#{team.rank}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Classement */}
          <TabsContent value="ranking">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Classement actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentRanking.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun classement disponible</h3>
                    <p className="text-gray-400">
                      Le classement sera disponible une fois que les matches auront commencé.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentRanking.map((team, index) => (
                      <div 
                        key={team.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                          index < 3 
                            ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-700/50' 
                            : 'bg-slate-700/30 border-slate-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-slate-600 text-white'
                          }`}>
                            {team.rank || index + 1}
                          </div>
                          
                          <img 
                            src={team.logo} 
                            alt={team.name}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-team.png';
                            }}
                          />
                          
                          <div>
                            <h4 className="text-white font-medium">{team.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{team.matchesJoues || 0} matchs</span>
                              <span>•</span>
                              <span className="text-green-400">{team.victoires || 0}V</span>
                              <span>•</span>
                              <span className="text-red-400">{team.defaites || 0}D</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-bold">{team.points || 0} pts</div>
                            <div className="flex items-center gap-1">
                              <TendanceIcon tendance={team.tendance || "stable"} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Administration (admin seulement) */}
          {isAdmin && (
            <TabsContent value="admin">
              <EventRankingManager 
                eventId={eventId} 
                eventTitle={eventData.title}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
} 