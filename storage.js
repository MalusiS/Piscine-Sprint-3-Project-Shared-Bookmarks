// storage.js

/**
 * Shared Bookmarks – LocalStorage Abstraction Layer
 *
 * Pure, testable functions that simulate multiple users.
 * Everything is stored locally in the browser (no backend).
 * Designed for TDD – every function is pure and side-effect free where possible.
 */

const STORAGE_PREFIX = "shared-bookmarks-user-";

/**
 * Returns a fixed list of demo user IDs (simulates multiple users).
 * @returns {string[]} Array of user ID strings
 */
export function getUserIds() {
  return ["1", "2", "3", "4", "5"];
}

/**
 * Retrieves bookmarks for a specific user safely.
 * Returns an empty array if no data exists, if JSON is corrupted, or if data is not an array.
 *
 * @param {string} userId - The user ID to fetch data for
 * @returns {Array<object>} Array of bookmark objects
 */
export function getData(userId) {
  if (!userId) return [];

  try {
    const key = `${STORAGE_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Ensure the parsed data is strictly an array before returning
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`⚠️ Corrupted data for user ${userId} – resetting`);
    clearData(userId);
    return [];
  }
}

/**
 * Saves bookmarks for a specific user.
 *
 * @param {string} userId - The user ID to store data for
 * @param {Array<object>} data - Array of bookmark objects
 * @returns {boolean} True if save was successful, false if storage quota exceeded
 */
export function setData(userId, data) {
  if (!userId) return false;

  // Fallback to an empty array if invalid data is passed
  const safeData = Array.isArray(data) ? data : [];

  try {
    const key = `${STORAGE_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(safeData));
    return true; // Save successful
  } catch (error) {
    // Catches QuotaExceededError (Storage full or Private Browsing restrictions)
    console.error(`❌ Failed to save data for user ${userId}. Storage may be full.`, error);
    return false; // Save failed
  }
}

/**
 * Clears all bookmarks for a specific user.
 *
 * @param {string} userId - The user ID to clear
 */
export function clearData(userId) {
  if (!userId) return;
  localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
}

/**
 * Resets ALL demo users (useful for "Reset Demo" button in a future version).
 */
export function resetAllData() {
  getUserIds().forEach((userId) => {
    clearData(userId);
  });
  console.info("✅ All demo data has been reset");
}

/**
 * Returns total number of bookmarks across all users (for stats/demo purposes).
 */
export function getTotalBookmarkCount() {
  return getUserIds().reduce((total, userId) => {
    return total + getData(userId).length;
  }, 0);
}
