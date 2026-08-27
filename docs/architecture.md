# Architecture

React Native Spy is an Electron app with three layers: a **main process** WebSocket server, a **preload** bridge, and a **React renderer** UI.

## Layers

```
React Native App                Electron Main              Preload                Renderer (React)
─────────────────              ─────────────              ─────────              ────────────────
client snippet  ──ws frame──►  rnspyServer.js  ──IPC──►   contextBridge  ──API──►  useRnspyDevtools
                                (ws.Server)      push      window.electron.rnspy     → device buckets
                                               channels                         → Network/WS/Console/Logs
```

### 1. Main process — `src/main/rnspyServer.js`

A `ws` WebSocket server (default port **8097**).

- Accepts RN client connections; each socket gets `__rnspyId`, `__rnspyDeviceId`, `__rnspyName`, `__rnspyPlatform` from the `hello` frame.
- Parses incoming JSON frames and tags each with a server `seq` + client metadata.
- Pushes events to the renderer via `mainWindow.webContents.send(...)`.
- Keeps a rolling **500-entry** server-log buffer.
- Detects the LAN address via `os.networkInterfaces()`.

**Exports:** `startRnspyServer`, `stopRnspyServer`, `getRnspyStatus`, `getRnspyLogs`, `clearRnspyLogs`, `disconnectRnspyClient`.

### 2. Main process — IPC registration (`src/main/index.js`)

Six request/response handlers bridge the renderer to the server, plus three push channels:

| Channel | Direction | Purpose |
| ------- | --------- | ------- |
| `rnspy:start` | renderer → main | start/restart server with `{ port }` |
| `rnspy:stop` | renderer → main | stop server, disconnect all |
| `rnspy:status` | renderer → main | snapshot of status |
| `rnspy:disconnect-client` | renderer → main | force-disconnect one client |
| `rnspy:get-logs` | renderer → main | server log buffer |
| `rnspy:clear-logs` | renderer → main | clear server log buffer |
| `rnspy:event` | main → renderer | a single RN event (console/network/ws) |
| `rnspy:status` | main → renderer | status changed (connect/disconnect) |
| `rnspy:log` | main → renderer | new server log entry |

The server is stopped on `window-all-closed` and `before-quit`.

### 3. Preload — `src/preload/index.js`

Exposes `window.electron.rnspy` via `contextBridge` (the only way the renderer talks to the server):

```js
window.electron.rnspy = {
  start, stop, getStatus, disconnectClient, getLogs, clearLogs,
  onEvent(cb), onStatus(cb), onLog(cb)   // each returns an unsubscribe fn
}
```

### 4. Renderer — `src/renderer/components/rnspy-devtools/useRnspyDevtools.js`

The core hook owning the entire client lifecycle:

- Starts the server on mount, stops on unmount.
- Subscribes to `rnspy:event` / `rnspy:status` / `rnspy:log`.
- Buckets events into a `Map<deviceKey, device>` where `deviceKey = deviceId || clientName || clientId || 'unknown'`.
- Merges `network-start` + `network` into one row (O(1) by `id`); tracks WebSocket connections + frames.
- Enforces the per-device caps (see [Configuration](./configuration.md)).
- Persists records → `sessionStorage` (debounced 600ms); port + hidden rules → `localStorage`.
- Returns state + actions used by the UI (`devices`, `status`, `hiddenRules`, `disconnectDevice`, `closeDevice`, `clearDevice`, `clearServerLogs`, etc.).

### 5. Renderer — UI components

| File | Role |
| ---- | ---- |
| `RnspyDevtoolsPage.jsx` | page shell: header, tab bar, device tabs, empty state, settings |
| `DeviceTabs.jsx` | per-device tab strip (online dot, counts, reload/clear/close) |
| `NetworkTab.jsx` | HTTP list + resizable detail pane (Headers/Payload/Response/Timing) |
| `WebSocketTab.jsx` | connections list + resizable frame stream |
| `ConsoleTab.jsx` | level-filtered log stream, caller badges, "open in VS Code" |
| `LogsTab.jsx` | server activity log |
| `RnspySettingsModal.jsx` | port, devices, project root, hidden rules, reset |
| `ProjectSetupModal.jsx` | folder picker, RN detection, change preview, apply/remove |
| `CursorMenu.jsx` | right-click context menu (portal) |
| `curl.js` | copy-as-cURL/fetch/Axios/HTTPie/HAR + pretty-body helpers |
| `requestFilters.js` | request naming + hidden-rule matching |

