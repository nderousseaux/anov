/**
 * Utility functions for date and time formatting
 */

/**
 * Format a number as currency (euros)
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'fr-FR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date to a readable string
 * @param date - Date object or ISO string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', options).format(dateObj);
}

/**
 * Format a date to a short string (e.g., "15 juin 2024")
 * @param date - Date object or ISO string
 * @returns Short formatted date string
 */
export function formatDateShort(date: Date | string): string {
  return formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Format a time string
 * @param time - Time string (HH:mm format)
 * @param options - Formatting options
 * @returns Formatted time string
 */
export function formatTime(
  time: string,
  options: { hour: '2-digit'; minute: '2-digit' } = { hour: '2-digit', minute: '2-digit' }
): string {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch {
    return time;
  }
}

/**
 * Check if a date is today
 * @param date - Date object or ISO string
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  // Use UTC methods to avoid timezone issues when comparing dates
  return (
    dateObj.getUTCDate() === today.getUTCDate() &&
    dateObj.getUTCMonth() === today.getUTCMonth() &&
    dateObj.getUTCFullYear() === today.getUTCFullYear()
  );
}

/**
 * Get the previous Monday from a given date
 * @param date - Date object or ISO string (default: today)
 * @returns Date object representing the previous Monday
 */
export function getPreviousMonday(date: Date | string = new Date()): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Calculate the day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // We need to get the day in UTC to match the date string
  const dayOfWeek = dateObj.getUTCDay();
  // Get the date of the most recent Monday
  // If today is Monday (1), we want to go back 7 days to get the previous Monday
  // If today is Sunday (0), we go back 6 days to get the previous Monday
  // If today is Wednesday (3), we go back 2 days to get the previous Monday
  const daysToSubtract = dayOfWeek === 0 ? 6 : (dayOfWeek === 1 ? 7 : dayOfWeek - 1);
  const previousMonday = new Date(dateObj);
  previousMonday.setUTCDate(dateObj.getUTCDate() - daysToSubtract);
  previousMonday.setUTCHours(0, 0, 0, 0);
  return previousMonday;
}

/**
 * Format a date to a display format for reservations (e.g., "lundi 15 juin")
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatReservationDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  return `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
}
