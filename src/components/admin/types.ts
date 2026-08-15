export interface GiftCardStats {
  totalIssued: number;
  totalAmount: number;
  active: number;
  expired: number;
  inProgress: number;
}

export type GiftCardStatus =
  "IN_PROGRESS_PAYMENT" | "ACTIVE" | "USED" | "EXPIRED";

export interface GourmetOfferStats {
  totalIssued: number;
  totalAmount: number;
  active: number;
  expired: number;
  inProgress: number;
}

export type GourmetOfferStatus =
  "IN_PROGRESS_PAYMENT" | "ACTIVE" | "USED" | "EXPIRED";
