import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { pickField } from '@/lib/langs';
import { ProductGrid } from '@/components/features/Boutique/ProductGrid';
import { GiftCardButton } from '@/components/features/Boutique/GiftCardButton';
import { BoutiqueSectionClient } from '@/components/features/Boutique/BoutiqueSectionClient';

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
      <BoutiqueSectionClient
        content={content}
        products={products}
        chequesCadeauxContent={chequesCadeauxContent}
      />
    </div>
  );
}