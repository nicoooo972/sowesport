'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/auth/protected-route';


interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await authService.getMe();
        setProfile(userData);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold mb-4">Non autorisé</h2>
            <p className="text-muted-foreground">Veuillez vous connecter pour accéder à votre profil.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.photo} alt={profile.name} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div>
                    <h3 className="font-medium">Membre depuis</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Ajoutez d'autres informations du profil ici */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du profil</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Formulaire de modification du profil à venir */}
                <p className="text-muted-foreground">Fonctionnalité à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Paramètres de sécurité à venir */}
                <p className="text-muted-foreground">Fonctionnalité à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}