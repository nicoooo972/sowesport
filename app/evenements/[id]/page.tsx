import EventDetailClient from "./EventDetailClient";
import { supabase } from "@/lib/supabase";

// Types pour les équipes et classements
interface Team {
  id: string;
  name: string;
  logo: string;
  rank?: number;
  matchesJoues?: number;
  victoires?: number;
  defaites?: number;
  points?: number;
  tendance?: "up" | "down" | "stable";
}

interface Event {
  id: string;
  title: string;
  game: string;
  subtitle: string;
  description: string;
  teams: number;
  prize: string;
  location: string;
  date: string;
  time: string;
  status: "online" | "closed";
  registered: boolean;
  image: string;
  format: string;
  organizer: string;
  organizerLogo: string;
}

// Données mock pour les événements (fallback)
const eventsData: { [key: string]: Event } = {
  "1": {
    id: "1",
    title: "LFL Spring Split",
    game: "League of Legends",
    subtitle: "Classements détaillés",
    description: "Le plus grand tournoi français de League of Legends revient pour une nouvelle saison",
    teams: 16,
    prize: "1 000 000 €",
    location: "Paris",
    date: "20 Fév 2025",
    time: "18:00",
    status: "online",
    registered: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop&crop=center",
    format: "Double élimination",
    organizer: "Riot Games France",
    organizerLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop&crop=center"
  },
  "2": {
    id: "2",
    title: "Rocket League World Cup",
    game: "Rocket League",
    subtitle: "Championnat mondial",
    description: "Les meilleures équipes de Rocket League s'affrontent pour le titre de champion du monde.",
    teams: 12,
    prize: "500 000 €",
    location: "Lyon",
    date: "25 Février 2025",
    time: "19:00",
    status: "online",
    registered: false,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop&crop=center",
    format: "Round Robin + Playoffs",
    organizer: "Psyonix",
    organizerLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop&crop=center"
  }
};

// Équipes participantes
const participatingTeams: Team[] = [
  { id: "1", name: "Karmine Corp", logo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=40&h=40&fit=crop&crop=center" },
  { id: "2", name: "Solary", logo: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=40&h=40&fit=crop&crop=center" },
  { id: "3", name: "Vitality", logo: "https://images.unsplash.com/photo-1614294149010-e6e13aa2a80f?w=40&h=40&fit=crop&crop=center" },
  { id: "4", name: "Jargis", logo: "https://images.unsplash.com/photo-1614294148891-37298467ab11?w=40&h=40&fit=crop&crop=center" },
  { id: "5", name: "LDLC OL", logo: "https://images.unsplash.com/photo-1614294149174-18e6c770bda8?w=40&h=40&fit=crop&crop=center" },
  { id: "6", name: "PSG Esport", logo: "https://images.unsplash.com/photo-1614294148889-bfe9c96bd8c3?w=40&h=40&fit=crop&crop=center" },
  { id: "7", name: "Gentle Mates", logo: "https://images.unsplash.com/photo-1614294149023-ea7df6b5160b?w=40&h=40&fit=crop&crop=center" },
  { id: "8", name: "MCES", logo: "https://images.unsplash.com/photo-1614294148997-92c4d8eb7e49?w=40&h=40&fit=crop&crop=center" },
  { id: "9", name: "GameWard", logo: "https://images.unsplash.com/photo-1614294148884-6cb05f77a1d5?w=40&h=40&fit=crop&crop=center" },
  { id: "10", name: "GamersOrigin", logo: "https://images.unsplash.com/photo-1614294149177-5c45a738b1f3?w=40&h=40&fit=crop&crop=center" },
  { id: "11", name: "Team BDS", logo: "https://images.unsplash.com/photo-1614294148882-ddf3a2e5b5b0?w=40&h=40&fit=crop&crop=center" },
  { id: "12", name: "Mandatory", logo: "https://images.unsplash.com/photo-1614294149020-82d6fdea7a2e?w=40&h=40&fit=crop&crop=center" },
  { id: "13", name: "Mirifik Premier", logo: "https://images.unsplash.com/photo-1614294148993-2d96b6f5d3d2?w=40&h=40&fit=crop&crop=center" },
  { id: "14", name: "Joblife", logo: "https://images.unsplash.com/photo-1614294149180-7b2b7b9b8b8b?w=40&h=40&fit=crop&crop=center" },
  { id: "15", name: "Mad Lions", logo: "https://images.unsplash.com/photo-1614294148878-1b5b7b9b8b8b?w=40&h=40&fit=crop&crop=center" },
  { id: "16", name: "Evalty", logo: "https://images.unsplash.com/photo-1614294149014-9c2b7b9b8b8b?w=40&h=40&fit=crop&crop=center" }
];

// Classement actuel
const currentRanking: Team[] = [
  { 
    id: "15", 
    name: "Mad Lions", 
    logo: "https://images.unsplash.com/photo-1614294148878-1b5b7b9b8b8b?w=40&h=40&fit=crop&crop=center", 
    rank: 1, 
    matchesJoues: 18, 
    victoires: 14, 
    defaites: 4, 
    points: 42, 
    tendance: "up" 
  },
  { 
    id: "5", 
    name: "LDLC OL", 
    logo: "https://images.unsplash.com/photo-1614294149174-18e6c770bda8?w=40&h=40&fit=crop&crop=center", 
    rank: 2, 
    matchesJoues: 18, 
    victoires: 13, 
    defaites: 5, 
    points: 39, 
    tendance: "up" 
  },
  { 
    id: "2", 
    name: "Solary", 
    logo: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=40&h=40&fit=crop&crop=center", 
    rank: 3, 
    matchesJoues: 18, 
    victoires: 12, 
    defaites: 6, 
    points: 36, 
    tendance: "stable" 
  },
  { 
    id: "7", 
    name: "Gentle Mates", 
    logo: "https://images.unsplash.com/photo-1614294149023-ea7df6b5160b?w=40&h=40&fit=crop&crop=center", 
    rank: 4, 
    matchesJoues: 18, 
    victoires: 11, 
    defaites: 7, 
    points: 33, 
    tendance: "down" 
  }
];

// Fonction requise pour l'export statique - récupère les événements depuis Supabase
export async function generateStaticParams() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('id');

    if (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      // Fallback sur les données mockées
      return Object.keys(eventsData).map((id) => ({ id }));
    }

    // Combiner les événements Supabase et mockés
    const supabaseIds = events?.map(event => ({ id: event.id })) || [];
    const mockIds = Object.keys(eventsData).map((id) => ({ id }));
    
    return [...supabaseIds, ...mockIds];
  } catch (error) {
    console.error('Erreur:', error);
    // Fallback sur les données mockées
    return Object.keys(eventsData).map((id) => ({ id }));
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: PageProps) {
  return <EventDetailClient eventId={params.id} />;
} 