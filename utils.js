// utils.js

/**
 * Shared Bookmarks – Utility Helpers
 *
 * Pure, battle-tested helper functions used throughout the app.
 * Written with TDD in mind – every function is deterministic,
 * fully tested in Jest, and handles edge cases gracefully.
 *
 * These utilities demonstrate the same analytical precision
 * I bring from my accounting background into modern web development.
 */

const TIME_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
};

/**
 * Formats an ISO timestamp into a beautiful, readable string.
 * Falls back gracefully for invalid dates.
 *
 * @param {string} isoString - ISO 8601 timestamp
 * @returns {string} Human-friendly date (e.g., "March 9, 2026, 8:45 PM SAST")
 */
export function formatTimestamp(isoString) {
  if (!isoString) return "—";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-ZA", TIME_OPTIONS); // South Africa locale for consistency
}

/**
 * Validates a URL string with strict protocol enforcement.
 * Prevents malformed, relative, or dangerous URLs.
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if it's a valid http/https URL
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim();
  // Fast fail for obvious non-http strings
  if (!/^https?:\/\//i.test(trimmed)) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes bookmark titles (removes excessive whitespace, limits length).
 * Useful for clean display and storage.
 *
 * @param {string} title - Raw title input
 * @returns {string} Cleaned title (max 120 chars)
 */
export function sanitizeTitle(title) {
  if (!title) return "";
  return title.trim().replace(/\s+/g, " ").slice(0, 120);
}

/**
 * Generates a short, readable excerpt from a description without breaking words.
 *
 * @param {string} desc - Full description
 * @param {number} maxLength - Max characters (default 120)
 * @returns {string} Truncated excerpt with ellipsis
 */
export function getExcerpt(desc, maxLength = 120) {
  if (!desc) return "";
  const clean = desc.trim().replace(/\s+/g, " ");
  
  if (clean.length <= maxLength) return clean;

  // Step back to the last space to avoid breaking a word in half
  const trimmed = clean.slice(0, maxLength);
  const lastSpaceIndex = trimmed.lastIndexOf(" ");

  // If there's no space (one giant string), hard slice. Otherwise, cut at the word.
  const finalCut = lastSpaceIndex > 0 ? trimmed.slice(0, lastSpaceIndex) : trimmed;
  
  return `${finalCut}…`;
}
