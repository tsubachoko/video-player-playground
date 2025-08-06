# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

このプロジェクトでは日本語でのコミュニケーションを希望します。コメント、説明、エラーメッセージなどは日本語で記述してください。

## Overview

This is a Video Player Playground project that demonstrates three major video player libraries:
- Video.js - HTML5 video player with plugin ecosystem
- HLS.js - HTTP Live Streaming player
- Shaka Player - Google's adaptive streaming player (supports both DASH and HLS)

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server (opens on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── main.js           # Main entry point, tab switching logic, global function exports
├── common/
│   └── constants.js  # Sample URLs and utility functions
├── videojs/
│   └── player.js     # Video.js player implementation
├── hlsjs/
│   └── player.js     # HLS.js player implementation
└── shaka/
    └── player.js     # Shaka Player implementation
```

## Key Technical Details

1. **Build Tool**: Uses Vite as the build tool with configuration in `vite.config.js`
2. **Module Type**: ES modules (`"type": "module"` in package.json)
3. **Dependencies**: All three video players are optimized in Vite config
4. **Port**: Development server runs on port 3000
5. **Bundle Analysis**: Rollup visualizer plugin is configured for bundle analysis

## Player-Specific Implementation Patterns

Each player module (`videojs/player.js`, `hlsjs/player.js`, `shaka/player.js`) exports:
- `init[Player]` - Initialize player
- `load[Player]` - Load custom URL
- `sample[Player]` - Load sample video
- Custom control functions for manual UI implementation:
  - `load[Player]Custom`
  - `togglePlay[Player]Custom`
  - `toggleMute[Player]Custom`
  - `setVolume[Player]Custom`
  - `setSpeed[Player]Custom`
  - `seek[Player]Custom`
  - `seekToPosition[Player]`

## Video Format Support

- **Video.js**: MP4, WebM, OGV, HLS (with plugin)
- **HLS.js**: HLS (.m3u8)
- **Shaka Player**: DASH (.mpd), HLS (.m3u8)

## Important Notes

1. The project uses external sample video URLs defined in `src/common/constants.js`
2. CORS restrictions may prevent some video URLs from playing
3. No linting or testing framework is currently configured
4. The UI supports both standard player controls and custom control implementations