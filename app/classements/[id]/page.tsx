import { notFound } from "next/navigation";
import ClassementDetailClient from "./ClassementDetailClient";

// Interfaces partagées
export interface Team {
  id: string;
  name: string;
  logo: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  trend: "up" | "down" | "stable";
}

export interface RankingDetail {
  id: string;
  title: string;
  game: string;
  teams: number;
  location: string;
  prize: string;
  date: string;
  status: "en-ligne" | "termine" | "a-venir";
  bannerImage: string;
  standings: Team[];
}

// Données mock enrichies pour les détails des classements
const rankingsData: Record<string, RankingDetail> = {
  "lfl-spring-split": {
    id: "lfl-spring-split",
    title: "LFL Spring Split 2025",
    game: "League of Legends",
    teams: 16,
    location: "Paris",
    prize: "150,000€",
    date: "15 Jan - 28 Mar 2025",
    status: "en-ligne",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    standings: [
      {
        id: "karmine-corp",
        name: "Karmine Corp",
        logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 16,
        losses: 2,
        points: 48,
        trend: "up"
      },
      {
        id: "ldlc-ol",
        name: "LDLC OL",
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 14,
        losses: 4,
        points: 42,
        trend: "up"
      },
      {
        id: "vitality",
        name: "Team Vitality",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 13,
        losses: 5,
        points: 39,
        trend: "stable"
      },
      {
        id: "solary",
        name: "Solary",
        logo: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 12,
        losses: 6,
        points: 36,
        trend: "down"
      },
      {
        id: "gameward",
        name: "Gameward",
        logo: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 11,
        losses: 7,
        points: 33,
        trend: "up"
      },
      {
        id: "team-go",
        name: "Team GO",
        logo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 10,
        losses: 8,
        points: 30,
        trend: "stable"
      },
      {
        id: "mirage-elyandra",
        name: "Mirage Elyandra",
        logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 9,
        losses: 9,
        points: 27,
        trend: "down"
      },
      {
        id: "team-du-sud",
        name: "Team du Sud",
        logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 8,
        losses: 10,
        points: 24,
        trend: "down"
      }
    ]
  },
  "valorant-championship": {
    id: "valorant-championship",
    title: "Valorant Champions Tour France",
    game: "Valorant",
    teams: 24,
    location: "Lyon",
    prize: "75,000€",
    date: "10 Jan - 15 Fév 2025",
    status: "en-ligne",
    bannerImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    standings: [
      {
        id: "kcorp-valorant",
        name: "Karmine Corp Blue",
        logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 12,
        wins: 11,
        losses: 1,
        points: 33,
        trend: "up"
      },
      {
        id: "vitality-val",
        name: "Team Vitality",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 12,
        wins: 9,
        losses: 3,
        points: 27,
        trend: "up"
      },
      {
        id: "gentle-mates",
        name: "Gentle Mates",
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 12,
        wins: 8,
        losses: 4,
        points: 24,
        trend: "stable"
      },
      {
        id: "team-falcons",
        name: "Team Falcons",
        logo: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 12,
        wins: 7,
        losses: 5,
        points: 21,
        trend: "down"
      }
    ]
  }
};

// generateStaticParams pour les routes statiques
export async function generateStaticParams() {
  return Object.keys(rankingsData).map((id) => ({
    id: id,
  }));
}

// Page serveur principale
export default function ClassementDetailPage({ params }: { params: { id: string } }) {
  const ranking = rankingsData[params.id];

  if (!ranking) {
    notFound();
  }

  return <ClassementDetailClient ranking={ranking} />;
} 