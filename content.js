"use strict";

/**
 * Hides any navigation tab / link on github.com whose visible text is "Agents".
 *
 * GitHub renders tabs in several ways (server-rendered HTML, Turbo-driven
 * partial updates, SPA-style navigation). We use a MutationObserver so that
 * dynamically-inserted elements are caught as well.
 */

function hideAgentsTabs() {
  // Repo underline-nav tabs  –  <a id="...-agents-tab" …>
  document
    .querySelectorAll('a[id$="-agents-tab"]')
    .forEach((el) => (el.style.display = "none"));

  // Any nav/tab link whose trimmed text content is exactly "Agents"
  document
    .querySelectorAll(
      'nav a[href*="agents"], .UnderlineNav a, .tabnav a, [role="tablist"] a'
    )
    .forEach((link) => {
      if (link.textContent.trim() === "Agents") {
        const li = link.closest("li");
        if (li) {
          li.style.display = "none";
        } else {
          link.style.display = "none";
        }
      }
    });
}

// Debounce so the observer doesn't fire hideAgentsTabs on every single mutation.
let debounceTimer = null;
function debouncedHide() {
  if (debounceTimer) return;
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    hideAgentsTabs();
  }, 100);
}

// Run once immediately (document_start means DOM may still be loading, but
// the observer below will cover elements that appear later).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideAgentsTabs);
} else {
  hideAgentsTabs();
}

// Observe DOM mutations so we also catch Turbo / pjax navigations.
const observer = new MutationObserver(debouncedHide);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
