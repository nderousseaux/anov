"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { GiftCardStats } from "@/components/admin/GiftCardStats";
import type { GiftCardStats as GiftCardStatsType } from "@/components/admin/types";
import { GiftCardCard } from "@/components/admin/GiftCardCard";
import { GiftCardFilters } from "@/components/admin/GiftCardFilters";
import { RefreshCw, Plus, Mail, X } from "lucide-react";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipientEmail: string | null;
  personalMessage: string | null;
  isPaid: boolean;
  status: "IN_PROGRESS_PAYMENT" | "ACTIVE" | "USED" | "EXPIRED";
  createdAt: string;
  expiresAt: string | null;
  transactionExpireAt: string | null;
  usedAt: string | null;
}

interface GiftCardListResponse {
  data: GiftCard[];
  total: number;
  page: number;
  pageSize: number;
}

function StatsFallback() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-foreground/10 rounded w-20"></div>
            <div className="h-8 bg-foreground/10 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GiftCardListFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4">
          <div className="animate-pulse space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-foreground/10 rounded w-16"></div>
              <div className="h-4 bg-foreground/10 rounded w-12"></div>
            </div>
            <div className="h-8 bg-foreground/10 rounded w-full"></div>
            <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
            <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GiftCardPageContent() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [stats, setStats] = useState<GiftCardStatsType>({
    totalIssued: 0,
    totalAmount: 0,
    active: 0,
    expired: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    amount: "",
    recipientEmail: "",
    personalMessage: "",
  });

  // Load stored form data from sessionStorage (when returning from Stripe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('giftCardFormData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCreateFormData({
            amount: parsedData.amount || "",
            recipientEmail: parsedData.recipientEmail || "",
            personalMessage: parsedData.personalMessage || "",
          });
          // Don't clear sessionStorage - keep data for potential modifications
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, []);

  // Filters state - must be inside a component wrapped by Suspense
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    code: searchParams.get("code") || "",
    email: searchParams.get("email") || "",
    page: parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch gift cards list
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.code) params.append("code", filters.code);
      if (filters.email) params.append("email", filters.email);
      params.append("page", filters.page.toString());

      const listResponse = await fetch(
        `/api/admin/gift-cards?${params.toString()}`,
      );
      if (!listResponse.ok)
        throw new Error("Erreur lors du chargement des chèques cadeaux");

      const listData: GiftCardListResponse = await listResponse.json();
      setGiftCards(listData.data);

      // Fetch stats
      const statsResponse = await fetch("/api/admin/gift-cards/stats");
      if (!statsResponse.ok)
        throw new Error("Erreur lors du chargement des statistiques");

      const statsData: GiftCardStatsType = await statsResponse.json();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.code, filters.email, filters.page]);

  // Fetch data when filters change or component mounts
  useEffect(() => {
    const fetchDataWithFilters = async () => {
      await fetchData();
    };
    fetchDataWithFilters();
  }, [fetchData]);

  // Reload stats when refreshing
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleValidateGiftCard = async (id: string) => {
    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action: "validate",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la validation");
      }

      // Refresh data
      handleRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleMarkUsed = (giftCard: GiftCard) => {
    // If expiresAt is null, treat it as not expired
    const now = new Date();
    let isExpired = false;
    if (giftCard.expiresAt) {
      const expiresAt = new Date(giftCard.expiresAt);
      isExpired = now > expiresAt;
    }

    if (isExpired) {
      const formattedDate = giftCard.expiresAt
        ? formatDateTime(giftCard.expiresAt)
        : "";
      if (
        !confirm(
          `Attention, ce bon cadeau est expiré depuis le ${formattedDate}. Êtes-vous sûr de vouloir le marquer comme utilisé ?`,
        )
      ) {
        return;
      }
    } else if (
      !confirm("Êtes-vous sûr de vouloir marquer ce bon comme utilisé ?")
    ) {
      return;
    }

    handleMarkUsedAction(giftCard.id);
  };

  // Wrapper function for GiftCardCard component (only passes required props)
  const handleMarkUsedForCard = ({
    id,
    expiresAt,
  }: {
    id: string;
    expiresAt?: string | null;
  }) => {
    handleMarkUsed({
      id,
      code: "",
      amount: 0,
      recipientEmail: null,
      personalMessage: null,
      isPaid: false,
      status: "ACTIVE",
      createdAt: "",
      expiresAt: expiresAt ?? "",
      transactionExpireAt: null,
      usedAt: null,
    });
  };

  const handleMarkUsedAction = async (id: string) => {
    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action: "markUsed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      // Refresh data
      handleRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  // La suppression de bons cadeaux est désactivée
  const handleDeleteGiftCard = () => {
    setError("La suppression de bons cadeaux n'est pas autorisée.");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateString = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.amount) {
      setError("Le montant est requis");
      return;
    }

    const amountValue = parseInt(createFormData.amount, 10);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Veuillez entrer un montant valide (nombre entier)");
      return;
    }

    // Vérifier que le montant ne contient pas de décimales
    if (createFormData.amount.includes(".")) {
      setError("Le montant doit être un nombre entier (sans décimales)");
      return;
    }

    // Vérifier l'email si présent
    if (
      createFormData.recipientEmail &&
      createFormData.recipientEmail.trim() !== ""
    ) {
      const emailValue = createFormData.recipientEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        setError("Veuillez entrer une adresse email valide");
        return;
      }
    }

    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: createFormData.amount,
          recipientEmail: createFormData.recipientEmail || null,
          personalMessage: createFormData.personalMessage || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      const newGiftCard = await response.json();

      // Refresh data
      handleRefresh();

      // Reset form and close modal
      setIsCreateModalOpen(false);
      setCreateFormData({
        amount: "",
        recipientEmail: "",
        personalMessage: "",
      });

      // Clear error
      setError(null);

      // Show success alert with code
      if (window) {
        // Display the code in a simple alert since we're on admin interface
        // For better UX, we could add a toast notification system
        alert(
          `Code créé avec succès : ${newGiftCard.code}\n\nCe code a été créé depuis l'interface admin.\n${newGiftCard.recipientEmail ? `Email envoyé à : ${newGiftCard.recipientEmail}` : "Aucun email envoyé - le code doit être partagé manuellement."}`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ amount: "", recipientEmail: "", personalMessage: "" });
    setError(null);
  };

  // Gestion de la touche Échap pour fermer la modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    if (isCreateModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreateModalOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gold">
              Bons Cadeaux
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion complète des chèques cadeaux
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A236] hover:bg-[#d4b14b] text-[#1C1C1C] font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Créer un bon cadeau</span>
              <span className="md:hidden">Créer</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#262626] hover:bg-[#333333] text-[#fcf8f2] hover:text-[#f5e6c6] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">Rafraîchir</span>
              <RefreshCw className="w-4 h-4 md:hidden" />
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Suspense fallback={<StatsFallback />}>
          <GiftCardStats stats={stats} />
        </Suspense>

        {/* Filters */}
        <div className="mb-6">
          <GiftCardFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Gift Card Grid */}
        {loading && !giftCards.length ? (
          <GiftCardListFallback />
        ) : (
          <>
            {giftCards.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-card border border-border rounded-lg p-8 inline-block">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aucun chèque cadeau
                  </h3>
                  <p className="text-muted-foreground">
                    Les bons cadeaux seront disponibles prochainement
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {giftCards.map((giftCard) => (
                  <GiftCardCard
                    key={giftCard.id}
                    giftCard={giftCard}
                    formatCurrency={formatCurrency}
                    formatDate={formatDateString}
                    formatDateTime={formatDateTime}
                    onValidate={handleValidateGiftCard}
                    onMarkUsed={handleMarkUsedForCard}
                    onDelete={handleDeleteGiftCard}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {giftCards.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Math.ceil(stats.totalIssued / 25) > 1 && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={filters.page === 1 || loading}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Précédent
                  </button>
                )}

                <span className="text-foreground/80">
                  Page {filters.page} sur{" "}
                  {Math.ceil(stats.totalIssued / 25) || 1}
                </span>

                {Math.ceil(stats.totalIssued / 25) > 1 && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={filters.page * 25 >= stats.totalIssued || loading}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de création de bon cadeau */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Créer un bon cadeau
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-muted rounded-full transition-colors w-8 h-8 flex items-center justify-center"
                title="Fermer (Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGiftCard} className="space-y-4">
              {/* Montant */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Montant <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={createFormData.amount}
                    onChange={(e) => {
                      // Ne permettre que les nombres entiers
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setCreateFormData((prev) => ({
                          ...prev,
                          amount: value,
                        }));
                      }
                    }}
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              {/* Email destinataire (optionnel) */}
              <div>
                <label
                  htmlFor="recipientEmail"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email du destinataire{" "}
                  <span className="text-muted-foreground text-xs">
                    (optionnel)
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="recipientEmail"
                    type="email"
                    required={!!createFormData.recipientEmail}
                    value={createFormData.recipientEmail}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        recipientEmail: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="destinataire@example.com"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Laissez vide pour créer le bon sans email (le code sera
                  affiché à la création)
                </p>
              </div>

              {/* Message personnalisé */}
              <div>
                <label
                  htmlFor="personalMessage"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message personnalisé{" "}
                  <span className="text-muted-foreground text-xs">
                    (optionnel)
                  </span>
                </label>
                <textarea
                  id="personalMessage"
                  rows={3}
                  value={createFormData.personalMessage}
                  onChange={(e) =>
                    setCreateFormData((prev) => ({
                      ...prev,
                      personalMessage: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  placeholder="Un message personnalisé à inclure..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!createFormData.amount}
                  className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors ${
                    createFormData.amount
                      ? "bg-[#C5A236] hover:bg-[#d4b14b] text-[#1C1C1C]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Créer le bon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminGiftCardsPage() {
  return (
    <Suspense fallback={<StatsFallback />}>
      <GiftCardPageContent />
    </Suspense>
  );
}
