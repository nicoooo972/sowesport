'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Search, Menu, X, User, LogOut, Settings, UserCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/tournaments-map', label: 'Tournaments Map' },
  { href: '/events', label: 'Events' },
  { href: '/shop', label: 'Shop' },
  { href: '/subscribe', label: 'Subscribe' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication
    setIsAuthenticated(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center md:w-1/4 pl-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              EsportsHub
            </span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="hidden md:flex md:w-2/4 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={pathname === item.href}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth and Controls Section */}
        <div className="flex items-center justify-end md:w-1/4 space-x-3 pr-4">
          {isSearchOpen && (
            <div className="animate-in fade-in-0 slide-in-from-top-5">
              <Input
                type="search"
                placeholder="Search..."
                className="mr-2 w-[150px] md:w-[200px]"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />

          {/* Auth Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                {isAuthenticated ? 'Profile' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">
                      <input type="checkbox" className="mr-2" />
                      Remember me
                    </label>
                    <Button variant="link" className="text-sm text-primary p-0">
                      Forgot password?
                    </Button>
                  </div>
                )}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <Button
                    variant="link"
                    className="text-primary p-0"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-b bg-background md:hidden">
          <nav className="container flex flex-col space-y-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm ${
                  pathname === item.href ? 'text-primary font-bold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}