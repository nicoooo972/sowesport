"use client";

import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Euro, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trophy,
  Target,
  BarChart3,
  Percent,
  Crown,
  Medal,
  Award,
  Sparkles,
  Clock,
  Gamepad2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RankingDetail, Team } from "./page";

// Composant pour afficher la tendance avec animation
function TrendIcon({ trend }: { trend: Team["trend"] }) {
  const config = {
    up: { 
      icon: <TrendingUp className="w-4 h-4" />, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    down: { 
      icon: <TrendingDown className="w-4 h-4" />, 
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    stable: { 
      icon: <Minus className="w-4 h-4" />, 
      color: "text-slate-500",
      bg: "bg-slate-500/10"
    }
  };

  const currentConfig = config[trend];

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`p-1.5 rounded-full ${currentConfig.bg} ${currentConfig.color}`}
    >
      {currentConfig.icon}
    </motion.div>
  );
}

// Composant pour la position avec médaille
function PositionBadge({ position }: { position: number }) {
  const getMedalConfig = (pos: number) => {
    switch (pos) {
      case 1:
        return { 
          icon: <Crown className="w-4 h-4" />, 
          bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
          text: "text-yellow-50"
        };
      case 2:
        return { 
          icon: <Medal className="w-4 h-4" />, 
          bg: "bg-gradient-to-r from-slate-400 to-slate-500",
          text: "text-slate-50"
        };
      case 3:
        return { 
          icon: <Award className="w-4 h-4" />, 
          bg: "bg-gradient-to-r from-amber-600 to-amber-700",
          text: "text-amber-50"
        };
      default:
        return { 
          icon: null, 
          bg: "bg-muted",
          text: "text-muted-foreground"
        };
    }
  };

  const config = getMedalConfig(position);

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.text} font-bold`}>
      {config.icon || position}
    </div>
  );
}

interface ClassementDetailClientProps {
  ranking: RankingDetail;
}

export default function ClassementDetailClient({ ranking }: ClassementDetailClientProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "en-ligne": 
        return { 
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", 
          text: "En cours",
          icon: <TrendingUp className="h-3 w-3" />
        };
      case "termine": 
        return { 
          color: "bg-slate-500/10 text-slate-600 border-slate-200", 
          text: "Terminé",
          icon: <Medal className="h-3 w-3" />
        };
      case "a-venir": 
        return { 
          color: "bg-blue-500/10 text-blue-600 border-blue-200", 
          text: "À venir",
          icon: <Clock className="h-3 w-3" />
        };
      default: 
        return { 
          color: "bg-slate-500/10 text-slate-600 border-slate-200", 
          text: "Inconnu",
          icon: <Target className="h-3 w-3" />
        };
    }
  };

  const statusConfig = getStatusConfig(ranking.status);

  // Calculs pour les statistiques
  const totalMatches = ranking.standings.reduce((acc, team) => acc + team.matchesPlayed, 0);
  const avgWinRate = ranking.standings.length > 0 
    ? ranking.standings.reduce((acc, team) => acc + (team.wins / team.matchesPlayed * 100), 0) / ranking.standings.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-20 pb-8 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/classements">
              <Button 
                variant="ghost" 
                className="hover:bg-muted mb-6 p-0 h-auto font-normal group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour aux classements
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
                             <Badge variant="secondary" className="text-sm font-medium">
                 <Gamepad2 className="w-3 h-3 mr-1" />
                 {ranking.game}
               </Badge>
              <Badge 
                className={`${statusConfig.color} flex items-center gap-1`}
                variant="outline"
              >
                {statusConfig.icon}
                <span className="font-medium">{statusConfig.text}</span>
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {ranking.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              Classements détaillés et performances des équipes
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Banner */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <Card className="overflow-hidden border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
          <div className="relative h-64 md:h-80">
            <Image
              src={ranking.bannerImage}
              alt={ranking.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Floating stats */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium opacity-90">Équipes</span>
                  </div>
                  <p className="text-xl font-bold">{ranking.teams}</p>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium opacity-90">Matchs</span>
                  </div>
                  <p className="text-xl font-bold">{totalMatches}</p>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium opacity-90">Prix</span>
                  </div>
                  <p className="text-xl font-bold">{ranking.prize}</p>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium opacity-90">WR Moy.</span>
                  </div>
                  <p className="text-xl font-bold">{avgWinRate.toFixed(0)}%</p>
                </motion.div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{ranking.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">{ranking.date}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Podium Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">🏆 Podium</h2>
          <p className="text-muted-foreground">Les 3 meilleures équipes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ranking.standings.slice(0, 3).map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className={`${index === 0 ? 'md:order-2 md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <Card className={`text-center border-0 shadow-lg ${
                index === 0 ? 'bg-gradient-to-b from-yellow-500/10 to-yellow-600/5 ring-2 ring-yellow-500/20' :
                index === 1 ? 'bg-gradient-to-b from-slate-400/10 to-slate-500/5 ring-2 ring-slate-400/20' :
                'bg-gradient-to-b from-amber-600/10 to-amber-700/5 ring-2 ring-amber-600/20'
              }`}>
                <CardContent className="pt-6 pb-6">
                  <div className="flex justify-center mb-4">
                    <PositionBadge position={index + 1} />
                  </div>
                  
                  <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-background shadow-lg">
                    <AvatarImage src={team.logo} alt={team.name} />
                    <AvatarFallback className="text-lg font-bold">
                      {team.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-bold text-lg mb-2">{team.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points:</span>
                      <span className="font-bold text-primary">{team.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">V/D:</span>
                      <span className="font-medium">{team.wins}/{team.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Winrate:</span>
                      <span className="font-medium text-emerald-600">
                        {((team.wins / team.matchesPlayed) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-3">
                    <TrendIcon trend={team.trend} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tableau de classement complet */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 pb-16"
      >
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="w-6 h-6 text-primary" />
              Classement complet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Position</TableHead>
                    <TableHead className="font-semibold">Équipe</TableHead>
                    <TableHead className="text-center font-semibold">MJ</TableHead>
                    <TableHead className="text-center font-semibold">V</TableHead>
                    <TableHead className="text-center font-semibold">D</TableHead>
                    <TableHead className="text-center font-semibold">Points</TableHead>
                    <TableHead className="text-center font-semibold">WR</TableHead>
                    <TableHead className="text-center font-semibold">Forme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {ranking.standings.map((team, index) => (
                      <motion.tr 
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                        className="hover:bg-muted/50 transition-colors border-b"
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <PositionBadge position={index + 1} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-background shadow-md">
                              <AvatarImage src={team.logo} alt={team.name} />
                              <AvatarFallback className="font-bold">
                                {team.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{team.name}</p>
                              {index < 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  {index === 0 ? 'Leader' : index === 1 ? '2ème' : '3ème'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {team.matchesPlayed}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                            {team.wins}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                            {team.losses}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-lg text-primary">
                            {team.points}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-emerald-600">
                            {((team.wins / team.matchesPlayed) * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <TrendIcon trend={team.trend} />
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 