The client snippet template lives outside the renderer at `src/shared/rnClient.js`, because both the renderer (empty-state snippet) and the main process (automatic setup) need it. electron-vite builds main and renderer separately and the `@` alias is renderer-only, so shared code must be reachable by relative path from both.

### 6. Client SDK — `src/shared/rnClient.js`

The snippet (see [Client SDK](./client-sdk.md)). It monkey-patches `console.*`, `fetch`, `XMLHttpRequest`, `WebSocket` and streams frames over WebSocket with auto-reconnect + offline queue. Also exports the shared `RNSPY_CONNECTION_FILENAME` / `RNSPY_CONNECTION_SPECIFIER` / `RNSPY_MARKER` constants that keep generation and detection in sync.

### 7. Project setup — `src/main/projectSetup.js`

The only part of the app that writes into a repo it doesn't own, so it's split into a read-only **plan** phase and a **apply** phase:

- `detectRnProject(dir)` — requires `react-native` in deps; reports app name, RN version, Expo, resolved entry file.
- `findEntryFile(dir, pkg)` — `package.json` `main` first (skipping `node_modules/` entries like Expo's `AppEntry.js`), then `index.*` / `App.*` conventions.
- `planSetup({ dir, host, port })` — computes every change without touching disk. Each step reports `create` / `overwrite` / `append` / `inject` / `already-present`.
- `applySetup({ dir, host, port })` — re-plans internally rather than trusting a renderer-supplied plan, backs up each file as `.rnspy.bak`, and rolls back if a later write fails.
- `removeSetup({ dir })` — deletes the generated file and strips the import.

Injection preserves the entry file's existing line endings and trailing-newline state, and places the import after only a shebang, leading comments, or `'use strict'`. Idempotency comes from the marker plus quote/extension-insensitive import matching, so re-running never duplicates a line.

Exposed over IPC as `rnspy:pick-project-folder`, `rnspy:detect-project`, `rnspy:plan-setup`, `rnspy:apply-setup`, `rnspy:remove-setup`.

## Data flow (one event)

1. RN app patches a global → emits a JSON frame over `ws://HOST:PORT`.
2. `rnspyServer.js` receives, tags with `seq` + client metadata, forwards via `rnspy:event`.
3. Preload delivers `rnspy:event` to the renderer.
4. `useRnspyDevtools` routes it to the right per-device bucket and triggers a re-render.
5. The relevant panel (`NetworkTab` / `WebSocketTab` / `ConsoleTab` / `LogsTab`) displays it.

## Build / run

- `electron-vite` compiles three targets: `out/main`, `out/preload`, `out/renderer`.
- `npm run dev` = hot-reload dev. `npm run build` = production bundle. `electron-builder` packages it (see [Getting Started](./getting-started.md)).

## Project structure

Each directory holds one kind of thing: hooks in `hooks/`, pure helpers in
`utils/`, React components in `components/`.

```
src/
  main/                   Electron main process
    index.js              IPC handlers + app lifecycle
    rnspyServer.js        WebSocket server + client tracking
    projectSetup.js       RN project detection + setup writes
    updater.js            auto-update state machine (GitHub Releases)
  preload/
    index.js              contextBridge → window.electron.{rnspy,updater}
  renderer/
    main.jsx              React entry
    App.jsx               routes (/ and /rnspy)
    assets/               static assets (favicon)
    styles/               theme.css tokens + shared button/badge styles
    hooks/
      useRnspyDevtools.js   device/event state, IPC subscriptions
      useUpdater.js         mirrors main-process updater state
      useVirtualRows.js     fixed-height row virtualization
    utils/
      curl.js               request → curl/fetch/HAR formatters
      requestFilters.js     request naming + hide rules
    components/
      rnspy-devtools/       debugger UI panels, modals, toolbar
  shared/
    rnClient.js           client SDK snippet injected into RN apps
```
