"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowUp, ArrowDown, Minus, Save, RefreshCw, Trophy } from "lucide-react";

interface EventTeam {
  id: number;
  event_id: string;
  team_name: string;
  team_logo?: string;
  position?: number;
  matches_played: number;
  wins: number;
  losses: number;
  points: number;
  trend: "up" | "down" | "stable";
}

interface EventRankingManagerProps {
  eventId: string;
  eventTitle: string;
}

export default function EventRankingManager({ eventId, eventTitle }: EventRankingManagerProps) {
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEventTeams();
  }, [eventId]);

  const loadEventTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_teams')
        .select('*')
        .eq('event_id', eventId)
        .order('position');

      if (error) throw error;

      setTeams(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des équipes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeamStats = (teamId: number, field: keyof EventTeam, value: any) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, [field]: value } : team
    ));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Recalculer les positions basées sur les points
      const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
      const updatedTeams = sortedTeams.map((team, index) => ({
        ...team,
        position: index + 1
      }));

      // Sauvegarder chaque équipe
      for (const team of updatedTeams) {
        const { error } = await supabase
          .from('event_teams')
          .update({
            position: team.position,
            matches_played: team.matches_played,
            wins: team.wins,
            losses: team.losses,
            points: team.points,
            trend: team.trend
          })
          .eq('id', team.id);

        if (error) throw error;
      }

      // Mettre à jour les classements généraux si les équipes existent dans la table teams
      await updateGlobalRankings(updatedTeams);

      setTeams(updatedTeams);
      
      toast({
        title: "Classement mis à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateGlobalRankings = async (eventTeams: EventTeam[]) => {
    for (const eventTeam of eventTeams) {
      // Vérifier si l'équipe existe dans la table globale
      const { data: globalTeam, error: findError } = await supabase
        .from('teams')
        .select('*')
        .eq('name', eventTeam.team_name)
        .single();

      if (globalTeam && !findError) {
        // Mettre à jour les stats globales (ajouter aux stats existantes)
        const { error: updateError } = await supabase
          .from('teams')
          .update({
            matches_played: globalTeam.matches_played + eventTeam.matches_played,
            wins: globalTeam.wins + eventTeam.wins,
            losses: globalTeam.losses + eventTeam.losses,
            points: globalTeam.points + eventTeam.points,
            updated_at: new Date().toISOString()
          })
          .eq('id', globalTeam.id);

        if (updateError) {
          console.error('Erreur mise à jour classement global:', updateError);
        }
      }
    }

    // Recalculer les positions globales
    await recalculateGlobalRankings();
  };

  const recalculateGlobalRankings = async () => {
    const { data: allTeams, error } = await supabase
      .from('teams')
      .select('*')
      .order('points', { ascending: false });

    if (error) return;

    // Mettre à jour les positions
    for (let i = 0; i < allTeams.length; i++) {
      await supabase
        .from('teams')
        .update({ rank_position: i + 1 })
        .eq('id', allTeams[i].id);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="w-4 h-4 text-green-400" />;
      case "down": return <ArrowDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "bg-green-600";
      case "down": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-white">Chargement des équipes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Gestion du classement - {eventTitle}
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={loadEventTeams} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={saveChanges} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Aucune équipe trouvée pour cet événement.
          </div>
        ) : (
          <div className="space-y-4">
            {teams
              .sort((a, b) => (a.position || 999) - (b.position || 999))
              .map((team) => (
                <div key={team.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Position et équipe */}
                    <div className="flex items-center gap-3">
                      <Badge className={`${getTrendColor(team.trend)} text-white`}>
                        #{team.position || '?'}
                      </Badge>
                      {getTrendIcon(team.trend)}
                      <div>
                        <h4 className="text-white font-medium">{team.team_name}</h4>
                      </div>
                    </div>

                    {/* Matches joués */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Matches</label>
                      <Input
                        type="number"
                        min="0"
                        value={team.matches_played}
                        onChange={(e) => updateTeamStats(team.id, 'matches_played', parseInt(e.target.value) || 0)}
                        className="bg-slate-600 border-slate-500 text-white h-8"
                      />
                    </div>

                    {/* Victoires */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Victoires</label>
                      <Input
                        type="number"
                        min="0"
                        value={team.wins}
                        onChange={(e) => updateTeamStats(team.id, 'wins', parseInt(e.target.value) || 0)}
                        className="bg-slate-600 border-slate-500 text-white h-8"
                      />
                    </div>

                    {/* Défaites */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Défaites</label>
                      <Input
                        type="number"
                        min="0"
                        value={team.losses}
                        onChange={(e) => updateTeamStats(team.id, 'losses', parseInt(e.target.value) || 0)}
                        className="bg-slate-600 border-slate-500 text-white h-8"
                      />
                    </div>

                    {/* Points */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Points</label>
                      <Input
                        type="number"
                        min="0"
                        value={team.points}
                        onChange={(e) => updateTeamStats(team.id, 'points', parseInt(e.target.value) || 0)}
                        className="bg-slate-600 border-slate-500 text-white h-8"
                      />
                    </div>

                    {/* Tendance */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tendance</label>
                      <select
                        value={team.trend}
                        onChange={(e) => updateTeamStats(team.id, 'trend', e.target.value as "up" | "down" | "stable")}
                        className="bg-slate-600 border-slate-500 text-white rounded h-8 w-full text-sm"
                      >
                        <option value="stable">Stable</option>
                        <option value="up">En hausse</option>
                        <option value="down">En baisse</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
} 