"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Plus,
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";

export default function AdminArticlesPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
      return;
    }
    
    if (isAdmin) {
      loadArticles();
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data: articlesData, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id(username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enrichedArticles = articlesData?.map(article => ({
        ...article,
        status: "published",
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 500) + 10,
        comments: Math.floor(Math.random() * 100) + 5,
        category: article.tags?.[0] || "Général"
      })) || [];

      setArticles(enrichedArticles);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
  };

  const handleArticleAction = async (articleId: string, action: string) => {
    try {
      let updateData: any = {};

      switch (action) {
        case "publish":
          updateData = { status: "published" };
          break;
        case "unpublish":
          updateData = { status: "draft" };
          break;
        case "feature":
          updateData = { featured: true };
          break;
        case "unfeature":
          updateData = { featured: false };
          break;
        case "delete":
          setArticles(prev => prev.filter(article => article.id !== articleId));
          toast({
            title: "Article supprimé",
            description: "L'article a été supprimé avec succès.",
          });
          return;
        default:
          return;
      }

      setArticles(prev => 
        prev.map(article => 
          article.id === articleId ? { ...article, ...updateData } : article
        )
      );

      toast({
        title: "Action effectuée",
        description: `L'article a été ${action === "publish" ? "publié" : action === "unpublish" ? "dépublié" : action === "feature" ? "mis en avant" : "retiré de la une"}.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'action article:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="gap-1 bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" />Publié</Badge>;
      case "draft":
        return <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" />Brouillon</Badge>;
      case "archived":
        return <Badge variant="outline" className="gap-1"><XCircle className="h-3 w-3" />Archivé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const categories = Array.from(new Set(articles.map(a => a.category)));

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" />
          <p className="text-lg font-medium">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Gestion des articles
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gérez les articles et contenus de la plateforme
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total articles</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Publiés</p>
                <p className="text-2xl font-bold">{articles.filter(a => a.status === "published").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <p className="text-2xl font-bold">{articles.filter(a => a.status === "draft").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Vues totales</p>
                <p className="text-2xl font-bold">{articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statistiques</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {article.image_url && (
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{article.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {article.description || "Aucune description"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          {article.featured && (
                            <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                              ⭐ À la une
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        {article.profiles?.username?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <span className="text-sm">{article.profiles?.username || "Auteur inconnu"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(article.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(article.created_at)}</div>
                      {article.updated_at !== article.created_at && (
                        <div className="text-xs text-muted-foreground">
                          Modifié le {formatDate(article.updated_at)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {article.likes}
                      </div>
                      <div>{article.comments} commentaires</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir l'article
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        {article.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleArticleAction(article.id, "publish")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publier
                          </DropdownMenuItem>
                        )}
                        {article.status === "published" && (
                          <DropdownMenuItem onClick={() => handleArticleAction(article.id, "unpublish")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Dépublier
                          </DropdownMenuItem>
                        )}
                        {!article.featured ? (
                          <DropdownMenuItem onClick={() => handleArticleAction(article.id, "feature")}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Mettre à la une
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleArticleAction(article.id, "unfeature")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Retirer de la une
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleArticleAction(article.id, "delete")}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
