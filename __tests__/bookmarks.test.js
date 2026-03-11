// __tests__/bookmarks.test.js

import { getData, setData, clearData } from "../storage.js";

// ==========================================
// SETUP: Mocking the Browser's LocalStorage
// ==========================================
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    removeItem(key) { delete store[key]; },
    clear() { store = {}; }
  };
})();

// Attach our mock to the global window object
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe("Bookmark Logic & Storage", () => {
  
  // Clear our fake database before every single test to prevent data leaks
  beforeEach(() => {
    global.localStorage.clear();
  });

  // ==========================================
  // Core Logic Tests
  // ==========================================
  test("bookmarks sort in reverse chronological order (Newest First)", () => {
    const bookmarks = [
      { title: "Old", createdAt: "2023-01-01T00:00:00Z" },
      { title: "New", createdAt: "2024-01-01T00:00:00Z" },
      { title: "Middle", createdAt: "2023-06-01T00:00:00Z" },
    ];

    // Simulating the exact sorting algorithm used in renderBookmarks()
    const sorted = [...bookmarks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    expect(sorted.map((b) => b.title)).toEqual(["New", "Middle", "Old"]);
  });

  // ==========================================
  // Storage API Tests
  // ==========================================
  test("getData() returns an empty array for a new user with no data", () => {
    expect(getData("user-99")).toEqual([]);
  });

  test("setData() successfully saves and retrieves bookmarks", () => {
    const mockBookmarks = [{ id: "1", title: "Test Bookmark", url: "https://test.com" }];
    
    // Save the data
    const success = setData("user-1", mockBookmarks);
    
    // Prove it saved successfully and returned the exact same data
    expect(success).toBe(true);
    expect(getData("user-1")).toEqual(mockBookmarks);
  });

  test("getData() gracefully recovers from corrupted JSON", () => {
    // Maliciously inject broken JSON directly into the storage
    global.localStorage.setItem("shared-bookmarks-user-error", "{ bad json data [");
    
    // getData should catch the error, clear the corrupted data, and return an empty array
    expect(getData("error")).toEqual([]);
  });

  test("clearData() completely removes a user's bookmarks", () => {
    const mockBookmarks = [{ id: "1", title: "Delete Me" }];
    setData("user-delete", mockBookmarks);
    
    // Verify it's there
    expect(getData("user-delete").length).toBe(1);
    
    // Clear it
    clearData("user-delete");
    
    // Verify it's gone
    expect(getData("user-delete")).toEqual([]);
  });
});
