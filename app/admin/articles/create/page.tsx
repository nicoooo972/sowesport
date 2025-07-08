"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Save, ArrowLeft } from "lucide-react";

// Schéma de validation avec Zod
const articleSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Le contenu est trop court"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  featured_image: z.string().url("URL invalide").optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_breaking: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function ArticleEditorPage() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const articleId = params.id as string | undefined;
  const isEditing = !!articleId;

  const [loading, setLoading] = useState(isEditing);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      featured_image: "",
      is_featured: false,
      is_breaking: false,
    },
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
      return;
    }

    if (isEditing && isAdmin) {
      const fetchArticle = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", articleId)
          .single();

        if (error || !data) {
          toast({ title: "Erreur", description: "Article non trouvé.", variant: "destructive" });
          router.push("/admin/articles");
        } else {
          form.reset(data);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [isAdmin, adminLoading, isEditing, articleId, router, toast, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    if (!user) {
      toast({ title: "Erreur", description: "Vous n'êtes pas connecté.", variant: "destructive" });
      return;
    }

    try {
      let response;
      const articleData = { 
        ...values, 
        id: isEditing ? articleId : uuidv4(),
        author_id: user.id
      };

      if (isEditing) {
        response = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", articleId);
      } else {
        response = await supabase
          .from("articles")
          .insert(articleData);
      }
      
      const { error } = response;
      if (error) throw error;

      toast({
        title: `Article ${isEditing ? "mis à jour" : "créé"}`,
        description: "L'opération a été réalisée avec succès.",
      });
      router.push("/admin/articles");

    } catch (error: any) {
      console.error("Erreur de sauvegarde de l'article:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder l'article.",
        variant: "destructive",
      });
    }
  };

  if (adminLoading || loading) {
    return <div>Chargement de l'éditeur...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText />
            {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Titre et Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Titre de l'article" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="titre-de-l-article" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Extrait */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Un court résumé de l'article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contenu */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu principal</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Écrivez votre article ici..." {...field} rows={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catégorie et Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="valorant">Valorant</SelectItem>
                          <SelectItem value="league-of-legends">League of Legends</SelectItem>
                          <SelectItem value="counter-strike">Counter-Strike</SelectItem>
                          <SelectItem value="esport-general">Esport Général</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image à la une</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Options booléennes */}
              <div className="flex items-center space-x-8">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mettre en avant</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_breaking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Breaking News</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder l'article"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 