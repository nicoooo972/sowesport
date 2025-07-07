import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { replyId: string } }
) {
  try {
    const replyId = params.replyId;

    // 1. Vérifier l'authentification de l'utilisateur
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Token d'authentification invalide" }, { status: 401 });
    }

    // 2. Vérifier si l'utilisateur a déjà liké cette réponse
    const { data: existingLike, error: likeCheckError } = await supabase
      .from("reply_likes")
      .select("id")
      .eq("reply_id", replyId)
      .eq("user_id", user.id)
      .single();

    if (likeCheckError && likeCheckError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Erreur lors de la vérification du like:", likeCheckError);
      return NextResponse.json({ error: "Erreur lors de la vérification du like" }, { status: 500 });
    }
    
    const replyUpdate = supabase.from("forum_replies").select("like_count").eq("id", replyId).single();

    if (existingLike) {
      // --- L'utilisateur a déjà liké, donc on UNLIKE ---
      
      // Supprimer le like de la table de jonction
      await supabase.from("reply_likes").delete().eq("id", existingLike.id);

      // Décrémenter le compteur de likes sur la réponse
      const { data: replyData } = await replyUpdate;
      if (replyData) {
        await supabase
          .from("forum_replies")
          .update({ like_count: Math.max(0, (replyData.like_count || 1) - 1) })
          .eq("id", replyId);
      }
      
      return NextResponse.json({ message: "Like retiré", liked: false });

    } else {
      // --- L'utilisateur n'a pas encore liké, donc on LIKE ---

      // Ajouter le like dans la table de jonction
      await supabase.from("reply_likes").insert({ reply_id: replyId, user_id: user.id });

      // Incrémenter le compteur de likes sur la réponse
      const { data: replyData } = await replyUpdate;
      await supabase
        .from("forum_replies")
        .update({ like_count: (replyData?.like_count || 0) + 1 })
        .eq("id", replyId);
        
      return NextResponse.json({ message: "Like ajouté", liked: true });
    }

  } catch (error) {
    console.error("Erreur dans POST /api/forum/replies/[replyId]/like:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
} 