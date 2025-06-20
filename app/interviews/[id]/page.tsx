import { notFound } from "next/navigation";
import InterviewDetailClient from "./InterviewDetailClient";

// Interfaces partagées
export interface InterviewDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  interviewee: {
    name: string;
    role: string;
    team?: string;
    avatar: string;
    bio: string;
    achievements: string[];
  };
  interviewer: {
    name: string;
    avatar: string;
  };
  category: string;
  duration: string;
  publishedAt: string;
  views: number;
  likes: number;
  isLiked: boolean;
  thumbnail: string;
  isVideo: boolean;
  videoUrl?: string;
  tags: string[];
  relatedInterviews: string[];
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp?: string;
}

// Données mock pour les détails des interviews
const interviewsData: Record<string, InterviewDetail> = {
  "kcorp-cabochard-interview": {
    id: "kcorp-cabochard-interview",
    title: "Cabochard nous parle de la nouvelle saison LFL",
    description: "Le toplaner de Karmine Corp revient sur les objectifs de l'équipe pour cette saison et sa préparation personnelle.",
    content: `Dans cette interview exclusive, Cabochard, le toplaner emblématique de Karmine Corp, nous livre ses impressions sur la nouvelle saison LFL qui s'annonce. 

Avec plusieurs années d'expérience au plus haut niveau européen, le joueur français partage sa vision de l'évolution de l'équipe et de ses ambitions personnelles pour 2025.

Au programme de cet entretien : stratégies d'équipe, préparation mentale, et bien sûr, les objectifs de Karmine Corp pour cette saison qui s'annonce cruciale.`,
    interviewee: {
      name: "Cabochard",
      role: "Toplaner",
      team: "Karmine Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Joueur professionnel français de League of Legends, évoluant au poste de toplaner. Reconnu pour son style agressif et sa capacité à porter son équipe, il est l'une des figures emblématiques de la scène française.",
      achievements: [
        "Champion LFL 2023",
        "Qualification Worlds 2024",
        "MVP Split Summer 2023",
        "5 années en LEC"
      ]
    },
    interviewer: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "League of Legends",
    duration: "15 min",
    publishedAt: "Il y a 2 jours",
    views: 12500,
    likes: 342,
    isLiked: false,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isVideo: true,
    videoUrl: "https://example.com/video/cabochard-interview",
    tags: ["interview", "lfl", "karmine-corp", "toplaner"],
    relatedInterviews: ["vitality-coach-interview", "scream-valorant-tips"]
  },
  "scream-valorant-tips": {
    id: "scream-valorant-tips",
    title: "ScreaM partage ses secrets sur Valorant",
    description: "L'ancien joueur CS:GO nous livre ses conseils pour performer sur Valorant et parle de l'évolution de la scène FPS.",
    content: `ScreaM, légende vivante du FPS français, nous accorde une interview exceptionnelle où il dévoile ses secrets pour exceller sur Valorant.

De son passage remarqué sur Counter-Strike à sa reconversion réussie sur Valorant, le joueur belge d'origine marocaine partage son expertise unique et ses conseils pour les joueurs aspirants.

Cette interview écrite explore en profondeur les techniques, l'état d'esprit et la philosophie de jeu qui ont fait de ScreaM l'un des joueurs les plus respectés de la scène FPS internationale.`,
    interviewee: {
      name: "ScreaM",
      role: "Pro Player",
      team: "Team Liquid",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Joueur professionnel belge reconnu comme l'un des meilleurs aimeurs au monde. Après une carrière légendaire sur CS:GO, il s'est reconverti avec succès sur Valorant où il continue de briller au plus haut niveau.",
      achievements: [
        "Major CS:GO Semi-finalist",
        "Valorant Champions Tour Winner",
        "Best Aimer Award 2023",
        "10+ années pro"
      ]
    },
    interviewer: {
      name: "Thomas Laurent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    category: "Valorant",
    duration: "18 min",
    publishedAt: "Il y a 1 semaine",
    views: 15600,
    likes: 567,
    isLiked: false,
    thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isVideo: false,
    tags: ["interview", "valorant", "tips", "fps"],
    relatedInterviews: ["kcorp-cabochard-interview", "analyst-esport-evolution"]
  }
};

// Questions et réponses pour les interviews
export const interviewQuestions: Record<string, Question[]> = {
  "kcorp-cabochard-interview": [
    {
      id: "q1",
      question: "Comment te sens-tu avant cette nouvelle saison LFL ?",
      answer: "Je me sens vraiment bien ! L'équipe a beaucoup travaillé pendant l'intersaison. On a analysé nos erreurs de l'année dernière et on a mis en place de nouvelles stratégies. L'ambiance dans l'équipe est excellente, et je pense qu'on va surprendre beaucoup de monde cette saison.",
      timestamp: "0:45"
    },
    {
      id: "q2", 
      question: "Quels sont les objectifs de Karmine Corp pour 2025 ?",
      answer: "Nos objectifs sont clairs : on veut dominer la LFL et se qualifier pour les compétitions internationales. On ne se cache pas, on vise le titre. L'organisation nous donne tous les moyens pour réussir, maintenant c'est à nous de le prouver sur le Rift.",
      timestamp: "3:20"
    },
    {
      id: "q3",
      question: "Comment s'est passée ta préparation personnelle ?",
      answer: "J'ai beaucoup travaillé sur ma condition physique et mentale. Le coaching staff m'a aidé à identifier mes points faibles et on a mis en place un programme spécifique. J'ai aussi étudié énormément de replays pour améliorer ma lecture de jeu.",
      timestamp: "6:10"
    },
    {
      id: "q4",
      question: "Que penses-tu du niveau actuel de la LFL ?",
      answer: "Le niveau monte chaque année ! Il y a de plus en plus de talents français qui émergent. La concurrence est rude, ce qui nous pousse tous à nous améliorer. C'est ça qui rend cette ligue si passionnante à suivre.",
      timestamp: "9:30"
    }
  ],
  "scream-valorant-tips": [
    {
      id: "q1",
      question: "Comment as-tu réussi ta transition de CS:GO vers Valorant ?",
      answer: "La transition n'a pas été évidente au début. Valorant a ses propres mécaniques avec les agents et les capacités. Mais les fondamentaux du FPS restent les mêmes : placement, timing, aim. J'ai dû réapprendre certains aspects tout en gardant ce qui fonctionnait déjà."
    },
    {
      id: "q2",
      question: "Quels conseils donnerais-tu aux joueurs qui veulent progresser ?",
      answer: "Le plus important, c'est la régularité dans l'entraînement. Il faut travailler son aim tous les jours, mais aussi comprendre le jeu tactique. Regardez les pros jouer, analysez leurs décisions. Et surtout, soyez patients - la progression demande du temps."
    },
    {
      id: "q3", 
      question: "Comment maintiens-tu ta précision légendaire ?",
      answer: "C'est un travail quotidien ! Je fais au minimum 30 minutes d'aim training par jour, même pendant les vacances. Mais la précision, ce n'est pas que mécanique - c'est aussi mental. Il faut rester calme et confiant dans les moments cruciaux."
    },
    {
      id: "q4",
      question: "Que penses-tu de l'évolution de la scène Valorant ?",
      answer: "Valorant évolue à une vitesse incroyable ! Riot fait un travail fantastique pour développer la scène compétitive. Les équipes deviennent de plus en plus professionnelles, et le niveau général monte énormément. C'est passionnant à vivre de l'intérieur."
    }
  ]
};

// generateStaticParams pour les routes statiques
export async function generateStaticParams() {
  return Object.keys(interviewsData).map((id) => ({
    id: id,
  }));
}

// Page serveur principale
export default function InterviewDetailPage({ params }: { params: { id: string } }) {
  const interview = interviewsData[params.id];
  const questions = interviewQuestions[params.id] || [];

  if (!interview) {
    notFound();
  }

  return <InterviewDetailClient interview={interview} questions={questions} />;
} 