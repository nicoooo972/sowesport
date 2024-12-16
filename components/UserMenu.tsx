"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  UserCircle,
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
  Keyboard,
  HelpCircle,
} from "lucide-react";

interface UserProfile {
  username: string;
  avatar_url: string | null;
  role: string;
}

export function UserMenu() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (!user?.id) return;

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("username, avatar_url, role")
  //       .eq("id", user.id)
  //       .single();

  //     if (data) {
  //       setProfile(data);
  //       setIsAdmin(data.role === "admin");
  //     }
  //   };

  //   fetchProfile();
  // }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const showKeyboardShortcuts = () => {
    toast({
      title: "Raccourcis clavier",
      description: (
        <div className="grid gap-2">
          <p>
            <kbd className="px-2 py-1 bg-muted rounded">P</kbd> Accéder au
            profil
          </p>
          <p>
            <kbd className="px-2 py-1 bg-muted rounded">N</kbd> Notifications
          </p>
          <p>
            <kbd className="px-2 py-1 bg-muted rounded">H</kbd> Aide
          </p>
          <p>
            <kbd className="px-2 py-1 bg-muted rounded">Q</kbd> Déconnexion
          </p>
        </div>
      ),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {profile?.username?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Indicateur de notification */}
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-white dark:ring-gray-900" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.username || "Utilisateur"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuGroup>
              <Link href="/admin">
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Administration</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={showKeyboardShortcuts}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Raccourcis clavier</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <Link href="/help">
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Centre d&apos;aide</span>
              <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-700 dark:focus:text-red-300"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
