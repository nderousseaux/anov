import type { GiftCardStatus } from './types';

interface GiftCardStatusBadgeProps {
  status: GiftCardStatus;
  className?: string;
}

const statusConfig = {
  PENDING_PAYMENT: {
    bg: 'bg-yellow-600/20',
    text: 'text-yellow-400',
    border: 'border-yellow-600/30',
    label: 'En attente',
  },
  ACTIVE: {
    bg: 'bg-green-600/20',
    text: 'text-green-400',
    border: 'border-green-600/30',
    label: 'Actif',
  },
  USED: {
    bg: 'bg-blue-600/20',
    text: 'text-blue-400',
    border: 'border-blue-600/30',
    label: 'Utilisé',
  },
  EXPIRED: {
    bg: 'bg-red-600/20',
    text: 'text-red-400',
    border: 'border-red-600/30',
    label: 'Expiré',
  },
};

export function GiftCardStatusBadge({ status, className = '' }: GiftCardStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}>
      {config.label}
    </span>
  );
}
