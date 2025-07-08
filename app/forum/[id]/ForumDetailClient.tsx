"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Eye, Pin, Lock, Calendar, User, ThumbsUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { ForumPostDetail, ForumReply } from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- Fonctions utilitaires ---
const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN": return "bg-red-600";
    case "MODERATOR": return "bg-blue-600";
    case "ORGANIZER": return "bg-orange-500";
    case "PRO": return "bg-yellow-500";
    case "PREMIUM": return "bg-indigo-500";
    default: return "bg-gray-600";
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "ADMIN": return "Admin";
    case "MODERATOR": return "Modérateur";
    case "ORGANIZER": return "Organisateur";
    case "PRO": return "Joueur Pro";
    case "PREMIUM": return "Premium";
    default: return "Membre";
  }
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// --- Composant pour une réponse ---
function ReplyCard({ reply, onDelete }: { reply: ForumReply, onDelete: (replyId: string) => void }) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(reply.reply_likes?.some(like => like.user_id === user?.id) || false);
  const [likeCount, setLikeCount] = useState(reply.like_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleDelete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/forum/replies/${reply.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "La suppression a échoué");
      }
      toast({ title: "Réponse supprimée", description: "La réponse a été retirée." });
      onDelete(reply.id);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Connectez-vous pour liker", variant: "destructive" });
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`/api/forum/replies/${reply.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      });
    } catch (error) {
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      toast({ title: "Erreur", description: "Impossible de liker.", variant: "destructive" });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2 flex-shrink-0 w-32">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700">
              {reply.author.avatar_url ? (
                <Image src={reply.author.avatar_url} alt={`${reply.author.username} avatar`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {reply.author.username[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-white font-bold">{reply.author.username}</p>
              <Badge className={`${getRoleColor(reply.author.role)} text-white text-sm`}>
                {getRoleText(reply.author.role)}
              </Badge>
              <p className="text-gray-400 text-sm mt-1">{reply.author.post_count || 0} posts</p>
              <p className="text-gray-400 text-sm">Membre depuis {formatDate(reply.author.join_date)}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-sm mb-4">Publié le {formatDate(reply.created_at)}</div>
            <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap">{reply.content}</div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <Button onClick={handleLike} disabled={isLiking} variant="ghost" size="sm" className={`flex items-center gap-1 ${isLiked ? 'text-purple-500 hover:text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
              </div>
              {profile?.role === 'admin' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center gap-1"><Trash2 className="w-4 h-4" />Supprimer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible. Voulez-vous vraiment supprimer cette réponse ?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Confirmer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Composant pour le formulaire de réponse ---
function ReplyForm({ postId, onReplyAdded }: { postId: string, onReplyAdded: (newReply: ForumReply) => void }) {
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        if (!replyContent.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Non authentifié");
            const response = await fetch(`/api/forum/posts/${postId}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
                body: JSON.stringify({ content: replyContent }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "La création a échoué");
            }
            const newReply = await response.json();
            toast({ title: "Réponse publiée !", description: "Votre réponse a été ajoutée." });
            setReplyContent("");
            onReplyAdded(newReply);
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white text-lg">Votre réponse</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea placeholder="Écrivez votre réponse..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="bg-slate-700 border-slate-600 text-white min-h-[120px]" disabled={isSubmitting}/>
                  <div className="flex justify-end"><Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting || !replyContent.trim()}>{isSubmitting ? "Publication..." : "Publier"}</Button></div>
                </form>
              </CardContent>
            </Card>
            <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        </>
    );
}

// --- Composant principal ---
interface ForumDetailClientProps {
  post: ForumPostDetail;
}

export default function ForumDetailClient({ post }: ForumDetailClientProps) {
  const [currentPost, setCurrentPost] = useState(post);
  const { profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleReplyAdded = (newReply: ForumReply) => {
    setCurrentPost(prevPost => ({
      ...prevPost,
      replies: [...prevPost.replies, newReply]
    }));
  };

  const handleReplyDeleted = (replyId: string) => {
    setCurrentPost(prevPost => ({
      ...prevPost,
      replies: prevPost.replies.filter(r => r.id !== replyId)
    }));
  };

  const handlePostDelete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/forum/posts/${post.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "La suppression a échoué");
      }
      toast({ title: "Sujet supprimé", description: "Le sujet et ses réponses ont été supprimés." });
      router.push('/forum');
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/forum" className="inline-flex items-center text-white hover:text-purple-300 mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Retour au forum</Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {currentPost.is_pinned && <Pin className="w-5 h-5 text-yellow-500" />}
                    {currentPost.is_locked && <Lock className="w-5 h-5 text-gray-500" />}
                    <h1 className="text-3xl font-bold">{currentPost.title}</h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Badge style={{ backgroundColor: currentPost.category.color }} className="text-white">{currentPost.category.name}</Badge>
                    {currentPost.tags?.map((tag) => (<Badge key={tag} variant="outline" className="border-purple-500 text-purple-400">#{tag}</Badge>))}
                  </div>
                </div>
                {profile?.role === 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible. Voulez-vous vraiment supprimer ce sujet et toutes ses réponses ?</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handlePostDelete}>Confirmer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mt-4">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{currentPost.views} vues</span></div>
                <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /><span>{currentPost.replies.length} réponses</span></div>
                <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{currentPost.like_count} likes</span></div>
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Publié le {formatDate(currentPost.created_at)}</span></div>
              </div>
            </div>
            <Separator className="bg-slate-700 mb-6" />
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2 flex-shrink-0 w-32">
                 <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700">
                    {currentPost.author.avatar_url ? (<Image src={currentPost.author.avatar_url} alt={`${currentPost.author.username} avatar`} fill className="object-cover" />) : (<div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">{currentPost.author.username[0]?.toUpperCase() || "?"}</div>)}
                 </div>
                 <div className="text-center">
                    <p className="text-white font-bold">{currentPost.author.username}</p>
                    <Badge className={`${getRoleColor(currentPost.author.role)} text-white text-sm`}>{getRoleText(currentPost.author.role)}</Badge>
                    <p className="text-gray-400 text-sm mt-1">{currentPost.author.post_count || 0} posts</p>
                    <p className="text-gray-400 text-sm">Membre depuis {formatDate(currentPost.author.join_date)}</p>
                 </div>
              </div>
              <div className="flex-1"><div className="prose prose-invert max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap">{currentPost.content}</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-white text-2xl font-bold mb-6">Réponses ({currentPost.replies.length})</h2>
        <div className="space-y-4">
          {currentPost.replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} onDelete={handleReplyDeleted} />
          ))}
        </div>
      </div>
      {!currentPost.is_locked && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <ReplyForm postId={currentPost.id} onReplyAdded={handleReplyAdded} />
        </div>
      )}
    </div>
  );
}
