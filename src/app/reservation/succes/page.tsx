"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Users,
  Mail,
  Phone,
  XCircle,
  Calendar,
  Clock as ClockIcon,
  Home,
} from "lucide-react";
import {
  PostPaymentScreen,
  PostPaymentLoading,
} from "@/components/shared/PostPaymentScreen";

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
  const sessionId = searchParams.get("session_id");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return <PostPaymentLoading message="Chargement..." />;
  }

  if (error || !reservation) {
    return (
      <PostPaymentScreen
        tone="error"
        icon={<XCircle className="w-10 h-10" />}
        title={error ?? "Systeme de paiement temporairement desactive"}
        description="Veuillez utiliser le CMS admin pour faire vos reservations"
        actions={[
          { label: "Faire une réservation via CMS", href: "/reservation" },
        ]}
      />
    );
  }

  // Si la réservation est expirée (PENDING_PAYMENT + transactionExpireAt dépassé)
  if (isExpired) {
    return (
      <PostPaymentScreen
        tone="warning"
        icon={<ClockIcon className="w-10 h-10" />}
        title="Transaction expirée"
        description="Votre paiement n'a pas été complété dans les 10 minutes. La réservation a été annulée."
        actions={[
          { label: "Faire une nouvelle réservation", href: "/reservation" },
        ]}
      >
        <p className="text-foreground">
          Votre acompte n&apos;a pas été débité. Le créneau est de nouveau
          disponible.
        </p>
      </PostPaymentScreen>
    );
  }

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
    <PostPaymentScreen
      icon={<CheckCircle className="w-10 h-10" />}
      title="Réservation confirmée"
      description="Votre acompte a bien été reçu. Un email de confirmation vous a été envoyé."
      actions={[
        {
          label: "Retour à l'accueil",
          href: "/",
          icon: <Home className="w-4 h-4" />,
          variant: "outline",
        },
      ]}
    >
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
    </PostPaymentScreen>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense fallback={<PostPaymentLoading message="Chargement..." />}>
      <ReservationSuccessForm />
    </Suspense>
  );
}