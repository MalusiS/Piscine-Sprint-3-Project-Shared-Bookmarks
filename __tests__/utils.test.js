// Tests for utils.js
import { formatTimestamp, isValidUrl } from "../utils.js";

describe("formatTimestamp", () => {
  test("formats valid ISO timestamp correctly", () => {
    const date = "2025-10-19T12:30:00Z";
    const result = formatTimestamp(date);
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/October/);
  });

  test("returns 'Invalid date' for invalid input", () => {
    expect(formatTimestamp("invalid-date")).toBe("Invalid date");
    expect(formatTimestamp("")).toBe("Invalid date");
  });
});

describe("isValidUrl", () => {
  test("accepts valid http and https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://my-site.org")).toBe(true);
  });

  test("rejects invalid or unsafe URLs", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
});
