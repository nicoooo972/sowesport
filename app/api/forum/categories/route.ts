import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Catégories par défaut si aucune n'existe en base
const defaultCategories = [
  {
    id: "league-of-legends",
    name: "League of Legends",
    description: "Discussions sur League of Legends, méta, patches et stratégies",
    color: "#6366f1",
    icon: "gamepad",
    display_order: 1,
    is_active: true,
  },
  {
    id: "valorant",
    name: "Valorant",
    description: "Tout sur Valorant : agents, maps, strats et actualités",
    color: "#ef4444",
    icon: "target",
    display_order: 2,
    is_active: true,
  },
  {
    id: "rocket-league",
    name: "Rocket League",
    description: "Rocket League : conseils, montages et discussions générales",
    color: "#f97316",
    icon: "car",
    display_order: 3,
    is_active: true,
  },
  {
    id: "annonces",
    name: "Annonces",
    description: "Annonces officielles et informations importantes",
    color: "#8b5cf6",
    icon: "megaphone",
    display_order: 0,
    is_active: true,
  },
  {
    id: "general",
    name: "Général",
    description: "Discussions générales sur l'esport et autres sujets",
    color: "#64748b",
    icon: "message-circle",
    display_order: 4,
    is_active: true,
  },
];

export async function GET() {
  try {
    // Vérifier si les tables existent
    const { data: tablesCheck, error: tableError } = await supabase
      .from("forum_categories")
      .select("id")
      .limit(1);

    if (tableError) {
      console.log("Table forum_categories n'existe pas, retour de catégories par défaut");
      
      // Retourner des catégories par défaut si la table n'existe pas
      return NextResponse.json([
        {
          id: "general",
          name: "Général",
          description: "Discussions générales",
          color: "#6366f1",
          display_order: 0,
          is_active: true,
        },
        {
          id: "valorant",
          name: "Valorant",
          description: "Discussions sur Valorant",
          color: "#ff4655",
          display_order: 1,
          is_active: true,
        },
        {
          id: "league-of-legends",
          name: "League of Legends",
          description: "Discussions sur League of Legends",
          color: "#c89b3c",
          display_order: 2,
          is_active: true,
        },
        {
          id: "rocket-league",
          name: "Rocket League",
          description: "Discussions sur Rocket League",
          color: "#0066cc",
          display_order: 3,
          is_active: true,
        },
      ]);
    }

    const { data: categories, error } = await supabase
      .from("forum_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des catégories" },
        { status: 500 }
      );
    }

    // Si aucune catégorie n'existe, créer les catégories par défaut
    if (!categories || categories.length === 0) {
      console.log("Aucune catégorie trouvée, création des catégories par défaut");
      
      const defaultCategories = [
        {
          name: "Général",
          description: "Discussions générales",
          color: "#6366f1",
          display_order: 0,
          is_active: true,
        },
        {
          name: "Valorant",
          description: "Discussions sur Valorant",
          color: "#ff4655",
          display_order: 1,
          is_active: true,
        },
        {
          name: "League of Legends",
          description: "Discussions sur League of Legends",
          color: "#c89b3c",
          display_order: 2,
          is_active: true,
        },
        {
          name: "Rocket League",
          description: "Discussions sur Rocket League",
          color: "#0066cc",
          display_order: 3,
          is_active: true,
        },
      ];

      const { data: newCategories, error: createError } = await supabase
        .from("forum_categories")
        .insert(defaultCategories)
        .select("*");

      if (createError) {
        console.error("Erreur lors de la création des catégories:", createError);
        return NextResponse.json(
          { error: "Erreur lors de la création des catégories par défaut" },
          { status: 500 }
        );
      }

      return NextResponse.json(newCategories || []);
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("Erreur dans GET /api/forum/categories:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, display_order } = body;

    // Validation des données
    if (!name) {
      return NextResponse.json(
        { error: "Le nom de la catégorie est requis" },
        { status: 400 }
      );
    }

    // Vérifier si les tables existent
    const { data: tablesCheck, error: tableError } = await supabase
      .from("forum_categories")
      .select("id")
      .limit(1);

    if (tableError) {
      return NextResponse.json(
        { 
          error: "Base de données non configurée", 
          details: "La table forum_categories n'existe pas encore",
          tableError: tableError.message
        },
        { status: 503 }
      );
    }

    const { data: newCategory, error } = await supabase
      .from("forum_categories")
      .insert([
        {
          name,
          description: description || "",
          color: color || "#6366f1",
          display_order: display_order || 0,
          is_active: true,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la catégorie", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Erreur dans POST /api/forum/categories:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
} 