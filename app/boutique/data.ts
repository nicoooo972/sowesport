export interface Product {
  id: string;
  slug: string;
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

export const products: Product[] = [
  {
    id: "1",
    slug: "tshirt-sowesport-classic",
    name: "T-Shirt SowEsport Classic",
    description:
      "T-shirt officiel en coton bio premium avec logo brodé. Coupe moderne et confortable pour les gamers.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage 30°C", "Pas de sèche-linge", "Repassage à l'envers"],
  },
  {
    id: "2",
    slug: "tshirt-gaming-elite",
    name: "T-Shirt Gaming Elite",
    description:
      "T-shirt technique avec fibres anti-transpiration pour les sessions gaming intensives.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4ad2?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage 40°C", "Séchage rapide"],
  },
  {
    id: "3",
    slug: "sweat-sowesport-pro",
    name: "Sweat SowEsport Pro",
    description:
      "Sweat à capuche premium avec doublure polaire et poche kangourou. Design exclusif SowEsport.",
    price: 59.99,
    originalPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage 30°C", "Séchage doux"],
  },
  {
    id: "4",
    slug: "casquette-gaming",
    name: "Casquette Gaming",
    description:
      "Casquette ajustable avec logo SowEsport brodé. Parfaite pour représenter votre passion gaming.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage à la main"],
  },
  {
    id: "5",
    slug: "sweat-gaming-zone",
    name: "Sweat Gaming Zone",
    description: "Sweat crewneck minimaliste pour un style gaming décontracté.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage 30°C"],
  },
  {
    id: "6",
    slug: "tshirt-retro-gaming",
    name: "T-Shirt Retro Gaming",
    description:
      "Design rétro inspiré des jeux vidéo classiques. Édition limitée collector.",
    price: 32.99,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop&crop=center",
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
    care: ["Lavage 30°C", "Repassage à l'envers"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}


