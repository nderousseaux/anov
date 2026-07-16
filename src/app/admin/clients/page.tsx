"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Gift,
  Mail,
  StickyNote,
} from "lucide-react";

interface CustomerSummary {
  email: string;
  reservationCount: number;
  giftCardCount: number;
  contactCount: number;
  lastEventAt: string;
  hasNote: boolean;
}

interface CustomerListResponse {
  data: CustomerSummary[];
  total: number;
  page: number;
  pageSize: number;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
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
      if (search) params.append("search", search);
      params.append("page", page.toString());

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des clients");
      const data: CustomerListResponse = await res.json();
      setCustomers(data.data);
      setTotal(data.total);
      setPageSize(data.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    router.replace(
      `/admin/clients${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  }, [search, page, router]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setTimeout(() => setRefreshing(false), 500));
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <AdminNav />

      <div className="max-w-6xl mx-auto p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Fiches Client
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
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
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Aucun client trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <Link
                key={customer.email}
                href={`/admin/clients/${encodeURIComponent(customer.email)}`}
                className="bg-card border border-border rounded-lg p-4 hover:border-gold/30 transition-colors block"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-medium text-foreground break-all">
                    {customer.email}
                  </span>
                  {customer.hasNote && (
                    <span title="Note présente">
                      <StickyNote className="w-4 h-4 text-primary shrink-0" />
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <CalendarDays className="w-3 h-3" />{" "}
                    {customer.reservationCount}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Gift className="w-3 h-3" /> {customer.giftCardCount}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Mail className="w-3 h-3" /> {customer.contactCount}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Dernière activité : {formatDateTime(customer.lastEventAt)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
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

export default function ClientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <ClientsContent />
    </Suspense>
  );
}
