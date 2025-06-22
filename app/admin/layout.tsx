"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Vue d'ensemble"
  },
  {
    title: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
    description: "Gestion des comptes"
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText,
    description: "Contenu et publications"
  },
  {
    title: "Événements",
    href: "/admin/evenements",
    icon: Calendar,
    description: "Tournois et compétitions"
  },
  {
    title: "Commentaires",
    href: "/admin/commentaires",
    icon: MessageSquare,
    description: "Modération"
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Statistiques détaillées"
  },
  {
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    description: "Configuration"
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" />
          <p className="text-lg font-medium">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette zone.
          </p>
          <Link href="/">
            <Button>
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">SowEsport</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <Link href="/" className="mt-3">
              <Button variant="outline" size="sm" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
} 