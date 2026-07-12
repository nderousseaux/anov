'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, AlertCircle, Package } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING_PAYMENT: {
    label: 'Paiement en cours...',
    variant: 'default',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'En attente...',
    variant: 'default',
    icon: Clock,
  },
  PROCESSING: {
    label: 'En préparation',
    variant: 'default',
    icon: Package,
  },
  SHIPPED: {
    label: 'Envoyée',
    variant: 'default',
    icon: Package,
  },
  READY: {
    label: 'Prête',
    variant: 'default',
    icon: Package,
  },
  COMPLETED: {
    label: 'Terminée',
    variant: 'default',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Remboursée',
    variant: 'outline',
    icon: AlertCircle,
  },
  EXPIRED: {
    label: 'Expirée',
    variant: 'outline',
    icon: AlertCircle,
  },
} as const;

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING_PAYMENT;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}