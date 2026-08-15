import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";
import { BoutiqueSectionClient } from "@/components/features/Boutique/BoutiqueSectionClient";

// Réutiliser les types de BoutiqueSectionClient pour éviter les doublons
import type {
  BoutiqueSectionClientProduct,
  BoutiqueSectionClientGourmetOffer,
  BoutiqueSectionClientBoutiqueContent,
} from "@/components/features/Boutique/BoutiqueSectionClient";

export default async function BoutiquePage() {
  const reader = createReader(process.cwd(), config);
  const boutiqueContent = await reader.singletons.boutique.read();
  const content = (boutiqueContent ??
    {}) as BoutiqueSectionClientBoutiqueContent;

  // Récupérer les produits depuis Keystatic
  const products = (content.products || []) as BoutiqueSectionClientProduct[];

  // Récupérer les offres gourmandes depuis Keystatic
  const gourmetOffers = (content.gourmetOffers ||
    []) as BoutiqueSectionClientGourmetOffer[];

  // Récupérer le contenu des chèques cadeaux pour la section
  const chequesCadeauxContent = await reader.singletons.chequesCadeaux.read();

  return (
    <div className="min-h-screen bg-background pt-20">
      <BoutiqueSectionClient
        content={content}
        products={products}
        gourmetOffers={gourmetOffers}
        chequesCadeauxContent={chequesCadeauxContent}
      />
    </div>
  );
}
