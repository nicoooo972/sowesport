import { notFound } from "next/navigation";
import ForumDetailClient from "./ForumDetailClient";

// Interfaces mises à jour pour correspondre aux données de l'API
export interface ForumAuthor {
  id: string;
  username: string;
  avatar_url: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  join_date: string;
  post_count: number;
}

export interface ForumReply {
  id: string;
  content: string;
  author: ForumAuthor;
  created_at: string;
  like_count: number;
  reply_to_id: string | null;
  reply_likes?: { user_id: string }[];
}

export interface ForumCategory {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface ForumPostDetail {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  author: ForumAuthor;
  replies: ForumReply[];
  views: number;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  tags: string[];
  last_reply_at: string | null;
}

// Fonction pour récupérer les données du post depuis l'API
async function getForumPost(id: string): Promise<ForumPostDetail | null> {
  try {
    // Dans un environnement de production, utilisez l'URL complète
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/forum/posts/${id}`, {
      // Désactiver le cache pour les données en temps réel
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    return null;
  }
}

// generateStaticParams n'est plus nécessaire car nous utilisons des données dynamiques
// Nous pouvons le garder pour la performance en pré-générant quelques pages populaires
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/forum/posts?limit=10`);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.posts.map((post: any) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error);
    return [];
  }
}

// Page serveur principale
export default async function ForumDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await getForumPost(params.id);

  if (!post) {
    notFound();
  }

  return <ForumDetailClient post={post} />;
}

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await getForumPost(params.id);

  if (!post) {
    return {
      title: 'Post non trouvé - SowEsport Forum',
    };
  }

  return {
    title: `${post.title} - SowEsport Forum`,
    description: post.content.substring(0, 160) + '...',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160) + '...',
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author.username],
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.content.substring(0, 160) + '...',
    },
  };
} 