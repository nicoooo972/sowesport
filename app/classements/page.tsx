"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Trophy, 
  Users, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Filter,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Medal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Types pour les classements
interface Ranking {
  id: string;
  title: string;
  game: string;
  teams: number;
  status: "en-cours" | "termine" | "a-venir";
  lastUpdate: string;
  location?: string;
  prize?: string;
  participants?: number;
  startDate?: string;
  endDate?: string;
}

// Données mock pour les classements
const rankings: Ranking[] = [
  {
    id: "lfl-spring-split",
    title: "LFL Spring Split 2025",
    game: "League of Legends",
    teams: 16,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025",
    location: "Paris",
    prize: "150,000€",
    participants: 320,
    startDate: "15 Janvier",
    endDate: "28 Mars"
  },
  {
    id: "valorant-championship",
    title: "Valorant Champions Tour France",
    game: "Valorant", 
    teams: 24,
    status: "en-cours",
    lastUpdate: "18 Janvier 2025",
    location: "Lyon",
    prize: "75,000€",
    participants: 480,
    startDate: "10 Janvier",
    endDate: "15 Février"
  },
  {
    id: "cs2-masters",
    title: "CS2 Masters France",
    game: "Counter-Strike 2",
    teams: 12,
    status: "a-venir", 
    lastUpdate: "17 Janvier 2025",
    location: "Bordeaux",
    prize: "50,000€",
    participants: 240,
    startDate: "1 Février",
    endDate: "20 Février"
  },
  {
    id: "fifa-elite",
    title: "FIFA Elite Championship",
    game: "FIFA 25",
    teams: 32,
    status: "termine",
    lastUpdate: "16 Janvier 2025", 
    location: "Marseille",
    prize: "25,000€",
    participants: 128,
    startDate: "5 Janvier",
    endDate: "15 Janvier"
  },
  {
    id: "rocket-league-grand-prix",
    title: "Rocket League Grand Prix",
    game: "Rocket League",
    teams: 20,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025",
    location: "Nice",
    prize: "40,000€",
    participants: 300,
    startDate: "12 Janvier",
    endDate: "25 Février"
  }
];

// Composant pour les cartes de classement
function RankingCard({ ranking, index }: { ranking: Ranking, index: number }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "en-cours": 
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/classements/${ranking.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Icône avec animation */}
                <motion.div 
                  className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                
                {/* Informations du tournoi */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {ranking.title}
                  </h3>
                  <p className="text-muted-foreground font-medium">{ranking.game}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{ranking.location}</span>
                    </div>
                    {ranking.prize && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span className="font-medium text-primary">{ranking.prize}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations droite */}
              <div className="flex items-center gap-6">
                {/* Statistiques */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Équipes</p>
                    <p className="font-bold text-lg text-foreground">{ranking.teams}</p>
                  </div>

                  {ranking.participants && (
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">Joueurs</p>
                      <p className="font-bold text-lg text-foreground">{ranking.participants}</p>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Période</p>
                    <p className="font-medium text-sm text-foreground">
                      {ranking.startDate} - {ranking.endDate}
                    </p>
                  </div>
                </div>

                {/* Statut */}
                <div className="flex flex-col items-center gap-2">
                  <Badge 
                    className={`${statusConfig.color} flex items-center gap-1 px-3 py-1`}
                    variant="outline"
                  >
                    {statusConfig.icon}
                    <span className="font-medium">{statusConfig.text}</span>
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    MAJ: {ranking.lastUpdate}
                  </p>
                </div>

                {/* Flèche avec animation */}
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function ClassementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [gameFilter, setGameFilter] = useState("tous");

  const recentSearches = ["LFL 2025", "Valorant Tour", "CS2 Masters"];

  // Filtrer les classements
  const filteredRankings = useMemo(() => {
    return rankings.filter(ranking => {
      const matchesSearch = ranking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ranking.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ranking.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "tous" || ranking.status === statusFilter;
      const matchesGame = gameFilter === "tous" || ranking.game.toLowerCase().includes(gameFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesGame;
    });
  }, [searchQuery, statusFilter, gameFilter]);

  const games = ["tous", "League of Legends", "Valorant", "Counter-Strike 2", "FIFA 25", "Rocket League"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-20 pb-16 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm font-medium mb-4">
                🏆 Compétitions Esport France
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Classements & Tournois
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Suivez les performances des meilleures équipes françaises et découvrez 
                les tournois esport les plus prestigieux du moment.
              </p>
            </div>

            {/* Stats rapides */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{rankings.length}</p>
                <p className="text-sm text-muted-foreground">Tournois actifs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {rankings.reduce((acc, r) => acc + r.teams, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Équipes participantes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {rankings.filter(r => r.status === "en-cours").length}
                </p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Barre de recherche */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un tournoi, jeu ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-center bg-background/50 border-muted focus:border-primary transition-colors"
                />
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap justify-center gap-3">
                {/* Filtre statut */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "tous", label: "Tous", icon: <Filter className="h-3 w-3" /> },
                    { key: "en-cours", label: "En cours", icon: <TrendingUp className="h-3 w-3" /> },
                    { key: "a-venir", label: "À venir", icon: <Clock className="h-3 w-3" /> },
                    { key: "termine", label: "Terminés", icon: <Medal className="h-3 w-3" /> }
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={statusFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(filter.key)}
                      className="gap-1.5"
                    >
                      {filter.icon}
                      {filter.label}
                    </Button>
                  ))}
                </div>

                {/* Filtre jeux */}
                <div className="flex flex-wrap gap-2">
                  {games.slice(0, 4).map((game) => (
                    <Button
                      key={game}
                      variant={gameFilter === game ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGameFilter(game)}
                      className="capitalize"
                    >
                      {game === "tous" ? "Tous les jeux" : game}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recherches récentes */}
              {searchQuery === "" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-3">Recherches populaires :</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <p className="text-muted-foreground text-center">
            {filteredRankings.length} tournoi{filteredRankings.length > 1 ? 's' : ''} trouvé{filteredRankings.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredRankings.map((ranking, index) => (
              <RankingCard key={ranking.id} ranking={ranking} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {filteredRankings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Aucun tournoi trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("tous");
                  setGameFilter("tous");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 