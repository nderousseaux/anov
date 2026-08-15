"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { GourmetOfferForm } from "./GourmetOfferForm";
import type { BoutiqueSectionClientGourmetOffer } from "./BoutiqueSectionClient";

type GourmetOffer = BoutiqueSectionClientGourmetOffer;

export function GourmetOfferCard({ offer }: { offer: GourmetOffer }) {
  const { locale, t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const offerId = useMemo(() => {
    return offer.id || `gourmet-offer-${offer.title_fr}`;
  }, [offer.id, offer.title_fr]);

  const title =
    (offer[`title_${locale}` as keyof GourmetOffer] as string) ||
    offer.title_fr ||
    "";
  const description =
    (offer[`description_${locale}` as keyof GourmetOffer] as string) ||
    offer.description_fr ||
    "";
  const alt = offer.alt_fr || offer.alt_en || title;

  return (
    <>
      <Card className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div className="aspect-video overflow-hidden bg-muted relative group flex-shrink-0">
          <Image
            src={offer.image || "/assets/placeholder-product.jpg"}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <h3
            className="text-lg font-semibold text-foreground mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-shrink-0 min-h-[3.5rem]">
            {description}
          </p>
          <p className="text-2xl font-bold text-primary mb-4 flex-shrink-0">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(offer.price ?? 0)}
          </p>
          <div className="mt-auto">
            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Gift className="w-4 h-4 mr-2" />
              {t.boutique.gourmetOffer.offerButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <GourmetOfferForm
          offer={{
            id: offerId,
            title,
            price: offer.price ?? 0,
            image: offer.image ?? "/assets/placeholder-product.jpg",
          }}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
