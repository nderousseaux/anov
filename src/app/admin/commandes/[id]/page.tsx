'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, use } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Package, Mail, Phone, Truck, Store, CalendarDays, Check, X, RefreshCw } from 'lucide-react';

interface OrderDetail {
  id: string;
  code: string;
  product: {
    id: string;
    code: string;
    title_fr: string;
    title_en: string;
    title_de: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string;
  expiresAt?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'En attente',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En préparation',
  SHIPPED: 'Envoyée',
  READY: 'Prête',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  EXPIRED: 'Expirée',
};

const AVAILABLE_ACTIONS: Record<string, Array<{ label: string; value: string }>> = {
  PENDING_PAYMENT: [{ label: 'Marquer comme confirmée', value: 'CONFIRMED' }],
  CONFIRMED: [{ label: 'Marquer comme en préparation', value: 'PROCESSING' }],
  PROCESSING: [
    { label: 'Marquer comme prête (pickup)', value: 'READY' },
    { label: 'Marquer comme envoyée (delivery)', value: 'SHIPPED' },
  ],
  READY: [{ label: 'Marquer comme terminée', value: 'COMPLETED' }],
  SHIPPED: [{ label: 'Marquer comme terminée', value: 'COMPLETED' }],
  COMPLETED: [],
  CANCELLED: [{ label: 'Rembourser', value: 'CANCELLED' }],
  EXPIRED: [],
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function OrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error('Erreur lors du chargement de la commande');
      const data: OrderDetail = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      // Refresh order data
      fetchData();

      // Show success message
      setSuccessMessage(`Statut mis à jour: ${STATUS_LABELS[newStatus]}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette commande et rembourser le client ?')) return;
    await handleStatusUpdate('CANCELLED');
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-muted-foreground">Commande non trouvée</p>
          </div>
        </div>
      </div>
    );
  }

  const actions = AVAILABLE_ACTIONS[order.status] || [];
  const productTitle = order.productName || 'Produit';

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-4xl mx-auto p-6">
        <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour aux commandes
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Commande {order.code}</h1>
            <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
          </div>
          <Badge className={`px-4 py-2 ${getBadgeColor(order.status)}`}>
            {STATUS_LABELS[order.status] || order.status}
          </Badge>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
            {error}
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {action.label}
                </Button>
              ))}
              {order.status !== 'CANCELLED' && order.status !== 'EXPIRED' && (
                <Button
                  onClick={handleCancelOrder}
                  variant="outline"
                  className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                >
                  Rembourser / Annuler
                </Button>
              )}
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
            {order.expiresAt && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Expiration</span>
                <span className="text-sm text-muted-foreground">{formatDateTime(order.expiresAt)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-500/10 text-yellow-600',
    CONFIRMED: 'bg-green-500/10 text-green-600',
    PROCESSING: 'bg-blue-500/10 text-blue-600',
    SHIPPED: 'bg-purple-500/10 text-purple-600',
    READY: 'bg-orange-500/10 text-orange-600',
    COMPLETED: 'bg-green-500/10 text-green-600',
    CANCELLED: 'bg-red-500/10 text-red-600',
    EXPIRED: 'bg-gray-500/10 text-gray-600',
  };
  return colors[status] || 'bg-muted';
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}