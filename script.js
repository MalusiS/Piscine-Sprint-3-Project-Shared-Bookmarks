import { getUserIds } from "./storage.js";

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
}

// Initialize app on DOM load
window.addEventListener("DOMContentLoaded", () => {
  renderUserDropdown();

  const userSelect = document.getElementById("user-select");
  userSelect.addEventListener("change", handleUserChange);
});
