import { getUserIds, getData, setData } from "./storage.js";

let selectedUserId = null;

/**
 * Renders the user dropdown list.
 */
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

  selectedUserId = users[0];
  userSelect.value = selectedUserId;

  console.log(`Default selected user: ${selectedUserId}`);
}

/**
 * Handles change in user selection.
 */
function handleUserChange(event) {
  selectedUserId = event.target.value;
  console.log(`Selected user changed to: ${selectedUserId}`);
  renderBookmarks();
}

/**
 * Renders bookmarks for the selected user in #bookmarks-section.
 */
function renderBookmarks() {
  const bookmarksSection = document.getElementById("bookmarks-section");

  // Clear previous content
  while (bookmarksSection.firstChild) {
    bookmarksSection.removeChild(bookmarksSection.firstChild);
  }

  const data = getData(selectedUserId);

  if (!data || data.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No bookmarks yet for this user.";
    bookmarksSection.appendChild(msg);
    return;
  }

  // Sort descending by date
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const list = document.createElement("ul");

  data.forEach((bookmark) => {
    const item = document.createElement("li");

    const titleLink = document.createElement("a");
    titleLink.href = bookmark.url;
    titleLink.textContent = bookmark.title;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";

    const desc = document.createElement("p");
    desc.textContent = bookmark.description;

    const time = document.createElement("time");
    time.datetime = bookmark.createdAt;
    time.textContent = new Date(bookmark.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    item.appendChild(titleLink);
    item.appendChild(desc);
    item.appendChild(time);
    list.appendChild(item);
  });

  bookmarksSection.appendChild(list);
}

/**
 * Handles submission of the Add Bookmark form.
 */
function handleAddBookmark(event) {
  event.preventDefault();

  const url = document.getElementById("bookmark-url").value.trim();
  const title = document.getElementById("bookmark-title").value.trim();
  const description = document.getElementById("bookmark-description").value.trim();

  if (!url || !title || !description) {
    alert("All fields are required.");
    return;
  }

  // Retrieve existing data or initialize empty array
  const existingData = getData(selectedUserId) || [];

  // Create new bookmark object
  const newBookmark = {
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  // Append and store
  const updatedData = [...existingData, newBookmark];
  setData(selectedUserId, updatedData);

  // Clear form
  event.target.reset();

  // Re-render bookmarks
  renderBookmarks();

  console.log(`Bookmark added for User ${selectedUserId}:`, newBookmark);
}

// Initialize app
window.addEventListener("DOMContentLoaded", () => {
  renderUserDropdown();

  const userSelect = document.getElementById("user-select");
  userSelect.addEventListener("change", handleUserChange);

  const bookmarkForm = document.getElementById("bookmark-form");
  bookmarkForm.addEventListener("submit", handleAddBookmark);

  renderBookmarks();
});
