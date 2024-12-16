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
import { Settings, User, Shield, History, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  username: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  bio: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
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

        if (error) throw error;

        if (data) {
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

    try {
      // Créer un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p className="text-muted-foreground">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
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
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="w-4 h-4" />
              Activité
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

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Historique de vos actions et interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    L&apos;historique des activités sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
