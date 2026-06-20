'use client';

import { AlertCircle, Check, Trash2, X, RotateCcw } from 'lucide-react';

interface GiftCardCardProps {
  giftCard: {
    id: string;
    code: string;
    amount: number;
    recipientEmail: string | null;
    personalMessage: string | null;
    isPaid: boolean;
    status: 'IN_PROGRESS_PAYMENT' | 'ACTIVE' | 'USED' | 'EXPIRED';
    createdAt: string;
    expiresAt: string;
    transactionExpireAt: string | null;
    usedAt: string | null;
  };
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
  onValidate: (id: string) => void;
  onMarkUsed: (giftCard: { id: string; expiresAt: string }) => void;
  onDelete: (id: string) => void;
}

export function GiftCardCard({ giftCard, formatCurrency, formatDate, formatDateTime, onValidate, onMarkUsed, onDelete }: GiftCardCardProps) {
  // La suppression de bons cadeaux est désactivée
  const canValidate = giftCard.status === 'ACTIVE' || giftCard.status === 'USED';
  const canDelete = false;
  const canMarkUsed = giftCard.status === 'ACTIVE' || giftCard.status === 'EXPIRED';
  const isPending = giftCard.status === 'IN_PROGRESS_PAYMENT';
  const isMarkedAsUsed = giftCard.status === 'USED';

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-gold/30 transition-colors group relative">
      {/* Actions buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Marquer comme utilisé pour ACTIVE ou EXPIRED */}
        {canMarkUsed && !isMarkedAsUsed && (
          <button
            onClick={() => onMarkUsed({ id: giftCard.id, expiresAt: giftCard.expiresAt })}
            className="p-2 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-colors"
            title={giftCard.status === 'EXPIRED' ? 'Valider le bon expiré' : 'Marquer comme utilisé'}
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        {/* Remettre USED à non utilisé */}
        {canValidate && isMarkedAsUsed && (
          <button
            onClick={() => onValidate(giftCard.id)}
            className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-colors"
            title="Marquer comme non utilisé"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {/* Supprimer - désactivé */}
        {canDelete && !isMarkedAsUsed && (
          <button
            onClick={() => onDelete(giftCard.id)}
            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
            title="Supprimer le bon"
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
              {giftCard.code}
            </code>
            {!giftCard.isPaid && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Montant</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(giftCard.amount)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Destinataire</p>
          {giftCard.recipientEmail ? (
            <p className="text-foreground truncate">{giftCard.recipientEmail}</p>
          ) : (
            <p className="text-foreground/60 italic">Email non communiqué</p>
          )}
        </div>

        {giftCard.personalMessage && (
          <div>
            <p className="text-sm text-muted-foreground">Message</p>
            <p className="text-sm text-foreground/80 line-clamp-2 italic">"{giftCard.personalMessage}"</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">Date d'achat</p>
          <p className="text-sm text-foreground">{formatDateTime(giftCard.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut:</span>
            <span className={`text-sm font-medium ${
              giftCard.status === 'ACTIVE' ? 'text-green-400' :
              giftCard.status === 'USED' ? 'text-blue-400' :
              giftCard.status === 'EXPIRED' ? 'text-red-400' :
              'text-amber-400'
            }`}>
              {giftCard.status === 'IN_PROGRESS_PAYMENT' ? 'En cours de paiement' :
               giftCard.status === 'ACTIVE' ? 'Actif' :
               giftCard.status === 'USED' ? 'Utilisé' :
               'Expiré'}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Expire:</span>
          <span className={giftCard.status === 'EXPIRED' ? 'text-red-400' : ''}>
            {formatDate(giftCard.expiresAt)}
          </span>
        </div>

        {giftCard.usedAt && (
          <div className="mt-1 flex items-center gap-2 text-xs text-blue-400">
            <span>Utilisé le:</span>
            <span>{formatDate(giftCard.usedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
