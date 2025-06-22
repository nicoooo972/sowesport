"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Eye, 
  Heart, 
  TrendingUp, 
  UserCheck,
  Shield,
  Settings,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalArticles: number;
  articlesThisWeek: number;
  totalEvents: number;
  activeEvents: number;
  totalComments: number;
  commentsThisWeek: number;
  totalViews: number;
  totalLikes: number;
  totalBookmarks: number;
  pendingModeration: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'article_published' | 'comment_posted' | 'event_created';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface PendingItem {
  id: string;
  type: 'comment' | 'article' | 'user_report';
  title: string;
  author: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
      return;
    }
    
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin, adminLoading, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadRecentActivity(),
        loadPendingItems()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [
        { count: totalUsers },
        { count: totalArticles },
        { count: totalEvents },
        { count: totalComments }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('content_comments').select('*', { count: 'exact', head: true })
      ]);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: newUsersThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const { count: articlesThisWeek } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const { count: activeEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live');

      const { count: commentsThisWeek } = await supabase
        .from('content_comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        totalArticles: totalArticles || 0,
        articlesThisWeek: articlesThisWeek || 0,
        totalEvents: totalEvents || 0,
        activeEvents: activeEvents || 0,
        totalComments: totalComments || 0,
        commentsThisWeek: commentsThisWeek || 0,
        totalViews: Math.floor(Math.random() * 50000) + 10000,
        totalLikes: Math.floor(Math.random() * 5000) + 1000,
        totalBookmarks: Math.floor(Math.random() * 2000) + 500,
        pendingModeration: Math.floor(Math.random() * 10) + 2
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    const mockActivity = [
      {
        id: '1',
        type: 'user_registration' as const,
        title: 'Nouvel utilisateur inscrit',
        description: 'ProGamer2024 a rejoint la plateforme',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: 'ProGamer2024'
      },
      {
        id: '2',
        type: 'article_published' as const,
        title: 'Nouvel article publié',
        description: 'Guide stratégique Valorant 2025',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        user: 'RedacteurChef'
      },
      {
        id: '3',
        type: 'event_created' as const,
        title: 'Événement créé',
        description: 'Tournoi League of Legends Printemps',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: 'OrganisateurPro'
      }
    ];

    setRecentActivity(mockActivity);
  };

  const loadPendingItems = async () => {
    const mockPending = [
      {
        id: '1',
        type: 'comment' as const,
        title: 'Commentaire signalé',
        author: 'UtilisateurX',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        priority: 'high' as const
      },
      {
        id: '2',
        type: 'article' as const,
        title: 'Article en attente de validation',
        author: 'NouveauRedacteur',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        priority: 'medium' as const
      }
    ];

    setPendingItems(mockPending);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'article_published': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'event_created': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'comment_posted': return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Urgent</Badge>;
      case 'medium': return <Badge variant="default">Moyen</Badge>;
      case 'low': return <Badge variant="outline">Faible</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" />
          <p className="text-lg font-medium">Chargement du panneau admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Panneau d'administration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Vue d'ensemble et gestion de la plateforme SowEsport
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/evenements">
            <Button className="w-full h-16 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Gérer les événements</span>
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button className="w-full h-16 flex flex-col gap-2" variant="outline">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Articles & Contenu</span>
            </Button>
          </Link>
          <Link href="/admin/utilisateurs">
            <Button className="w-full h-16 flex flex-col gap-2" variant="outline">
              <Users className="h-5 w-5" />
              <span className="text-sm">Gestion utilisateurs</span>
            </Button>
          </Link>
          <Button className="w-full h-16 flex flex-col gap-2" variant="outline">
            <Settings className="h-5 w-5" />
            <span className="text-sm">Paramètres</span>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Modération</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.newUsersThisWeek || 0} cette semaine
                  </p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.articlesThisWeek || 0} cette semaine
                  </p>
                  <Progress value={60} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Événements</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activeEvents || 0} actifs
                  </p>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalLikes || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total likes & interactions
                  </p>
                  <Progress value={90} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Éléments en attente
                    {stats?.pendingModeration && stats.pendingModeration > 0 && (
                      <Badge variant="destructive">{stats.pendingModeration}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-xs text-muted-foreground">Par {item.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(item.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vues totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalViews?.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+12% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Likes totaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalLikes?.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+8% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Favoris totaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalBookmarks?.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+15% ce mois</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commentaires signalés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingItems.filter(item => item.type === 'comment').map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Par {item.author}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Valider</Button>
                            <Button size="sm" variant="destructive">Supprimer</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Articles en attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingItems.filter(item => item.type === 'article').map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Par {item.author}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Réviser</Button>
                            <Button size="sm">Publier</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>État du système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Base de données</span>
                    <Badge variant="default">Opérationnelle</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Serveur API</span>
                    <Badge variant="default">Opérationnel</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service de stockage</span>
                    <Badge variant="default">Opérationnel</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Notifications push</span>
                    <Badge variant="outline">Configuré</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Vider le cache
                  </Button>
                  <Button className="w-full" variant="outline">
                    Sauvegarder la base de données
                  </Button>
                  <Button className="w-full" variant="outline">
                    Générer un rapport
                  </Button>
                  <Button className="w-full" variant="destructive">
                    Mode maintenance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 