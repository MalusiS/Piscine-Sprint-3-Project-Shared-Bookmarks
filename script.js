// script.js

import { getUserIds, getData, setData } from "./storage.js";
import { formatTimestamp, isValidUrl, sanitizeTitle, getExcerpt } from "./utils.js"; // Added new imports

let selectedUserId = null;
let allBookmarks = []; 
let lastFocusedElement = null; // WCAG: Track what opened the modal

// ==================== UTILITIES ====================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  // WCAG: Added role="alert" and aria-live so screen readers announce the toast immediately
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium z-[200] transition-all ${
    type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
  }`;
  toast.innerHTML = `
    <i class="fa-solid ${type === "success" ? "fa-check-circle" : "fa-triangle-exclamation"}" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Generate a unique ID (Fallback for older browsers)
function generateId() {
  return typeof crypto.randomUUID === "function" 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// ==================== RENDER FUNCTIONS ====================
function renderUserDropdown() {
  const userSelect = document.getElementById("user-select");
  const users = getUserIds();
  userSelect.innerHTML = "";

  users.forEach((userId, index) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${index + 1}`;
    userSelect.appendChild(option);
  });

  selectedUserId = users[0] || null;
  if (selectedUserId) {
    userSelect.value = selectedUserId;
    loadBookmarksForCurrentUser();
  }
}

function loadBookmarksForCurrentUser() {
  allBookmarks = getData(selectedUserId) || [];
  renderBookmarks();
}

function createBookmarkCard(bookmark) {
  const card = document.createElement("div");
  card.className = "bookmark-card bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full";
  
  // Build the static HTML safely, then inject user data via textContent to prevent XSS.
  card.innerHTML = `
    <div class="flex-1">
      <a target="_blank" 
         rel="noopener noreferrer"
         class="bookmark-link block text-xl font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors line-clamp-2">
      </a>
      <p class="bookmark-desc mt-3 text-gray-600 dark:text-gray-400 text-[15px] line-clamp-3"></p>
    </div>
    
    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
      <time datetime="${bookmark.createdAt}">${formatTimestamp(bookmark.createdAt)}</time>
      
      <button data-id="${bookmark.id}" 
        aria-label="Delete bookmark"
        class="delete-btn text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors flex items-center gap-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded">
        <i class="fa-solid fa-trash" aria-hidden="true"></i>
        Delete
      </button>
    </div>
  `;

  // Safely inject text and attributes
  const link = card.querySelector('.bookmark-link');
  link.href = bookmark.url;
  link.textContent = bookmark.title;
  card.querySelector('.bookmark-desc').textContent = bookmark.description;

  return card;
}

function renderBookmarks(filteredBookmarks = null) {
  const grid = document.getElementById("bookmarks-grid");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("bookmark-count");

  // Create a copy so we don't mutate the original array, and sort it reverse-chronologically
  let bookmarksToShow = [...(filteredBookmarks || allBookmarks)];
  bookmarksToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  grid.innerHTML = "";

  if (bookmarksToShow.length === 0) {
    emptyState.classList.remove("hidden");
    countEl.textContent = "0 bookmarks";
    return;
  }

  emptyState.classList.add("hidden");
  countEl.textContent = `${bookmarksToShow.length} bookmark${bookmarksToShow.length === 1 ? "" : "s"}`;

  bookmarksToShow.forEach((bookmark) => {
    const card = createBookmarkCard(bookmark);
    grid.appendChild(card);
  });
}

// ==================== EVENT HANDLERS ====================
function openModal() {
  lastFocusedElement = document.activeElement; // WCAG: Remember what was focused
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("bookmark-url").focus();
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("bookmark-form").reset();
  
  // WCAG: Return focus to the button that opened the modal
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function handleAddBookmark(e) {
  e.preventDefault();

  if (!selectedUserId) {
    showToast("Please select a user first", "error");
    return;
  }

  const url = document.getElementById("bookmark-url").value.trim();
  const title = document.getElementById("bookmark-title").value.trim();
  const description = document.getElementById("bookmark-description").value.trim();

  if (!isValidUrl(url)) {
    showToast("Please enter a valid URL (http:// or https://)", "error");
    return;
  }

  const newBookmark = {
    id: generateId(), 
    url,
    title: sanitizeTitle(title), // Sanitizing title
    description: getExcerpt(description, 250), // Smart word-boundary truncation
    createdAt: new Date().toISOString(),
  };

  const currentData = getData(selectedUserId) || [];
  currentData.push(newBookmark);
  const success = setData(selectedUserId, currentData);
  
  if (success) {
    loadBookmarksForCurrentUser(); 
    closeModal();
    showToast("Bookmark added successfully!", "success");
  } else {
    showToast("Failed to save. Device storage may be full.", "error");
  }
}

function handleDelete(id) {
  if (!confirm("Delete this bookmark permanently?")) return;

  const currentData = getData(selectedUserId) || [];
  const updatedData = currentData.filter(b => b.id !== id); 
  
  setData(selectedUserId, updatedData);
  loadBookmarksForCurrentUser();
  
  showToast("Bookmark deleted", "success"); 
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase().trim();
  
  if (!term) {
    renderBookmarks();
    return;
  }

  const filtered = allBookmarks.filter(b =>
    b.title.toLowerCase().includes(term) ||
    b.description.toLowerCase().includes(term) ||
    b.url.toLowerCase().includes(term)
  );

  renderBookmarks(filtered);
}

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle.querySelector("i");

  if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
    localStorage.theme = isDark ? "dark" : "light";
  });
}

// ==================== MAIN INIT ====================
window.addEventListener("DOMContentLoaded", () => {
  renderUserDropdown();

  document.getElementById("user-select").addEventListener("change", (e) => {
    selectedUserId = e.target.value;
    loadBookmarksForCurrentUser();
  });

  document.getElementById("add-btn").addEventListener("click", openModal);
  document.getElementById("cancel-btn").addEventListener("click", closeModal);
  document.getElementById("bookmark-form").addEventListener("submit", handleAddBookmark);

  document.getElementById("search-input").addEventListener("input", handleSearch);

  document.getElementById("bookmarks-grid").addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      handleDelete(deleteBtn.dataset.id);
    }
  });

  // WCAG: Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("modal").classList.contains("hidden")) {
      closeModal();
    }
  });

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });

  initThemeToggle();

  if (selectedUserId) loadBookmarksForCurrentUser();
});
