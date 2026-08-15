"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface GourmetOfferFormOffer {
  id: string;
  title: string;
  price: number;
  image?: string;
}

interface GourmetOfferFormProps {
  offer: GourmetOfferFormOffer;
  onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GourmetOfferForm({ offer, onClose }: GourmetOfferFormProps) {
  const { t } = useLanguage();
  const f = t.boutique.gourmetOffer.form;

  const [step, setStep] = useState<"form" | "processing">("form");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientEmail.trim() || !EMAIL_REGEX.test(recipientEmail)) {
      setError(f.errors.recipient);
      return;
    }

    setStep("processing");

    try {
      const response = await fetch("/api/gourmet-offers/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          offerName: offer.title,
          offerImage: offer.image,
          price: offer.price,
          recipientEmail,
          personalMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || f.errors.network);
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "gourmetOfferFormData",
          JSON.stringify({
            recipientEmail,
            personalMessage,
            offerId: offer.id,
            offerName: offer.title,
          }),
        );
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(f.errors.network);
    } catch (err) {
      setError(err instanceof Error ? err.message : f.errors.network);
      setStep("form");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
          aria-label="Fermer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center mb-2">
            <h2
              className="text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {f.title.replace("{title}", offer.title)}
            </h2>
          </div>

          {/* Offer Summary */}
          <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
              {offer.image ? (
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Gift className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {offer.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(offer.price)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gourmet-offer-recipient">
              {f.recipientLabel}
            </Label>
            <Input
              id="gourmet-offer-recipient"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder={f.placeholderRecipient}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gourmet-offer-message">{f.messageLabel}</Label>
            <Textarea
              id="gourmet-offer-message"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder={f.placeholderMessage}
              className="min-h-24"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" size="lg" disabled={step === "processing"}>
              {step === "processing" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {f.submit}
                </>
              ) : (
                f.submit
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={step === "processing"}
            >
              {f.cancel}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {f.paymentInfo}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
