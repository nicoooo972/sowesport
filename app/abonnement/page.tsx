"use client";

import { useState } from "react";
import { Check, Star, Zap, Users, BarChart3, Calendar, Shield, Bell, MapPin, MessageSquare, Eye, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// Types pour les plans d'abonnement
interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalYearlyPrice: number;
  discount: string;
  description: string;
  icon: any;
  popular: boolean;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 6.99,
    yearlyPrice: 69.90,
    originalYearlyPrice: 83.88,
    discount: "-16%",
    description: "Parfait pour découvrir l'univers esport premium",
    icon: Star,
    popular: true,
    features: [
      "Contenus exclusifs : interviews, analyses approfondies",
      "Carte interactive complète des événements et acteurs",
      "Accès et participation au forum communautaire",
      "Navigation 100% sans publicité"
    ],
    buttonText: "Commencer avec Starter",
    buttonVariant: "default"
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 11.99,
    yearlyPrice: 119.90,
    originalYearlyPrice: 143.88,
    discount: "-17%",
    description: "Pour les fans passionnés qui veulent aller plus loin",
    icon: Zap,
    popular: false,
    features: [
      "Tout ce qui est inclus dans Starter",
      "Alertes personnalisées (équipes et compétitions favorites)",
      "Accès prioritaire aux événements partenaires",
      "Statistiques détaillées (équipes, joueurs, tournois)",
      "Offres et remises spéciales via nos partenaires"
    ],
    buttonText: "Passer au Pro",
    buttonVariant: "outline"
  },
  {
    id: "organisateur",
    name: "Organisateur",
    monthlyPrice: 21.99,
    yearlyPrice: 219.90,
    originalYearlyPrice: 263.88,
    discount: "-17%",
    description: "Pour les professionnels qui organisent des événements",
    icon: Users,
    popular: false,
    features: [
      "Tout ce qui est inclus dans Pro",
      "Création, gestion et mise en avant de vos propres événements",
      "Outils de gestion avancés (billetterie, inscriptions, communication)",
      "Tableau de bord analytics poussé pour suivre performances & audience"
    ],
    buttonText: "Devenir Organisateur",
    buttonVariant: "secondary"
  }
];

// Composant pour les icônes de fonctionnalités
const FeatureIcon = ({ feature }: { feature: string }) => {
  if (feature.includes("Contenus exclusifs")) return <Eye className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Carte interactive")) return <MapPin className="w-4 h-4 text-purple-500" />;
  if (feature.includes("forum")) return <MessageSquare className="w-4 h-4 text-purple-500" />;
  if (feature.includes("sans publicité")) return <Shield className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Alertes")) return <Bell className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Accès prioritaire")) return <Star className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Statistiques")) return <BarChart3 className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Offres")) return <Gift className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Création")) return <Calendar className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Outils de gestion")) return <Users className="w-4 h-4 text-purple-500" />;
  if (feature.includes("Tableau de bord")) return <BarChart3 className="w-4 h-4 text-purple-500" />;
  return <Check className="w-4 h-4 text-purple-500" />;
};

export default function AbonnementPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-bold">
              🔥 OFFRE PROMOTIONNELLE LIMITÉE
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Rejoignez la communauté{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Accédez à du contenu exclusif, des fonctionnalités avancées et une expérience sans publicité. 
            Choisissez l'abonnement qui vous correspond.
          </p>

          {/* Toggle annuel/mensuel */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Mensuel
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-lg font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Annuel
            </span>
            <Badge className="bg-green-600 text-white ml-2">
              Jusqu'à -17%
            </Badge>
          </div>
        </div>
      </div>

      {/* Plans de pricing */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const originalPrice = isYearly ? plan.originalYearlyPrice : (plan.monthlyPrice * 12);
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-2 border-purple-500 bg-gradient-to-b from-purple-900/50 to-slate-900/50' 
                    : 'border-slate-700 bg-slate-800/50'
                } hover:border-purple-400`}
              >
                {/* Badge "Plus populaire" */}
                {plan.popular && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-violet-500 text-white px-4 py-1">
                      ⭐ MEILLEURE OFFRE
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-purple-600' : 'bg-slate-700'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <p className="text-gray-300 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Prix */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-white">
                        {price.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="text-gray-400">
                        {isYearly ? '/an' : '/mois'}
                      </span>
                    </div>
                    
                    {isYearly && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {originalPrice.toFixed(2).replace('.', ',')} €
                        </span>
                        <Badge className="bg-green-600 text-white text-xs">
                          {plan.discount}
                        </Badge>
                      </div>
                    )}
                    
                    {!isYearly && (
                      <p className="text-sm text-gray-400">
                        ou {plan.yearlyPrice.toFixed(2).replace('.', ',')} €/an ({plan.discount})
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Liste des fonctionnalités */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FeatureIcon feature={feature} />
                        <span className="text-gray-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bouton d'action */}
                  <Button
                    className={`w-full font-semibold py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white'
                        : plan.buttonVariant === 'outline'
                        ? 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                    variant={plan.popular ? 'default' : plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ/Informations supplémentaires */}
        <div className="mt-16 text-center">
          <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Puis-je changer d'abonnement ?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment depuis votre espace personnel.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Puis-je annuler à tout moment ?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Bien sûr ! Aucun engagement, vous pouvez annuler votre abonnement quand vous le souhaitez.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Les prix incluent-ils la TVA ?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Oui, tous les prix affichés sont TTC (TVA française incluse).
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Moyens de paiement acceptés ?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Carte bancaire, PayPal, Apple Pay, Google Pay et virements SEPA.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action final */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">
            Une question ? Besoin d'aide pour choisir ?
          </p>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
            Contactez notre équipe
          </Button>
        </div>
      </div>
    </div>
  );
} 