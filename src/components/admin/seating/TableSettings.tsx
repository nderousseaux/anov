"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TableRow {
  id: number;
  name: string;
  capacity: number;
  posX: number;
  posY: number;
  walkIn: boolean;
}

interface ComboRow {
  id: number;
  tableIds: number[];
  capacityOverride: number | null;
  capacity: number;
}

interface InfeasibleService {
  dateStr: string;
  service: "lunch" | "dinner";
  unplaced: { id: string; name: string; guests: number }[];
}

async function call<T = unknown>(
  url: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Une erreur est survenue");
  return data as T;
}

const fail = (err: unknown) =>
  toast.error(err instanceof Error ? err.message : "Une erreur est survenue");

const selectClass =
  "h-9 rounded-md border border-input bg-input-background px-2 text-sm text-foreground";

function formatService(s: InfeasibleService): string {
  const day = new Date(`${s.dateStr}T00:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return `${day} · ${s.service === "lunch" ? "midi" : "soir"}`;
}

function TableEditor({
  table,
  onSave,
  onDelete,
}: {
  table: TableRow;
  onSave: (patch: Partial<TableRow>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [name, setName] = useState(table.name);
  const [capacity, setCapacity] = useState(String(table.capacity));
  const [posX, setPosX] = useState(String(table.posX));
  const [posY, setPosY] = useState(String(table.posY));
  const [walkIn, setWalkIn] = useState(table.walkIn);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirty =
    name !== table.name ||
    Number(capacity) !== table.capacity ||
    Number(posX) !== table.posX ||
    Number(posY) !== table.posY ||
    walkIn !== table.walkIn;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-[1.2fr_5rem_5rem_5rem_auto_auto] gap-3 items-end border-b border-primary/10 pb-4 last:border-0 last:pb-0">
      <div className="space-y-1 col-span-2 md:col-span-1">
        <Label className="text-xs text-muted-foreground">Nom</Label>
        <Input
          aria-label={`Nom de la table ${table.name}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Places</Label>
        <Input
          type="number"
          min={1}
          max={20}
          aria-label={`Places de la table ${table.name}`}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">X (%)</Label>
        <Input
          type="number"
          min={0}
          max={100}
          aria-label={`Position X de la table ${table.name}`}
          value={posX}
          onChange={(e) => setPosX(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Y (%)</Label>
        <Input
          type="number"
          min={0}
          max={100}
          aria-label={`Position Y de la table ${table.name}`}
          value={posY}
          onChange={(e) => setPosY(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 h-9 text-sm text-foreground">
        <Switch
          checked={walkIn}
          onCheckedChange={setWalkIn}
          aria-label={`Table ${table.name} réservée au walk-in`}
        />
        Walk-in
      </label>
      <div className="flex gap-2 justify-end col-span-2 md:col-span-1">
        <Button
          size="sm"
          disabled={!dirty || busy}
          onClick={() =>
            run(() =>
              onSave({
                name,
                capacity: Number(capacity),
                posX: Number(posX),
                posY: Number(posY),
                walkIn,
              }),
            )
          }
        >
          <Save className="w-4 h-4 mr-1.5" />
          Enregistrer
        </Button>
        {confirmDelete ? (
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={() => run(onDelete)}
          >
            Confirmer ?
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            aria-label={`Supprimer la table ${table.name}`}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ComboEditor({
  combo,
  label,
  sum,
  onSave,
  onDelete,
}: {
  combo: ComboRow;
  label: string;
  sum: number;
  onSave: (capacityOverride: number | null) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [capacity, setCapacity] = useState(
    combo.capacityOverride === null ? "" : String(combo.capacityOverride),
  );
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const next = capacity.trim() === "" ? null : Number(capacity);
  const dirty = next !== combo.capacityOverride;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-primary/10 pb-4 last:border-0 last:pb-0">
      <div className="min-w-32 flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">Tables collées</Label>
        <p className="h-9 flex items-center text-sm font-medium text-foreground">
          {label}
        </p>
      </div>
      <div className="space-y-1 w-40">
        <Label className="text-xs text-muted-foreground">Capacité</Label>
        <Input
          type="number"
          min={1}
          max={40}
          placeholder={`${sum} (somme)`}
          aria-label={`Capacité de la combinaison ${label}`}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!dirty || busy}
          onClick={() => run(() => onSave(next))}
        >
          <Save className="w-4 h-4 mr-1.5" />
          Enregistrer
        </Button>
        {confirmDelete ? (
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={() => run(onDelete)}
          >
            Confirmer ?
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            aria-label={`Supprimer la combinaison ${label}`}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function TableSettings() {
  const [tables, setTables] = useState<TableRow[] | null>(null);
  const [combos, setCombos] = useState<ComboRow[]>([]);
  const [infeasible, setInfeasible] = useState<InfeasibleService[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Nouvelle table
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("2");
  const [newWalkIn, setNewWalkIn] = useState(false);
  // Nouvelle combinaison
  const [comboA, setComboA] = useState("");
  const [comboB, setComboB] = useState("");
  const [comboCapacity, setComboCapacity] = useState("");

  const reload = useCallback(async () => {
    try {
      const [t, c, i] = await Promise.all([
        call<TableRow[]>("/api/admin/tables", "GET"),
        call<ComboRow[]>("/api/admin/table-combos", "GET"),
        call<{ infeasibleServices: InfeasibleService[] }>(
          "/api/admin/seating/infeasible",
          "GET",
        ),
      ]);
      setTables(t);
      setCombos(c);
      setInfeasible(i.infeasibleServices);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erreur de chargement");
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Exécute une mutation, recharge l'état (dont l'alerte de faisabilité) et confirme. */
  const mutate = async (fn: () => Promise<unknown>, success: string) => {
    try {
      await fn();
      await reload();
      toast.success(success);
    } catch (err) {
      fail(err);
    }
  };

  if (loadError) {
    return <p className="text-destructive text-sm">{loadError}</p>;
  }
  if (!tables) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement…
      </div>
    );
  }

  const byId = new Map(tables.map((t) => [t.id, t]));
  const comboLabel = (c: ComboRow) =>
    c.tableIds.map((id) => byId.get(id)?.name ?? `#${id}`).join(" + ");
  const comboSum = (c: ComboRow) =>
    c.tableIds.reduce((sum, id) => sum + (byId.get(id)?.capacity ?? 0), 0);

  const canAddCombo = comboA !== "" && comboB !== "" && comboA !== comboB;

  return (
    <div className="space-y-8">
      {infeasible.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm space-y-2"
        >
          <p className="flex items-center gap-2 font-medium text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            Des réservations à venir ne tiennent pas sur les tables ouvertes à
            la réservation en ligne
          </p>
          <ul className="list-disc pl-6 text-foreground/90">
            {infeasible.map((s) => (
              <li key={`${s.dateStr}-${s.service}`}>
                {formatService(s)} :{" "}
                {s.unplaced.map((r) => `${r.name} (${r.guests})`).join(", ")}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground">
            Aucune réservation n&apos;a été annulée. Ces services
            n&apos;accepteront plus de nouvelle réservation tant que la
            situation n&apos;est pas réglée.
          </p>
        </div>
      )}

      <section className="bg-card border border-primary/20 rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tables</h2>
          <p className="text-sm text-muted-foreground">
            Une table « walk-in » est réservée aux clients de passage : elle
            n&apos;est jamais proposée à la réservation en ligne, mais reste
            utilisable côté restaurant. X et Y positionnent la table sur le plan
            de salle (en %).
          </p>
        </div>

        {tables.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune table.</p>
        )}
        {tables.map((table) => (
          <TableEditor
            key={`${table.id}-${table.name}-${table.capacity}-${table.posX}-${table.posY}-${table.walkIn}`}
            table={table}
            onSave={(patch) =>
              mutate(
                () => call(`/api/admin/tables/${table.id}`, "PATCH", patch),
                `Table ${patch.name ?? table.name} enregistrée`,
              )
            }
            onDelete={() =>
              mutate(
                () => call(`/api/admin/tables/${table.id}`, "DELETE"),
                `Table ${table.name} supprimée`,
              )
            }
          />
        ))}

        <form
          className="flex flex-wrap items-end gap-3 pt-2 border-t border-primary/20"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(
              () =>
                call("/api/admin/tables", "POST", {
                  name: newName,
                  capacity: Number(newCapacity),
                  walkIn: newWalkIn,
                }),
              `Table ${newName} ajoutée`,
            ).then(() => setNewName(""));
          }}
        >
          <div className="space-y-1">
            <Label
              htmlFor="new-table-name"
              className="text-xs text-muted-foreground"
            >
              Nouvelle table
            </Label>
            <Input
              id="new-table-name"
              required
              placeholder="Nom (ex. T7)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-1 w-24">
            <Label
              htmlFor="new-table-capacity"
              className="text-xs text-muted-foreground"
            >
              Places
            </Label>
            <Input
              id="new-table-capacity"
              type="number"
              min={1}
              max={20}
              required
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 h-9 text-sm text-foreground">
            <Switch checked={newWalkIn} onCheckedChange={setNewWalkIn} />
            Walk-in
          </label>
          <Button type="submit" size="sm" disabled={!newName.trim()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter
          </Button>
        </form>
      </section>

      <section className="bg-card border border-primary/20 rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Combinaisons de tables
          </h2>
          <p className="text-sm text-muted-foreground">
            Deux tables qui peuvent être collées pour un grand groupe. La
            capacité est par défaut la somme des deux tables ; renseignez-la
            pour la modifier. Sans combinaison, les groupes de plus de{" "}
            {Math.max(
              0,
              ...tables.filter((t) => !t.walkIn).map((t) => t.capacity),
            )}{" "}
            personnes ne peuvent pas réserver en ligne.
          </p>
        </div>

        {combos.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune combinaison.</p>
        )}
        {combos.map((combo) => (
          <ComboEditor
            key={`${combo.id}-${combo.capacityOverride}-${combo.capacity}`}
            combo={combo}
            label={comboLabel(combo)}
            sum={comboSum(combo)}
            onSave={(capacityOverride) =>
              mutate(
                () =>
                  call(`/api/admin/table-combos/${combo.id}`, "PATCH", {
                    capacityOverride,
                  }),
                `Combinaison ${comboLabel(combo)} enregistrée`,
              )
            }
            onDelete={() =>
              mutate(
                () => call(`/api/admin/table-combos/${combo.id}`, "DELETE"),
                `Combinaison ${comboLabel(combo)} supprimée`,
              )
            }
          />
        ))}

        <form
          className="flex flex-wrap items-end gap-3 pt-2 border-t border-primary/20"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(
              () =>
                call("/api/admin/table-combos", "POST", {
                  tableIds: [Number(comboA), Number(comboB)],
                  capacityOverride:
                    comboCapacity.trim() === "" ? null : Number(comboCapacity),
                }),
              "Combinaison ajoutée",
            ).then(() => {
              setComboA("");
              setComboB("");
              setComboCapacity("");
            });
          }}
        >
          {[
            ["Première table", comboA, setComboA],
            ["Seconde table", comboB, setComboB],
          ].map(([label, value, setValue]) => (
            <div key={label as string} className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {label as string}
              </Label>
              <select
                className={selectClass}
                aria-label={label as string}
                value={value as string}
                onChange={(e) =>
                  (setValue as (v: string) => void)(e.target.value)
                }
              >
                <option value="">Choisir…</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.capacity} pl.)
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="space-y-1 w-36">
            <Label
              htmlFor="new-combo-capacity"
              className="text-xs text-muted-foreground"
            >
              Capacité
            </Label>
            <Input
              id="new-combo-capacity"
              type="number"
              min={1}
              max={40}
              placeholder={
                canAddCombo
                  ? `${(byId.get(Number(comboA))?.capacity ?? 0) + (byId.get(Number(comboB))?.capacity ?? 0)} (somme)`
                  : "somme"
              }
              value={comboCapacity}
              onChange={(e) => setComboCapacity(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={!canAddCombo}>
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter
          </Button>
        </form>
      </section>
    </div>
  );
}
