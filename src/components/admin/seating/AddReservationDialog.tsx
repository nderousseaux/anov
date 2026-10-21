"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { groupSlotsByService, serviceOfSlot } from "@/lib/seating";
import { SERVICE_LABELS, type PlanningTable, type ServiceKey } from "./types";

/** Client de passage sur une table précise (« + Passage » sur une table walk-in libre). */
export interface WalkInPreset {
  table: PlanningTable;
}

const pad = (n: number) => String(n).padStart(2, "0");

function defaultTime(service: ServiceKey, slots: string[]): string {
  return (
    groupSlotsByService(slots)[service][0] ??
    (service === "lunch" ? "12:00" : "19:00")
  );
}

/** Heure d'un client de passage : maintenant si c'est dans le service affiché, sinon son début. */
function walkInTime(service: ServiceKey, slots: string[]): string {
  const now = new Date();
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return serviceOfSlot(hhmm) === service ? hhmm : defaultTime(service, slots);
}

interface Conflict {
  message: string;
  canForce: boolean;
}

/**
 * Réservation saisie par le restaurateur : client au téléphone, ou client de passage sur
 * une table walk-in (`preset`). Même validation que le web ; si c'est complet, on propose
 * « Forcer quand même » (la réservation apparaîtra alors sans table).
 */
export function AddReservationDialog({
  open,
  onOpenChange,
  date,
  service: initialService,
  slots,
  preset,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  service: ServiceKey;
  slots: string[];
  preset?: WalkInPreset | null;
  onCreated: () => void;
}) {
  const walkIn = !!preset;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("2");
  const [service, setService] = useState<ServiceKey>(initialService);
  const [time, setTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formulaire remis à zéro à chaque ouverture
  useEffect(() => {
    if (!open) return;
    setName("");
    setPhone("");
    setEmail("");
    setSpecialRequest("");
    setConflict(null);
    setError(null);
    setService(initialService);
    setGuests(String(preset ? Math.min(2, preset.table.capacity) : 2));
    setTime(
      preset
        ? walkInTime(initialService, slots)
        : defaultTime(initialService, slots),
    );
    // `slots` change à chaque rendu de la page : on ne réinitialise qu'à l'ouverture
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialService, preset]);

  const submit = async (force: boolean) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: walkIn ? "WALK_IN" : "PHONE",
          name,
          phone,
          email,
          date,
          time,
          guests: Number(guests),
          specialRequest,
          tableId: preset?.table.id,
          force,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 409 && data?.canForce) {
        setConflict({ message: data.error, canForce: true });
        return;
      }
      if (!res.ok) {
        setError(data?.error ?? "Une erreur est survenue");
        return;
      }
      if (data.forced) {
        toast.warning(
          "Réservation ajoutée sans table : le service est sur-réservé",
        );
      } else {
        toast.success(
          walkIn ? "Client de passage ajouté" : "Réservation ajoutée",
        );
      }
      onOpenChange(false);
      onCreated();
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Toute modification après un refus repart d'une validation normale
    submit(false);
  };

  const changed = () => conflict && setConflict(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {walkIn
              ? `Client de passage · table ${preset!.table.name}`
              : "Nouvelle réservation"}
          </DialogTitle>
          <DialogDescription>
            {walkIn
              ? `${preset!.table.capacity} places · ${time}`
              : "Client au téléphone : même validation que la réservation en ligne."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <div className="space-y-1">
              <Label htmlFor="res-name">
                Nom{walkIn ? " (facultatif)" : ""}
              </Label>
              <Input
                id="res-name"
                required={!walkIn}
                placeholder={walkIn ? "Passage" : "Nom du client"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  changed();
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="res-guests">Couverts</Label>
              <Input
                id="res-guests"
                type="number"
                min={1}
                max={20}
                required
                value={guests}
                onChange={(e) => {
                  setGuests(e.target.value);
                  changed();
                }}
              />
            </div>
          </div>

          {!walkIn && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Service</Label>
                  <div className="flex gap-2">
                    {(["lunch", "dinner"] as const).map((key) => (
                      <Button
                        key={key}
                        type="button"
                        size="sm"
                        variant={service === key ? "default" : "outline"}
                        aria-pressed={service === key}
                        onClick={() => {
                          setService(key);
                          setTime(defaultTime(key, slots));
                          changed();
                        }}
                      >
                        {SERVICE_LABELS[key]}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="res-time">Heure d&apos;arrivée</Label>
                  <Input
                    id="res-time"
                    type="time"
                    step={900}
                    required
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      // l'heure détermine le service : on garde les deux alignés
                      if (e.target.value)
                        setService(serviceOfSlot(e.target.value));
                      changed();
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="res-phone">Téléphone</Label>
                  <Input
                    id="res-phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="res-email">Email (facultatif)</Label>
                  <Input
                    id="res-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="res-request">Demande spéciale</Label>
                <Textarea
                  id="res-request"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </>
          )}

          {conflict && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 space-y-2"
            >
              <p>
                {conflict.message}. Vous pouvez l&apos;ajouter quand même : elle
                apparaîtra « sans table » et le service sera sur-réservé.
              </p>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={submitting}
                onClick={() => submit(true)}
              >
                Forcer quand même
              </Button>
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              )}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
