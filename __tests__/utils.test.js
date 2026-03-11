// __tests__/utils.test.js

import { formatTimestamp, isValidUrl, sanitizeTitle, getExcerpt } from '../utils.js';

describe('Shared Bookmarks Utilities', () => {

  // ==========================================
  // formatTimestamp Tests
  // ==========================================
  describe('formatTimestamp()', () => {
    it('returns "—" for empty or null inputs', () => {
      expect(formatTimestamp('')).toBe('—');
      expect(formatTimestamp(null)).toBe('—');
      expect(formatTimestamp(undefined)).toBe('—');
    });

    it('returns "Invalid date" for malformed date strings', () => {
      expect(formatTimestamp('not-a-real-date')).toBe('Invalid date');
    });

    it('formats a valid ISO timestamp correctly', () => {
      const validIso = '2026-03-10T14:30:00Z';
      const result = formatTimestamp(validIso);
      // Since locales can vary depending on where the test runs, 
      // we check that it successfully returned a string and didn't fail.
      expect(typeof result).toBe('string');
      expect(result).not.toBe('Invalid date');
      expect(result).not.toBe('—');
    });
  });

  // ==========================================
  // isValidUrl Tests
  // ==========================================
  describe('isValidUrl()', () => {
    it('returns true for valid HTTP and HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000/path?query=1')).toBe(true);
    });

    it('returns false for strings missing a protocol', () => {
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.google.com')).toBe(false);
    });

    it('returns false for dangerous or unsupported protocols (XSS prevention)', () => {
      expect(isValidUrl('javascript:alert("hack")')).toBe(false);
      expect(isValidUrl('ftp://files.server.com')).toBe(false);
      expect(isValidUrl('file:///C:/passwords.txt')).toBe(false);
    });

    it('returns false for invalid data types', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(12345)).toBe(false);
    });
  });

  // ==========================================
  // sanitizeTitle Tests
  // ==========================================
  describe('sanitizeTitle()', () => {
    it('removes leading/trailing whitespace and excessive internal spaces', () => {
      expect(sanitizeTitle('   Hello    World   ')).toBe('Hello World');
    });

    it('truncates titles strictly to 120 characters', () => {
      const massiveTitle = 'A'.repeat(200);
      const result = sanitizeTitle(massiveTitle);
      expect(result.length).toBe(120);
    });

    it('handles empty inputs gracefully', () => {
      expect(sanitizeTitle(null)).toBe('');
      expect(sanitizeTitle(undefined)).toBe('');
    });
  });

  // ==========================================
  // getExcerpt Tests
  // ==========================================
  describe('getExcerpt()', () => {
    it('returns the full string if it is under the max length', () => {
      expect(getExcerpt('Short description', 50)).toBe('Short description');
    });

    it('truncates and appends an ellipsis if the string exceeds max length', () => {
      const longDesc = 'A'.repeat(150);
      const result = getExcerpt(longDesc, 120);
      expect(result.length).toBe(121); // 120 characters + 1 ellipsis
      expect(result.endsWith('…')).toBe(true);
    });

    it('trims trailing spaces before appending the ellipsis', () => {
      // "Hello World " is exactly 12 characters long.
      // By passing a much longer string, we force the truncation to trigger.
      const description = 'Hello World and the rest of the universe';
      
      // If we cut at 12, the string is "Hello World ". 
      // A bad function would return "Hello World …". 
      // Our smart function should step back and return "Hello World…".
      const result = getExcerpt(description, 12); 
      
      expect(result).toBe('Hello World…'); 
    });
  });
});
