import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { replyId: string } }
) {
  try {
    const replyId = params.replyId;

    // 1. Vérifier l'authentification de l'utilisateur
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token requis" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // 2. Vérifier si l'utilisateur est un administrateur
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Action non autorisée. Seuls les administrateurs peuvent supprimer des réponses." }, { status: 403 });
    }

    // 3. Vérifier que la réponse existe avant de la supprimer
    const { data: existingReply, error: replyCheckError } = await supabase
        .from("forum_replies")
        .select("id")
        .eq("id", replyId)
        .single();

    if (replyCheckError || !existingReply) {
        return NextResponse.json({ error: "Réponse non trouvée" }, { status: 404 });
    }
    
    // 4. Supprimer la réponse
    const { error: deleteError } = await supabase
      .from("forum_replies")
      .delete()
      .eq("id", replyId);

    if (deleteError) {
      console.error(`Erreur admin lors de la suppression de la réponse ${replyId}:`, deleteError);
      return NextResponse.json({ error: "Erreur lors de la suppression", details: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Réponse supprimée avec succès" });

  } catch (error) {
    console.error(`Erreur inattendue dans DELETE /api/forum/replies/[replyId] pour la réponse ${params.replyId}:`, error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
} 