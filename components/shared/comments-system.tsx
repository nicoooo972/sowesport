"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  MoreVertical,
  Flag,
  Trash2,
  Edit,
  Send
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  parent_id: number | null;
  user_id: string;
  user_profile?: {
    username: string;
    avatar_url: string;
    role: string;
  };
  replies?: Comment[];
  user_liked?: boolean;
}

interface CommentsSystemProps {
  contentType: string;
  contentId: string;
  maxDepth?: number;
}

const CommentsSystem = ({ 
  contentType, 
  contentId, 
  maxDepth = 2 
}: CommentsSystemProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [contentType, contentId]);

  const loadComments = async () => {
    try {
      // Charger les commentaires avec les profils utilisateur
      const { data: commentsData, error } = await supabase
        .from('content_comments')
        .select(`
          *,
          profiles!inner(username, avatar_url, role)
        `)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrichir avec les likes de l'utilisateur actuel si connecté
      let enrichedComments = commentsData || [];
      
      if (user?.id) {
        const commentIds = enrichedComments.map(c => c.id);
        const { data: userLikes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds);

        const likedCommentIds = new Set(userLikes?.map(like => like.comment_id) || []);
        
        enrichedComments = enrichedComments.map(comment => ({
          ...comment,
          user_profile: comment.profiles,
          user_liked: likedCommentIds.has(comment.id)
        }));
      } else {
        enrichedComments = enrichedComments.map(comment => ({
          ...comment,
          user_profile: comment.profiles,
          user_liked: false
        }));
      }

      // Organiser en arbre de commentaires
      const organized = organizeComments(enrichedComments);
      setComments(organized);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const organizeComments = (flatComments: any[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // Créer la map des commentaires
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organiser en arbre
    flatComments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!;
      
      if (comment.parent_id === null) {
        rootComments.push(commentNode);
      } else {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentNode);
        }
      }
    });

    return rootComments;
  };

  const submitComment = async (parentId: number | null = null) => {
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter.",
        variant: "destructive",
      });
      return;
    }

    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('content_comments')
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          content: content.trim(),
          parent_id: parentId
        })
        .select(`
          *,
          profiles!inner(username, avatar_url, role)
        `)
        .single();

      if (error) throw error;

      // Réinitialiser les champs
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }

      // Recharger les commentaires
      await loadComments();
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentLike = async (commentId: number, currentlyLiked: boolean) => {
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer un commentaire.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentlyLiked) {
        // Supprimer le like
        await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);

        // Décrémenter le compteur
        const { data: currentComment } = await supabase
          .from('content_comments')
          .select('likes_count')
          .eq('id', commentId)
          .single();
          
        await supabase
          .from('content_comments')
          .update({ likes_count: Math.max(0, (currentComment?.likes_count || 0) - 1) })
          .eq('id', commentId);
      } else {
        // Ajouter le like
        await supabase
          .from('comment_likes')
          .insert({
            user_id: user.id,
            comment_id: commentId
          });

        // Incrémenter le compteur
        const { data: currentComment } = await supabase
          .from('content_comments')
          .select('likes_count')
          .eq('id', commentId)
          .single();
          
        await supabase
          .from('content_comments')
          .update({ likes_count: (currentComment?.likes_count || 0) + 1 })
          .eq('id', commentId);
      }

      // Recharger les commentaires pour mettre à jour l'état
      await loadComments();
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande.",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('content_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadComments();
      
      toast({
        title: "Commentaire supprimé",
        description: "Votre commentaire a été supprimé.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire.",
        variant: "destructive",
      });
    }
  };

  const updateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('content_comments')
        .update({ 
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEditingComment(null);
      setEditContent("");
      await loadComments();
      
      toast({
        title: "Commentaire modifié",
        description: "Votre commentaire a été mis à jour.",
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le commentaire.",
        variant: "destructive",
      });
    }
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const canReply = depth < maxDepth;
    const isOwner = user?.id === comment.user_id;
    
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user_profile?.avatar_url || ""} />
                <AvatarFallback>
                  {comment.user_profile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">{comment.user_profile?.username}</span>
                  {comment.user_profile?.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs">Admin</Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="text-xs text-gray-400">(modifié)</span>
                  )}
                </div>
                
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Modifier votre commentaire..."
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateComment(comment.id)}
                        disabled={submitting}
                      >
                        Sauvegarder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleCommentLike(comment.id, comment.user_liked || false)}
                        className={`h-8 px-2 ${comment.user_liked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${comment.user_liked ? 'fill-current' : ''}`} />
                        {comment.likes_count}
                      </Button>
                      
                      {canReply && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setReplyingTo(comment.id)}
                          className="h-8 px-2"
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Répondre
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteComment(comment.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-4 pl-12">
              <div className="space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Répondre à ${comment.user_profile?.username}...`}
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => submitComment(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Commentaires</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Commentaires ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Formulaire de nouveau commentaire */}
        {user ? (
          <div className="mb-6">
            <div className="flex space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez votre commentaire..."
                  rows={3}
                  className="mb-2"
                />
                <Button
                  onClick={() => submitComment()}
                  disabled={submitting || !newComment.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Publication...' : 'Publier'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Connectez-vous pour participer à la discussion
            </p>
          </div>
        )}

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun commentaire pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">
                Soyez le premier à partager votre avis !
              </p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSystem; 