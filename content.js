"use strict";

/**
 * Hides the "Agents" navigation tab on github.com.
 *
 * Strategy:
 *  - CSS (hide-agents.css) instantly hides tabs matched by id selector.
 *  - This script handles dynamic content: Turbo navigations and lazily
 *    inserted DOM nodes are caught via event listeners + MutationObserver.
 *  - Only added nodes are inspected — no full-document rescans on every
 *    mutation — and writes are batched with requestAnimationFrame.
 */

const AGENTS_TAB_ID_SUFFIX = "-agents-tab";
const NAV_LINK_SELECTOR =
  '.UnderlineNav a, .tabnav a, [role="tablist"] a, nav a';

/** Hide a single element (or its closest <li> wrapper). */
function hide(el) {
  const target = el.closest("li") || el;
  target.style.display = "none";
}

/** Check a subtree for Agents tabs and hide them. */
function hideAgentsIn(root) {
  if (!(root instanceof Element)) return;

  // 1. Tabs identified by id  –  <a id="...-agents-tab">
  root.querySelectorAll(`a[id$="${AGENTS_TAB_ID_SUFFIX}"]`).forEach(hide);
  if (root.matches?.(`a[id$="${AGENTS_TAB_ID_SUFFIX}"]`)) hide(root);

  // 2. Nav links whose visible text is exactly "Agents"
  root.querySelectorAll(NAV_LINK_SELECTOR).forEach((link) => {
    if (link.textContent.trim() === "Agents") hide(link);
  });
  if (root.matches?.(NAV_LINK_SELECTOR) && root.textContent.trim() === "Agents") {
    hide(root);
  }
}

/** Full-page scan — used on initial load and Turbo navigations. */
function hideAgentsTabs() {
  hideAgentsIn(document.documentElement);
}

// --- Batched MutationObserver (only inspects added nodes) ---------------

let rafScheduled = false;
let pendingRoots = [];

function flushPending() {
  rafScheduled = false;
  const roots = pendingRoots;
  pendingRoots = [];
  for (const root of roots) {
    hideAgentsIn(root);
  }
}

function scheduleHide(root) {
  pendingRoots.push(root);
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(flushPending);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        scheduleHide(node);
      }
    }
  }
});

// --- Bootstrap -----------------------------------------------------------

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideAgentsTabs);
} else {
  hideAgentsTabs();
}

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// GitHub uses Turbo for SPA-style navigation. A full scan after each
// Turbo visit ensures we catch server-rendered tabs on the new page.
document.addEventListener("turbo:load", hideAgentsTabs);
