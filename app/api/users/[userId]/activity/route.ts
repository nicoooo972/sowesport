import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const offset = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: "L'ID de l'utilisateur est requis" },
        { status: 400 }
      );
    }

    // Récupérer les activités pour l'utilisateur spécifié
    const { data: activities, error } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Erreur lors de la récupération des activités:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des activités" },
        { status: 500 }
      );
    }

    // Compter le total pour la pagination
    const { count: totalCount, error: countError } = await supabase
      .from("user_activities")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
        console.error("Erreur lors du comptage des activités:", countError);
    }

    return NextResponse.json({
      activities: activities || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Erreur dans GET /api/users/[userId]/activity:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 