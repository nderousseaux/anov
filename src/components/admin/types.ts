export interface GiftCardStats {
  totalIssued: number;
  totalAmount: number;
  active: number;
  expired: number;
}

export type GiftCardStatus = 'PENDING_PAYMENT' | 'ACTIVE' | 'USED' | 'EXPIRED';
