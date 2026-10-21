"use client";

import { Pin, PinOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  PlanningCombo,
  PlanningReservation,
  PlanningTable,
} from "./types";

/**
 * Panneau de déplacement : choisir la table ou la combinaison où placer la réservation
 * sélectionnée. Elle est alors épinglée (l'algo ne la déplace plus) ; « Désépingler » la
 * rend à l'algo. Les destinations trop petites restent proposées, en ambre : le serveur
 * demandera confirmation.
 */
export function MovePanel({
  reservation,
  tables,
  combos,
  onMove,
  onClose,
}: {
  reservation: PlanningReservation;
  tables: PlanningTable[];
  combos: PlanningCombo[];
  onMove: (tableIds: number[]) => void;
  onClose: () => void;
}) {
  const byId = new Map(tables.map((t) => [t.id, t]));
  const current = reservation.assignedTableIds ?? [];
  const pinned = reservation.pinnedTableIds.length > 0;
  const sameSet = (a: number[], b: number[]) =>
    a.length === b.length && a.every((id) => b.includes(id));

  const target = (
    key: string,
    label: string,
    capacity: number,
    ids: number[],
    walkIn = false,
  ) => {
    const here = pinned && sameSet(ids, reservation.pinnedTableIds);
    const tooSmall = reservation.guests > capacity;
    return (
      <Button
        key={key}
        size="sm"
        variant="outline"
        disabled={here}
        aria-label={`Placer sur ${label}`}
        title={
          here
            ? "Déjà épinglée ici"
            : tooSmall
              ? `Trop petite pour ${reservation.guests} couverts`
              : undefined
        }
        onClick={() => onMove(ids)}
        className={`h-8 px-2 text-xs ${walkIn ? "border-dashed" : ""} ${tooSmall ? "text-amber-400 border-amber-500/40" : ""} ${here ? "bg-primary/20 text-primary" : ""}`}
      >
        {label}
        <span className="ml-1 text-muted-foreground">({capacity})</span>
      </Button>
    );
  };

  return (
    <div
      data-testid="move-panel"
      className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm">
          <span className="font-medium">{reservation.name}</span>
          <span className="text-muted-foreground">
            {" "}
            · {reservation.guests} couvert{reservation.guests > 1 ? "s" : ""}
            {current.length > 0 &&
              ` · actuellement ${current.map((id) => byId.get(id)?.name ?? `#${id}`).join(" + ")}`}
          </span>
          {pinned && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-primary">
              <Pin size={12} /> épinglée
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Fermer le panneau de déplacement"
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Placer sur
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tables.map((t) =>
            target(`t${t.id}`, t.name, t.capacity, [t.id], t.walkIn),
          )}
          {combos.map((c) =>
            target(
              `c${c.id}`,
              c.tableIds
                .map((id) => byId.get(id)?.name ?? `#${id}`)
                .join(" + "),
              c.capacity,
              c.tableIds,
            ),
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!pinned && current.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onMove(current)}
          >
            <Pin size={13} className="mr-1.5" />
            Épingler sur sa table actuelle
          </Button>
        )}
        {pinned && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onMove([])}
          >
            <PinOff size={13} className="mr-1.5" />
            Désépingler (rendre à l&apos;algo)
          </Button>
        )}
      </div>
    </div>
  );
}
