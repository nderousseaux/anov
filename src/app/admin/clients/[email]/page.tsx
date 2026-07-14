"use client";

import { useEffect, useState, useCallback, useMemo, use } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  ArrowLeft,
  Save,
  CalendarDays,
  Gift,
  Mail,
  Check,
  Package,
} from "lucide-react";

interface ReservationRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  guests: number;
  status: string;
  specialRequest: string | null;
  createdAt: string;
}

interface GiftCardRow {
  id: string;
  code: string;
  amount: number;
  recipientEmail: string | null;
  personalMessage: string | null;
  status: string;
  createdAt: string;
  usedAt: string | null;
}

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ProductOrderRow {
  id: string;
  code: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface CustomerDetailResponse {
  reservations: ReservationRow[];
  giftCards: GiftCardRow[];
  contactMessages: ContactMessageRow[];
  productOrders: ProductOrderRow[];
  note: { content: string } | null;
}

type TimelineItem =
  | { type: "reservation"; date: string; data: ReservationRow }
  | { type: "giftCard"; date: string; data: GiftCardRow }
  | { type: "contact"; date: string; data: ContactMessageRow }
  | { type: "productOrder"; date: string; data: ProductOrderRow };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
  IN_PROGRESS_PAYMENT: "Paiement en cours",
  ACTIVE: "Actif",
  USED: "Utilisé",
  EXPIRED: "Expiré",
  PROCESSING: "En préparation",
  SHIPPED: "Envoyée",
  READY: "Prête",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: rawEmail } = use(params);
  const email = decodeURIComponent(rawEmail);

  const [detail, setDetail] = useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/customers/${encodeURIComponent(email)}`,
      );
      if (!res.ok)
        throw new Error("Erreur lors du chargement de la fiche client");
      const data: CustomerDetailResponse = await res.json();
      setDetail(data);
      setNoteContent(data.note?.content ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!detail) return [];
    const items: TimelineItem[] = [
      ...detail.reservations.map((r) => ({
        type: "reservation" as const,
        date: r.date,
        data: r,
      })),
      ...detail.giftCards.map((g) => ({
        type: "giftCard" as const,
        date: g.createdAt,
        data: g,
      })),
      ...detail.contactMessages.map((c) => ({
        type: "contact" as const,
        date: c.createdAt,
        data: c,
      })),
      ...detail.productOrders.map((o) => ({
        type: "productOrder" as const,
        date: o.createdAt,
        data: o,
      })),
    ];
    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [detail]);

  const filterItems = (type: TimelineItem["type"] | "all") =>
    type === "all" ? timeline : timeline.filter((i) => i.type === type);

  const handleSaveNote = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(
        `/api/admin/customers/${encodeURIComponent(email)}/note`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: noteContent }),
        },
      );
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde de la note");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux fiches client
        </Link>

        <h1 className="text-2xl font-semibold text-foreground mb-6 break-all">
          {email}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-lg p-4 mb-8">
              <h2 className="text-sm font-medium text-foreground mb-3">Note</h2>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Ajouter une note sur ce client..."
                className="min-h-24 mb-3"
              />
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={handleSaveNote} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Enregistrer
                </Button>
                {saved && (
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Note enregistrée
                  </span>
                )}
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Tous ({timeline.length})</TabsTrigger>
                <TabsTrigger value="reservation">
                  Réservations ({detail?.reservations.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="giftCard">
                  Bons cadeaux ({detail?.giftCards.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="contact">
                  Contacts ({detail?.contactMessages.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="productOrder">
                  Commandes ({detail?.productOrders.length ?? 0})
                </TabsTrigger>
              </TabsList>

              {(
                [
                  "all",
                  "reservation",
                  "giftCard",
                  "contact",
                  "productOrder",
                ] as const
              ).map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                  {filterItems(tab).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Aucun événement.
                    </div>
                  ) : (
                    filterItems(tab).map((item) => (
                      <TimelineCard
                        key={`${item.type}-${item.data.id}`}
                        item={item}
                      />
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  if (item.type === "reservation") {
    const r = item.data;
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
        <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              Réservation — {r.guests} couvert{r.guests > 1 ? "s" : ""}
            </span>
            <Badge variant="secondary">
              {STATUS_LABELS[r.status] ?? r.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(r.date)}
          </p>
          {r.specialRequest && (
            <p className="text-sm text-muted-foreground mt-2">
              {r.specialRequest}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (item.type === "giftCard") {
    const g = item.data;
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
        <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              Bon cadeau — {g.code}
            </span>
            <Badge variant="secondary">
              {STATUS_LABELS[g.status] ?? g.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(g.createdAt)} — {formatCurrency(g.amount)}
          </p>
          {g.personalMessage && (
            <p className="text-sm text-muted-foreground mt-2">
              {g.personalMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (item.type === "productOrder") {
    const o = item.data;
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
        <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              Commande — {o.productTitle}
            </span>
            <Badge variant="secondary">
              {STATUS_LABELS[o.status] ?? o.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(o.createdAt)} — Qté: {o.quantity} (
            {formatCurrency(o.totalPrice)})
          </p>
        </div>
      </div>
    );
  }

  const c = item.data;
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
      <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            Message — {c.subject}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(c.createdAt)}
        </p>
        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
          {c.message}
        </p>
      </div>
    </div>
  );
}
