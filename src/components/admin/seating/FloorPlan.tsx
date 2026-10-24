import { Pin } from "lucide-react";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  formatTime,
  type PlanningReservation,
  type PlanningTable,
} from "./types";

const TABLE_SIZE_CLASSES: Record<number, string> = {
  2: "w-20 h-20",
  3: "w-24 h-24",
  4: "w-28 h-28",
};

/**
 * Plan de salle d'un service. Les tables affichées sont celles calculées par l'algo
 * (`assignedTableIds`) ; les tables walk-in sont en pointillés ; une réservation sur
 * plusieurs tables (combinaison) est colorée à part.
 */
export function FloorPlan({
  tables,
  reservations,
  selectedId = null,
  onSelect,
  onTableClick,
}: {
  tables: PlanningTable[];
  reservations: PlanningReservation[];
  /** Réservation sélectionnée (à déplacer). */
  selectedId?: string | null;
  /** Fournir pour rendre les réservations sélectionnables. */
  onSelect?: (id: string | null) => void;
  /** Appelé au clic sur une table quand une réservation est sélectionnée. */
  onTableClick?: (table: PlanningTable) => void;
}) {
  const placing = selectedId !== null && !!onTableClick;
  const byTable = new Map<number, PlanningReservation[]>();
  for (const r of reservations) {
    for (const id of r.assignedTableIds ?? []) {
      byTable.set(id, [...(byTable.get(id) ?? []), r]);
    }
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-background/20 border border-primary/10 rounded-xl">
      {tables.map((table) => {
        const list = byTable.get(table.id) ?? [];
        const occupied = list.length > 0;
        const fused = list.some((r) => (r.assignedTableIds?.length ?? 0) > 1);
        const color = fused
          ? "bg-violet-500/15 border-violet-400/50"
          : occupied
            ? "bg-primary/10 border-primary/40"
            : "bg-background/40 border-primary/15";
        return (
          <div
            key={table.id}
            data-testid={`table-${table.name}`}
            data-state={fused ? "fused" : occupied ? "reserved" : "free"}
            style={{ left: `${table.posX}%`, top: `${table.posY}%` }}
            onClick={placing ? () => onTableClick!(table) : undefined}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${TABLE_SIZE_CLASSES[table.capacity] ?? "w-28 h-24"} rounded-lg border p-1.5 flex flex-col gap-0.5 overflow-hidden ${color} ${table.walkIn ? "border-dashed" : ""} ${placing ? "cursor-pointer hover:ring-2 hover:ring-primary/60" : ""}`}
          >
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-primary">
                {table.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {table.capacity}p
              </span>
            </div>
            {table.walkIn && (
              <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                walk-in
              </span>
            )}
            {occupied ? (
              <div className="space-y-0.5 overflow-y-auto text-[10px] leading-tight">
                {list.map((r) => {
                  const selected = r.id === selectedId;
                  const content = (
                    <>
                      <span className="font-medium text-primary/90">
                        {formatTime(r.date)}
                      </span>{" "}
                      {r.pinnedTableIds.length > 0 && (
                        <Pin size={9} className="inline text-primary" />
                      )}{" "}
                      {r.name}
                      <span
                        className={`ml-1 px-1 rounded border text-[9px] ${STATUS_COLORS[r.status]}`}
                      >
                        {STATUS_LABELS[r.status]}
                      </span>
                    </>
                  );
                  const title = `${r.name} · ${r.guests} cvrt${r.guests > 1 ? "s" : ""}`;
                  return onSelect ? (
                    <button
                      type="button"
                      key={r.id}
                      title={title}
                      aria-pressed={selected}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(selected ? null : r.id);
                      }}
                      className={`block w-full truncate text-left text-[10px] leading-tight rounded px-0.5 ${selected ? "bg-primary/30 ring-1 ring-primary" : "hover:bg-primary/10"}`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div key={r.id} className="truncate" title={title}>
                      {content}
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground/40 italic">
                Libre
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
