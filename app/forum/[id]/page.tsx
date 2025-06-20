import { notFound } from "next/navigation";
import ForumDetailClient from "./ForumDetailClient";

// Interfaces partagées
export interface ForumAuthor {
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  joinDate: string;
  posts: number;
}

export interface ForumReply {
  id: string;
  content: string;
  author: ForumAuthor;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface ForumPostDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  author: ForumAuthor;
  replies: ForumReply[];
  views: number;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  tags: string[];
}

// Données mock pour les détails des posts
const forumPostsData: Record<string, ForumPostDetail> = {
  "patch-13-3-discussion": {
    id: "patch-13-3-discussion",
    title: "Discussion sur le patch 13.3 de League of Legends",
    content: `Le nouveau patch 13.3 de League of Legends apporte des changements majeurs à la méta actuelle. Voici les points les plus importants :

**Changements majeurs :**
- Nerf de Jinx : réduction des dégâts de base de son Q
- Buff de Azir : augmentation de la portée de ses soldats
- Modification de la jungle : les camps donnent plus d'or mais respawnent plus lentement

**Impact sur la méta :**
Ces changements vont probablement favoriser un style de jeu plus axé sur le late game. Les ADC vont devoir être plus prudents en début de partie.

Qu'est-ce que vous en pensez ? Est-ce que ces changements vont changer votre façon de jouer ?`,
    category: "League of Legends",
    author: {
      name: "GameMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "admin",
      joinDate: "Janvier 2020",
      posts: 1250
    },
    replies: [
      {
        id: "reply-1",
        content: "Excellente analyse ! Je pense que le nerf de Jinx était nécessaire, elle dominait trop la botlane ces derniers temps. Par contre, le buff d'Azir me fait un peu peur pour les matchs pro.",
        author: {
          name: "ProPlayer92",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          role: "member",
          joinDate: "Mars 2022",
          posts: 456
        },
        createdAt: "Il y a 2h",
        likes: 12,
        isLiked: false
      },
      {
        id: "reply-2",
        content: "Les changements de jungle sont intéressants. Ça va favoriser les junglers qui savent bien optimiser leurs routes. Fini les clear speed champions sans cervelle !",
        author: {
          name: "JungleKing",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          role: "moderator",
          joinDate: "Septembre 2021",
          posts: 789
        },
        createdAt: "Il y a 4h",
        likes: 8,
        isLiked: true
      },
      {
        id: "reply-3",
        content: "Franchement je ne comprends pas pourquoi ils buffent Azir alors qu'il est déjà très fort en teamfight. Riot et leur obsession pour ce champion...",
        author: {
          name: "MidLaner2025",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          role: "member",
          joinDate: "Octobre 2023",
          posts: 234
        },
        createdAt: "Il y a 6h",
        likes: 5,
        isLiked: false
      }
    ],
    views: 1250,
    likes: 25,
    isLiked: false,
    isPinned: true,
    isLocked: false,
    createdAt: "15 Janvier 2025",
    tags: ["patch", "meta", "discussion"]
  },
  "valorant-champions-predictions": {
    id: "valorant-champions-predictions",
    title: "Prédictions Valorant Champions 2025",
    content: `Les Valorant Champions 2025 approchent à grands pas ! Voici mes prédictions pour les équipes qui vont dominer cette année :

**Top 3 attendu :**
1. **Fnatic** - Leur synergie d'équipe est exceptionnelle cette saison
2. **LOUD** - Ils ont prouvé qu'ils pouvaient battre n'importe qui
3. **Paper Rex** - Leur style agressif peut surprendre

**Équipes à surveiller :**
- Team Liquid avec leur nouveau roster
- NAVI qui monte en puissance
- Les équipes coréennes qui progressent vite

Qu'est-ce que vous en pensez ? Qui sont vos favoris pour cette édition ?`,
    category: "Valorant", 
    author: {
      name: "EsportAnalyst",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      role: "moderator",
      joinDate: "Juin 2021",
      posts: 892
    },
    replies: [
      {
        id: "reply-val-1",
        content: "Je suis d'accord pour Fnatic en #1, mais je pense que LOUD va avoir du mal cette année. Leurs adversaires ont beaucoup progressé.",
        author: {
          name: "ValorantFan",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          role: "member",
          joinDate: "Février 2023",
          posts: 345
        },
        createdAt: "Il y a 4h",
        likes: 7,
        isLiked: false
      }
    ],
    views: 890,
    likes: 18,
    isLiked: false,
    isPinned: false,
    isLocked: false,
    createdAt: "18 Janvier 2025",
    tags: ["valorant", "champions", "predictions", "esport"]
  }
};

// generateStaticParams pour les routes statiques
export async function generateStaticParams() {
  return Object.keys(forumPostsData).map((id) => ({
    id: id,
  }));
}

// Page serveur principale
export default function ForumDetailPage({ params }: { params: { id: string } }) {
  const post = forumPostsData[params.id];

  if (!post) {
    notFound();
  }

  return <ForumDetailClient post={post} />;
} 