import { getUserIds, getData } from "./storage.js";

// Keep track of currently selected user
let selectedUserId = null;

/**
 * Renders the user dropdown list.
 */
function renderUserDropdown() {
  const userSelect = document.getElementById("user-select");
  const users = getUserIds();

  // Clear any existing options
  userSelect.innerHTML = "";

  // Populate dropdown with user options
  users.forEach((userId, index) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${index + 1}`;
    userSelect.appendChild(option);
  });

  // Default selection
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
  // Later: trigger re-render of bookmarks for this user
  renderBookmarks();  // Added for Issue 3: Trigger bookmark render on change
}

/**
 * Renders the bookmarks for the selected user in #bookmarks-section.
 */
function renderBookmarks() {
  const bookmarksSection = document.getElementById('bookmarks-section');
  
  // Clear previous content performantly (advisable change for efficiency)
  while (bookmarksSection.firstChild) {
    bookmarksSection.removeChild(bookmarksSection.firstChild);
  }

  const data = getData(selectedUserId);

  // If no data or empty list
  if (!data || data.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No bookmarks yet for this user.";
    bookmarksSection.appendChild(msg);
    return;
  }

  // Sort descending by createdAt
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Create list container
  const list = document.createElement("ul");

  data.forEach((bookmark) => {
    const item = document.createElement("li");

    const titleLink = document.createElement("a");
    titleLink.href = bookmark.url;
    titleLink.textContent = bookmark.title;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";  // Advisable addition for security

    const desc = document.createElement("p");
    desc.textContent = bookmark.description;

    const time = document.createElement("time");
    time.datetime = bookmark.createdAt;  // Advisable addition for accessibility
    time.textContent = new Date(bookmark.createdAt).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });  // Advisable: Specified options for consistent formatting

    item.appendChild(titleLink);
    item.appendChild(desc);
    item.appendChild(time);

    list.appendChild(item);
  });

  bookmarksSection.appendChild(list);
}

// Initialize app on DOM load
window.addEventListener("DOMContentLoaded", () => {
  renderUserDropdown();

  const userSelect = document.getElementById("user-select");
  userSelect.addEventListener("change", handleUserChange);
  
  // Added for Issue 3: Initial bookmark render for default user
  renderBookmarks();
});
