import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Récupérer le post avec les informations de l'auteur et de la catégorie
    const { data: post, error: postError } = await supabase
      .from("forum_posts")
      .select(`
        id,
        title,
        content,
        views,
        like_count,
        reply_count,
        is_pinned,
        is_locked,
        last_reply_at,
        tags,
        created_at,
        updated_at,
        author:profiles!forum_posts_author_id_fkey(
          id,
          username,
          avatar_url,
          role,
          join_date:created_at,
          post_count
        ),
        category:forum_categories!category_id (
          id,
          name,
          color,
          description
        )
      `)
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("Erreur lors de la récupération du post:", postError);
      if (postError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Post non trouvé" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Erreur lors de la récupération du post" },
        { status: 500 }
      );
    }

    // Récupérer les réponses du post, en incluant les informations sur les likes
    const { data: replies, error: repliesError } = await supabase
      .from("forum_replies")
      .select(`
        *,
        author:profiles!forum_replies_author_id_fkey(
          id,
          username,
          avatar_url,
          role,
          join_date:created_at,
          post_count
        ),
        reply_likes(
          user_id
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Erreur lors de la récupération des réponses:", repliesError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des réponses" },
        { status: 500 }
      );
    }

    // Incrémenter le nombre de vues
    await supabase
      .from("forum_posts")
      .update({ views: (post.views || 0) + 1 })
      .eq("id", postId);

    // Structurer la réponse
    const response = {
      ...post,
      views: (post.views || 0) + 1, // Refléter l'incrémentation immédiatement
      replies: replies || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur dans GET /api/forum/posts/[id]:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();
    const { title, content, tags, is_pinned, is_locked } = body;

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

    // Vérifier que le post existe et appartient à l'utilisateur (ou que l'utilisateur est admin/mod)
    const { data: existingPost, error: postError } = await supabase
      .from("forum_posts")
      .select(`
        id,
        author_id,
        author:profiles!forum_posts_author_id_fkey(
          role
        )
      `)
      .eq("id", postId)
      .single();

    if (postError || !existingPost) {
      return NextResponse.json(
        { error: "Post non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer le rôle de l'utilisateur actuel
    const { data: currentUser } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isOwner = existingPost.author_id === user.id;
    const isAdminOrMod = currentUser?.role === "ADMIN" || currentUser?.role === "MODERATOR";

    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json(
        { error: "Non autorisé à modifier ce post" },
        { status: 403 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    
    // Seuls les admins/mods peuvent modifier is_pinned et is_locked
    if (isAdminOrMod) {
      if (is_pinned !== undefined) updateData.is_pinned = is_pinned;
      if (is_locked !== undefined) updateData.is_locked = is_locked;
    }

    updateData.updated_at = new Date().toISOString();

    // Mettre à jour le post
    const { data: updatedPost, error: updateError } = await supabase
      .from("forum_posts")
      .update(updateData)
      .eq("id", postId)
      .select(`
        id,
        title,
        content,
        views,
        like_count,
        reply_count,
        is_pinned,
        is_locked,
        last_reply_at,
        tags,
        created_at,
        updated_at,
        author:profiles!forum_posts_author_id_fkey(
          id,
          username,
          avatar_url,
          role
        ),
        category:forum_categories!category_id (
          id,
          name,
          color
        )
      `)
      .single();

    if (updateError) {
      console.error("Erreur lors de la mise à jour:", updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du post" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Erreur dans PUT /api/forum/posts/[id]:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

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

    // Vérifier que le post existe et appartient à l'utilisateur (ou que l'utilisateur est admin)
    const { data: existingPost, error: postError } = await supabase
      .from("forum_posts")
      .select(`
        id,
        author_id,
        author:profiles!forum_posts_author_id_fkey(
          role
        )
      `)
      .eq("id", postId)
      .single();

    if (postError || !existingPost) {
      return NextResponse.json(
        { error: "Post non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer le rôle de l'utilisateur actuel
    const { data: currentUser } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isOwner = existingPost.author_id === user.id;
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Action non autorisée. Vous devez être l'auteur ou un administrateur." },
        { status: 403 }
      );
    }

    // Supprimer le post (les réponses et les likes associés seront supprimés en cascade)
    const { error: deleteError } = await supabase
      .from("forum_posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      console.error(`Erreur lors de la suppression du post ${postId} par l'utilisateur ${user.id}:`, deleteError);
      return NextResponse.json(
        { error: "Erreur lors de la suppression du post", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Post et contenu associé supprimés avec succès" });
  } catch (error) {
    console.error(`Erreur inattendue dans DELETE /api/forum/posts/[id] pour le post ${params.id}:`, error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 