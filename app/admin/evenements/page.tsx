"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Users, MapPin, Euro, Clock, Shield, ArrowLeft, Edit, Trash2, Eye, Trophy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";
import EventRankingManager from "@/components/admin/event-ranking-manager";
import TeamManager from "@/components/admin/team-manager";

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

interface EventForm {
  title: string;
  subtitle: string;
  description: string;
  game: string;
  teams_count: number;
  prize_pool: string;
  location: string;
  full_address: string;
  city: string;
  postal_code: string;
  country: string;
  venue_name: string;
  latitude: string;
  longitude: string;
  event_date: string;
  event_time: string;
  status: string;
  image_url: string;
  format_description: string;
  organizer_name: string;
  organizer_logo: string;
  registration_open: boolean;
}

const initialForm: EventForm = {
  title: "",
  subtitle: "",
  description: "",
  game: "",
  teams_count: 0,
  prize_pool: "",
  location: "",
  full_address: "",
  city: "",
  postal_code: "",
  country: "France",
  venue_name: "",
  latitude: "",
  longitude: "",
  event_date: "",
  event_time: "",
  status: "upcoming",
  image_url: "",
  format_description: "",
  organizer_name: "",
  organizer_logo: "",
  registration_open: true
};

export default function AdminEvenementsPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [formData, setFormData] = useState<EventForm>(initialForm);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/evenements");
    }
  }, [isAdmin, adminLoading, router]);

  // Charger tous les événements
  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin]);

  // Charger les événements en attente (simulé pour l'instant)
  useEffect(() => {
    // TODO: Implémenter plus tard quand on aura la table des demandes
    setPendingEvents([]);
  }, []);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements.",
        variant: "destructive",
      });
    } finally {
      setEventsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    try {

      if (editingEvent) {
        // Modification d'un événement existant
        const { error } = await supabase
          .from('events')
          .update({
            ...formData,
            teams_count: Number(formData.teams_count),
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);

        if (error) throw error;

        // Mettre à jour les équipes
        await updateEventTeams(editingEvent.id, teamsData);

        toast({
          title: "Événement modifié !",
          description: "L'événement a été mis à jour avec succès.",
        });
      } else {
        // Création d'un nouvel événement
        const eventData = {
          ...formData,
          id: `event_${Date.now()}`,
          teams_count: Number(formData.teams_count),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;

        // Ajouter les équipes
        await updateEventTeams(eventData.id, teamsData);

        toast({
          title: "Événement créé !",
          description: "L'événement a été ajouté avec succès.",
        });
      }

      setFormData(initialForm);
      setEditingEvent(null);
      setTeamsData([]);
      fetchEvents(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: `Impossible de ${editingEvent ? 'modifier' : 'créer'} l'événement.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEventTeams = async (eventId: string, teams: any[]) => {
    // Supprimer les anciennes équipes
    await supabase
      .from('event_teams')
      .delete()
      .eq('event_id', eventId);

    // Ajouter les nouvelles équipes
    if (teams.length > 0) {
      const teamsToInsert = teams.map((team, index) => ({
        event_id: eventId,
        team_name: team.name || `Équipe ${index + 1}`,
        team_logo: team.logo || null,
        position: team.position || index + 1,
        matches_played: team.matches_played || 0,
        wins: team.wins || 0,
        losses: team.losses || 0,
        points: team.points || 0,
        trend: team.trend || 'stable'
      }));

      const { error } = await supabase
        .from('event_teams')
        .insert(teamsToInsert);

      if (error) throw error;
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      subtitle: event.subtitle || "",
      description: event.description || "",
      game: event.game,
      teams_count: event.teams_count,
      prize_pool: event.prize_pool || "",
      location: event.location || "",
      full_address: (event as any).full_address || "",
      city: (event as any).city || "",
      postal_code: (event as any).postal_code || "",
      country: (event as any).country || "France",
      venue_name: (event as any).venue_name || "",
      latitude: (event as any).latitude?.toString() || "",
      longitude: (event as any).longitude?.toString() || "",
      event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : "",
      event_time: event.event_time || "",
      status: event.status,
      image_url: event.image_url || "",
      format_description: event.format_description || "",
      organizer_name: event.organizer_name || "",
      organizer_logo: event.organizer_logo || "",
      registration_open: event.registration_open
    });
    
    // Charger les équipes de l'événement
    loadEventTeams(event.id);
  };

  const loadEventTeams = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_teams')
        .select('*')
        .eq('event_id', eventId)
        .order('position');

      if (error) throw error;

      const formattedTeams = (data || []).map(team => ({
        name: team.team_name,
        logo: team.team_logo || '',
        position: team.position,
        matches_played: team.matches_played,
        wins: team.wins,
        losses: team.losses,
        points: team.points,
        trend: team.trend
      }));

      setTeamsData(formattedTeams);
    } catch (error) {
      console.error('Erreur lors du chargement des équipes:', error);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Événement supprimé !",
        description: "L'événement a été supprimé avec succès.",
      });

      fetchEvents(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date non définie";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string, registrationOpen: boolean) => {
    if (status === 'completed') {
      return <Badge variant="secondary">Terminé</Badge>;
    }
    if (status === 'live') {
      return <Badge className="bg-red-600">En cours</Badge>;
    }
    if (registrationOpen) {
      return <Badge className="bg-green-600">Ouvert</Badge>;
    }
    return <Badge variant="outline">À venir</Badge>;
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Vérification des permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/evenements">
              <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-emerald-400" />
                Administration des Événements
              </h1>
              <p className="text-gray-300">Gérez les événements de la plateforme</p>
            </div>
          </div>

          <Tabs defaultValue="manage" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="manage" className="data-[state=active]:bg-purple-600">
                <Eye className="w-4 h-4 mr-2" />
                Gérer les événements ({events.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="data-[state=active]:bg-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                {editingEvent ? 'Modifier' : 'Ajouter'} un événement
              </TabsTrigger>
              <TabsTrigger value="rankings" className="data-[state=active]:bg-orange-600">
                <Trophy className="w-4 h-4 mr-2" />
                Classements
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
                <Clock className="w-4 h-4 mr-2" />
                Demandes en attente ({pendingEvents.length})
              </TabsTrigger>
            </TabsList>

            {/* Onglet Gérer les événements */}
            <TabsContent value="manage">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Événements existants</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-white">Chargement des événements...</div>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Aucun événement</h3>
                      <p className="text-gray-400">Commencez par créer votre premier événement.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((event) => (
                        <Card key={event.id} className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                <p className="text-purple-400">{event.game}</p>
                                {event.subtitle && (
                                  <p className="text-gray-400 text-sm">{event.subtitle}</p>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                {getStatusBadge(event.status, event.registration_open)}
                                <span className="text-gray-300 text-sm">
                                  {formatDate(event.event_date)}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {event.teams_count} équipes
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(event)}
                                  className="flex-1 border-slate-600 hover:bg-slate-600"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Modifier
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-white">
                                        Supprimer l'événement
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-300">
                                        Êtes-vous sûr de vouloir supprimer "{event.title}" ? 
                                        Cette action est irréversible.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="border-slate-600 hover:bg-slate-700">
                                        Annuler
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(event.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Supprimer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Ajouter/Modifier un événement */}
            <TabsContent value="add">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingEvent ? `Modifier "${editingEvent.title}"` : 'Créer un nouvel événement'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informations principales */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-white font-medium block mb-2">Titre *</label>
                          <Input
                            required
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: LFL Spring Split"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Sous-titre</label>
                          <Input
                            value={formData.subtitle}
                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: Championnat français officiel"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Jeu *</label>
                          <Select value={formData.game} onValueChange={(value) => handleInputChange('game', value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Sélectionner un jeu" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="League of Legends">League of Legends</SelectItem>
                              <SelectItem value="Valorant">Valorant</SelectItem>
                              <SelectItem value="Counter-Strike 2">Counter-Strike 2</SelectItem>
                              <SelectItem value="Rocket League">Rocket League</SelectItem>
                              <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                              <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Nombre d'équipes *</label>
                          <Input
                            type="number"
                            required
                            min="1"
                            value={formData.teams_count}
                            onChange={(e) => handleInputChange('teams_count', parseInt(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Prize Pool</label>
                          <Input
                            value={formData.prize_pool}
                            onChange={(e) => handleInputChange('prize_pool', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: 100 000 €"
                          />
                        </div>
                      </div>

                      {/* Détails de l'événement */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-white font-medium block mb-2">Localisation (courte)</label>
                          <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: Paris, En ligne"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Nom du lieu</label>
                          <Input
                            value={formData.venue_name}
                            onChange={(e) => handleInputChange('venue_name', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: Accor Arena, Palais des Sports"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Adresse complète</label>
                          <Input
                            value={formData.full_address}
                            onChange={(e) => handleInputChange('full_address', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: 8 Boulevard de Bercy, 75012 Paris"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-white font-medium block mb-2">Ville</label>
                            <Input
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: Paris"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium block mb-2">Code postal</label>
                            <Input
                              value={formData.postal_code}
                              onChange={(e) => handleInputChange('postal_code', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: 75012"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Pays</label>
                          <Input
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: France"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-white font-medium block mb-2">Latitude</label>
                            <Input
                              type="number"
                              step="any"
                              value={formData.latitude}
                              onChange={(e) => handleInputChange('latitude', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: 48.8399"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium block mb-2">Longitude</label>
                            <Input
                              type="number"
                              step="any"
                              value={formData.longitude}
                              onChange={(e) => handleInputChange('longitude', e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: 2.3781"
                            />
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 mt-2">
                          💡 Astuce: Vous pouvez obtenir les coordonnées GPS en recherchant l'adresse sur Google Maps et en cliquant sur le lieu.
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Date de l'événement</label>
                          <Input
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => handleInputChange('event_date', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Heure</label>
                          <Input
                            value={formData.event_time}
                            onChange={(e) => handleInputChange('event_time', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: 18h00"
                          />
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">Statut</label>
                          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="upcoming">À venir</SelectItem>
                              <SelectItem value="live">En cours</SelectItem>
                              <SelectItem value="completed">Terminé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-white font-medium block mb-2">URL de l'image</label>
                          <Input
                            value={formData.image_url}
                            onChange={(e) => handleInputChange('image_url', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-white font-medium block mb-2">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Description de l'événement..."
                        rows={4}
                      />
                    </div>

                    {/* Format de tournoi */}
                    <div>
                      <label className="text-white font-medium block mb-2">Format du tournoi</label>
                      <Textarea
                        value={formData.format_description}
                        onChange={(e) => handleInputChange('format_description', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Description du format (bracket, groupes, etc.)..."
                        rows={3}
                      />
                    </div>

                    {/* Gestionnaire d'équipes */}
                    <div className="col-span-full">
                      <TeamManager 
                        teams={teamsData}
                        onTeamsChange={setTeamsData}
                      />
                    </div>

                    {/* Organisateur */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-white font-medium block mb-2">Nom de l'organisateur</label>
                        <Input
                          value={formData.organizer_name}
                          onChange={(e) => handleInputChange('organizer_name', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Ex: Riot Games"
                        />
                      </div>
                      <div>
                        <label className="text-white font-medium block mb-2">Logo de l'organisateur</label>
                        <Input
                          value={formData.organizer_logo}
                          onChange={(e) => handleInputChange('organizer_logo', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {loading ? 
                          (editingEvent ? "Modification..." : "Création...") : 
                          (editingEvent ? "Modifier l'événement" : "Créer l'événement")
                        }
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData(initialForm);
                          setEditingEvent(null);
                          setTeamsData([]);
                        }}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        {editingEvent ? "Annuler" : "Réinitialiser"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Classements */}
            <TabsContent value="rankings">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Gestion des classements</CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Aucun événement disponible</h3>
                      <p className="text-gray-400">
                        Créez d'abord des événements pour gérer leurs classements.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {events.map((event) => (
                        <EventRankingManager 
                          key={event.id}
                          eventId={event.id} 
                          eventTitle={event.title}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Demandes en attente */}
            <TabsContent value="pending">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Demandes d'événements en attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune demande en attente</h3>
                    <p className="text-gray-400">
                      Les demandes de création d'événements apparaîtront ici quand cette fonctionnalité sera activée.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 