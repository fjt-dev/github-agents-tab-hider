"use strict";

// Set default state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, (data) => {
    if (data.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});
