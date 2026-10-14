# Open City Rise Explorer — Windows App

This is the standalone Windows build of the non-combat city exploration edition.

## Build locally

Install Node.js 22 or later, then run from the repository root:

```powershell
npm install
npm run test:app
npm run start
npm run build:win
```

The Windows build creates two executables in `release\\`:
- `Open City Rise Explorer-0.1.0-x64-nsis.exe`: installer with Start Menu and Desktop shortcuts.
- `Open City Rise Explorer-0.1.0-x64-portable.exe`: portable executable that does not require installation.

The desktop app loads `open-city-rise-safe.html`, which keeps the city, vehicles, NPC roaming, timed delivery missions, police pursuit challenge, minimap, desktop controls and touch controls. Weapon models, attacks, combat NPC spawners, injury effects and crime robbery interactions are removed. Three.js is bundled locally so the 3D engine does not need a CDN connection at launch. Electron keeps Node integration disabled and uses a sandboxed, context-isolated preload bridge.

Desktop mode enables the higher-detail scene profile for a regular PC window; adaptive rendering remains enabled to avoid forcing maximum resolution when the GPU is under load. Press F11 for fullscreen.
