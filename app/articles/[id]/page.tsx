import { notFound } from "next/navigation";
import ArticleDetailClient from "./ArticleDetailClient";

// Interfaces partagées
export interface ArticleDetail {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    socialLinks: {
      twitter?: string;
      linkedin?: string;
    };
  };
  category: string;
  publishedAt: string;
  lastUpdated?: string;
  readTime: string;
  views: number;
  likes: number;
  isLiked: boolean;
  featuredImage: string;
  isFeatured: boolean;
  isBreaking: boolean;
  tags: string[];
  relatedArticles: string[];
  tableOfContents: {
    id: string;
    title: string;
    level: number;
  }[];
}

// Données mock pour les détails des articles
const articlesData: Record<string, ArticleDetail> = {
  "lfl-spring-split-preview": {
    id: "lfl-spring-split-preview",
    title: "LFL Spring Split 2025 : Notre preview complète",
    excerpt: "Analyse approfondie des équipes, transferts marquants et prédictions pour la nouvelle saison de la Ligue Française de League of Legends.",
    content: `# Introduction

La LFL Spring Split 2025 s'annonce comme l'une des saisons les plus compétitives de l'histoire de la ligue française. Avec de nombreux transferts surprenants et l'arrivée de nouveaux talents, cette saison promet d'être passionnante.

## Les équipes favorites

### Karmine Corp
L'organisation de Kameto reste sur une excellente saison 2024 et compte bien réitérer ses performances. Avec un roster renforcé et une préparation optimale, KCorp fait figure de grande favorite.

**Points forts :**
- Synergie d'équipe exceptionnelle
- Expérience en compétitions internationales
- Staff technique de qualité

### Team Vitality
Vitality a fait le choix de la jeunesse avec l'intégration de plusieurs rookies prometteurs. Un pari risqué mais qui pourrait s'avérer payant.

### LDLC OL
L'équipe lyonnaise mise sur la stabilité avec un roster peu changé. Leur expérience pourrait faire la différence dans les moments cruciaux.

## Les nouveaux visages

Cette saison voit l'arrivée de plusieurs joueurs talentueux :

- **Rookie1** : Ex-joueur de l'ERL espagnole, rejoint KCorp au poste de jungler
- **Veteran2** : Retour surprise d'un ancien joueur LEC chez Vitality
- **Young3** : Prodige français de 17 ans, intègre LDLC OL

## Nos prédictions

Basées sur les performances passées et les changements de roster, voici nos prédictions pour le Top 5 :

1. **Karmine Corp** - L'expérience et la synergie feront la différence
2. **Team Vitality** - Les rookies pourraient créer la surprise
3. **LDLC OL** - La régularité sera leur atout
4. **Solary** - Équipe à surveiller avec leur nouveau midlaner
5. **Team GO** - Progression attendue cette saison

## Format et calendrier

La LFL 2025 conserve son format habituel :
- 10 équipes en saison régulière
- Double round-robin (18 matchs par équipe)
- Playoffs avec les 6 meilleures équipes
- Finales en BO5

Le coup d'envoi sera donné le **15 février 2025** avec un match d'ouverture entre Karmine Corp et Team Vitality.

## Conclusion

Cette saison s'annonce comme l'une des plus ouvertes de l'histoire de la LFL. Avec l'arrivée de nouveaux talents et les changements de roster, tous les scénarios sont possibles. Une chose est sûre : les spectateurs vont être gâtés !`,
    author: {
      name: "Alexandre Martin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Journaliste esport spécialisé League of Legends depuis 5 ans. Passionné par la scène française et européenne, il couvre les principales compétitions.",
      socialLinks: {
        twitter: "https://twitter.com/alex_martin_lol",
        linkedin: "https://linkedin.com/in/alexandre-martin"
      }
    },
    category: "League of Legends",
    publishedAt: "Il y a 1 jour",
    lastUpdated: "Il y a 6 heures",
    readTime: "8 min",
    views: 15200,
    likes: 342,
    isLiked: false,
    featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isBreaking: false,
    tags: ["lfl", "preview", "esport", "karmine-corp", "vitality"],
    relatedArticles: ["karmine-corp-transferts", "valorant-meta-analysis"],
    tableOfContents: [
      { id: "introduction", title: "Introduction", level: 1 },
      { id: "equipes-favorites", title: "Les équipes favorites", level: 2 },
      { id: "karmine-corp", title: "Karmine Corp", level: 3 },
      { id: "team-vitality", title: "Team Vitality", level: 3 },
      { id: "ldlc-ol", title: "LDLC OL", level: 3 },
      { id: "nouveaux-visages", title: "Les nouveaux visages", level: 2 },
      { id: "predictions", title: "Nos prédictions", level: 2 },
      { id: "format-calendrier", title: "Format et calendrier", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 }
    ]
  },
  "karmine-corp-transferts": {
    id: "karmine-corp-transferts",
    title: "🔥 BREAKING: Karmine Corp annonce ses nouveaux transferts",
    excerpt: "L'organisation française frappe fort avec l'arrivée de trois nouveaux joueurs de talent pour renforcer son roster.",
    content: `# Karmine Corp frappe fort sur le marché des transferts

Dans un communiqué officiel publié ce matin, Karmine Corp a dévoilé ses nouveaux transferts pour la saison 2025. L'organisation de Kameto n'a pas fait les choses à moitié.

## Les nouvelles recrues

### Un jungler de renommée internationale
Le plus gros coup de cette session de transferts est sans conteste l'arrivée de **"JungleKing"**, ancien joueur de l'équipe coréenne T1. Avec ses 3 titres internationaux, il apporte une expérience précieuse.

### Un support européen confirmé
**"VisionMaster"** quitte Fnatic pour rejoindre les rangs de KCorp. Reconnu pour son shot-calling exceptionnel, il devrait apporter la maturité tactique nécessaire.

### Un rookie français prometteur
Enfin, **"FrenchTalent"** intègre l'académie de KCorp avec une promotion directe en équipe première. À seulement 18 ans, il est considéré comme l'un des plus grands espoirs français.

## Les départs
Ces arrivées s'accompagnent de quelques départs :
- **"OldGuard"** prend sa retraite après 6 années de bons et loyaux services
- **"Veteran"** rejoint Team Vitality dans un échange
- **"Rookie2024"** retourne en académie pour continuer sa progression

## L'analyse
Ces transferts montrent clairement les ambitions de Karmine Corp pour 2025. Avec un mélange d'expérience internationale et de talent local, l'équipe semble parfaitement armée pour les défis à venir.

Le budget alloué à ces transferts serait de **2.5 millions d'euros**, un record pour une organisation française.

## Réactions
**Kameto**, CEO de Karmine Corp : *"Ces recrues s'inscrivent dans notre vision long terme. Nous voulons être compétitifs au niveau européen et international."*

**"JungleKing"** : *"Rejoindre KCorp était une évidence. L'ambiance et le projet m'ont convaincu."*

## La suite
L'équipe se retrouvera dès lundi prochain pour débuter sa préparation. Le premier match officiel aura lieu le 15 février contre Team Vitality, un derby français qui s'annonce bouillant.`,
    author: {
      name: "Thomas Laurent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Spécialiste des transferts et de l'actualité esport française. Suit de près l'évolution du marché des joueurs professionnels.",
      socialLinks: {
        twitter: "https://twitter.com/thomas_transferts"
      }
    },
    category: "Transferts",
    publishedAt: "Il y a 3 heures",
    readTime: "4 min",
    views: 23400,
    likes: 892,
    isLiked: false,
    featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    isBreaking: true,
    tags: ["karmine-corp", "transferts", "breaking", "lfl"],
    relatedArticles: ["lfl-spring-split-preview", "esport-france-economie"],
    tableOfContents: [
      { id: "nouvelles-recrues", title: "Les nouvelles recrues", level: 2 },
      { id: "departs", title: "Les départs", level: 2 },
      { id: "analyse", title: "L'analyse", level: 2 },
      { id: "reactions", title: "Réactions", level: 2 },
      { id: "suite", title: "La suite", level: 2 }
    ]
  },
  "valorant-meta-analysis": {
    id: "valorant-meta-analysis",
    title: "Analyse de la meta Valorant 2025 : Les agents dominants",
    excerpt: "Découvrez quels agents règnent sur la meta compétitive de Valorant en cette nouvelle saison et comment les équipes s'adaptent.",
    content: `# La meta Valorant 2025 : Une révolution en cours

L'année 2025 marque un tournant majeur dans l'écosystème compétitif de Valorant. Avec les récents ajustements d'équilibrage et l'introduction de nouveaux agents, la meta a considérablement évolué.

## Les agents dominants

### Duelistes
**Jett** reste incontournable avec ses capacités de mobilité exceptionnelles. Son utilisation a augmenté de 15% par rapport à la saison précédente.

**Raze** fait son grand retour grâce aux buffs de ses grenades. Elle est désormais viable sur la plupart des cartes.

### Contrôleurs
**Omen** domine toujours la catégorie avec un taux de pick de 78% en compétition professionnelle.

**Viper** reste essentielle sur certaines cartes, particulièrement Bind et Icebox.

### Initiateurs
**Sova** conserve sa position de référence avec ses darts de reconnaissance irremplaçables.

**Breach** gagne en popularité grâce à ses capacités de contrôle de zone améliorées.

### Sentinelles
**Killjoy** est devenue l'agent défensif de référence sur la plupart des cartes.

**Cypher** fait un retour remarqué grâce aux buffs de ses pièges.

## Stratégies émergentes

### Le rush coordonné
Les équipes privilégient désormais des exécutions rapides et synchronisées, s'appuyant sur la synergie entre duelistes et initiateurs.

### Le jeu lent et méticuleux
À l'inverse, certaines équipes optent pour un style plus patient, utilisant les contrôleurs pour sécuriser progressivement le terrain.

### L'adaptabilité mid-round
La capacité à changer de stratégie en cours de round devient cruciale face à la diversité des compositions adverses.

## Impact sur les équipes professionnelles

### Team Liquid
L'équipe européenne s'est parfaitement adaptée à la nouvelle meta en intégrant Raze dans ses compositions.

### Sentinels
L'organisation américaine mise sur la polyvalence de ses joueurs pour s'adapter rapidement aux changements.

### LOUD
L'équipe brésilienne continue d'innover avec des compositions atypiques qui prennent les adversaires au dépourvu.

## Prédictions pour la suite

La meta devrait continuer d'évoluer avec les prochaines mises à jour. Les agents hybrides pourraient gagner en importance, offrant plus de flexibilité aux équipes.

## Conseils pour s'adapter

- Maîtrisez au moins 2 agents par rôle
- Travaillez la communication d'équipe
- Restez informés des changements d'équilibrage
- Analysez les matchs professionnels

## Conclusion

La meta Valorant 2025 récompense l'adaptabilité et la créativité. Les équipes qui sauront innover tout en maîtrisant les fondamentaux prendront l'avantage sur leurs adversaires.`,
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Analyste professionnelle Valorant et ancienne joueuse compétitive. Spécialisée dans l'étude des metas et des stratégies d'équipe.",
      socialLinks: {
        twitter: "https://twitter.com/sarah_valorant",
        linkedin: "https://linkedin.com/in/sarah-chen-valorant"
      }
    },
    category: "Valorant",
    publishedAt: "Il y a 2 jours",
    lastUpdated: "Il y a 1 jour",
    readTime: "6 min",
    views: 18500,
    likes: 567,
    isLiked: false,
    featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    isBreaking: false,
    tags: ["valorant", "meta", "agents", "strategie", "esport"],
    relatedArticles: ["lfl-spring-split-preview", "karmine-corp-transferts"],
    tableOfContents: [
      { id: "agents-dominants", title: "Les agents dominants", level: 2 },
      { id: "duelistes", title: "Duelistes", level: 3 },
      { id: "controleurs", title: "Contrôleurs", level: 3 },
      { id: "initiateurs", title: "Initiateurs", level: 3 },
      { id: "sentinelles", title: "Sentinelles", level: 3 },
      { id: "strategies-emergentes", title: "Stratégies émergentes", level: 2 },
      { id: "impact-equipes", title: "Impact sur les équipes professionnelles", level: 2 },
      { id: "predictions", title: "Prédictions pour la suite", level: 2 },
      { id: "conseils", title: "Conseils pour s'adapter", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 }
    ]
  }
};

// generateStaticParams pour les routes statiques
export async function generateStaticParams() {
  return Object.keys(articlesData).map((id) => ({
    id: id,
  }));
}

// Page serveur principale
export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = articlesData[params.id];

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
} 