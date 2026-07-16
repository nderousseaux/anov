"use client";

import { pickField } from "@/lib/langs";
import { ProductGrid } from "@/components/features/Boutique/ProductGrid";
import { GiftCardButton } from "@/components/features/Boutique/GiftCardButton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Home, ArrowRight } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";

export interface BoutiqueSectionClientBoutiqueContent {
  image?: string | null;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  productsIntroTitle_fr?: string;
  productsIntroTitle_en?: string;
  productsIntroTitle_de?: string;
  productsIntroSubtitle_fr?: string;
  productsIntroSubtitle_en?: string;
  productsIntroSubtitle_de?: string;
  products?: readonly BoutiqueSectionClientProduct[];
  [key: string]: unknown;
}

export interface BoutiqueSectionClientProduct {
  id?: string;
  title_fr: string;
  title_en?: string;
  title_de?: string;
  description_fr?: string;
  description_en?: string;
  description_de?: string;
  price?: number | null;
  maxOrder?: number | null;
  isDeliverable: boolean;
  image?: string | null;
  alt_fr?: string;
  alt_en?: string;
  [key: string]: unknown;
}

export function BoutiqueSectionClient({
  content,
  products,
  chequesCadeauxContent,
  isSuccess = false,
}: {
  content: BoutiqueSectionClientBoutiqueContent;
  products: BoutiqueSectionClientProduct[];
  chequesCadeauxContent?: Record<string, unknown> | null;
  isSuccess?: boolean;
  sessionId?: string;
}) {
  const { locale } = useLanguage();

  const giftCardsTitle = chequesCadeauxContent
    ? pickField(chequesCadeauxContent, "title", locale)
    : "Chèques Cadeaux";

  const productsIntroTitle = content.productsIntroTitle_fr
    ? pickField(content, "productsIntroTitle", locale)
    : "Nos Produits";

  const productsIntroSubtitle = content.productsIntroSubtitle_fr
    ? pickField(content, "productsIntroSubtitle", locale)
    : undefined;

  // Si c'est la page de succès, afficher un message de confirmation
  if (isSuccess) {
    // Check for stored order form data in sessionStorage
    const hasFormData = typeof window !== 'undefined' && sessionStorage.getItem('productOrderFormData');
    const formData = hasFormData ? JSON.parse(sessionStorage.getItem('productOrderFormData') || '{}') : null;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-green-500" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Commande confirmée !
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Votre commande a été prise en compte avec succès.
          </p>
          {hasFormData && (
            <div className="bg-muted/50 border border-primary/10 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Vos coordonnées ont été enregistrées pour faciliter vos futures commandes.
              </p>
              <p className="text-sm text-foreground mb-4">
                {formData.customerName} • {formData.customerEmail}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-4 justify-center">
            <Button asChild>
              <a href="/boutique" className="flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {hasFormData ? "Passer une nouvelle commande" : "Commander un produit"}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l&apos;accueil
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[36vh] sm:h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              content.image ||
              "https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5mfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            }
            alt="Boutique"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-card" />
        </div>
        <div className="relative z-10 text-center sm:px-4 sm:pt-0 pt-16">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pickField(content, "title", locale)}
          </h1>
          {content.subtitle_fr && (
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {pickField(content, "subtitle", locale)}
            </p>
          )}
        </div>
      </div>

      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          {/* Section Produits */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {productsIntroTitle}
              </h2>
              {productsIntroSubtitle && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {productsIntroSubtitle}
                </p>
              )}
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12 bg-secondary/50 rounded-xl border border-primary/10">
                <p className="text-muted-foreground">
                  Aucun produit disponible pour le moment.
                </p>
              </div>
            )}
          </div>

          {/* Section Chèques Cadeaux */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {giftCardsTitle}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Offrez une expérience gastronomique unique à vos proches avec
                nos chèques cadeaux. Valables 12 mois, ils peuvent être utilisés
                dans tous nos restaurants.
              </p>
            </div>

            <div className="flex justify-center">
              <GiftCardButton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
