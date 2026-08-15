import type { GourmetOfferStatus } from "./types";

interface GourmetOfferStatusBadgeProps {
  status: GourmetOfferStatus;
  className?: string;
}

const statusConfig: Record<
  GourmetOfferStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  IN_PROGRESS_PAYMENT: {
    bg: "bg-amber-600/20",
    text: "text-amber-400",
    border: "border-amber-600/30",
    label: "En cours de paiement",
  },
  ACTIVE: {
    bg: "bg-green-600/20",
    text: "text-green-400",
    border: "border-green-600/30",
    label: "Actif",
  },
  USED: {
    bg: "bg-blue-600/20",
    text: "text-blue-400",
    border: "border-blue-600/30",
    label: "Utilisé",
  },
  EXPIRED: {
    bg: "bg-red-600/20",
    text: "text-red-400",
    border: "border-red-600/30",
    label: "Expiré",
  },
};

export function GourmetOfferStatusBadge({
  status,
  className = "",
}: GourmetOfferStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
}
