import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug, getRelatedProducts } from "../data";
import { Star, ShoppingCart, Truck, RotateCcw, Shield } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-background">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge className="bg-yellow-500 text-black">
                    ⭐ Bestseller
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
            </div>

            <div>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through mr-2">
                  {product.originalPrice.toFixed(2)}€
                </span>
              )}
              <span className="text-3xl font-bold">
                {product.price.toFixed(2)}€
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Tailles</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className="px-4 py-2 border rounded-lg hover:border-gray-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Couleurs</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className="px-4 py-2 border rounded-lg hover:border-gray-400"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
              {!product.inStock && (
                <Badge variant="secondary" className="self-center">
                  Rupture de stock
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Livraison gratuite</div>
                    <div className="text-xs text-muted-foreground">
                      Dès 50€ d'achat
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Retours 30 jours</div>
                    <div className="text-xs text-muted-foreground">
                      Gratuits
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Paiement sécurisé</div>
                    <div className="text-xs text-muted-foreground">
                      SSL / PCI
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/boutique/${p.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-48">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="font-medium line-clamp-1">{p.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.price.toFixed(2)}€
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { products } = await import("../data");
  return products.map((p) => ({ slug: p.slug }));
}
