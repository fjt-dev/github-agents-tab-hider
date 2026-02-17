"use strict";

/**
 * Hides any navigation tab / link on github.com whose visible text is "Agents".
 *
 * GitHub renders tabs in several ways (server-rendered HTML, Turbo-driven
 * partial updates, SPA-style navigation). We use a MutationObserver so that
 * dynamically-inserted elements are caught as well.
 *
 * The extension can be toggled on/off via the popup. When disabled, all hidden
 * elements are restored and the observer is paused.
 */

const STYLE_ID = "hide-agents-tab-css";

const CSS_RULES = `
a[id$="-agents-tab"] { display: none !important; }
nav a[href$="/agents"] { display: none !important; }
li a[href$="/agents"] { display: none !important; }
`;

let observer = null;

function injectCSS() {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS_RULES;
    (document.head || document.documentElement).appendChild(style);
  }
}

function removeCSS() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}

function hideAgentsTabs() {
  // Repo underline-nav tabs  -  <a id="...-agents-tab" ...>
  document
    .querySelectorAll('a[id$="-agents-tab"]')
    .forEach((el) => (el.style.display = "none"));

  // Any link whose trimmed text content is exactly "Agents"
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

  // Global / sidebar nav items linking to an /agents path
  document.querySelectorAll('a[href$="/agents"]').forEach((link) => {
    const li = link.closest("li");
    if (li) {
      li.style.display = "none";
    } else {
      link.style.display = "none";
    }
  });
}

function showAgentsTabs() {
  // Restore elements hidden by JS (inline style)
  document
    .querySelectorAll('a[id$="-agents-tab"]')
    .forEach((el) => (el.style.display = ""));

  document
    .querySelectorAll(
      'nav a[href*="agents"], .UnderlineNav a, .tabnav a, [role="tablist"] a'
    )
    .forEach((link) => {
      if (link.textContent.trim() === "Agents") {
        const li = link.closest("li");
        if (li) {
          li.style.display = "";
        } else {
          link.style.display = "";
        }
      }
    });

  document.querySelectorAll('a[href$="/agents"]').forEach((link) => {
    const li = link.closest("li");
    if (li) {
      li.style.display = "";
    } else {
      link.style.display = "";
    }
  });
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver(hideAgentsTabs);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function enable() {
  injectCSS();
  hideAgentsTabs();
  startObserver();
}

function disable() {
  stopObserver();
  removeCSS();
  showAgentsTabs();
}

// Listen for toggle messages from the popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggle") {
    if (msg.enabled) {
      enable();
    } else {
      disable();
    }
  }
});

// Initialize based on saved state
function init() {
  chrome.storage.local.get({ enabled: true }, (data) => {
    if (data.enabled) {
      enable();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
