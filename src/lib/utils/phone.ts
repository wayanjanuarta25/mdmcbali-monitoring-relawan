/**
 * Indonesian Phone Number Normalization & Validation Utility
 * Standardizes phone numbers to national/international numeric format (628xxxxxxxx)
 * for duplicate detection and consistent database storage.
 */

// Regex for Indonesian mobile phone number: starts with 628, followed by 8-12 digits (total 10-14 digits)
export const ID_NORMALIZED_PHONE_REGEX = /^628[1-9][0-9]{7,11}$/;

/**
 * Normalizes an Indonesian phone number to standard 628xxxxxxxx format.
 * Strips whitespace, hyphens, dots, parentheses, and leading plus.
 * Handles prefix variants: '08...', '+628...', '628...', '8...'
 */
export function normalizePhoneNumber(rawPhone: string | number | null | undefined): string {
  if (rawPhone === null || rawPhone === undefined) return "";

  // Convert to string and remove all non-digit characters
  let digits = String(rawPhone).replace(/\D/g, "");

  if (!digits) return "";

  // Standardize prefix
  if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  } else if (digits.startsWith("8")) {
    digits = "628" + digits.slice(1);
  } else if (digits.startsWith("6208")) {
    digits = "628" + digits.slice(4);
  }

  return digits;
}

/**
 * Checks whether a phone number (either raw or already normalized) is valid Indonesian mobile number.
 */
export function isValidIndonesianPhone(rawPhone: string | number | null | undefined): boolean {
  const normalized = normalizePhoneNumber(rawPhone);
  return ID_NORMALIZED_PHONE_REGEX.test(normalized);
}

/**
 * Formats a normalized phone number (628xxxxxxxx) into readable Indonesian phone format (08xx-xxxx-xxxx).
 */
export function formatDisplayPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return String(phone);

  // Convert 628... back to 08...
  let local = normalized;
  if (local.startsWith("62")) {
    local = "0" + local.slice(2);
  }

  if (local.length >= 10 && local.length <= 13) {
    // Format as 0812-3456-7890
    return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
  }

  return local;
}
