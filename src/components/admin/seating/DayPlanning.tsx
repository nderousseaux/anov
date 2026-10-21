"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Pin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AddReservationDialog,
  type WalkInPreset,
} from "./AddReservationDialog";
import { FloorPlan } from "./FloorPlan";
import { MovePanel } from "./MovePanel";
import {
  SERVICE_LABELS,
  SOURCE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatTime,
  type DayPlanningData,
  type PlanningCombo,
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

function isToday(date: string): boolean {
  const now = new Date();
  return (
    date ===
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  );
}

/** Midi par défaut ; pour aujourd'hui, le soir une fois le service du midi passé. */
function defaultService(date: string): ServiceKey {
  return isToday(date) && new Date().getHours() >= 15 ? "dinner" : "lunch";
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
                {r.pinnedTableIds.length > 0 && (
                  <Pin size={9} className="inline mr-0.5" />
                )}
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
  combos,
  selectedId,
  onSelect,
  onMove,
  onCancel,
  onAddWalkIn,
}: {
  service: ServicePlanning;
  tables: PlanningTable[];
  combos: PlanningCombo[];
  /** Réservation sélectionnée dans le plan (à déplacer). */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Déplacer / épingler (`tableIds`), ou désépingler (liste vide). */
  onMove: (r: PlanningReservation, tableIds: number[]) => void;
  onCancel: (r: PlanningReservation) => void;
  /** Absent : on ne propose pas d'ajouter un client de passage (jour autre qu'aujourd'hui). */
  onAddWalkIn?: (table: PlanningTable) => void;
}) {
  const walkInTables = tables.filter((t) => t.walkIn);
  const { reservations, summary } = service;
  const nameById = new Map(reservations.map((r) => [r.id, r.name]));
  const unplacedNames = summary.unplaced.map((id) => nameById.get(id) ?? id);
  const selected = reservations.find((r) => r.id === selectedId && r.counting);

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
          <FloorPlan
            tables={tables}
            reservations={reservations}
            selectedId={selected?.id ?? null}
            onSelect={onSelect}
            onTableClick={(table) => selected && onMove(selected, [table.id])}
          />
          {summary.unplaced.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-red-300">Sans table :</span>
              {reservations
                .filter((r) => summary.unplaced.includes(r.id))
                .map((r) => (
                  <Button
                    key={r.id}
                    size="sm"
                    variant="outline"
                    aria-pressed={r.id === selected?.id}
                    className={`h-7 px-2 text-xs ${r.id === selected?.id ? "bg-primary/20" : ""}`}
                    onClick={() =>
                      onSelect(r.id === selected?.id ? null : r.id)
                    }
                  >
                    {r.name} ({r.guests})
                  </Button>
                ))}
            </div>
          )}
          {selected ? (
            <MovePanel
              reservation={selected}
              tables={tables}
              combos={combos}
              onMove={(tableIds) => onMove(selected, tableIds)}
              onClose={() => onSelect(null)}
            />
          ) : (
            <p className="mt-2 text-xs text-muted-foreground/60 italic">
              Cliquez sur une réservation du plan pour la déplacer ou
              l&apos;épingler.
            </p>
          )}
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
                  className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded border border-dashed ${occupant ? "border-primary/40 bg-primary/10 text-primary" : "border-muted-foreground/30 text-muted-foreground"}`}
                >
                  <span>
                    {t.name} · {t.capacity} pl. ·{" "}
                    {occupant ? `occupée (${occupant.name})` : "libre"}
                  </span>
                  {!occupant && onAddWalkIn && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      aria-label={`Ajouter un client de passage sur la table ${t.name}`}
                      onClick={() => onAddWalkIn(t)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Passage
                    </Button>
                  )}
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
  slots,
  onChanged,
}: {
  date: string;
  /** Créneaux d'ouverture du jour (proposent l'heure par défaut d'un nouvel ajout). */
  slots: string[];
  /** Appelé après une modification (annulation, ajout) pour rafraîchir le reste de la page. */
  onChanged: () => void;
}) {
  const [data, setData] = useState<DayPlanningData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ServiceKey>(() => defaultService(date));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walkIn, setWalkIn] = useState<WalkInPreset | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    reservation: PlanningReservation;
    tableIds: number[];
    warnings: string[];
  } | null>(null);

  useEffect(() => {
    setTab(defaultService(date));
    setSelectedId(null);
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

  const move = async (
    r: PlanningReservation,
    tableIds: number[],
    force = false,
  ) => {
    try {
      const res = await fetch(`/api/admin/reservations/${r.id}/tables`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableIds, force }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 409 && body?.canForce) {
        setPendingMove({ reservation: r, tableIds, warnings: body.warnings });
        return;
      }
      if (!res.ok) {
        toast.error(body?.error ?? "Impossible de déplacer la réservation");
        return;
      }
      setPendingMove(null);
      setSelectedId(null);
      const names = tableNames(tableIds, data?.tables ?? []);
      const message =
        tableIds.length === 0
          ? `${r.name} rendue à l'algorithme`
          : `${r.name} épinglée sur ${names}`;
      if (body.warnings?.length > 0)
        toast.warning(`${message} (${body.warnings.join(" · ")})`);
      else toast.success(message);
      load();
    } catch {
      toast.error("Erreur réseau, veuillez réessayer");
    }
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
    <>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as ServiceKey)}
        className={loading ? "opacity-70 transition-opacity" : undefined}
      >
        <div className="flex items-center justify-between gap-3">
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
          <Button
            size="sm"
            onClick={() => {
              setWalkIn(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Réservation
          </Button>
        </div>
        {data.services.map((s) => (
          <TabsContent key={s.key} value={s.key} className="mt-4">
            <ServicePanel
              service={s}
              tables={data.tables}
              combos={data.combos}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={(r, tableIds) => move(r, tableIds)}
              onCancel={cancel}
              onAddWalkIn={
                isToday(date)
                  ? (table) => {
                      setWalkIn({ table });
                      setDialogOpen(true);
                    }
                  : undefined
              }
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={pendingMove !== null}
        onOpenChange={(open) => !open && setPendingMove(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Déplacer quand même ?</DialogTitle>
            <DialogDescription>
              {pendingMove &&
                `${pendingMove.reservation.name} · ${tableNames(pendingMove.tableIds, data.tables) || "algorithme"}`}
            </DialogDescription>
          </DialogHeader>
          <div
            role="alert"
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 space-y-1"
          >
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Ce déplacement pose problème
            </p>
            <ul className="list-disc pl-6">
              {pendingMove?.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Aucune réservation n&apos;est annulée.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingMove(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                pendingMove &&
                move(pendingMove.reservation, pendingMove.tableIds, true)
              }
            >
              Déplacer quand même
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={date}
        service={tab}
        slots={slots}
        preset={walkIn}
        onCreated={() => {
          onChanged();
          load();
        }}
      />
    </>
  );
}
