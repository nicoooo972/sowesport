"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  FileText,
  Clock,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Interface alignée avec la table `user_activities` et la réponse de l'API
interface Activity {
  id: string;
  user_id: string;
  activity_type: 'new_forum_post' | 'new_forum_reply' | string;
  related_id: string | null;
  related_url: string | null;
  content: {
    title?: string;
    replyExcerpt?: string;
  } | null;
  created_at: string;
}

const ActivityHistory = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadActivities = useCallback(async (isInitialLoad = false) => {
    if (!user?.id || !hasMore) {
      if (isInitialLoad) setLoading(false);
      return;
    }

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await fetch(`/api/users/${user.id}/activity?page=${page}&limit=15`);
      if (!response.ok) throw new Error("Impossible de charger les activités");
      
      const data = await response.json();
      
      setActivities(prev => isInitialLoad ? data.activities : [...prev, ...data.activities]);
      setHasMore(data.pagination.page < data.pagination.totalPages);
      setPage(prev => prev + 1);

    } catch (error) {
      console.error('Erreur lors du chargement de l\'activité:', error);
    } finally {
      if (isInitialLoad) setLoading(false);
      setLoadingMore(false);
    }
  }, [user?.id, page, hasMore]);


  useEffect(() => {
    loadActivities(true);
  }, [user?.id]); // Ne dépend que de user.id pour le chargement initial

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_forum_post': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'new_forum_reply': return <MessageCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.activity_type) {
      case 'new_forum_post':
        return <>Vous avez créé le sujet : <span className="font-semibold">{activity.content?.title}</span></>;
      case 'new_forum_reply':
        return <>Vous avez répondu au sujet : <span className="font-semibold">{activity.content?.replyExcerpt ? `"${activity.content.replyExcerpt}..."` : ''}</span></>;
      default:
        return `Activité inconnue : ${activity.activity_type}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderActivity = (activity: Activity) => {
    const content = (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm">
          {getActivityIcon(activity.activity_type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {getActivityDescription(activity)}
            </p>
            <time className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatDate(activity.created_at)}
            </time>
          </div>
        </div>
      </div>
    );
  
    if (activity.related_url) {
      return (
        <Link href={activity.related_url} key={activity.id} className="block">
          {content}
        </Link>
      );
    }
  
    return <div key={activity.id}>{content}</div>;
  };
  

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité récente</p>
            <p className="text-sm text-gray-400 mt-2">
              Vos nouvelles contributions sur le forum apparaîtront ici.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map(renderActivity)}
        </div>
        
        {hasMore && (
          <div className="text-center mt-6">
            <Button onClick={() => loadActivities()} disabled={loadingMore} variant="outline">
              {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loadingMore ? "Chargement..." : "Voir plus"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory; 