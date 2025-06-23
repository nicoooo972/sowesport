"use client";

import { useState } from "react";
import { Search, Calendar, Clock, User, Play, Eye, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Types pour les interviews
interface Interview {
  id: string;
  title: string;
  description: string;
  interviewee: {
    name: string;
    role: string;
    team?: string;
    avatar: string;
  };
  category: string;
  duration: string;
  publishedAt: string;
  views: number;
  thumbnail: string;
  isVideo: boolean;
  isFeatured: boolean;
  tags: string[];
}

// Données mock pour les interviews
const interviews: Interview[] = [
  {
    id: "kcorp-cabochard-interview",
    title: "Cabochard nous parle de la nouvelle saison LFL",
    description: "Le toplaner de Karmine Corp revient sur les objectifs de l'équipe pour cette saison et sa préparation personnelle.",
    interviewee: {
      name: "Cabochard",
      role: "Toplaner",
      team: "Karmine Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "League of Legends",
    duration: "15 min",
    publishedAt: "Il y a 2 jours",
    views: 12500,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isVideo: true,
    isFeatured: true,
    tags: ["interview", "lfl", "karmine-corp"]
  },
  {
    id: "vitality-coach-interview",
    title: "Le coach de Vitality dévoile sa stratégie",
    description: "Entretien exclusif avec le staff technique de Team Vitality sur leur approche tactique pour les championnats européens.",
    interviewee: {
      name: "YamatoCannon",
      role: "Head Coach",
      team: "Team Vitality",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "League of Legends",
    duration: "22 min",
    publishedAt: "Il y a 5 jours",
    views: 8900,
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isVideo: true,
    isFeatured: false,
    tags: ["interview", "coaching", "vitality"]
  },
  {
    id: "scream-valorant-tips",
    title: "ScreaM partage ses secrets sur Valorant",
    description: "L'ancien joueur CS:GO nous livre ses conseils pour performer sur Valorant et parle de l'évolution de la scène FPS.",
    interviewee: {
      name: "ScreaM",
      role: "Pro Player",
      team: "Team Liquid",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Valorant",
    duration: "18 min",
    publishedAt: "Il y a 1 semaine",
    views: 15600,
    thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isVideo: false,
    isFeatured: true,
    tags: ["interview", "valorant", "tips"]
  },
  {
    id: "analyst-esport-evolution",
    title: "L'évolution de l'esport français avec un expert",
    description: "Discussion approfondie avec un analyste reconnu sur les tendances du marché esport français et ses perspectives d'avenir.",
    interviewee: {
      name: "Alexandre Müller",
      role: "Analyste Esport",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Industrie",
    duration: "35 min",
    publishedAt: "Il y a 2 semaines",
    views: 5400,
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isVideo: false,
    isFeatured: false,
    tags: ["interview", "industrie", "analyse"]
  },
  {
    id: "rocket-league-champion",
    title: "Le champion français de Rocket League se confie",
    description: "Rencontre avec le joueur qui a mené l'équipe de France vers la victoire internationale et ses projets futurs.",
    interviewee: {
      name: "Fairy Peak",
      role: "Pro Player",
      team: "Dignitas",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Rocket League",
    duration: "12 min",
    publishedAt: "Il y a 3 semaines",
    views: 7800,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isVideo: true,
    isFeatured: false,
    tags: ["interview", "rocket-league", "champion"]
  }
];

// Composant pour les cartes d'interview
function InterviewCard({ interview }: { interview: Interview }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Industrie": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Link href={`/interviews/${interview.id}`}>
      <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={interview.thumbnail}
            alt={interview.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            {interview.isFeatured && (
              <Badge className="bg-yellow-600 text-white">
                ⭐ À la une
              </Badge>
            )}
            <Badge className={`${getCategoryColor(interview.category)} text-white`}>
              {interview.category}
            </Badge>
          </div>

          {/* Type d'interview */}
          <div className="absolute top-4 right-4">
            {interview.isVideo ? (
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Play className="w-3 h-3" />
                Vidéo
              </div>
            ) : (
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                Article
              </div>
            )}
          </div>

          {/* Durée */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {interview.duration}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar de l'interviewé */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              <Image
                src={interview.interviewee.avatar}
                alt={`${interview.interviewee.name} avatar`}
                fill
                className="object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                {interview.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {interview.description}
              </p>

              {/* Informations sur l'interviewé */}
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">{interview.interviewee.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{interview.interviewee.role}</span>
                {interview.interviewee.team && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-purple-400">{interview.interviewee.team}</span>
                  </>
                )}
              </div>

              {/* Métadonnées */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{interview.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{interview.views.toLocaleString()} vues</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [typeFilter, setTypeFilter] = useState("tous");

  const categories = ["League of Legends", "Valorant", "Rocket League", "Industrie"];

  // Filtrer les interviews
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.interviewee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "tous" || interview.category === categoryFilter;
    const matchesType = typeFilter === "tous" || 
                       (typeFilter === "video" && interview.isVideo) ||
                       (typeFilter === "article" && !interview.isVideo);
    return matchesSearch && matchesCategory && matchesType;
  });

  // Séparer les interviews à la une
  const featuredInterviews = filteredInterviews.filter(interview => interview.isFeatured);
  const regularInterviews = filteredInterviews.filter(interview => !interview.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Interviews
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les interviews exclusives de la scène esport française
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
                  placeholder="Rechercher une interview..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filtres par catégorie */}
              <div className="flex gap-2 flex-wrap lg:col-span-2">
                <Button
                  variant={categoryFilter === "tous" ? "default" : "outline"}
                  className={categoryFilter === "tous" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setCategoryFilter("tous")}
                >
                  Tous
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    className={categoryFilter === category ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Filtre par type */}
              <div className="flex gap-2">
                <Button
                  variant={typeFilter === "tous" ? "default" : "outline"}
                  className={typeFilter === "tous" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setTypeFilter("tous")}
                >
                  Tous
                </Button>
                <Button
                  variant={typeFilter === "video" ? "default" : "outline"}
                  className={typeFilter === "video" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setTypeFilter("video")}
                >
                  Vidéos
                </Button>
                <Button
                  variant={typeFilter === "article" ? "default" : "outline"}
                  className={typeFilter === "article" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setTypeFilter("article")}
                >
                  Articles
                </Button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-6 text-gray-300">
              <span>{filteredInterviews.length} interviews trouvées</span>
              <span>•</span>
              <span>{featuredInterviews.length} à la une</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews à la une */}
      {featuredInterviews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            ⭐ À la une
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Toutes les interviews */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-white text-2xl font-bold mb-6">
          Toutes les interviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularInterviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune interview trouvée</p>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
} 