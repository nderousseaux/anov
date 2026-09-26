"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, Home, ArrowRight, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { pickField } from "@/lib/langs";
import {
  PostPaymentScreen,
  PostPaymentLoading,
} from "@/components/shared/PostPaymentScreen";

interface GiftCardSuccessContent {
  title?: string;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  confirmationText?: string;
  confirmationText_fr?: string;
  confirmationText_en?: string;
  confirmationText_de?: string;
  emailSentTitle?: string;
  emailSentTitle_fr?: string;
  emailSentTitle_en?: string;
  emailSentTitle_de?: string;
  emailSentDescription?: string;
  emailSentDescription_fr?: string;
  emailSentDescription_en?: string;
  emailSentDescription_de?: string;
  helpTitle?: string;
  helpTitle_fr?: string;
  helpTitle_en?: string;
  helpTitle_de?: string;
  helpText: string;
  helpText_fr?: string;
  helpText_en?: string;
  helpText_de?: string;
  buttonHome: string;
  buttonHome_fr?: string;
  buttonHome_en?: string;
  buttonHome_de?: string;
  buttonAnother: string;
  buttonAnother_fr?: string;
  buttonAnother_en?: string;
  buttonAnother_de?: string;
}

interface GiftCardSuccessContentProps {
  content: GiftCardSuccessContent | null;
}

export default function GiftCardSuccessContent({
  content,
}: GiftCardSuccessContentProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored gift card form data from sessionStorage
  const [hasFormData, setHasFormData] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    message: "",
  });

  useEffect(() => {
    const loadFromSessionStorage = () => {
      if (typeof window !== 'undefined') {
        const storedData = sessionStorage.getItem('giftCardFormData');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
            setHasFormData(true);
            // Don't clear sessionStorage - keep data for potential modifications
          } catch {
            // Invalid JSON, ignore
          }
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
  }, []);

  const c = content ?? {};

  useEffect(() => {
    if (!sessionId) {
      setError("Session invalide");
      setIsLoading(false);
    } else {
      // Simuler une petite attente pour laisser le temps au webhook de traiter
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <PostPaymentLoading
        message={
          locale === "fr"
            ? "Traitement de votre paiement..."
            : locale === "en"
              ? "Processing your payment..."
              : "Verarbeitung Ihrer Zahlung..."
        }
      />
    );
  }

  if (error || !sessionId) {
    return (
      <PostPaymentScreen
        tone="error"
        icon={<XCircle className="w-10 h-10" />}
        title={
          locale === "fr"
            ? "Une erreur s'est produite"
            : locale === "en"
              ? "An error occurred"
              : "Ein Fehler ist aufgetreten"
        }
        description={
          locale === "fr"
            ? "Nous n'avons pas pu traiter votre paiement. Veuillez réessayer ou nous contacter."
            : locale === "en"
              ? "We were unable to process your payment. Please try again or contact us."
              : "Wir konnten Ihre Zahlung nicht verarbeiten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns."
        }
        actions={[
          {
            label:
              locale === "fr"
                ? "Retour aux chèques cadeaux"
                : locale === "en"
                  ? "Back to gift cards"
                  : "Zurück zu Geschenkgutscheinen",
            href: "/cheques-cadeaux",
          },
        ]}
      />
    );
  }

  return (
    <PostPaymentScreen
      icon={<CheckCircle2 className="w-10 h-10" />}
      title={pickField(c, "title", locale)}
      description={pickField(c, "confirmationText", locale)}
      actions={[
        {
          label: hasFormData
            ? "Acheter un nouveau chèque"
            : pickField(c, "buttonAnother", locale),
          href: "/cheques-cadeaux",
          icon: <ArrowRight className="w-4 h-4" />,
        },
        {
          label: pickField(c, "buttonHome", locale),
          href: "/",
          icon: <Home className="w-4 h-4" />,
          variant: "outline",
        },
      ]}
    >
      <div className="bg-secondary border border-primary/20 rounded-lg p-6 text-center">
        <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
        <p className="text-foreground font-medium">
          {pickField(c, "emailSentTitle", locale)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {pickField(c, "emailSentDescription", locale)}
        </p>
      </div>

      <div className="bg-background/50 border border-primary/10 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          <strong>{pickField(c, "helpTitle", locale)}</strong>{" "}
          {pickField(c, "helpText", locale)}
        </p>
      </div>

      {hasFormData && (
        <div className="bg-muted/50 border border-primary/10 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Vos coordonnées ont été enregistrées pour faciliter vos futures commandes.
          </p>
          <p className="text-sm text-foreground mt-1">
            {formData.recipient} • {formData.amount}
          </p>
        </div>
      )}
    </PostPaymentScreen>
  );
}
