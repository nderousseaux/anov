import { Suspense } from "react";
import { BoutiqueSuccessClient } from "@/components/features/Boutique/BoutiqueSuccessClient";
import { PostPaymentLoading } from "@/components/shared/PostPaymentScreen";

export default async function BoutiqueSuccessPage() {
  return (
    <Suspense fallback={<PostPaymentLoading message="Chargement..." />}>
      <BoutiqueSuccessClient />
    </Suspense>
  );
}