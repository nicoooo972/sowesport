import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();
    const { content, reply_to_id } = body;

    // Récupérer l'utilisateur depuis l'en-tête d'autorisation
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Token d'authentification invalide" },
        { status: 401 }
      );
    }

    // Validation des données
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le contenu de la réponse est requis" },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: "La réponse doit contenir au moins 10 caractères" },
        { status: 400 }
      );
    }

    // Vérifier que le post existe et n'est pas verrouillé
    const { data: post, error: postError } = await supabase
      .from("forum_posts")
      .select("id, is_locked, reply_count")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post non trouvé" },
        { status: 404 }
      );
    }

    if (post.is_locked) {
      return NextResponse.json(
        { error: "Ce post est verrouillé, vous ne pouvez pas y répondre" },
        { status: 403 }
      );
    }

    // Si reply_to_id est fourni, vérifier que la réponse parente existe
    if (reply_to_id) {
      const { data: parentReply, error: parentError } = await supabase
        .from("forum_replies")
        .select("id")
        .eq("id", reply_to_id)
        .eq("post_id", postId)
        .single();

      if (parentError || !parentReply) {
        return NextResponse.json(
          { error: "Réponse parente non trouvée" },
          { status: 400 }
        );
      }
    }

    // Créer la nouvelle réponse
    const { data: newReply, error: replyError } = await supabase
      .from("forum_replies")
      .insert([
        {
          content: content.trim(),
          author_id: user.id,
          post_id: postId,
          reply_to_id: reply_to_id || null,
          like_count: 0,
        },
      ])
      .select(`
        id,
        content,
        like_count,
        reply_to_id,
        created_at,
        updated_at,
        author:profiles!forum_replies_author_id_fkey(
          id,
          username,
          avatar_url,
          role,
          join_date:created_at,
          post_count
        )
      `)
      .single();

    if (replyError) {
      console.error("Erreur lors de la création de la réponse:", replyError);
      return NextResponse.json(
        { error: "Erreur lors de la création de la réponse" },
        { status: 500 }
      );
    }

    // Mettre à jour le compteur de réponses du post et la dernière activité
    const { error: updatePostError } = await supabase
      .from("forum_posts")
      .update({
        reply_count: (post.reply_count || 0) + 1,
        last_reply_at: new Date().toISOString(),
        last_reply_author_id: user.id,
      })
      .eq("id", postId);

    if (updatePostError) {
      console.error("Erreur lors de la mise à jour du post:", updatePostError);
      // On ne fait pas échouer la requête car la réponse a été créée
    }

    // Incrémenter le compteur de posts de l'utilisateur (les réponses comptent aussi)
    const { data: userData } = await supabase
      .from("profiles")
      .select("post_count")
      .eq("id", user.id)
      .single();
    
    if (userData) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ post_count: (userData.post_count || 0) + 1 })
        .eq("id", user.id);
      
      if (updateError) {
        console.error("Erreur MàJ compteur posts pour réponse:", updateError);
      }
    }

    // Journaliser l'activité de création de réponse
    const { error: activityError } = await supabase.from("user_activities").insert({
      user_id: user.id,
      activity_type: "new_forum_reply",
      related_id: newReply.id,
      related_url: `/forum/${postId}#reply-${newReply.id}`,
      content: {
        postId: postId,
        replyExcerpt: content.substring(0, 100)
      }
    });

    if (activityError) {
      console.error("Erreur lors de la journalisation de l'activité (réponse):", activityError);
    }

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Erreur dans POST /api/forum/posts/[id]/replies:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const offset = (page - 1) * limit;

    // Vérifier que le post existe
    const { data: post, error: postError } = await supabase
      .from("forum_posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les réponses
    let query = supabase
      .from("forum_replies")
      .select(`
        id,
        content,
        like_count,
        reply_to_id,
        created_at,
        updated_at,
        author:profiles!forum_replies_author_id_fkey(
          id,
          username,
          avatar_url,
          role,
          join_date:created_at,
          post_count
        )
      `)
      .eq("post_id", postId);

    // Tri
    if (sortBy === "likes") {
      query = query.order("like_count", { ascending: sortOrder === "asc" });
    } else {
      query = query.order("created_at", { ascending: sortOrder === "asc" });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: replies, error: repliesError } = await query;

    if (repliesError) {
      console.error("Erreur lors de la récupération des réponses:", repliesError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des réponses" },
        { status: 500 }
      );
    }

    // Compter le total pour la pagination
    const { count: totalCount } = await supabase
      .from("forum_replies")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    return NextResponse.json({
      replies: replies || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Erreur dans GET /api/forum/posts/[id]/replies:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 