"use client";

import { Check, Trash2, RotateCcw } from "lucide-react";

function checkIsExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

interface GourmetOfferCardProps {
  gourmetOffer: {
    id: string;
    code: string;
    offerName: string;
    price: number;
    recipientEmail: string | null;
    personalMessage: string | null;
    isPaid: boolean;
    status: "IN_PROGRESS_PAYMENT" | "ACTIVE" | "USED" | "EXPIRED";
    createdAt: string;
    expiresAt: string | null;
    transactionExpireAt: string | null;
    usedAt: string | null;
  };
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string | null) => string;
  onValidate: (id: string) => void;
  onMarkUsed: (gourmetOffer: { id: string; expiresAt?: string | null }) => void;
  onDelete: (id: string) => void;
}

export function GourmetOfferCard({
  gourmetOffer,
  formatCurrency,
  formatDate,
  formatDateTime,
  onValidate,
  onMarkUsed,
  onDelete,
}: GourmetOfferCardProps) {
  // La suppression des offres gourmandes est désactivée
  const canValidate =
    gourmetOffer.status === "ACTIVE" || gourmetOffer.status === "USED";
  const canDelete = false;
  const canMarkUsed = true; // Always allow marking as used
  const isMarkedAsUsed = gourmetOffer.status === "USED";
  const isExpired = checkIsExpired(gourmetOffer.expiresAt); // Offre ACTIVE expirée à 1 an

  return (
    <div
      className="bg-card border border-border rounded-lg p-5 hover:border-gold/30 transition-colors group relative"
      data-testid="gourmet-offer-card"
    >
      {/* Actions buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Marquer comme utilisé pour ACTIVE ou EXPIRED */}
        {canMarkUsed && !isMarkedAsUsed && (
          <button
            onClick={() =>
              onMarkUsed({
                id: gourmetOffer.id,
                expiresAt: gourmetOffer.expiresAt ?? undefined,
              })
            }
            className="p-2 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-colors"
            title={
              gourmetOffer.status === "EXPIRED"
                ? "Valider l'offre expirée"
                : "Marquer comme utilisée"
            }
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        {/* Remettre USED à non utilisé */}
        {canValidate && isMarkedAsUsed && (
          <button
            onClick={() => onValidate(gourmetOffer.id)}
            className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-colors"
            title="Marquer comme non utilisée"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {/* Supprimer - désactivé */}
        {canDelete && !isMarkedAsUsed && (
          <button
            onClick={() => onDelete(gourmetOffer.id)}
            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
            title="Supprimer l'offre"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">Code</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="bg-background/50 px-2 py-1 rounded text-sm text-gold font-mono break-all">
              {gourmetOffer.code}
            </code>
            {!gourmetOffer.isPaid && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Offre</p>
          <p className="text-lg font-bold text-foreground">
            {gourmetOffer.offerName}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(gourmetOffer.price)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Destinataire</p>
          {gourmetOffer.recipientEmail ? (
            <p className="text-foreground truncate">
              {gourmetOffer.recipientEmail}
            </p>
          ) : (
            <p className="text-foreground/60 italic">Email non communiqué</p>
          )}
        </div>

        {gourmetOffer.personalMessage && (
          <div>
            <p className="text-sm text-muted-foreground">Message</p>
            <p className="text-sm text-foreground/80 line-clamp-2 italic">
              &quot;{gourmetOffer.personalMessage}&quot;
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">Date d&apos;achat</p>
          <p className="text-sm text-foreground">
            {formatDateTime(gourmetOffer.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut:</span>
            <span
              className={`text-sm font-medium ${
                gourmetOffer.status === "IN_PROGRESS_PAYMENT"
                  ? "text-amber-400"
                  : gourmetOffer.status === "ACTIVE" && isExpired
                    ? "text-red-400"
                    : gourmetOffer.status === "ACTIVE"
                      ? "text-green-400"
                      : gourmetOffer.status === "USED"
                        ? "text-blue-400"
                        : gourmetOffer.status === "EXPIRED"
                          ? "text-red-400"
                          : "text-amber-400"
              }`}
            >
              {gourmetOffer.status === "IN_PROGRESS_PAYMENT"
                ? "En cours de paiement"
                : gourmetOffer.status === "ACTIVE" && isExpired
                  ? "Expiré"
                  : gourmetOffer.status === "ACTIVE"
                    ? "Actif"
                    : gourmetOffer.status === "USED"
                      ? "Utilisé"
                      : "Expiré"}
            </span>
          </div>
        </div>

        {gourmetOffer.usedAt ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Utilisé le:</span>
            <span className="text-blue-400">
              {formatDate(gourmetOffer.usedAt)}
            </span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Expire:</span>
            <span
              className={
                gourmetOffer.status === "EXPIRED" ||
                (gourmetOffer.status === "ACTIVE" && isExpired)
                  ? "text-red-400"
                  : ""
              }
            >
              {gourmetOffer.expiresAt ? formatDate(gourmetOffer.expiresAt) : "N/A"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
