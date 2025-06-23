"use client";

import { useState } from "react";
import { Mail, Send, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface NewsletterSubscribeProps {
  className?: string;
  variant?: 'default' | 'inline' | 'modal';
  title?: string;
  description?: string;
}

export default function NewsletterSubscribe({ 
  className = "",
  variant = 'default',
  title = "Restez informé",
  description = "Recevez les dernières actualités de l'esport français directement dans votre boîte mail."
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage("Veuillez saisir votre adresse email");
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez saisir une adresse email valide");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage("");

    try {
      // Vérifier si l'email existe déjà
      const { data: existingSubscriber } = await supabase
        .from('newsletter_subscribers')
        .select('email, is_active')
        .eq('email', email.toLowerCase())
        .single();

      if (existingSubscriber) {
        if (existingSubscriber.is_active) {
          setErrorMessage("Vous êtes déjà abonné à notre newsletter");
          setStatus('error');
          return;
        } else {
          // Réactiver l'abonnement
          const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ 
              is_active: true,
              resubscribed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase());

          if (error) throw error;
        }
      } else {
        // Nouvel abonnement
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email: email.toLowerCase(),
            is_active: true,
            subscribed_at: new Date().toISOString(),
            source: 'website',
            preferences: {
              articles: true,
              events: true,
              interviews: true,
              weekly_digest: true
            }
          });

        if (error) throw error;
      }

      setStatus('success');
      setEmail("");
      
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez bientôt nos dernières actualités.",
      });

      // Optionnel : analytics ou événement
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_subscribe', {
          'event_category': 'engagement',
          'event_label': email.toLowerCase()
        });
      }

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      setStatus('error');
      
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de traiter votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
          
          {/* Statistiques mockées */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>📊 +15K abonnés</span>
            <span>📅 Hebdomadaire</span>
            <span>🚫 Pas de spam</span>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="relative">
            <Input
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              className={`pr-24 ${
                status === 'error' ? 'border-red-500 focus:border-red-500' : ''
              } ${
                status === 'success' ? 'border-green-500 focus:border-green-500' : ''
              }`}
              disabled={status === 'loading'}
            />
            
            <Button
              type="submit"
              size="sm"
              disabled={status === 'loading' || !email.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <X className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Check className="h-4 w-4" />
              <span>Inscription confirmée ! Vérifiez votre boîte mail.</span>
            </div>
          )}
        </form>

        {/* Garanties */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="outline" className="text-xs">
            📧 1 mail/semaine max
          </Badge>
          <Badge variant="outline" className="text-xs">
            🔒 Données protégées
          </Badge>
          <Badge variant="outline" className="text-xs">
            ❌ Désabonnement facile
          </Badge>
        </div>

        {/* Aperçu du contenu */}
        <div className="border-t pt-4 mt-4">
          <p className="text-xs font-medium mb-2 text-center">
            Ce que vous recevrez :
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>📰</span>
              <span>Nouveaux articles</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🎯</span>
              <span>Événements à venir</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🎤</span>
              <span>Interviews exclusives</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📊</span>
              <span>Résumé hebdomadaire</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 ${className}`}>
        {renderContent()}
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        {renderContent()}
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={`bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800 ${className}`}>
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}