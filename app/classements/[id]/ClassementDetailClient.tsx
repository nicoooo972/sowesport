"use client";

import { ArrowLeft, Users, MapPin, Euro, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { RankingDetail, Team } from "./page";

// Composant pour afficher la tendance
function TrendIcon({ trend }: { trend: Team["trend"] }) {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    case "stable":
      return <Minus className="w-4 h-4 text-gray-500" />;
    default:
      return <Minus className="w-4 h-4 text-gray-500" />;
  }
}

interface ClassementDetailClientProps {
  ranking: RankingDetail;
}

export default function ClassementDetailClient({ ranking }: ClassementDetailClientProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en-ligne": return "bg-purple-600";
      case "termine": return "bg-gray-600";
      case "a-venir": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "en-ligne": return "En ligne";
      case "termine": return "Terminé";
      case "a-venir": return "À venir";
      default: return "Inconnu";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec bouton retour */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/classements">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-6 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux classements
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {ranking.title}
          </h1>
          <p className="text-xl text-gray-200">
            Classements détaillés
          </p>
        </div>
      </div>

      {/* Banner avec image et informations */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image
              src={ranking.bannerImage}
              alt={ranking.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className={`${getStatusColor(ranking.status)} text-white text-sm px-3 py-1`}>
                {getStatusText(ranking.status)}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{ranking.teams} équipes</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{ranking.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Euro className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{ranking.prize}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{ranking.date}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de classement */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Classement actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300 font-medium">Position</TableHead>
                    <TableHead className="text-gray-300 font-medium">Équipe</TableHead>
                    <TableHead className="text-gray-300 font-medium text-center">MJ</TableHead>
                    <TableHead className="text-gray-300 font-medium text-center">V</TableHead>
                    <TableHead className="text-gray-300 font-medium text-center">D</TableHead>
                    <TableHead className="text-gray-300 font-medium text-center">Points</TableHead>
                    <TableHead className="text-gray-300 font-medium text-center">Tendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.standings.map((team, index) => (
                    <TableRow key={team.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="text-white font-bold text-lg">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-700">
                            <Image
                              src={team.logo}
                              alt={`${team.name} logo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-white font-medium">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-white">
                        {team.matchesPlayed}
                      </TableCell>
                      <TableCell className="text-center text-green-400 font-medium">
                        {team.wins}
                      </TableCell>
                      <TableCell className="text-center text-red-400 font-medium">
                        {team.losses}
                      </TableCell>
                      <TableCell className="text-center text-white font-bold text-lg">
                        {team.points}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <TrendIcon trend={team.trend} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 