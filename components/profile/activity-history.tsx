"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Calendar, 
  Eye, 
  Share2,
  Trophy,
  UserPlus,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Activity {
  id: number;
  activity_type: string;
  content_type: string;
  content_id: string;
  description: string;
  metadata: any;
  created_at: string;
}

const ActivityHistory = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'activité:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'bookmark': return <Bookmark className="w-4 h-4 text-yellow-500" />;
      case 'participate': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'view': return <Eye className="w-4 h-4 text-gray-500" />;
      case 'share': return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-indigo-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'like': return 'bg-red-50 dark:bg-red-950';
      case 'comment': return 'bg-blue-50 dark:bg-blue-950';
      case 'bookmark': return 'bg-yellow-50 dark:bg-yellow-950';
      case 'participate': return 'bg-green-50 dark:bg-green-950';
      case 'view': return 'bg-gray-50 dark:bg-gray-950';
      case 'share': return 'bg-purple-50 dark:bg-purple-950';
      case 'achievement': return 'bg-amber-50 dark:bg-amber-950';
      case 'follow': return 'bg-indigo-50 dark:bg-indigo-950';
      default: return 'bg-gray-50 dark:bg-gray-950';
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
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getContentTitle = (activity: Activity) => {
    if (activity.metadata?.title) {
      return activity.metadata.title;
    }
    
    switch (activity.content_type) {
      case 'article': return 'un article';
      case 'event': return 'un événement';
      case 'interview': return 'une interview';
      case 'forum_post': return 'un post de forum';
      default: return 'du contenu';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité récente</p>
            <p className="text-sm text-gray-400 mt-2">
              Commencez à interagir avec le contenu pour voir votre activité ici
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${getActivityColor(activity.activity_type)}`}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
                {getActivityIcon(activity.activity_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.description || `${activity.activity_type} sur ${getContentTitle(activity)}`}
                  </p>
                  <time className="text-xs text-gray-500">
                    {formatDate(activity.created_at)}
                  </time>
                </div>
                
                {activity.metadata?.subtitle && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {activity.metadata.subtitle}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {activity.content_type}
                  </Badge>
                  
                  {activity.metadata?.category && (
                    <Badge variant="outline" className="text-xs">
                      {activity.metadata.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length >= 50 && (
          <div className="text-center mt-6">
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              Voir plus d'activités
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHistory; 