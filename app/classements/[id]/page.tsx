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

// Données mock pour les détails des classements
const rankingsData: Record<string, RankingDetail> = {
  "lfl-spring-split": {
    id: "lfl-spring-split",
    title: "LFL Spring Split",
    game: "League of legends",
    teams: 16,
    location: "Paris",
    prize: "1,000,000 €",
    date: "20 Fév 2025",
    status: "en-ligne",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    standings: [
      {
        id: "karmine-corp",
        name: "Karmine Corp",
        logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 14,
        losses: 4,
        points: 42,
        trend: "up"
      },
      {
        id: "ldlc-ol",
        name: "LDLC OL",
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 13,
        losses: 5,
        points: 39,
        trend: "up"
      },
      {
        id: "vitality",
        name: "Vitality",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 12,
        losses: 6,
        points: 36,
        trend: "down"
      },
      {
        id: "solary",
        name: "Solary",
        logo: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        matchesPlayed: 18,
        wins: 11,
        losses: 7,
        points: 33,
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