"use client";

import { useState } from "react";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types pour les produits
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "t-shirt" | "sweat";
  sizes: string[];
  inStock: boolean;
}

// Données mock pour les produits
const products: Product[] = [
  // T-Shirts
  {
    id: "1",
    name: "T-Shirt SowEsport Classic",
    description: "T-Shirt officiel en coton bio",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "2",
    name: "T-Shirt SowEsport Classic",
    description: "T-Shirt officiel en coton bio",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "3",
    name: "T-Shirt SowEsport Classic",
    description: "T-Shirt officiel en coton bio",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "4",
    name: "T-Shirt SowEsport Classic",
    description: "T-Shirt officiel en coton bio",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "5",
    name: "T-Shirt SowEsport Classic",
    description: "T-Shirt officiel en coton bio",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  // Sweats
  {
    id: "6",
    name: "Sweat SowEsport classic",
    description: "Sweat officiel en coton bio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "7",
    name: "Sweat SowEsport classic",
    description: "Sweat officiel en coton bio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "8",
    name: "Sweat SowEsport classic",
    description: "Sweat officiel en coton bio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "9",
    name: "Sweat SowEsport classic",
    description: "Sweat officiel en coton bio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "10",
    name: "Sweat SowEsport classic",
    description: "Sweat officiel en coton bio",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  }
];

// Composant pour les cartes produits
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Rupture de stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white text-lg">{product.name}</h3>
          <p className="text-gray-400 text-sm">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
        </div>
        
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BoutiquePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Séparer par catégories
  const tshirts = filteredProducts.filter(product => product.category === "t-shirt");
  const sweats = filteredProducts.filter(product => product.category === "sweat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Boutique SowEsport
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez notre collection de produits exclusifs
          </p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Barre de recherche */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filtres */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Taille" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Taille</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section T-Shirts */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">T-Shirts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {tshirts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section Sweats */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Sweats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {sweats.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section informations */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-white font-bold mb-2">Livraison gratuite</h3>
              <p className="text-gray-300 text-sm">À partir de 50€ d'achat en France métropolitaine</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Badge className="w-6 h-6 text-white bg-transparent border-0">🛡️</Badge>
                </div>
              </div>
              <h3 className="text-white font-bold mb-2">Retours gratuits</h3>
              <p className="text-gray-300 text-sm">30 jours pour changer d'avis, retours gratuits</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Badge className="w-6 h-6 text-white bg-transparent border-0">⚡</Badge>
                </div>
              </div>
              <h3 className="text-white font-bold mb-2">Expédition rapide</h3>
              <p className="text-gray-300 text-sm">Commande expédiée sous 24h ouvrées</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 