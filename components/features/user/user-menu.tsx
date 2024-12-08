'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { StatusBadge } from './status-badge';
import { ProfileCustomization } from './profile-customization';
import { UserProfile, UserStatus } from './types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { statusConfig } from './config';
import { authService } from "@/services/authService";
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    username: 'John Doe',
    email: 'john.doe@example.com',
    status: 'online',
    theme: {
      primaryColor: '#8B5CF6',
      avatarBorder: '#C4B5FD',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  // Chargement des données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getMe();
        setProfile(prev => ({
          ...prev,
          id: userData.id,
          username: userData.name,
          email: userData.email,
        }));
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Animation des notifications
  const notificationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const handleStatusChange = (newStatus: UserStatus) => {
    setProfile(prev => ({ ...prev, status: newStatus }));
  };

  const handleThemeUpdate = (color: string) => {
    setProfile(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: color,
      },
    }));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.reload(); // Rafraîchir la page après la déconnexion
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false); // Ferme le menu
    router.push('/profile');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Photo de profil" />
              <AvatarFallback
                style={{ borderColor: profile.theme.avatarBorder }}
                className="border-2"
              >
                {profile.username[0]}
              </AvatarFallback>
            </Avatar>
            <StatusBadge status={profile.status} />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            asChild
            forceMount
            align="end"
            className="w-80"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-12 w-12"
                    style={{ borderColor: profile.theme.primaryColor }}
                  >
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>{profile.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.username}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Profil */}
              <DropdownMenuItem onClick={handleProfileClick}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>

              {/* Sélecteur de statut */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="flex items-center">
                    <StatusBadge status={profile.status} className="mr-2" />
                    <span>Définir le statut</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.keys(statusConfig).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status as UserStatus)}
                    >
                      <StatusBadge
                        status={status as UserStatus}
                        className="mr-2"
                      />
                      <span>{statusConfig[status as UserStatus].label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Paramètres */}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Personnalisation */}
              <ProfileCustomization
                profile={profile}
                onUpdateTheme={handleThemeUpdate}
              />

              <DropdownMenuSeparator />

              {/* Déconnexion */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>

            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}