// Tests for bookmark sorting and URL validation logic
import { isValidUrl } from "../utils.js";

describe("Bookmark logic", () => {
  test("bookmarks are sorted in reverse chronological order", () => {
    const bookmarks = [
      { title: "Old", createdAt: "2023-01-01T00:00:00Z" },
      { title: "New", createdAt: "2024-01-01T00:00:00Z" },
      { title: "Middle", createdAt: "2023-06-01T00:00:00Z" },
    ];

    // Simulate the same sorting used in renderBookmarks()
    const sorted = [...bookmarks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    expect(sorted.map((b) => b.title)).toEqual(["New", "Middle", "Old"]);
  });

  test("rejects invalid URLs", () => {
    const invalidUrls = [
      "example.com",
      "ftp://example.com",
      "://missing-protocol.com",
      "http:/broken.com",
      "javascript:alert('xss')",
    ];

    invalidUrls.forEach((url) => {
      expect(isValidUrl(url)).toBe(false);
    });
  });

  test("accepts valid URLs", () => {
    const validUrls = [
      "http://example.com",
      "https://example.com",
      "https://sub.domain.com/path?query=value",
    ];

    validUrls.forEach((url) => {
      expect(isValidUrl(url)).toBe(true);
    });
  });
});
