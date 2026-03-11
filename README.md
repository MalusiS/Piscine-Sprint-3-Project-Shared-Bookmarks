# 📚 Shared Bookmarks

![Accessibility](https://img.shields.io/badge/Accessibility-100%25_Lighthouse-success)
![WAVE](https://img.shields.io/badge/WAVE-Zero_Errors-success)
![Tests](https://img.shields.io/badge/Tests-18%2F18_Passing-success)
![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38B2AC?logo=tailwind-css&logoColor=white)

A rigorously tested, WCAG AA-compliant bookmark manager built with Vanilla JavaScript. This project focuses heavily on defensive programming, accessibility, and client-side data integrity.

## ✨ Core Engineering Features

### 🛡️ Security & State Management
* **XSS Neutralization:** All user inputs are sanitized and safely injected via `textContent` rather than `innerHTML` to prevent Cross-Site Scripting attacks.
* **UUID-Based Deletion:** Replaced standard array-index deletion with `crypto.randomUUID()`, eliminating data-loss bugs when deleting items from a filtered search state.
* **Defensive Storage Abstraction:** The LocalStorage API is wrapped in a dedicated module with `try/catch` blocks, strict type validation (`Array.isArray`), and graceful fallbacks for corrupted JSON data or quota-exceeded errors.

### ♿ Accessibility (A11y)
* **100% Lighthouse & WAVE Compliant:** Achieved zero errors on the WAVE Web Accessibility Evaluation Tool in both Light and Dark modes.
* **Accessible Modals:** Custom modal includes `role="dialog"`, `aria-modal="true"`, and focus-trapping logic (returns focus to the triggering element upon closing, supports `Escape` key dismissal).
* **Semantic HTML:** Fully structured with semantic landmarks (`<main>`, `<header>`), `aria-labels` on icon-only buttons, and optimized contrast ratios for all text sizes.

### 🧪 Test-Driven Development (TDD)
* **Comprehensive Jest Suite:** Utility functions and state logic are fully covered by automated tests.
* **LocalStorage Mocking:** The test suite includes a custom browser storage mock to test edge cases, including injecting corrupted JSON to verify the app's error-recovery mechanisms.

### 📱 UI / UX
* **Responsive Architecture:** Built mobile-first with Tailwind CSS, featuring a responsive header that optimizes premium screen real estate on smaller devices.
* **Smart Truncation:** Descriptions are truncated at exact word boundaries before appending an ellipsis, preventing awkward or broken words in the UI.
* **Theme Persistence:** A system-aware Dark/Light mode toggle that saves user preferences to LocalStorage.

---

## 🚀 Getting Started

Because this project is built with Vanilla JS and a Tailwind CDN, there is no complex build step required to run the application itself. 

### Running the App
1. Clone the repository:
   ```bash
   git clone https://github.com/MalusiS/Piscine-Sprint-3-Project-Shared-Bookmarks.git

2. Open `index.html` in your browser, or use an extension like VS Code Live Server.

### Running the Test Suite
To execute the Jest test suite and verify the business logic:
1. Install the development dependencies:
   ```bash
   npm install

2. Run the tests (Configured for ES Modules):
   ```bash
   npm test

---

## 📁 Architecture & File Structure

- `index.html` - The semantic, fully accessible markup shell. 
- `script.js` - The main controller handling DOM manipulation, event delegation, and UI state.
- `storage.js` - A pure, side-effect-free abstraction layer managing LocalStorage interactions.
- `utils.js` - Pure helper functions (formatting, validation, sanitization) built via TDD.
- `__tests__/` - The Jest test suites verifying core logic and edge cases.

---

## 👨‍💻 Author

**Malusi Skunyana**
- [GitHub](https://github.com/MalusiS)
