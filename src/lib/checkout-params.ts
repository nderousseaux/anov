/**
 * Utilities to encode/decode form data in URL query params for Stripe checkout flow
 * This allows form data to be preserved when users return from Stripe payment
 */

// Types pour les données de réservation
export interface ReservationFormData {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  specialRequest?: string;
}

// Types pour les données de chèque cadeau
export interface GiftCardFormData {
  amount?: string;
  recipient?: string;
  message?: string;
}

/**
 * Encode form data into URL query string
 * Uses base64 encoding for security (avoids issues with special chars)
 */
export function encodeFormData<T extends Record<string, unknown>>(data: T): string {
  const json = JSON.stringify(data);
  return btoa(json);
}

/**
 * Decode URL query param back to form data
 */
export function decodeFormData<T>(encoded: string | null): T | null {
  if (!encoded) return null;
  try {
    const json = atob(encoded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Get param name for data type
 */
function getParamName(paramType: 'reservation' | 'giftCard' | 'productOrder'): string {
  const paramNameMap: Record<string, string> = {
    reservation: 'r',
    giftCard: 'g',
    productOrder: 'p',
  };
  return paramNameMap[paramType] || 'r';
}

/**
 * Create URL with encoded form data as query params
 * @param baseUrl - Base URL (e.g., /reservation/succes)
 * @param formData - Form data to encode
 * @param paramType - Type of data: 'reservation', 'giftCard', or 'productOrder'
 */
export function buildUrlWithEncodedData(
  baseUrl: string,
  formData: Record<string, unknown>,
  paramType: 'reservation' | 'giftCard' | 'productOrder' = 'reservation',
): string {
  const encodedData = encodeFormData(formData);
  const paramName = getParamName(paramType);

  // Only use on client side
  if (typeof window === 'undefined') {
    return baseUrl;
  }

  const url = new URL(window.location.origin + baseUrl);
  url.searchParams.set(paramName, encodedData);

  return url.pathname + url.search;
}

/**
 * Parse query params from current URL and extract encoded form data
 * @param paramType - Type of data: 'reservation', 'giftCard', or 'productOrder'
 */
export function getEncodedFormDataFromUrl(paramType: 'reservation' | 'giftCard' | 'productOrder' = 'reservation'): string | null {
  const paramName = getParamName(paramType);

  // Only use on client side
  if (typeof window === 'undefined') {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(paramName);
}

/**
 * Extract reservation form data from URL query params
 */
export function getReservationFormDataFromUrl(): ReservationFormData | null {
  const encoded = getEncodedFormDataFromUrl('reservation');
  return encoded ? decodeFormData<ReservationFormData>(encoded) : null;
}

/**
 * Extract gift card form data from URL query params
 */
export function getGiftCardFormDataFromUrl(): GiftCardFormData | null {
  const encoded = getEncodedFormDataFromUrl('giftCard');
  return encoded ? decodeFormData<GiftCardFormData>(encoded) : null;
}

/**
 * Extract product order form data from URL query params
 */
export function getProductOrderFormDataFromUrl(): ReservationFormData | null {
  const encoded = getEncodedFormDataFromUrl('productOrder');
  return encoded ? decodeFormData<ReservationFormData>(encoded) : null;
}

/**
 * Clear form data params from current URL
 * @param paramType - Type of data to clear
 */
export function clearEncodedFormData(paramType: 'reservation' | 'giftCard' | 'productOrder' = 'reservation'): void {
  const paramName = getParamName(paramType);

  // Only use on client side
  if (typeof window === 'undefined') {
    return;
  }

  // Use history.replaceState to remove the param without reloading
  const url = new URL(window.location.href);
  url.searchParams.delete(paramName);
  window.history.replaceState({}, document.title, url.pathname + url.search);
}