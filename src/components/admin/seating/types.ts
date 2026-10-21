export type ReservationStatus =
  "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export type ReservationSource = "WEB" | "PHONE" | "WALK_IN";

export type ServiceKey = "lunch" | "dinner";

export interface PlanningTable {
  id: number;
  name: string;
  capacity: number;
  posX: number;
  posY: number;
  walkIn: boolean;
}

export interface PlanningReservation {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  date: string;
  guests: number;
  status: ReservationStatus;
  source: ReservationSource;
  specialRequest: string | null;
  depositPaidCents: number | null;
  transactionExpireAt: string | null;
  createdAt: string;
  pinnedTableIds: number[];
  /** La réservation occupe une place dans le service (faux : annulée, etc.). */
  counting: boolean;
  /** Tables calculées par l'algo ; null si elle ne compte pas, ou si elle n'a pas pu être placée. */
  assignedTableIds: number[] | null;
}

export interface ServiceSummary {
  assignments: Record<string, number[]>;
  unplaced: string[];
  covers: number;
  capacity: number;
  tablesTotal: number;
  tablesFree: number;
  walkInOccupied: number[];
}

export interface ServicePlanning {
  key: ServiceKey;
  reservations: PlanningReservation[];
  summary: ServiceSummary;
}

export interface PlanningCombo {
  id: number;
  tableIds: number[];
  capacity: number;
}

export interface DayPlanningData {
  combos: PlanningCombo[];
  tables: PlanningTable[];
  services: ServicePlanning[];
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
};

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  CONFIRMED: "bg-green-600/20 text-green-400 border-green-600/30",
  CANCELLED: "bg-red-600/20 text-red-400 border-red-600/30",
  COMPLETED: "bg-blue-600/20 text-blue-400 border-blue-600/30",
};

export const SOURCE_LABELS: Record<ReservationSource, string> = {
  WEB: "Web",
  PHONE: "Téléphone",
  WALK_IN: "Passage",
};

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  lunch: "Midi",
  dinner: "Soir",
};

/** Heure "HH:mm" d'une date ISO (stockée en UTC « local »). */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
