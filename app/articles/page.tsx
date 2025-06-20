"use client";

import { useState } from "react";
import { Search, Calendar, Clock, User, Bookmark, Eye, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Types pour les articles
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featuredImage: string;
  isFeatured: boolean;
  isBreaking: boolean;
  tags: string[];
}

// Données mock pour les articles
const articles: Article[] = [
  {
    id: "lfl-spring-split-preview",
    title: "LFL Spring Split 2025 : Notre preview complète",
    excerpt: "Analyse approfondie des équipes, transferts marquants et prédictions pour la nouvelle saison de la Ligue Française de League of Legends.",
    content: "La LFL Spring Split 2025 s'annonce comme l'une des saisons les plus compétitives de l'histoire...",
    author: {
      name: "Alexandre Martin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "League of Legends",
    publishedAt: "Il y a 1 jour",
    readTime: "8 min",
    views: 15200,
    likes: 342,
    featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isBreaking: false,
    tags: ["lfl", "preview", "esport"]
  },
  {
    id: "valorant-meta-analysis",
    title: "📈 Valorant : La nouvelle méta qui révolutionne les tournois",
    excerpt: "Découvrez comment les derniers changements de patch ont bouleversé les stratégies des équipes professionnelles.",
    content: "Le patch 8.11 de Valorant a introduit des changements majeurs...",
    author: {
      name: "Sophie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Valorant",
    publishedAt: "Il y a 2 jours",
    readTime: "6 min",
    views: 8900,
    likes: 156,
    featuredImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isBreaking: true,
    tags: ["valorant", "meta", "analyse"]
  },
  {
    id: "karmine-corp-transferts",
    title: "🔥 BREAKING: Karmine Corp annonce ses nouveaux transferts",
    excerpt: "L'organisation française frappe fort avec l'arrivée de trois nouveaux joueurs de talent pour renforcer son roster.",
    content: "Dans un communiqué officiel publié ce matin, Karmine Corp a dévoilé...",
    author: {
      name: "Thomas Laurent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Transferts",
    publishedAt: "Il y a 3 heures",
    readTime: "4 min",
    views: 23400,
    likes: 892,
    featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isBreaking: true,
    tags: ["karmine-corp", "transferts", "breaking"]
  },
  {
    id: "esport-france-economie",
    title: "L'économie de l'esport français en 2025 : les chiffres clés",
    excerpt: "Étude complète sur la croissance du marché esportif français, investissements et perspectives d'avenir.",
    content: "Le marché français de l'esport continue sa progression fulgurante...",
    author: {
      name: "Marie Petit",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Industrie",
    publishedAt: "Il y a 1 semaine",
    readTime: "12 min",
    views: 6700,
    likes: 234,
    featuredImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isBreaking: false,
    tags: ["industrie", "economie", "france"]
  },
  {
    id: "rocket-league-championship",
    title: "Rocket League Championship : Les équipes françaises brillent",
    excerpt: "Retour sur les performances exceptionnelles des représentants français lors du dernier championnat mondial.",
    content: "Le Rocket League Championship Series a livré son verdict...",
    author: {
      name: "Lucas Moreau",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Rocket League",
    publishedAt: "Il y a 4 jours",
    readTime: "7 min",
    views: 11300,
    likes: 445,
    featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isBreaking: false,
    tags: ["rocket-league", "championship", "france"]
  },
  {
    id: "gaming-setup-guide",
    title: "Guide 2025 : Le setup gaming parfait pour l'esport compétitif",
    excerpt: "Nos recommandations d'équipements pour optimiser vos performances en compétition, du matériel aux périphériques.",
    content: "Un bon setup gaming peut faire la différence entre la victoire et la défaite...",
    author: {
      name: "Kevin Rousseau",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Guide",
    publishedAt: "Il y a 2 semaines",
    readTime: "15 min",
    views: 18900,
    likes: 567,
    featuredImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isBreaking: false,
    tags: ["guide", "setup", "gaming"]
  }
];

// Composant pour les cartes d'article
function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Industrie": return "bg-purple-600";
      case "Transferts": return "bg-green-600";
      case "Guide": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const cardClasses = featured 
    ? "bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
    : "bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.01] cursor-pointer overflow-hidden";

  const imageHeight = featured ? "h-64" : "h-48";

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className={cardClasses}>
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white animate-pulse">
                🔥 BREAKING
              </Badge>
            )}
            {article.isFeatured && !article.isBreaking && (
              <Badge className="bg-yellow-600 text-white">
                ⭐ À la une
              </Badge>
            )}
            <Badge className={`${getCategoryColor(article.category)} text-white`}>
              {article.category}
            </Badge>
          </div>

          {/* Stats en bas */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()}
            </div>
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Titre */}
            <h3 className={`text-white font-bold leading-tight line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
              {article.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Métadonnées */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-700">
                  <Image
                    src={article.author.avatar}
                    alt={`${article.author.name} avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{article.author.name}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [sortBy, setSortBy] = useState("recent");

  const categories = ["League of Legends", "Valorant", "Rocket League", "Industrie", "Transferts", "Guide"];

  // Filtrer et trier les articles
  let filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "tous" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Trier les articles
  if (sortBy === "popular") {
    filteredArticles = filteredArticles.sort((a, b) => b.views - a.views);
  } else if (sortBy === "liked") {
    filteredArticles = filteredArticles.sort((a, b) => b.likes - a.likes);
  }

  // Séparer les articles à la une et breaking news
  const breakingArticles = filteredArticles.filter(article => article.isBreaking);
  const featuredArticles = filteredArticles.filter(article => article.isFeatured && !article.isBreaking);
  const regularArticles = filteredArticles.filter(article => !article.isFeatured && !article.isBreaking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Articles
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Toute l'actualité esport française en un seul endroit
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
                  placeholder="Rechercher un article..."
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

              {/* Tri */}
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  className={sortBy === "recent" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setSortBy("recent")}
                >
                  Récents
                </Button>
                <Button
                  variant={sortBy === "popular" ? "default" : "outline"}
                  className={sortBy === "popular" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  onClick={() => setSortBy("popular")}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Populaires
                </Button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex items-center gap-6 text-gray-300">
              <span>{filteredArticles.length} articles trouvés</span>
              <span>•</span>
              <span>{breakingArticles.length} breaking news</span>
              <span>•</span>
              <span>{featuredArticles.length} articles à la une</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breaking News */}
      {breakingArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            🔥 Breaking News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breakingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Articles à la une */}
      {featuredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            ⭐ À la une
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      )}

      {/* Tous les articles */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-white text-2xl font-bold mb-6">
          Tous les articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun article trouvé</p>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
} 