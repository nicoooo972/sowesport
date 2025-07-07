"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle, Users, Clock, Pin, Lock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import CreateForumPostModal from "@/components/forum/CreateForumPostModal";
import { useToast } from "@/components/ui/use-toast";

// Types pour les forums
interface ForumAuthor {
  id: string;
  username: string;
  avatar_url: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
}

interface ForumCategory {
  id: string;
  name: string;
  color: string;
}

interface ForumPost {
  id: string;
  title: string;
  views: number;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  last_reply_at: string | null;
  created_at: string;
  author: ForumAuthor;
  category: ForumCategory;
  last_reply_author: {
    id: string;
    username: string;
  } | null;
}

interface ForumApiResponse {
  posts: ForumPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Composant pour les cartes de forum
function ForumCard({ post }: { post: ForumPost }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-600";
      case "MODERATOR": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN": return "Admin";
      case "MODERATOR": return "Mod";
      default: return "Membre";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Il y a moins d'1h";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Link href={`/forum/${post.id}`}>
      <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar auteur */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={`${post.author.username} avatar`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {post.author.username[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Titre avec icônes */}
                  <div className="flex items-center gap-2 mb-2">
                    {post.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    {post.is_locked && <Lock className="w-4 h-4 text-gray-500" />}
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 mb-3">
                    <Badge 
                      className="text-white text-xs"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <span>par</span>
                      <span className="text-white font-medium">{post.author.username}</span>
                      <Badge className={`${getRoleColor(post.author.role)} text-white text-xs ml-1`}>
                        {getRoleText(post.author.role)}
                      </Badge>
                    </div>
                  </div>

                  {/* Dernière réponse */}
                  <div className="text-gray-400 text-sm">
                    {post.last_reply_author ? (
                      <>
                        <span>Dernière réponse par </span>
                        <span className="text-white font-medium">{post.last_reply_author.username}</span>
                        <span className="ml-1">{formatDate(post.last_reply_at || post.created_at)}</span>
                      </>
                    ) : (
                      <span>Créé {formatDate(post.created_at)}</span>
                    )}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="flex gap-6 text-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Réponses</span>
                    </div>
                    <span className="text-white font-bold text-lg">{post.reply_count}</span>
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

// Composant de squelette pour le chargement
function ForumCardSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full bg-slate-700" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4 bg-slate-700" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 bg-slate-700" />
              <Skeleton className="h-5 w-32 bg-slate-700" />
            </div>
            <Skeleton className="h-4 w-48 bg-slate-700" />
          </div>
          <div className="flex gap-6">
            <Skeleton className="h-12 w-16 bg-slate-700" />
            <Skeleton className="h-12 w-16 bg-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const { toast } = useToast();

  // Charger les données initiales
  useEffect(() => {
    loadForumData();
    loadCategories();
  }, [categoryFilter, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/forum/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const loadForumData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
      });

      if (categoryFilter !== "tous") {
        params.append("category", categoryFilter);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/forum/posts?${params}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data: ForumApiResponse = await response.json();
      setPosts(data.posts);
      setPagination({
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts du forum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = () => {
    // Recharger les données après création d'un post
    loadForumData();
  };

  // Séparer les posts épinglés
  const pinnedPosts = posts.filter(post => post.is_pinned);
  const regularPosts = posts.filter(post => !post.is_pinned);

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
            <CreateForumPostModal onPostCreated={handlePostCreated} />
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
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    className={categoryFilter === category.id ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{pagination.total} sujets</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Communauté active</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Mise à jour en temps réel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu du forum */}
      {isLoading ? (
        // États de chargement
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ForumCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : (
        <>
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

            {posts.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucun sujet trouvé</p>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres ou créez un nouveau sujet</p>
                <CreateForumPostModal onPostCreated={handlePostCreated} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 