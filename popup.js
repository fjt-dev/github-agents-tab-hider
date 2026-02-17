"use strict";

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function updateUI(enabled) {
  toggle.checked = enabled;
  status.textContent = enabled ? "Enabled" : "Disabled";
  status.classList.toggle("enabled", enabled);
}

// Load saved state
chrome.storage.local.get({ enabled: true }, (data) => {
  updateUI(data.enabled);
});

// Handle toggle
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  updateUI(enabled);

  // Notify all GitHub tabs
  chrome.tabs.query({ url: "https://github.com/*" }, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: "toggle", enabled });
    }
  });
});
