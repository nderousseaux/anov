"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, Gift, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function BoutiqueSuccessClient() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<{
    customerName?: string;
    customerEmail?: string;
  } | null>(null);
  const [isGourmetOffer, setIsGourmetOffer] = useState(false);

  // Load stored order form data from sessionStorage
  // Use pageshow event to handle back/forward cache (bfcache)
  useEffect(() => {
    const loadFromSessionStorage = () => {
      if (typeof window !== 'undefined') {
        const storedData = sessionStorage.getItem('productOrderFormData');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData({
              customerName: parsedData.customerName,
              customerEmail: parsedData.customerEmail,
            });
          } catch {
            // Invalid JSON, ignore
          }
        }

        const gourmetOfferData = sessionStorage.getItem('gourmetOfferFormData');
        if (
          searchParams?.get("type") === "gourmet-offer" ||
          gourmetOfferData
        ) {
          setIsGourmetOffer(true);
        }
      }
    };

    // Load immediately on mount
    loadFromSessionStorage();

    // Also listen for pageshow event (fired when page is restored from bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        loadFromSessionStorage();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [searchParams]);

  const hasFormData = formData !== null;

  if (isGourmetOffer) {
    const g = t.boutique.gourmetOffer.success;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-green-500" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {g.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {g.emailSentTitle}
          </p>
          <p className="text-base text-muted-foreground mb-8">
            {g.emailSentDescription}
          </p>
          <div className="flex flex-col gap-4 justify-center">
            <Button asChild>
              <a href="/boutique" className="flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {g.buttonAnother}
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