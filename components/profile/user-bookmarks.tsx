"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bookmark, 
  BookmarkX, 
  Calendar, 
  FileText, 
  MessageSquare,
  Mic,
  ExternalLink,
  Clock,
  Eye,
  Heart,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

interface BookmarkItem {
  id: number;
  content_type: string;
  content_id: string;
  created_at: string;
  content_data?: any;
}

const UserBookmarks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    try {
      const { data: bookmarkData, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrichir avec les données du contenu
      const enrichedBookmarks = await Promise.all(
        (bookmarkData || []).map(async (bookmark) => {
          let contentData = null;
          
          try {
            switch (bookmark.content_type) {
              case 'article':
                const { data: article } = await supabase
                  .from('articles')
                  .select('title, excerpt, featured_image, category, views, likes')
                  .eq('id', bookmark.content_id)
                  .single();
                contentData = article;
                break;
                
              case 'event':
                const { data: event } = await supabase
                  .from('events')
                  .select('title, subtitle, image_url, game, location, event_date, status')
                  .eq('id', bookmark.content_id)
                  .single();
                contentData = event;
                break;
                
              case 'interview':
                const { data: interview } = await supabase
                  .from('interviews')
                  .select('title, description, thumbnail, interviewee_name, category, duration, views')
                  .eq('id', bookmark.content_id)
                  .single();
                contentData = interview;
                break;
            }
          } catch (error) {
            console.error(`Erreur lors du chargement de ${bookmark.content_type}:`, error);
          }

          return { ...bookmark, content_data: contentData };
        })
      );

      setBookmarks(enrichedBookmarks);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: number, contentId: string) => {
    setRemoving(contentId);
    
    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      
      toast({
        title: "Favori supprimé",
        description: "L'élément a été retiré de vos favoris.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le favori.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'interview': return <Mic className="w-4 h-4" />;
      case 'forum_post': return <MessageSquare className="w-4 h-4" />;
      default: return <Bookmark className="w-4 h-4" />;
    }
  };

  const getContentUrl = (type: string, id: string) => {
    switch (type) {
      case 'article': return `/articles/${id}`;
      case 'event': return `/evenements/${id}`;
      case 'interview': return `/interviews/${id}`;
      case 'forum_post': return `/forum/${id}`;
      default: return '#';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filterBookmarksByType = (type: string) => {
    return bookmarks.filter(bookmark => bookmark.content_type === type);
  };

  const renderBookmarkCard = (bookmark: BookmarkItem) => {
    const data = bookmark.content_data;
    if (!data) return null;

    return (
      <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {/* Image/Thumbnail */}
            <div className="flex-shrink-0">
              {(data.featured_image || data.image_url || data.thumbnail) ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={data.featured_image || data.image_url || data.thumbnail}
                    alt={data.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {getContentIcon(bookmark.content_type)}
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight mb-2">
                    {data.title}
                  </h3>
                  
                  {(data.excerpt || data.subtitle || data.description) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {data.excerpt || data.subtitle || data.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {bookmark.content_type}
                    </Badge>
                    
                    {(data.category || data.game) && (
                      <Badge variant="outline" className="text-xs">
                        {data.category || data.game}
                      </Badge>
                    )}

                    {bookmark.content_type === 'event' && data.status && (
                      <Badge 
                        variant={data.status === 'upcoming' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {data.status}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Ajouté le {formatDate(bookmark.created_at)}</span>
                    </span>
                    
                    {data.views && (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{data.views}</span>
                      </span>
                    )}
                    
                    {data.likes && (
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{data.likes}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <Link href={getContentUrl(bookmark.content_type, bookmark.content_id)}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                  </Link>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeBookmark(bookmark.id, bookmark.content_id)}
                    disabled={removing === bookmark.content_id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {removing === bookmark.content_id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes favoris</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes favoris</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookmarkX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun favori pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez du contenu à vos favoris pour le retrouver facilement ici
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const articleBookmarks = filterBookmarksByType('article');
  const eventBookmarks = filterBookmarksByType('event');
  const interviewBookmarks = filterBookmarksByType('interview');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5" />
          <span>Mes favoris ({bookmarks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Tout ({bookmarks.length})
            </TabsTrigger>
            {articleBookmarks.length > 0 && (
              <TabsTrigger value="articles">
                Articles ({articleBookmarks.length})
              </TabsTrigger>
            )}
            {eventBookmarks.length > 0 && (
              <TabsTrigger value="events">
                Événements ({eventBookmarks.length})
              </TabsTrigger>
            )}
            {interviewBookmarks.length > 0 && (
              <TabsTrigger value="interviews">
                Interviews ({interviewBookmarks.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookmarks.map(renderBookmarkCard)}
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            {articleBookmarks.map(renderBookmarkCard)}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {eventBookmarks.map(renderBookmarkCard)}
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            {interviewBookmarks.map(renderBookmarkCard)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserBookmarks; 