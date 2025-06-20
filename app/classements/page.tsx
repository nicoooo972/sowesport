"use client";

import { useState } from "react";
import { Search, Trophy, Users, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}

// Données mock pour les classements
const rankings: Ranking[] = [
  {
    id: "lfl-spring-split",
    title: "LFL Spring Split",
    game: "League of legends",
    teams: 16,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025",
    location: "Paris"
  },
  {
    id: "lfl-spring-split-2",
    title: "LFL Spring Split",
    game: "League of legends", 
    teams: 16,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025",
    location: "Lyon"
  },
  {
    id: "lfl-spring-split-3",
    title: "LFL Spring Split",
    game: "League of legends",
    teams: 16,
    status: "en-cours", 
    lastUpdate: "19 Janvier 2025",
    location: "Bordeaux"
  },
  {
    id: "lfl-spring-split-4",
    title: "LFL Spring Split",
    game: "League of legends",
    teams: 16,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025", 
    location: "Marseille"
  },
  {
    id: "lfl-spring-split-5",
    title: "LFL Spring Split", 
    game: "League of legends",
    teams: 16,
    status: "en-cours",
    lastUpdate: "19 Janvier 2025",
    location: "Nice"
  }
];

// Composant pour les cartes de classement
function RankingCard({ ranking }: { ranking: Ranking }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en-cours": return "bg-green-600";
      case "termine": return "bg-gray-600";
      case "a-venir": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "en-cours": return "En cours";
      case "termine": return "Terminé";
      case "a-venir": return "À venir";
      default: return "Inconnu";
    }
  };

  return (
    <Link href={`/classements/${ranking.id}`}>
      <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icône trophée */}
              <div className="p-3 bg-purple-600 rounded-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              
              {/* Informations du tournoi */}
              <div>
                <h3 className="text-white font-bold text-xl">{ranking.title}</h3>
                <p className="text-purple-400 font-medium">{ranking.game}</p>
              </div>
            </div>

            {/* Informations droite */}
            <div className="flex items-center gap-8">
              {/* Équipes */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">Équipes</p>
                <p className="text-white font-bold text-lg">{ranking.teams}</p>
              </div>

              {/* Statut */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">Statut</p>
                <Badge className={`${getStatusColor(ranking.status)} text-white`}>
                  {getStatusText(ranking.status)}
                </Badge>
              </div>

              {/* Mise à jour */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">Mise à jour</p>
                <p className="text-white font-medium">{ranking.lastUpdate}</p>
              </div>

              {/* Flèche */}
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ClassementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [locationFilter, setLocationFilter] = useState("lieu");
  const [currentPage, setCurrentPage] = useState(1);

  const recentSearches = ["LFL 2025", "Valorant Tour", "ESL Pro League"];

  // Filtrer les classements
  const filteredRankings = rankings.filter(ranking => {
    const matchesSearch = ranking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ranking.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "tous" || ranking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Classements
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les classements esport en France !
          </p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Barre de recherche */}
              <div className="relative lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un tournois..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "tous" ? "default" : "outline"}
                  className={statusFilter === "tous" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setStatusFilter("tous")}
                >
                  Tous
                </Button>
                <Button
                  variant={statusFilter === "en-cours" ? "default" : "outline"}
                  className={statusFilter === "en-cours" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setStatusFilter("en-cours")}
                >
                  En cours
                </Button>
                <Button
                  variant={statusFilter === "termine" ? "default" : "outline"}
                  className={statusFilter === "termine" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setStatusFilter("termine")}
                >
                  Terminés
                </Button>
              </div>

              {/* Filtre lieu */}
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Lieu
              </Button>
            </div>

            {/* Recherches récentes */}
            <div>
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

      {/* Liste des classements */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="space-y-4">
          {filteredRankings.map((ranking) => (
            <RankingCard key={ranking.id} ranking={ranking} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Précédent
          </Button>
          
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={
                currentPage === page
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-slate-600 text-white hover:bg-slate-700"
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
            disabled={currentPage === 3}
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
} 