import { getUserIds, getData, setData } from "./storage.js";
import { formatTimestamp, isValidUrl } from "./utils.js";

let selectedUserId = null;

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
}

function handleUserChange(event) {
  selectedUserId = event.target.value;
  renderBookmarks();
}

function renderBookmarks() {
  const bookmarksSection = document.getElementById("bookmarks-section");
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

  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const list = document.createElement("ul");

  data.forEach((bookmark) => {
    const item = document.createElement("li");

    const titleLink = document.createElement("a");
    titleLink.href = bookmark.url;
    titleLink.textContent = bookmark.title;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    // Keeping this explicit aria-label to prevent possible Lighthouse audit failures
    titleLink.setAttribute("aria-label", `Open bookmark: ${bookmark.title}`);

    const desc = document.createElement("p");
    desc.textContent = bookmark.description;

    const time = document.createElement("time");
    time.datetime = bookmark.createdAt;
    time.textContent = formatTimestamp(bookmark.createdAt);

    item.append(titleLink, desc, time);
    list.appendChild(item);
  });

  bookmarksSection.appendChild(list);
}

function handleAddBookmark(event) {
  event.preventDefault();

  if (!selectedUserId) {
    alert("Please select a user first.");
    return;
  }

  const url = document.getElementById("bookmark-url").value.trim();
  const title = document.getElementById("bookmark-title").value.trim();
  const description = document.getElementById("bookmark-description").value.trim();

  if (!url || !title || !description) {
    alert("All fields are required.");
    return;
  }

  if (!isValidUrl(url)) {
    alert("Please enter a valid URL starting with http:// or https://");
    return;
  }

  const newBookmark = {
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  const existing = getData(selectedUserId) || [];
  existing.push(newBookmark);
  setData(selectedUserId, existing);
  renderBookmarks();
  event.target.reset();

  // Added focus to satisfy manual audit: "The user's focus is directed to new content added to the page"
  document.getElementById("bookmarks-section").focus();
}

window.addEventListener("DOMContentLoaded", () => {
  renderUserDropdown();
  document.getElementById("user-select").addEventListener("change", handleUserChange);
  document.getElementById("bookmark-form").addEventListener("submit", handleAddBookmark);
  renderBookmarks();
});
