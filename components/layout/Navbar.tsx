"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "../auth/AuthModal";
import { UserMenu } from "../UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { NotificationManager } from "../pwa/notification-manager";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Evénements", href: "/evenements" },
  { name: "Carte", href: "/carte" },
  { name: "Boutique", href: "/boutique" },
  { name: "Forum", href: "/forum" },
  { name: "Classements", href: "/classements" },
  { name: "Articles", href: "/articles" },
  { name: "Interviews", href: "/interviews" },
  { name: "Abonnement", href: "/abonnement" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? "hidden" : "unset";
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background shadow-md" : "bg-background"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo avec dégradé */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center group">
            <span className="text-lg md:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-400 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-500 hover:to-violet-300">
              SowEsport
            </span>
          </Link>
        </div>

        {/* Bouton Menu Mobile avec nouvelle animation */}
        <div className="flex items-center gap-4 lg:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 text-foreground hover:bg-purple-100/20 dark:hover:bg-purple-900/20 transition-all duration-300"
            onClick={toggleMenu}
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors group py-2"
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Actions Desktop */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <NotificationManager />
          <ModeToggle />
          {user ? (
            <UserMenu />
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-purple-600/90 to-violet-500/90 hover:from-purple-500 hover:to-violet-400 text-white transition-all duration-300"
            >
              Se connecter
            </Button>
          )}
        </div>
      </nav>

      {/* Menu Mobile avec nouvelle animation */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-background shadow-xl transform transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-400 bg-clip-text text-transparent">
              SowEsport
            </span>
            {/* Bouton de fermeture ajouté ici */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-purple-100/20 dark:hover:bg-purple-900/20 transition-all duration-300"
              onClick={toggleMenu}
            >
              <X className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Fermer le menu</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-6 space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-medium text-foreground/90 hover:text-foreground transition-all duration-300 hover:translate-x-2"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-6 mt-auto border-t border-border">
              {user ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={() => {
                    toggleMenu();
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600/90 to-violet-500/90 hover:from-purple-500 hover:to-violet-400 text-white"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
}

export default Navbar;
