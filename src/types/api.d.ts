// API response types
export interface ApiPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

// Gift card API types
export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipientEmail: string | null;
  personalMessage: string | null;
  isPaid: boolean;
  status: 'PENDING_PAYMENT' | 'ACTIVE' | 'USED';
  createdAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  stripeSessionId: string | null;
}

export interface GiftCardCreateRequest {
  amount: string;
  recipientEmail?: string;
  personalMessage?: string;
}

export interface GiftCardActionRequest {
  id: string;
  action: 'validate' | 'markUsed' | 'delete';
}

// Stripe webhook payload types
export interface StripeWebhookSession {
  id: string;
  object: string;
  metadata: {
    type?: string;
    giftCardId?: string;
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    guests?: string;
    specialRequest?: string;
  };
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: StripeWebhookSession;
  };
}

// Reservation API types
export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  guests: number;
  specialRequest: string | null;
  wantsSmsReminder: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  cancelToken: string | null;
}
