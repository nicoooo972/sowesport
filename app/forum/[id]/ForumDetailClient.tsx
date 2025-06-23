"use client";

import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Eye, Pin, Lock, Calendar, User, ThumbsUp, Reply, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { ForumPostDetail, ForumReply, ForumAuthor } from "./page";

// Composant pour afficher une réponse
function ReplyCard({ reply }: { reply: ForumReply }) {
  const [isLiked, setIsLiked] = useState(reply.isLiked);
  const [likes, setLikes] = useState(reply.likes);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-600";
      case "moderator": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "moderator": return "Mod";
      default: return "Membre";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar et infos utilisateur */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700">
              <Image
                src={reply.author.avatar}
                alt={`${reply.author.name} avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">{reply.author.name}</p>
              <Badge className={`${getRoleColor(reply.author.role)} text-white text-xs`}>
                {getRoleText(reply.author.role)}
              </Badge>
              <p className="text-gray-400 text-xs mt-1">{reply.author.posts} posts</p>
              <p className="text-gray-400 text-xs">Membre depuis {reply.author.joinDate}</p>
            </div>
          </div>

          {/* Contenu de la réponse */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Publié {reply.createdAt}</span>
              </div>
            </div>

            {/* Contenu */}
            <div className="prose prose-invert max-w-none mb-4">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`text-gray-400 hover:text-white ${isLiked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Reply className="w-4 h-4 mr-1" />
                Répondre
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour le formulaire de réponse
function ReplyForm() {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on pourrait envoyer la réponse à l'API
    console.log("Nouvelle réponse:", replyContent);
    setReplyContent("");
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Répondre au sujet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Écrivez votre réponse..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-[120px]"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!replyContent.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Publier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface ForumDetailClientProps {
  post: ForumPostDetail;
}

export default function ForumDetailClient({ post }: ForumDetailClientProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-600";
      case "moderator": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "moderator": return "Mod";
      default: return "Membre";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "League of Legends": return "bg-blue-600";
      case "Valorant": return "bg-red-600";
      case "Rocket League": return "bg-orange-600";
      case "Annonces": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header avec bouton retour */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/forum">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-6 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au forum
            </Button>
          </Link>
        </div>
      </div>

      {/* Post principal */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header du post */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {post.isPinned && <Pin className="w-5 h-5 text-yellow-500" />}
                {post.isLocked && <Lock className="w-5 h-5 text-gray-500" />}
                <h1 className="text-3xl font-bold text-white">{post.title}</h1>
              </div>

              {/* Métadonnées */}
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`${getCategoryColor(post.category)} text-white`}>
                  {post.category}
                </Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-purple-500 text-purple-400">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Statistiques */}
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.replies.length} réponses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {post.createdAt}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700 mb-6" />

            {/* Auteur et contenu */}
            <div className="flex gap-6">
              {/* Infos auteur */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700">
                  <Image
                    src={post.author.avatar}
                    alt={`${post.author.name} avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">{post.author.name}</p>
                  <Badge className={`${getRoleColor(post.author.role)} text-white text-sm`}>
                    {getRoleText(post.author.role)}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">{post.author.posts} posts</p>
                  <p className="text-gray-400 text-sm">Membre depuis {post.author.joinDate}</p>
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <div className="prose prose-invert max-w-none mb-6">
                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className={`text-gray-400 hover:text-white ${isLiked ? 'text-red-500' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    <Reply className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Réponses */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-white text-2xl font-bold mb-6">
          Réponses ({post.replies.length})
        </h2>
        <div className="space-y-4">
          {post.replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))}
        </div>
      </div>

      {/* Formulaire de réponse */}
      {!post.isLocked && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <ReplyForm />
        </div>
      )}

      {/* Message si verrouillé */}
      {post.isLocked && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">Ce sujet est verrouillé. Vous ne pouvez plus y répondre.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 