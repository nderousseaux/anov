"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, Gift, Home, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PostPaymentScreen } from "@/components/shared/PostPaymentScreen";

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

  const homeAction = {
    label: t.common.backToHome,
    href: "/",
    icon: <Home className="w-4 h-4" />,
    variant: "outline" as const,
  };

  if (isGourmetOffer) {
    const g = t.boutique.gourmetOffer.success;
    return (
      <PostPaymentScreen
        icon={<Gift className="w-10 h-10" />}
        title={g.title}
        description={
          <>
            <p className="mb-2">{g.emailSentTitle}</p>
            <p className="text-sm">{g.emailSentDescription}</p>
          </>
        }
        actions={[
          {
            label: g.buttonAnother,
            href: "/boutique",
            icon: <ArrowRight className="w-4 h-4" />,
          },
          homeAction,
        ]}
      />
    );
  }

  return (
    <PostPaymentScreen
      icon={<ShoppingBag className="w-10 h-10" />}
      title={t.boutique.product.successTitle}
      description={t.boutique.product.successDesc}
      actions={[
        {
          label: t.boutique.product.successButtonShop,
          href: "/boutique",
          icon: <ArrowRight className="w-4 h-4" />,
        },
        homeAction,
      ]}
    >
      {hasFormData && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Vos coordonnées ont été enregistrées pour faciliter vos futures commandes.
          </p>
          <p className="text-sm text-foreground">
            {formData.customerName} • {formData.customerEmail}
          </p>
        </div>
      )}
    </PostPaymentScreen>
  );
}