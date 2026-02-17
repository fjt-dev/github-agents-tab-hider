"use strict";

// Set default state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ enabled: true }, (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
  });
});
