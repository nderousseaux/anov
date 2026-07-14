"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaiementPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de réservation
    // Stripe redirige directement vers /reservation/succes après le paiement
    router.push("/reservation");
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête minimaliste aux couleurs du site */}
      <header className="border-b border-primary/20 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold text-primary">ANØV</div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirection vers Stripe...</p>
        </div>
      </div>
    </div>
  );
}
