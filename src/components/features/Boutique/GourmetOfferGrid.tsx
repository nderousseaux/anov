"use client";

import { GourmetOfferCard } from "./GourmetOfferCard";
import type { BoutiqueSectionClientGourmetOffer } from "./BoutiqueSectionClient";

interface GourmetOfferGridProps {
  offers: BoutiqueSectionClientGourmetOffer[];
}

export function GourmetOfferGrid({ offers }: GourmetOfferGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer, i) => (
        <GourmetOfferCard key={offer.id ?? i} offer={offer} />
      ))}
    </div>
  );
}
