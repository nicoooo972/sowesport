import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useUserInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const logActivity = useCallback(async (
    activityType: string,
    contentType: string,
    contentId: string,
    description?: string,
    metadata?: any
  ) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          content_type: contentType,
          content_id: contentId,
          description,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', error);
    }
  }, [user]);

  const toggleLike = useCallback(async (
    contentType: string,
    contentId: string,
    currentlyLiked: boolean
  ) => {
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer ce contenu.",
        variant: "destructive",
      });
      return currentlyLiked;
    }

    setLoading(true);

    const tableName = contentType === 'article' ? 'articles' : 
                      contentType === 'interview' ? 'interviews' :
                      contentType === 'event' ? 'events' :
                      contentType === 'forumpost' ? 'forum_posts' : null;

    if (!tableName) {
      toast({ title: "Erreur", description: "Type de contenu invalide.", variant: "destructive" });
      setLoading(false);
      return currentlyLiked;
    }

    try {
      if (currentlyLiked) {
        // 1. Supprimer le like de la table de jonction
        const { error: deleteError } = await supabase
          .from('user_likes')
          .delete()
          .match({ user_id: user.id, content_type: contentType, content_id: contentId });

        if (deleteError) throw deleteError;

        // 2. Si la suppression réussit, décrémenter le compteur via RPC
        const { error: rpcError } = await supabase.rpc('decrement_likes', { 
          p_table_name: tableName, 
          p_content_id: contentId 
        });
        if (rpcError) throw rpcError;

        await logActivity('unlike', contentType, contentId);
        toast({ title: "Like retiré" });

      } else {
        // 1. Ajouter le like
        const { error: insertError } = await supabase
          .from('user_likes')
          .insert({ user_id: user.id, content_type: contentType, content_id: contentId });

        if (insertError) throw insertError;

        // 2. Si l'insertion réussit, incrémenter le compteur via RPC
        const { error: rpcError } = await supabase.rpc('increment_likes', { 
          p_table_name: tableName, 
          p_content_id: contentId 
        });
        if (rpcError) throw rpcError;

        await logActivity('like', contentType, contentId);
        toast({ title: "Contenu aimé !" });
      }

      return !currentlyLiked;
    } catch (error) {
      console.error('Erreur lors du toggle like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande pour le moment.",
        variant: "destructive",
      });
      return currentlyLiked;
    } finally {
      setLoading(false);
    }
  }, [user, toast, logActivity]);

  const toggleBookmark = useCallback(async (
    contentType: string,
    contentId: string,
    currentlyBookmarked: boolean,
    contentTitle?: string
  ) => {
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour sauvegarder ce contenu.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      if (currentlyBookmarked) {
        // Supprimer le bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .eq('content_id', contentId);

        if (error) throw error;

        await logActivity('unbookmark', contentType, contentId);
        
        toast({
          title: "Favori supprimé",
          description: "Le contenu a été retiré de vos favoris.",
        });
        
      } else {
        // Ajouter le bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({
            user_id: user.id,
            content_type: contentType,
            content_id: contentId
          });

        if (error) throw error;

        await logActivity(
          'bookmark', 
          contentType, 
          contentId, 
          `A ajouté "${contentTitle || 'du contenu'}" aux favoris`,
          { title: contentTitle }
        );
        
        toast({
          title: "Ajouté aux favoris",
          description: "Le contenu a été sauvegardé dans vos favoris.",
        });
      }

      return !currentlyBookmarked;
    } catch (error) {
      console.error('Erreur lors du toggle bookmark:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande.",
        variant: "destructive",
      });
      return currentlyBookmarked;
    } finally {
      setLoading(false);
    }
  }, [user, toast, logActivity]);

  const recordView = useCallback(async (
    contentType: string,
    contentId: string,
    ipAddress?: string,
    userAgent?: string
  ) => {
    try {
      // Enregistrer la vue
      await supabase
        .from('user_views')
        .insert({
          user_id: user?.id || null,
          content_type: contentType,
          content_id: contentId,
          ip_address: ipAddress,
          user_agent: userAgent
        });

      // Incrémenter le compteur de vues
      const tableName = contentType === 'article' ? 'articles' : 
                       contentType === 'interview' ? 'interviews' : 'events';
      
      const { data: currentData } = await supabase
        .from(tableName)
        .select('views')
        .eq('id', contentId)
        .single();
        
      await supabase
        .from(tableName)
        .update({ views: (currentData?.views || 0) + 1 })
        .eq('id', contentId);

      // Logger l'activité si l'utilisateur est connecté
      if (user?.id) {
        await logActivity('view', contentType, contentId);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
    }
  }, [user, logActivity]);

  const shareContent = useCallback(async (
    contentType: string,
    contentId: string,
    shareMethod: 'link' | 'social' | 'email',
    contentTitle?: string
  ) => {
    if (!user?.id) return;

    try {
      await logActivity(
        'share', 
        contentType, 
        contentId, 
        `A partagé "${contentTitle || 'du contenu'}" via ${shareMethod}`,
        { 
          title: contentTitle,
          share_method: shareMethod 
        }
      );

      toast({
        title: "Contenu partagé",
        description: "Merci de faire découvrir notre contenu !",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du partage:', error);
    }
  }, [user, toast, logActivity]);

  const checkUserInteractions = useCallback(async (
    contentType: string,
    contentId: string
  ) => {
    if (!user?.id) return { liked: false, bookmarked: false };

    try {
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from('user_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .single(),
        supabase
          .from('user_bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .single()
      ]);

      return {
        liked: !likeResult.error,
        bookmarked: !bookmarkResult.error
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des interactions:', error);
      return { liked: false, bookmarked: false };
    }
  }, [user]);

  return {
    toggleLike,
    toggleBookmark,
    recordView,
    shareContent,
    checkUserInteractions,
    loading
  };
}; 