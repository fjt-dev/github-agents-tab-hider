"use strict";

const toggle = document.getElementById("toggle");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const statusSpan = document.getElementById("statusSpan");
const statusCard = document.getElementById("statusCard");

function updateUI(enabled) {
  if (enabled) {
    statusDot.classList.remove("off");
    statusText.textContent = "Enabled";
    statusCard.classList.add("active");
    statusSpan.textContent = "hidden";
    statusSpan.classList.remove("off");
  } else {
    statusDot.classList.add("off");
    statusText.textContent = "Disabled";
    statusCard.classList.remove("active");
    statusSpan.textContent = "visible";
    statusSpan.classList.add("off");
  }
}

// Load saved state
chrome.storage.sync.get({ enabled: true }, (result) => {
  const enabled = result.enabled !== false;
  toggle.checked = enabled;
  updateUI(enabled);
});

// Handle toggle
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled });
  updateUI(enabled);

  // Notify all GitHub tabs
  chrome.tabs.query({ url: "https://github.com/*" }, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: "toggle", enabled });
    }
  });
});
