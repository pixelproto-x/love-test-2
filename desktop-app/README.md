# Open City Rise — Windows App

This folder contains the Electron host for the standalone Windows application.

## Build locally

Install Node.js 22 or later, then run from the repository root:

```powershell
npm install
npm run test:app
npm run start
npm run build:win
```

The Windows build creates two executables in `release\`:
- `Open City Rise-0.1.0-x64-nsis.exe`: installer with Start Menu and Desktop shortcuts.
- `Open City Rise-0.1.0-x64-portable.exe`: portable executable that does not require installation.

The build bundles Three.js locally so the 3D engine does not need a CDN connection at launch. Browser-based GitHub Pages play still uses the existing CDN fallbacks. Electron keeps Node integration disabled and uses a sandboxed, context-isolated preload bridge.

Desktop mode enables the higher-detail scene profile for a regular PC window; adaptive rendering remains enabled to avoid forcing maximum resolution when the GPU is under load. Press F11 for fullscreen.
