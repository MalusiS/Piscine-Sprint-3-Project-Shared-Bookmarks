/**
 * Format an ISO timestamp to a readable local string.
 * @param {string} isoString - ISO timestamp string
 * @returns {string} - Formatted local date string
 */
export function formatTimestamp(isoString) {
  if (!isoString || isNaN(new Date(isoString).getTime())) {
    return "Invalid date";
  }
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/**
 * Validate a URL string.
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidUrl(url) {
  try {
    // Must start with http:// or https:// explicitly
    if (!/^https?:\/\//i.test(url)) return false;

    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
