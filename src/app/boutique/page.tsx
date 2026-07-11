'use client';

import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { pickField } from '@/lib/langs';
import { ProductGrid } from '@/components/features/Boutique/ProductGrid';
import { GiftCardButton } from '@/components/features/Boutique/GiftCardButton';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  title_fr: string;
  title_en: string;
  title_de: string;
  description_fr?: string;
  description_en?: string;
  description_de?: string;
  price: number;
  maxOrder: number;
  isDeliverable: boolean;
  image: string;
  alt_fr?: string;
  alt_en?: string;
  alt_de?: string;
}

interface BoutiqueContent {
  image?: string;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  productsIntroTitle_fr?: string;
  productsIntroTitle_en?: string;
  productsIntroTitle_de?: string;
  products?: Product[];
}

export default async function BoutiquePage() {
  const reader = createReader(process.cwd(), config);
  const boutiqueContent = await reader.singletons.boutique.read();
  const content = (boutiqueContent ?? {}) as BoutiqueContent;

  // Récupérer les produits depuis Keystatic
  const products: Product[] = content.products || [];

  // Récupérer le contenu des chèques cadeaux pour la section
  const chequesCadeauxContent = await reader.singletons.chequesCadeaux.read();

  return (
    <div className="min-h-screen bg-background pt-20">
      <BoutiqueSection
        content={content}
        products={products}
        chequesCadeauxContent={chequesCadeauxContent}
      />
    </div>
  );
}

function BoutiqueSection({
  content,
  products,
  chequesCadeauxContent,
}: {
  content: BoutiqueContent;
  products: Product[];
  chequesCadeauxContent?: Record<string, unknown> | null;
}) {
  const { locale } = useLanguage();

  const giftCardsTitle = chequesCadeauxContent
    ? pickField(chequesCadeauxContent, 'title', locale)
    : 'Chèques Cadeaux';

  const productsIntroTitle = content.productsIntroTitle_fr
    ? pickField(content, 'productsIntroTitle', locale)
    : 'Nos Produits';

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[36vh] sm:h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={content.image || 'https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5mfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt="Boutique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-card" />
        </div>
        <div className="relative z-10 text-center sm:px-4 sm:pt-0 pt-16">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pickField(content, 'title', locale)}
          </h1>
          {content.subtitle_fr && (
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {pickField(content, 'subtitle', locale)}
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
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {productsIntroTitle}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {pickField(content, 'productsIntroSubtitle', locale)}
              </p>
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
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {giftCardsTitle}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Offrez une expérience gastronomique unique à vos proches avec nos chèques cadeaux. Valables 12 mois, ils peuvent être utilisés dans tous nos restaurants.
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