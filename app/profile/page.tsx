"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, Shield, History, Upload, Loader2, Bookmark, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ActivityHistory from "@/components/profile/activity-history";
import UserBookmarks from "@/components/profile/user-bookmarks";

interface Profile {
  username: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  bio: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar_url: null as string | null,
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // Aucun profil trouvé, créer un profil par défaut
          const defaultProfile = {
            id: user.id,
            username: user.email?.split("@")[0] || "Utilisateur",
            bio: "",
            avatar_url: null,
            role: "user",
            created_at: new Date().toISOString(),
          };

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert(defaultProfile)
            .select()
            .single();

          if (createError) throw createError;

          setProfile(newProfile);
          setFormData({
            username: newProfile.username || "",
            bio: newProfile.bio || "",
            avatar_url: newProfile.avatar_url,
          });
        } else if (error) {
          throw error;
        } else if (data) {
          setProfile(data);
          setFormData({
            username: data.username || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur de chargement",
          description:
            "Impossible de charger votre profil. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, toast]);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev!,
        username: formData.username,
        bio: formData.bio,
      }));

      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Formats acceptés: JPEG, PNG, WebP, GIF.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Supprimer l'ancien avatar s'il existe
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath && oldPath.includes(user.id)) {
          await supabase.storage
            .from("avatars")
            .remove([`avatars/${oldPath}`]);
        }
      }

      // Créer un nom de fichier unique avec timestamp
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload du fichier avec options
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Mettre à jour l'état local
      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : null));
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));

      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour votre avatar. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p className="text-muted-foreground">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête du profil avec upload d'avatar */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative group">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback>
                {profile.username?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              className="absolute inset-0 flex items-center justify-center bg-black/50 
                         text-white rounded-full opacity-0 group-hover:opacity-100 
                         cursor-pointer transition-opacity"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Upload className="h-6 w-6" />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {profile.username || "Utilisateur"}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-flex items-center gap-1 text-sm 
                             bg-purple-100 dark:bg-purple-900/30 
                             text-purple-800 dark:text-purple-200 
                             px-2 py-1 rounded-full"
              >
                <Shield className="w-4 h-4" />
                {profile.role || "Membre"}
              </span>
              <span className="text-sm text-muted-foreground">
                Membre depuis le{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Onglets du profil */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="w-4 h-4" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et votre visibilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Nom d&apos;utilisateur
                      </label>
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="Votre nom d'utilisateur"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Biographie</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 rounded-md border bg-background"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {profile.bio || "Aucune biographie"}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <div className="flex gap-4">
                    <Button onClick={handleUpdateProfile} disabled={isSaving}>
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez vos préférences et la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Notifications par email</h3>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications sur les nouveaux événements
                      </p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Sécurité du compte</h3>
                      <p className="text-sm text-muted-foreground">
                        Gérez votre mot de passe et l&apos;authentification à
                        deux facteurs
                      </p>
                    </div>
                    <Button variant="outline">Gérer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks">
            <UserBookmarks />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityHistory />
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Mes statistiques</CardTitle>
                <CardDescription>
                  Aperçu de votre activité et performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Articles lus</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">24</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        📖
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Événements</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">7</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        🎯
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Points</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">342</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        ⭐
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Niveau</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">8</p>
                      </div>
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Badges récents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">🔥</div>
                      <p className="text-xs font-medium">Lecteur assidu</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">💬</div>
                      <p className="text-xs font-medium">Commentateur</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">📚</div>
                      <p className="text-xs font-medium">Collectionneur</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center opacity-50">
                      <div className="text-2xl mb-1">🎮</div>
                      <p className="text-xs font-medium">À débloquer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
