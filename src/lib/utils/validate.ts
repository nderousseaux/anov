/**
 * Utility functions for validation
 */

/**
 * Validate email address format
 * @param email - Email string to validate
 * @returns True if email is valid format
 */
export function validateEmail(email: string): boolean {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (French format)
 * @param phone - Phone number string to validate
 * @returns True if phone is valid format
 */
export function validatePhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleanedPhone = phone.replace(/\s/g, '').replace(/-/g, '');
  // French phone regex: starts with 0, then 9 digits
  const phoneRegex = /^0[1-9]\d{8}$/;
  return phoneRegex.test(cleanedPhone);
}

/**
 * Validate that a string is not empty or just whitespace
 * @param value - String to validate
 * @returns True if string is non-empty
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate that a number is positive
 * @param value - Number to validate
 * @returns True if number is positive
 */
export function isPositiveNumber(value: number): boolean {
  return value > 0;
}

/**
 * Validate that a number is within a range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
