import { Suspense } from "react";
import { BoutiqueSuccessClient } from "@/components/features/Boutique/BoutiqueSuccessClient";

export default async function BoutiqueSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Suspense>
        <BoutiqueSuccessClient />
      </Suspense>
    </div>
  );
}