# GitHub Agents Tab Hider

**Chrome extension to hide the Agents tab on GitHub**

A lightweight Chrome extension that removes the "Agents" navigation tab from GitHub's interface, providing a cleaner workspace for developers who don't use this feature.

## Features

- Automatically hides the "Agents" tab across all GitHub pages
- Works with both server-rendered and dynamically loaded content
- No data collection or tracking
- Instant hiding with no visual flicker

## Installation
1. Clone or download this repository
   ```
   git clone https://github.com/fjt-dev/delete-Agents-Tab/edit/main/README.md
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the project folder
5. The extension is now active on github.com

## How It Works

The extension uses a two-layer approach for reliable tab hiding:

1. **CSS-based hiding** - Instantly hides tabs matching known selectors before the page fully renders, preventing visual flicker
2. **JavaScript observer** - A MutationObserver watches for dynamically-inserted tabs during Turbo/pjax navigations

This combination ensures the Agents tab remains hidden even as you navigate through GitHub's single-page application experience.

## Technical Details

### Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome Manifest V3 extension configuration |
| `hide-agents.css` | CSS rules to hide Agents tab elements |
| `content.js` | Content script for dynamic tab observation |
| `icon48.png` | Extension icon (48×48) |
| `icon128.png` | Extension icon (128×128) |

### Architecture

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Run Time**: `document_start` for maximum performance
- **Permissions**: Minimal - only operates on github.com
- **Privacy**: No data collection, no external requests

### Targeted Selectors

The extension hides elements matching:
- Repository navigation tabs with ID ending in `-agents-tab`
- Links with href ending in `/agents`
- Navigation links with text content "Agents"

## License

MIT License - feel free to use and modify as needed.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Note**: This extension is not affiliated with or endorsed by GitHub, Inc.
