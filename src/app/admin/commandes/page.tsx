'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight, Search, Package, Mail, CalendarDays } from 'lucide-react';

interface Order {
  id: string;
  code: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  status: string;
  createdAt: string;
}

interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
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

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  CONFIRMED: 'bg-green-500/10 text-green-500 border-green-500/20',
  PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  READY: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  EXPIRED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
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

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
      const data: OrderListResponse = await res.json();
      setOrders(data.data);
      setTotal(data.total);
      setPageSize(data.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/admin/commandes${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [search, statusFilter, page, router]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setTimeout(() => setRefreshing(false), 500));
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Commandes Produits</h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground mb-1 block">Rechercher</Label>
            <Input
              placeholder="Code, email, nom..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex-1 sm:w-48">
            <Label className="text-sm text-muted-foreground mb-1 block">Statut</Label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING_PAYMENT">En attente</option>
              <option value="CONFIRMED">Confirmée</option>
              <option value="PROCESSING">En préparation</option>
              <option value="SHIPPED">Envoyée</option>
              <option value="READY">Prête</option>
              <option value="COMPLETED">Terminée</option>
              <option value="CANCELLED">Annulée</option>
              <option value="EXPIRED">Expirée</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Produit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Qté</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Statut</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono text-primary">{order.code}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{order.productTitle}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{order.quantity}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{formatCurrency(order.totalPrice)}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${STATUS_COLORS[order.status] || 'bg-muted'} border`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  Page {page} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}