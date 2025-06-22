"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Eye, Calendar, Clock, Share2, User, Twitter, Facebook, Linkedin, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { ArticleDetail } from "./page";
import InteractionButtons from "@/components/shared/interaction-buttons";
import CommentsSystem from "@/components/shared/comments-system";
import { useUserInteractions } from "@/hooks/useUserInteractions";

// Composant pour la table des matières
function TableOfContents({ tableOfContents }: { tableOfContents: ArticleDetail["tableOfContents"] }) {
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 sticky top-8">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Table des matières
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {tableOfContents.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors hover:bg-slate-700/50 ${
                activeSection === item.id
                  ? "text-purple-400 bg-slate-700/50"
                  : "text-gray-300"
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

// Composant pour les informations de l'auteur
function AuthorCard({ author }: { author: ArticleDetail["author"] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">À propos de l'auteur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
            <Image
              src={author.avatar}
              alt={`${author.name} avatar`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">{author.name}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {author.bio}
            </p>
            <div className="flex gap-2">
              {author.socialLinks.twitter && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  asChild
                >
                  <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {author.socialLinks.linkedin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  asChild
                >
                  <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les articles liés
function RelatedArticles({ relatedArticles }: { relatedArticles: string[] }) {
  // Mock data pour les articles liés
  const mockRelatedArticles = [
    {
      id: "related-1",
      title: "Analyse de la meta Valorant 2025",
      excerpt: "Découvrez les agents les plus forts de la nouvelle saison",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      readTime: "5 min"
    },
    {
      id: "related-2", 
      title: "L'économie de l'esport français en 2025",
      excerpt: "État des lieux du marché français de l'esport",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      readTime: "7 min"
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Articles recommandés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRelatedArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/articles/${article.id}`}
              className="block group"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ArticleDetailClientProps {
  article: ArticleDetail;
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const [isLiked, setIsLiked] = useState(article.isLiked);
  const [likes, setLikes] = useState(article.likes);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const { recordView } = useUserInteractions();

  // Logger la vue de l'article au chargement
  useEffect(() => {
    if (article.id) {
      recordView('article', article.id);
    }
  }, [article.id, recordView]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Transferts": return "bg-green-600";
      case "Industrie": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${article.title} - ${article.excerpt}`;
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  // Convertir le contenu markdown en HTML basique pour l'affichage
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 id="$1" class="text-3xl font-bold text-white mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 id="$1" class="text-2xl font-bold text-white mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 id="$1" class="text-xl font-bold text-white mb-3 mt-4">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="text-white font-bold">$1</strong>')
      .replace(/^\*(.*?)\*/gm, '<em class="text-gray-300 italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="text-gray-200 mb-1">$1</li>')
      .replace(/^([^<\n]+)$/gm, '<p class="text-gray-200 mb-4 leading-relaxed">$1</p>')
      .replace(/(<li.*?<\/li>)/g, '<ul class="list-disc list-inside mb-4 space-y-1 ml-4">$1</ul>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec bouton retour */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/articles">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-6 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux articles
            </Button>
          </Link>
        </div>
      </div>

      {/* Image de couverture et méta informations */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="relative">
          {/* Image de couverture */}
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges sur l'image */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`${getCategoryColor(article.category)} hover:${getCategoryColor(article.category)}`}>
                {article.category}
              </Badge>
              {article.isFeatured && (
                <Badge className="bg-yellow-600 hover:bg-yellow-700">
                  À la une
                </Badge>
              )}
              {article.isBreaking && (
                <Badge className="bg-red-600 hover:bg-red-700 animate-pulse">
                  🔥 BREAKING
                </Badge>
              )}
            </div>
          </div>

          {/* Titre et informations */}
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Méta informations */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Publié {article.publishedAt}</span>
              </div>
              {article.lastUpdated && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Mis à jour {article.lastUpdated}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} vues</span>
              </div>
            </div>

            {/* Actions */}
            <InteractionButtons 
              contentId={article.id || 'article-1'}
              contentType="article"
              variant="default"
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-slate-600 text-gray-400 hover:text-white"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table des matières (sidebar gauche) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <TableOfContents tableOfContents={article.tableOfContents} />
          </div>

          {/* Contenu de l'article */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                />
              </CardContent>
            </Card>
            
            {/* Système de commentaires */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <CommentsSystem 
                  contentId={article.id || 'article-1'}
                  contentType="article"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar droite */}
          <div className="lg:col-span-1 order-3 space-y-6">
            <AuthorCard author={article.author} />
            <RelatedArticles relatedArticles={article.relatedArticles} />
          </div>
        </div>
      </div>
    </div>
  );
} 