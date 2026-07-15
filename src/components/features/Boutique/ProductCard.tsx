"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, AlertCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { OrderForm } from "./OrderForm";
import type { BoutiqueSectionClientProduct } from "./BoutiqueSectionClient";

type Product = BoutiqueSectionClientProduct;

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAdding] = useState(false);

  // Generate a stable ID for this product (use original id if available, otherwise derive from title)
  const productId = useMemo(() => {
    return product.id || `product-${product.title_fr}`;
  }, [product.id, product.title_fr]);

  // Check if there's stored form data from a recent purchase (returning from Stripe)
  // If yes, open the popup automatically with pre-filled data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('productOrderFormData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Check if this is the product that was just ordered
          if (parsedData.productId && parsedData.productId === productId) {
            // Clear the sessionStorage so we don't auto-open on future visits
            sessionStorage.removeItem('productOrderFormData');
            // Small delay to ensure component is mounted
            setTimeout(() => {
              setIsOrderOpen(true);
            }, 100);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [productId]);
  const title =
    (product[`title_${locale}` as keyof Product] as string) ||
    product.title_fr ||
    "";
  const alt = product.alt_fr || product.alt_en || "Produit";

  const handleAddToCart = () => {
    setIsOrderOpen(true);
  };

  return (
    <>
      <Card className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div className="aspect-video overflow-hidden bg-muted relative group flex-shrink-0">
          <Image
            src={product.image || "/assets/placeholder-product.jpg"}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="mb-2 flex items-center justify-between flex-shrink-0">
            <span
              className={`text-xs flex items-center gap-1 ${product.isDeliverable ? "text-green-500" : "text-amber-500"}`}
            >
              {product.isDeliverable ? (
                <span>Livrable</span>
              ) : (
                <>
                  <AlertCircle size={12} />
                  Pickup sur place
                </>
              )}
            </span>
          </div>
          <h3
            className="text-lg font-semibold text-foreground mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-shrink-0 min-h-[3.5rem]">
            {(product[`description_${locale}` as keyof Product] as string) ||
              product.description_fr ||
              ""}
          </p>
          <p className="text-2xl font-bold text-primary mb-4 flex-shrink-0">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(product.price ?? 0)}
          </p>
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isAdding ? (
                <span className="animate-pulse">
                  {t.boutique.product.addToCart} en cours...
                </span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t.boutique.product.addToCart}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isOrderOpen && (
        <OrderForm
          product={{
            id: productId,
            title_fr: product.title_fr,
            title_en: product.title_en ?? "",
            title_de: product.title_de ?? "",
            price: product.price ?? 0,
            maxOrder: product.maxOrder ?? 0,
            isDeliverable: product.isDeliverable,
            image: product.image ?? "/assets/placeholder-product.jpg",
          }}
          onClose={() => setIsOrderOpen(false)}
        />
      )}
    </>
  );
}
