"use client";

import { useState } from "react";
import { Search, Plus, MessageCircle, Users, Clock, Pin, Lock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Types pour les forums
interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: "admin" | "moderator" | "member";
  };
  replies: number;
  views: number;
  lastReply: {
    author: string;
    date: string;
  };
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
}

// Données mock pour les forums
const forumPosts: ForumPost[] = [
  {
    id: "patch-13-3-discussion",
    title: "Discussion sur le patch 13.3 de League of Legends",
    category: "League of Legends",
    author: {
      name: "GameMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "admin"
    },
    replies: 42,
    views: 1250,
    lastReply: {
      author: "ProPlayer92",
      date: "Il y a 2h"
    },
    isPinned: true,
    isLocked: false,
    createdAt: "2025-01-15"
  },
  {
    id: "valorant-champions-predictions",
    title: "Prédictions Valorant Champions 2025",
    category: "Valorant",
    author: {
      name: "EsportAnalyst",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "moderator"
    },
    replies: 28,
    views: 890,
    lastReply: {
      author: "ValorantFan",
      date: "Il y a 4h"
    },
    isPinned: false,
    isLocked: false,
    createdAt: "2025-01-18"
  },
  {
    id: "lfl-spring-split-analysis",
    title: "Analyse des équipes LFL Spring Split",
    category: "League of Legends",
    author: {
      name: "StrategicGamer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "member"
    },
    replies: 67,
    views: 2100,
    lastReply: {
      author: "TeamKarmine",
      date: "Il y a 1h"
    },
    isPinned: false,
    isLocked: false,
    createdAt: "2025-01-16"
  },
  {
    id: "rocket-league-tips",
    title: "Conseils pour progresser en Rocket League",
    category: "Rocket League",
    author: {
      name: "RocketPro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "member"
    },
    replies: 15,
    views: 456,
    lastReply: {
      author: "Rookie2025",
      date: "Il y a 6h"
    },
    isPinned: false,
    isLocked: false,
    createdAt: "2025-01-17"
  },
  {
    id: "tournament-rules-2025",
    title: "Règlement des tournois SowEsport 2025",
    category: "Annonces",
    author: {
      name: "SowEsportAdmin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "admin"
    },
    replies: 8,
    views: 325,
    lastReply: {
      author: "TournamentOrg",
      date: "Il y a 12h"
    },
    isPinned: true,
    isLocked: true,
    createdAt: "2025-01-10"
  }
];

// Composant pour les cartes de forum
function ForumCard({ post }: { post: ForumPost }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-600";
      case "moderator": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "moderator": return "Mod";
      default: return "Membre";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Annonces": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Link href={`/forum/${post.id}`}>
      <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar auteur */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={`${post.author.name} avatar`}
                fill
                className="object-cover"
              />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Titre avec icônes */}
                  <div className="flex items-center gap-2 mb-2">
                    {post.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    {post.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={`${getCategoryColor(post.category)} text-white text-xs`}>
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <span>par</span>
                      <span className="text-white font-medium">{post.author.name}</span>
                      <Badge className={`${getRoleColor(post.author.role)} text-white text-xs ml-1`}>
                        {getRoleText(post.author.role)}
                      </Badge>
                    </div>
                  </div>

                  {/* Dernière réponse */}
                  <div className="text-gray-400 text-sm">
                    <span>Dernière réponse par </span>
                    <span className="text-white font-medium">{post.lastReply.author}</span>
                    <span className="ml-1">{post.lastReply.date}</span>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="flex gap-6 text-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Réponses</span>
                    </div>
                    <span className="text-white font-bold text-lg">{post.replies}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Vues</span>
                    </div>
                    <span className="text-white font-bold text-lg">{post.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");

  const categories = ["League of Legends", "Valorant", "Rocket League", "Annonces"];

  // Filtrer les posts
  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "tous" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Séparer les posts épinglés
  const pinnedPosts = filteredPosts.filter(post => post.isPinned);
  const regularPosts = filteredPosts.filter(post => !post.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Forum
              </h1>
              <p className="text-xl text-gray-200">
                Discutez avec la communauté esport française !
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer un sujet
            </Button>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Barre de recherche */}
              <div className="relative lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher dans le forum..."
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
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{forumPosts.length} sujets</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>1,250 membres actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Dernière activité: il y a 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts épinglés */}
      {pinnedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
            <Pin className="w-5 h-5 text-yellow-500" />
            Sujets épinglés
          </h2>
          <div className="space-y-4">
            {pinnedPosts.map((post) => (
              <ForumCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Posts réguliers */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-white text-2xl font-bold mb-4">
          Discussions générales
        </h2>
        <div className="space-y-4">
          {regularPosts.map((post) => (
            <ForumCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun sujet trouvé</p>
            <p className="text-gray-500">Essayez de modifier vos filtres ou créez un nouveau sujet</p>
          </div>
        )}
      </div>
    </div>
  );
} 