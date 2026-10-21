"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloorPlan } from "./FloorPlan";
import {
  SERVICE_LABELS,
  SOURCE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatTime,
  type DayPlanningData,
  type PlanningReservation,
  type PlanningTable,
  type ServiceKey,
  type ServicePlanning,
} from "./types";

function tableNames(ids: number[] | null, tables: PlanningTable[]): string {
  if (!ids || ids.length === 0) return "";
  const byId = new Map(tables.map((t) => [t.id, t.name]));
  return ids.map((id) => byId.get(id) ?? `#${id}`).join(" + ");
}

/** Midi par défaut ; pour aujourd'hui, le soir une fois le service du midi passé. */
function defaultService(date: string): ServiceKey {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return date === today && now.getHours() >= 15 ? "dinner" : "lunch";
}

function FillIndicator({ service }: { service: ServicePlanning }) {
  const { covers, capacity, tablesFree, tablesTotal, unplaced } =
    service.summary;
  const pct = capacity > 0 ? Math.min(100, (covers / capacity) * 100) : 0;
  const bar =
    unplaced.length > 0
      ? "bg-red-500"
      : pct >= 85
        ? "bg-amber-500"
        : "bg-primary";
  return (
    <div className="space-y-1.5" data-testid="fill-indicator">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-foreground">
          {covers} / {capacity} couverts
        </span>
        <span className="text-xs text-muted-foreground">
          {tablesFree} table{tablesFree > 1 ? "s" : ""} libre
          {tablesFree > 1 ? "s" : ""} sur {tablesTotal}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-background/40 overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ReservationRow({
  r,
  tables,
  onCancel,
}: {
  r: PlanningReservation;
  tables: PlanningTable[];
  onCancel: (r: PlanningReservation) => void;
}) {
  const assigned = tableNames(r.assignedTableIds, tables);
  return (
    <div
      className={`bg-background/30 border border-primary/10 rounded-lg px-3 py-2.5 flex items-start gap-3 ${r.status === "CANCELLED" ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="text-sm font-semibold text-primary tabular-nums min-w-[38px]"
          title="Heure d'arrivée"
        >
          {formatTime(r.date)}
        </div>
        <div
          className="text-[10px] text-muted-foreground/70"
          title="Heure de la réservation"
        >
          {formatTime(r.createdAt)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-sm">{r.name}</span>
          <span className="text-xs text-muted-foreground">
            {r.guests} cvrt{r.guests > 1 ? "s" : ""}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border leading-none ${STATUS_COLORS[r.status]}`}
          >
            {STATUS_LABELS[r.status]}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border leading-none border-primary/20 text-muted-foreground">
            {SOURCE_LABELS[r.source]}
          </span>
          {r.counting &&
            (assigned ? (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded border leading-none border-primary/30 text-primary"
                title={
                  r.pinnedTableIds.length > 0
                    ? "Table imposée"
                    : "Table attribuée automatiquement"
                }
              >
                {assigned}
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded border leading-none bg-red-900/20 text-red-400 border-red-900/30">
                Sans table
              </span>
            ))}
        </div>
        {(r.phone || r.email) && (
          <div className="text-xs text-muted-foreground truncate">
            {[r.phone, r.email].filter(Boolean).join(" · ")}
          </div>
        )}
        {r.depositPaidCents ? (
          <div className="text-xs text-green-400 font-medium mt-0.5">
            &#10004; Acompte: {(r.depositPaidCents / 100).toFixed(2)}€
          </div>
        ) : null}
        {r.specialRequest && (
          <div className="text-xs text-amber-400/70 truncate mt-0.5">
            &#8627; {r.specialRequest}
          </div>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {r.status === "PENDING_PAYMENT" && r.transactionExpireAt && (
          <span className="text-[10px] px-2 py-1 rounded border leading-none bg-amber-900/20 text-amber-600 border-amber-900/30">
            Expiration:{" "}
            {new Date(r.transactionExpireAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        {r.status === "CONFIRMED" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel(r)}
            className="text-red-400 border-red-600/30 hover:bg-red-600/10 px-3 text-xs"
          >
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
}

function ServicePanel({
  service,
  tables,
  onCancel,
}: {
  service: ServicePlanning;
  tables: PlanningTable[];
  onCancel: (r: PlanningReservation) => void;
}) {
  const walkInTables = tables.filter((t) => t.walkIn);
  const { reservations, summary } = service;
  const nameById = new Map(reservations.map((r) => [r.id, r.name]));
  const unplacedNames = summary.unplaced.map((id) => nameById.get(id) ?? id);

  return (
    <div className="space-y-4">
      <FillIndicator service={service} />

      {unplacedNames.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {unplacedNames.length} réservation
            {unplacedNames.length > 1 ? "s" : ""} sans table : le service est
            sur-réservé ({unplacedNames.join(", ")}). Aucune n&apos;est annulée.
          </span>
        </div>
      )}

      <Tabs defaultValue="liste">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-2 mt-4">
          {reservations.length === 0 ? (
            <p className="text-xs text-muted-foreground/50 py-3 text-center italic">
              Aucune réservation
            </p>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {reservations.map((r) => (
                <ReservationRow
                  key={r.id}
                  r={r}
                  tables={tables}
                  onCancel={onCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <FloorPlan tables={tables} reservations={reservations} />
        </TabsContent>
      </Tabs>

      {walkInTables.length > 0 && (
        <div className="space-y-1.5" data-testid="walk-in-tables">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tables walk-in
          </h4>
          <div className="flex flex-wrap gap-2">
            {walkInTables.map((t) => {
              const occupant = reservations.find((r) =>
                r.assignedTableIds?.includes(t.id),
              );
              return (
                <span
                  key={t.id}
                  className={`text-xs px-2 py-1 rounded border border-dashed ${occupant ? "border-primary/40 bg-primary/10 text-primary" : "border-muted-foreground/30 text-muted-foreground"}`}
                >
                  {t.name} · {t.capacity} pl. ·{" "}
                  {occupant ? `occupée (${occupant.name})` : "libre"}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Planning d'un jour : un onglet par service (midi / soir), avec remplissage, liste des
 * réservations (source, tables attribuées), plan de salle et tables walk-in à part.
 */
export function DayPlanning({
  date,
  onChanged,
}: {
  date: string;
  /** Appelé après une modification (annulation) pour rafraîchir le reste de la page. */
  onChanged: () => void;
}) {
  const [data, setData] = useState<DayPlanningData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ServiceKey>(() => defaultService(date));

  useEffect(() => {
    setTab(defaultService(date));
  }, [date]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/planning?date=${date}`);
      if (!res.ok) throw new Error("Impossible de charger le planning");
      setData((await res.json()) as DayPlanningData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (r: PlanningReservation) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?"))
      return;
    const res = await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, status: "CANCELLED" }),
    });
    if (!res.ok) {
      window.alert("Impossible d'annuler la réservation.");
      return;
    }
    onChanged();
    load();
  };

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 size={18} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as ServiceKey)}
      className={loading ? "opacity-70 transition-opacity" : undefined}
    >
      <TabsList>
        {data.services.map((s) => (
          <TabsTrigger key={s.key} value={s.key}>
            {SERVICE_LABELS[s.key]}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {s.reservations.filter((r) => r.counting).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {data.services.map((s) => (
        <TabsContent key={s.key} value={s.key} className="mt-4">
          <ServicePanel service={s} tables={data.tables} onCancel={cancel} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
