import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Vérifier si les tables existent
    const { data: tablesExist, error: tableError } = await supabase
      .from("forum_posts")
      .select("id")
      .limit(1);

    if (tableError) {
      console.log("Tables n'existent pas encore, retour de données mock");
      // Retourner des données mock si les tables n'existent pas
      return NextResponse.json({
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const offset = (page - 1) * limit;

    let query = supabase
      .from("forum_posts")
      .select(`
        id,
        title,
        views,
        like_count,
        reply_count,
        is_pinned,
        is_locked,
        last_reply_at,
        created_at,
        category:forum_categories!inner(
          id,
          name,
          color
        ),
        author:profiles!forum_posts_author_id_fkey(
          id,
          username,
          avatar_url,
          role,
          join_date:created_at,
          post_count
        ),
        last_reply_author:profiles!forum_posts_last_reply_author_id_fkey(
          id,
          username
        )
      `);

    // Filtres
    if (category && category !== "tous") {
      query = query.eq("category_id", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Tri
    if (sortBy === "replies") {
      query = query.order("reply_count", { ascending: sortOrder === "asc" });
    } else if (sortBy === "views") {
      query = query.order("views", { ascending: sortOrder === "asc" });
    } else if (sortBy === "likes") {
      query = query.order("like_count", { ascending: sortOrder === "asc" });
    } else if (sortBy === "last_activity") {
      query = query.order("last_reply_at", { ascending: sortOrder === "asc", nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: sortOrder === "asc" });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des posts:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des posts" },
        { status: 500 }
      );
    }

    // Compter le total pour la pagination
    const { count: totalCount } = await supabase
      .from("forum_posts")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Erreur dans GET /api/forum/posts:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, categoryId, tags } = body;

    console.log("Données reçues:", { title, content, categoryId, tags });

    // Vérifier l'authentification via session Supabase côté client
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader ? "présent" : "absent");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 }
      );
    }

    // Extraire le token Bearer
    const token = authHeader.replace("Bearer ", "");
    console.log("Token extrait:", token ? "présent" : "absent");

    // Vérifier le token avec Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log("Utilisateur authentifié:", user ? user.id : "aucun", "Erreur auth:", authError);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Token d'authentification invalide", details: authError?.message },
        { status: 401 }
      );
    }

    // Validation des données
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Le titre, le contenu et la catégorie sont requis" },
        { status: 400 }
      );
    }

    if (title.length < 10) {
      return NextResponse.json(
        { error: "Le titre doit contenir au moins 10 caractères" },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { error: "Le contenu doit contenir au moins 20 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si les tables existent
    const { data: tablesCheck, error: tableError } = await supabase
      .from("forum_posts")
      .select("id")
      .limit(1);

    if (tableError) {
      console.error("Tables n'existent pas:", tableError);
      return NextResponse.json(
        { 
          error: "Base de données non configurée", 
          details: "Les tables du forum n'existent pas encore",
          tableError: tableError.message
        },
        { status: 503 }
      );
    }

    // Vérifier que la catégorie existe (ou utiliser une catégorie par défaut)
    const { data: categories, error: catError } = await supabase
      .from("forum_categories")
      .select("id")
      .limit(1);

    let finalCategoryId = categoryId;

    if (catError || !categories || categories.length === 0) {
      console.log("Aucune catégorie trouvée, création d'une catégorie par défaut");
      
      // Créer une catégorie par défaut
      const { data: newCategory, error: createCatError } = await supabase
        .from("forum_categories")
        .insert([
          {
            name: "Général",
            description: "Discussions générales",
            color: "#6366f1",
            display_order: 0,
            is_active: true,
          },
        ])
        .select("id")
        .single();

      if (createCatError) {
        console.error("Erreur création catégorie:", createCatError);
        return NextResponse.json(
          { error: "Erreur lors de la création de la catégorie par défaut" },
          { status: 500 }
        );
      }

      finalCategoryId = newCategory.id;
    }

    // Vérifier/créer l'utilisateur dans la table profiles
    const { data: existingUser, error: userError } = await supabase
      .from("profiles")
      .select("id, post_count")
      .eq("id", user.id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // L'utilisateur n'existe pas, le créer
      console.log("Création de l'utilisateur dans la table profiles");
      
      const { data: newUser, error: createUserError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email || "",
            username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: "MEMBER",
            post_count: 0,
          },
        ])
        .select("id, post_count")
        .single();

      if (createUserError) {
        console.error("Erreur création utilisateur:", createUserError);
        return NextResponse.json(
          { error: "Erreur lors de la création de l'utilisateur" },
          { status: 500 }
        );
      }
    }

    // Créer le nouveau post
    console.log("Création du post avec:", {
      title,
      content: content.substring(0, 100) + "...",
      author_id: user.id,
      category_id: finalCategoryId,
    });

    const { data: newPost, error } = await supabase
      .from("forum_posts")
      .insert([
        {
          title,
          content,
          author_id: user.id,
          category_id: finalCategoryId,
          tags: tags || [],
          views: 0,
          like_count: 0,
          reply_count: 0,
          is_pinned: false,
          is_locked: false,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Erreur lors de la création du post:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création du post", details: error.message },
        { status: 500 }
      );
    }

    console.log("Post créé avec succès:", newPost.id);

    // Incrémenter le compteur de posts de l'utilisateur
    const currentPostCount = existingUser?.post_count || 0;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ post_count: currentPostCount + 1 })
      .eq("id", user.id);

    if (updateError) {
      console.error("Erreur mise à jour compteur de posts:", updateError);
    }
    
    // Journaliser l'activité de création de post
    const { error: activityError } = await supabase.from("user_activities").insert({
      user_id: user.id,
      activity_type: "new_forum_post",
      related_id: newPost.id,
      related_url: `/forum/${newPost.id}`,
      content: {
        title: newPost.title,
      }
    });

    if (activityError) {
      console.error("Erreur lors de la journalisation de l'activité:", activityError);
      // On ne bloque pas la réponse pour une erreur de journalisation, mais c'est bon à savoir
    }

    // Re-fetch the post to include all author/category details in the response
    const { data: finalPost, error: fetchError } = await supabase
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
      .eq("id", newPost.id)
      .single();

    if (fetchError) {
      console.error("Erreur lors du re-fetch du post:", fetchError);
      // Return the original newPost data as a fallback
      return NextResponse.json(newPost, { status: 201 });
    }

    return NextResponse.json(finalPost, { status: 201 });
  } catch (error) {
    console.error("Erreur dans POST /api/forum/posts:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur", 
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
} 