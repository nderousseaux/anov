'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Package, Truck, Store } from 'lucide-react';
interface CustomerAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  code: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: CustomerAddress;
  status: string;
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string;
  }

interface OrderDetailContentProps {
  order: Order;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'En paiement...',
  CONFIRMED: 'En attente...',
  SHIPPED: 'Envoyée',
  READY: 'Prête',
  COMPLETED: 'Terminée',
  CANCELLED: 'Remboursée',
};

const AVAILABLE_ACTIONS_BASE: Record<string, Array<{ label: string; value: string; variant?: string }>> = {
  PENDING_PAYMENT: [],
  CONFIRMED: [
    { label: 'Passer au suivant', value: 'NEXT' },
    { label: 'Rembourser / Annuler', value: 'CANCELLED', variant: 'outline' },
  ],
  READY: [
    { label: 'Marquer comme terminée', value: 'COMPLETED' },
    { label: 'Rembourser / Annuler', value: 'CANCELLED', variant: 'outline' },
  ],
  SHIPPED: [
    { label: 'Marquer comme terminée', value: 'COMPLETED' },
    { label: 'Rembourser / Annuler', value: 'CANCELLED', variant: 'outline' },
  ],
  COMPLETED: [
    { label: 'Rembourser / Annuler', value: 'CANCELLED', variant: 'outline' },
  ],
  CANCELLED: [],
};

function getAvailableActions(orderStatus: string, deliveryMethod: 'PICKUP' | 'DELIVERY') {
  const baseActions = AVAILABLE_ACTIONS_BASE[orderStatus] || [];

  // Pour les commandes CONFIRMED, ajouter l'action "Passer au suivant" en plus des autres actions
  if (orderStatus === 'CONFIRMED') {
    const label = deliveryMethod === 'DELIVERY' ? 'Marquer comme envoyée (mail)' : 'Marquer comme prête (mail)';
    const targetStatus = deliveryMethod === 'DELIVERY' ? 'SHIPPED' : 'READY';
    return [
      { label, value: targetStatus },
      ...baseActions.filter(a => a.value !== 'NEXT')
    ];
  }

  return baseActions;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      // Refresh order data
      const updatedRes = await fetch(`/api/admin/orders/${order.id}`);
      if (updatedRes.ok) {
        const updatedOrder = await updatedRes.json();
        // We can't update state directly since this is a client component
        // In a real app, we'd use a context or zustand store
        // For now, we'll just reload the page
        router.refresh();
      }

      setSuccessMessage(`Statut mis à jour: ${STATUS_LABELS[newStatus]}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette commande et rembourser le client ?')) return;
    await handleStatusUpdate('CANCELLED');
  };

  const actions = getAvailableActions(order.status, order.deliveryMethod);
  const productTitle = order.productName || 'Produit';

  return (
    <>
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-4 mb-6">
          {successMessage}
        </div>
      )}

      {/* Order Details */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Détails de la commande</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Produit</p>
              <p className="font-medium text-foreground">{productTitle}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{formatCurrency(order.totalPrice)}</p>
              <p className="text-sm text-muted-foreground">Qté: {order.quantity}</p>
            </div>
          </div>

          {order.deliveryMethod === 'DELIVERY' ? (
            <div className="flex items-start gap-4 pl-12">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Livraison à domicile</p>
                <p className="text-foreground font-medium">Adresse de livraison</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.customerAddress?.firstName} {order.customerAddress?.lastName}
                  <br />
                  {order.customerAddress?.address}
                  <br />
                  {order.customerAddress?.zipCode} {order.customerAddress?.city}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 pl-12">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retrait au restaurant</p>
                <p className="text-foreground font-medium">ANØV - Centre-ville</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Nom</p>
                <p className="text-foreground">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Email</p>
                <p className="text-foreground text-sm">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Téléphone</p>
                <p className="text-foreground">{order.customerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.value}
                onClick={() => handleStatusUpdate(action.value)}
                disabled={updating}
                variant={action.variant || 'default'}
                className={action.variant === 'outline'
                  ? 'text-red-500 border-red-500/30 hover:bg-red-500/10'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Payment Info */}
      {order.stripeSessionId && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informations de paiement</h2>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Session Stripe</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">{order.stripeSessionId}</code>
          </div>
        </div>
      )}
    </>
  );
}