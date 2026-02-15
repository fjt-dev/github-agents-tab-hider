# delete-Agents-Tab
**Chrome extension to remove the Agents tab from github.com**

- Created this to hide GitHub Copilot because it doesn't solve my subscription issues.

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select this project folder
5. The extension is now active on github.com

## How it works

- A CSS file (`hide-agents.css`) immediately hides tabs matching known selectors (e.g. `a[id$="-agents-tab"]`, links with `href` ending in `/agents`).
- A content script (`content.js`) runs at `document_start` and uses a `MutationObserver` to catch any dynamically-inserted "Agents" tabs (Turbo/pjax navigations).

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome Manifest V3 extension config |
| `hide-agents.css` | CSS rules injected into github.com pages |
| `content.js` | JS content script for dynamic tab hiding |
| `icon48.png` | Extension icon (48x48) |
| `icon128.png` | Extension icon (128x128) |
