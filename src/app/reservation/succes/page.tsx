"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Users,
  Mail,
  Phone,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock as ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// SYSTEME DE PAIEMENT ACTIVE
// Le CMS est fonctionnel coté admin, le système de paiement Stripe est maintenant actif

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  status: string;
  transactionExpireAt: string | null;
};

function ReservationSuccessForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequest: "",
  });
  // Check for formData in sessionStorage (when returning from Stripe)
  // Use pageshow event to handle back/forward cache (bfcache)
  useEffect(() => {
    const loadFromSessionStorage = () => {
      if (typeof window !== 'undefined') {
        const storedData = sessionStorage.getItem('reservationFormData');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
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

  useEffect(() => {
    // Vérifier le statut de la session Stripe
    if (sessionId) {
      fetch(`/api/reservations/by-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setReservation(data);
            // Vérifier si la réservation est expirée
            // EXPIRED is nowait le statut, but on vérifie PENDING_PAYMENT + transactionExpireAt dépassé
            const now = new Date();
            const isExpired =
              data.status === "PENDING_PAYMENT" &&
              data.transactionExpireAt &&
              new Date(data.transactionExpireAt) < now;
            setIsExpired(isExpired);
          } else {
            setError(data.error || "Session introuvable");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Erreur lors de la vérification de la réservation");
          setLoading(false);
        });
    } else {
      setError("ID de session manquant");
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <XCircle size={64} className="text-destructive mx-auto mb-4" />
          <p className="text-foreground text-xl mb-6">
            {error ?? "Systeme de paiement temporairement desactive"}
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Veuillez utiliser le CMS admin pour faire vos reservations
          </p>
          <Link href="/reservation">
            <Button className="bg-primary text-primary-foreground">
              Faire une réservation via CMS
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Si la réservation est expirée (PENDING_PAYMENT + transactionExpireAt dépassé)
  if (isExpired) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <ClockIcon size={72} className="text-amber-500 mx-auto mb-4" />
            <h1
              className="text-4xl sm:text-5xl text-amber-500 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Transaction expirée
            </h1>
            <p className="text-muted-foreground">
              Votre paiement n&apos;a pas été complété dans les 10 minutes. La
              réservation a été annulée.
            </p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5">
            <p className="text-foreground">
              Votre acompte n&apos;a pas été débité. Le créneau est de nouveau
              disponible.
            </p>
          </div>
          <div className="text-center mt-8">
            <Link href="/reservation">
              <Button className="bg-primary text-primary-foreground">
                Faire une nouvelle réservation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si on a des données encodées, afficher un bouton pour reprendre le formulaire
  // (data is read from sessionStorage)
  const hasFormData = Object.values(formData).some(v => v);

  // Format de la date pour l'affichage
  const d = new Date(reservation.date);
  const formattedDate = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <CheckCircle size={72} className="text-primary mx-auto mb-4" />
          <h1
            className="text-4xl sm:text-5xl text-primary mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Réservation confirmée
          </h1>
          <p className="text-muted-foreground">
            Votre acompte a bien été reçu. Un email de confirmation vous a été
            envoyé.
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5 mb-6">
          <div className="flex items-center gap-3 text-foreground">
            <Calendar size={20} className="text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <ClockIcon size={20} className="text-primary shrink-0" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Users size={20} className="text-primary shrink-0" />
            <span>
              {reservation.guests} personne{reservation.guests > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Mail size={20} className="text-primary shrink-0" />
            <span>{reservation.email}</span>
          </div>
          {reservation.phone && (
            <div className="flex items-center gap-3 text-foreground">
              <Phone size={20} className="text-primary shrink-0" />
              <span>{reservation.phone}</span>
            </div>
          )}
        </div>

        <div className="bg-muted/50 border border-primary/10 rounded-lg p-6 mb-6 text-center">
          <p className="text-foreground mb-4">
            {hasFormData
              ? "Vous avez changé d'avis ou voulez modifier votre réservation ?"
              : "Souhaitez-vous faire une nouvelle réservation ?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasFormData ? (
              <Button
                onClick={() => {
                  // Force a refresh to re-run useEffect in ReservationForm
                  router.refresh();
                  window.location.href = "/reservation";
                }}
                variant="outline"
                className="border-primary/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Reprendre ma réservation
              </Button>
            ) : null}
            <Button
              onClick={() => {
                router.refresh();
                window.location.href = "/reservation";
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {hasFormData ? "Modifier la réservation" : "Faire une réservation"}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10"
            >
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <p className="text-foreground text-xl">Chargement...</p>
        </div>
      }
    >
      <ReservationSuccessForm />
    </Suspense>
  );
}