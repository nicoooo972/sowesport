"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Heart,
  Star,
  Plus,
  Minus,
  X,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Grid,
  List,
  SlidersHorizontal,
  Eye,
  Share2
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

// Types pour les produits
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: "t-shirt" | "sweat" | "accessoire" | "casquette";
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  material: string;
  care: string[];
}

interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

// Données enrichies pour les produits
const products: Product[] = [
  {
    id: "1",
    name: "T-Shirt SowEsport Classic",
    description: "T-shirt officiel en coton bio premium avec logo brodé. Coupe moderne et confortable pour les gamers.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop&crop=center"
    ],
    category: "t-shirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Noir", "Blanc", "Violet", "Gris"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 156,
    tags: ["Bestseller", "Coton Bio", "Édition Limitée"],
    material: "100% Coton Bio",
    care: ["Lavage 30°C", "Pas de sèche-linge", "Repassage à l'envers"]
  },
  {
    id: "2",
    name: "T-Shirt Gaming Elite",
    description: "T-shirt technique avec fibres anti-transpiration pour les sessions gaming intensives.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4ad2?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600&h=600&fit=crop&crop=center"
    ],
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir", "Bleu Marine", "Rouge"],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 89,
    tags: ["Tech", "Anti-transpiration"],
    material: "Polyester recyclé",
    care: ["Lavage 40°C", "Séchage rapide"]
  },
  {
    id: "3",
    name: "Sweat SowEsport Pro",
    description: "Sweat à capuche premium avec doublure polaire et poche kangourou. Design exclusif SowEsport.",
    price: 59.99,
    originalPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center"
    ],
    category: "sweat",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Noir", "Gris", "Violet", "Blanc"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 203,
    tags: ["Premium", "Doublure Polaire", "Bestseller"],
    material: "80% Coton, 20% Polyester",
    care: ["Lavage 30°C", "Séchage doux"]
  },
  {
    id: "4",
    name: "Casquette Gaming",
    description: "Casquette ajustable avec logo SowEsport brodé. Parfaite pour représenter votre passion gaming.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop&crop=center"
    ],
    category: "casquette",
    sizes: ["Unique"],
    colors: ["Noir", "Blanc", "Violet"],
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 67,
    tags: ["Ajustable", "Logo Brodé"],
    material: "100% Coton",
    care: ["Lavage à la main"]
  },
  {
    id: "5",
    name: "Sweat Gaming Zone",
    description: "Sweat crewneck minimaliste pour un style gaming décontracté.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop&crop=center"
    ],
    category: "sweat",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gris", "Noir", "Beige"],
    inStock: false,
    featured: false,
    rating: 4.4,
    reviews: 45,
    tags: ["Minimaliste", "Crewneck"],
    material: "Mélange Coton",
    care: ["Lavage 30°C"]
  },
  {
    id: "6",
    name: "T-Shirt Retro Gaming",
    description: "Design rétro inspiré des jeux vidéo classiques. Édition limitée collector.",
    price: 32.99,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop&crop=center"
    ],
    category: "t-shirt",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir", "Blanc"],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 112,
    tags: ["Rétro", "Collector", "Édition Limitée"],
    material: "Coton Premium",
    care: ["Lavage 30°C", "Repassage à l'envers"]
  }
];

// Composant ProductCard amélioré
function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite,
  viewMode = "grid" 
}: { 
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
  viewMode?: "grid" | "list";
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (${selectedSize}, ${selectedColor})`,
    });
  };

  if (viewMode === "list") {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Badge variant="destructive">Rupture</Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(product.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through text-sm">
                      {product.originalPrice.toFixed(2)}€
                    </span>
                  )}
                  <span className="text-2xl font-bold">
                    {product.price.toFixed(2)}€
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div 
          className="relative h-80 cursor-pointer"
          onMouseEnter={() => setCurrentImageIndex(1)}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          <Image
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-yellow-500 text-black">
                ⭐ Bestseller
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Rupture</Badge>
            )}
          </div>
          
          {/* Actions overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleFavorite(product.id)}
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <ProductQuickView product={product} onAddToCart={onAddToCart} />
              </DialogContent>
            </Dialog>
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Image indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm block">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
            <span className="text-xl font-bold">
              {product.price.toFixed(2)}€
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-purple-500' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase() === 'noir' ? '#000' :
                                   color.toLowerCase() === 'blanc' ? '#fff' :
                                   color.toLowerCase() === 'violet' ? '#8b5cf6' :
                                   color.toLowerCase() === 'gris' ? '#6b7280' :
                                   color.toLowerCase() === 'rouge' ? '#ef4444' :
                                   color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                                   color.toLowerCase() === 'beige' ? '#d2b48c' : '#6b7280'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant QuickView
function ProductQuickView({ 
  product, 
  onAddToCart 
}: { 
  product: Product; 
  onAddToCart: (product: Product, size: string, color: string) => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative h-96">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-purple-500' : 'border-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-muted-foreground">
            {product.rating} ({product.reviews} avis)
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-lg">
              {product.originalPrice.toFixed(2)}€
            </span>
          )}
          <span className="text-3xl font-bold">
            {product.price.toFixed(2)}€
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Taille</label>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === size 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Couleur</label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedColor === color 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 h-12"
          disabled={!product.inStock}
          onClick={() => onAddToCart(product, selectedSize, selectedColor)}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </Button>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Matière:</span> {product.material}
          </div>
          <div>
            <span className="font-medium">Entretien:</span>
            <ul className="list-disc list-inside mt-1">
              {product.care.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Panier
function CartSheet({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  isOpen, 
  onOpenChange 
}: {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string, color: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Panier ({itemsCount} article{itemsCount > 1 ? 's' : ''})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-bold">{item.product.price.toFixed(2)}€</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.product.id, item.size, item.color)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, Math.max(0, item.quantity - 1))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                  Procéder au paiement
                </Button>
                <Button variant="outline" className="w-full">
                  Continuer mes achats
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Livraison gratuite à partir de 50€
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function BoutiquePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  // Filtrer et trier les produits
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return b.featured ? 1 : -1;
      }
    });

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.product.id === product.id && 
        item.size === size && 
        item.color === color
      );
      
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, size, color, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId, size, color);
    } else {
      setCart(prev => 
        prev.map(item => 
          item.product.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => 
      prev.filter(item => 
        !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Boutique SowEsport
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection exclusive de vêtements gaming premium
          </p>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit, une catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Contrôles */}
              <div className="flex items-center gap-2">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-3 block">Catégorie</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            <SelectItem value="t-shirt">T-Shirts</SelectItem>
                            <SelectItem value="sweat">Sweats</SelectItem>
                            <SelectItem value="casquette">Casquettes</SelectItem>
                            <SelectItem value="accessoire">Accessoires</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          Prix: {priceRange[0]}€ - {priceRange[1]}€
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Recommandés</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Panier
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-purple-600">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(product.id)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setPriceRange([0, 100]);
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Avantages */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Livraison gratuite</h3>
              <p className="text-muted-foreground">
                À partir de 50€ d'achat en France métropolitaine
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Retours gratuits</h3>
              <p className="text-muted-foreground">
                30 jours pour changer d'avis, retours gratuits
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Paiement sécurisé</h3>
              <p className="text-muted-foreground">
                Vos données sont protégées avec le cryptage SSL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panier */}
      <CartSheet
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        isOpen={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
} 