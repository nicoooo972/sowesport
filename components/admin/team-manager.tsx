"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users } from "lucide-react";

interface Team {
  name: string;
  logo: string;
  position: number;
  matches_played: number;
  wins: number;
  losses: number;
  points: number;
  trend: "up" | "down" | "stable";
}

interface TeamManagerProps {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
}

export default function TeamManager({ teams, onTeamsChange }: TeamManagerProps) {
  const addTeam = () => {
    const newTeam: Team = {
      name: "",
      logo: "",
      position: teams.length + 1,
      matches_played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      trend: "stable"
    };
    onTeamsChange([...teams, newTeam]);
  };

  const removeTeam = (index: number) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    // Réajuster les positions
    const reindexedTeams = updatedTeams.map((team, i) => ({
      ...team,
      position: i + 1
    }));
    onTeamsChange(reindexedTeams);
  };

  const updateTeam = (index: number, field: keyof Team, value: string | number) => {
    const updatedTeams = teams.map((team, i) => 
      i === index ? { ...team, [field]: value } : team
    );
    onTeamsChange(updatedTeams);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "bg-green-600";
      case "down": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Équipes participantes ({teams.length})
        </CardTitle>
        <Button onClick={addTeam} size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une équipe
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucune équipe ajoutée. Cliquez sur "Ajouter une équipe" pour commencer.</p>
          </div>
        ) : (
          teams.map((team, index) => (
            <div key={index} className="bg-slate-600/50 rounded-lg p-4 space-y-4">
              {/* En-tête avec position et bouton supprimer */}
              <div className="flex items-center justify-between">
                <Badge className={`${getTrendColor(team.trend)} text-white`}>
                  Équipe #{team.position}
                </Badge>
                <Button
                  onClick={() => removeTeam(index)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Nom de l'équipe *
                  </label>
                  <Input
                    value={team.name}
                    onChange={(e) => updateTeam(index, 'name', e.target.value)}
                    placeholder="Ex: Team Vitality"
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Logo (URL)
                  </label>
                  <Input
                    value={team.logo}
                    onChange={(e) => updateTeam(index, 'logo', e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Matches joués
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={team.matches_played}
                    onChange={(e) => updateTeam(index, 'matches_played', parseInt(e.target.value) || 0)}
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Victoires
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={team.wins}
                    onChange={(e) => updateTeam(index, 'wins', parseInt(e.target.value) || 0)}
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Défaites
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={team.losses}
                    onChange={(e) => updateTeam(index, 'losses', parseInt(e.target.value) || 0)}
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Points
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={team.points}
                    onChange={(e) => updateTeam(index, 'points', parseInt(e.target.value) || 0)}
                    className="bg-slate-500 border-slate-400 text-white"
                  />
                </div>
              </div>

              {/* Tendance */}
              <div>
                <label className="text-sm font-medium text-white block mb-1">
                  Tendance
                </label>
                <select
                  value={team.trend}
                  onChange={(e) => updateTeam(index, 'trend', e.target.value as "up" | "down" | "stable")}
                  className="w-full bg-slate-500 border-slate-400 text-white rounded px-3 py-2"
                >
                  <option value="stable">Stable</option>
                  <option value="up">En hausse ↗</option>
                  <option value="down">En baisse ↘</option>
                </select>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
} 