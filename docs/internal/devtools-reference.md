# React Native Spy — Complete Documentation

React Native Spy is a built-in **remote debugger for React Native applications** that runs inside the Table Vault Electron desktop app. It hosts a WebSocket server in the Electron main process, and a React Native app connects to it by pasting a client SDK snippet into its entry file. The SDK monkey-patches `console.*`, `fetch`, `XMLHttpRequest`, and `WebSocket` in the RN app and streams all console output, HTTP network requests, and WebSocket frames to the desktop app in real-time.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Flow](#data-flow)
3. [File Structure](#file-structure)
4. [Routing & Navigation](#routing--navigation)
5. [Main Process — WebSocket Server](#1-main-process--websocket-server)
6. [Main Process — IPC Registration](#2-main-process--ipc-registration)
7. [Preload — Bridge API](#3-preload--bridge-api)
8. [Renderer — Core Hook](#4-renderer--core-hook-usernspydevtools)
9. [Renderer — Main Page Shell](#5-renderer--main-page-shell-rnspydevtoolspage)
10. [Renderer — Device Tabs](#6-renderer--device-tabs)
11. [Renderer — Network Tab](#7-renderer--network-tab)
12. [Renderer — WebSocket Tab](#8-renderer--websocket-tab)
13. [Renderer — Console Tab](#9-renderer--console-tab)
14. [Renderer — Logs Tab](#10-renderer--logs-tab)
15. [Renderer — Settings Modal](#11-renderer--settings-modal)
16. [Renderer — Context Menu](#12-renderer--context-menu-cursormenu)
17. [Renderer — React Native Client SDK](#13-renderer--react-native-client-sdk)
18. [Renderer — cURL/Fetch Utilities](#14-renderer--curlfetch-utilities)
19. [Renderer — Request Filters](#15-renderer--request-filter-utilities)
20. [Dependencies](#dependencies)
21. [Storage Keys](#storage-keys)
22. [Limits & Caps](#limits--caps)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   React Native App (Device)                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Client SDK (pasted into index.js / App.js)              │   │
│  │  • Patches console.*, fetch, XMLHttpRequest, WebSocket   │   │
│  │  • Emits JSON frames over ws://HOST:PORT                 │   │
│  │  • Auto-reconnect (2s retry), offline queue (500 cap)    │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │ WebSocket                                      │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               Electron Main Process (rnspyServer.js)             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ws.Server (port 8097 default)                           │   │
│  │  • Accepts RN client connections                         │   │
│  │  • Parses JSON frames (hello, console, network, ws)      │   │
│  │  • Tags with server seq + client metadata                │   │
│  │  • Rolling server log buffer (500 entries)               │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │ IPC (ipcMain.handle ↔ ipcRenderer.invoke)      │
│                 │ Push channels: rnspy:event, rnspy:status,        │
│                 │                rnspy:log                         │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Preload (contextBridge)                        │
│  Exposes window.electron.rnspy = { start, stop, getStatus,      │
│    disconnectClient, getLogs, clearLogs, onEvent, onStatus,     │
│    onLog }                                                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Renderer (React UI)                              │
│                                                                 │
│  useRnspyDevtools() hook                                         │
│    • Starts/stops server on mount/unmount                       │
│    • Subscribes to rnspy:event, rnspy:status, rnspy:log            │
│    • Accumulates per-device buckets (Map<key, device>)          │
│    • Persists to sessionStorage/localStorage                    │
│                                                                 │
│  RnspyDevtoolsPage                                               │
│    ├── DeviceTabs (per-device tab strip)                        │
│    ├── NetworkTab (HTTP request list + detail panel)             │
│    ├── WebSocketTab (WS connections + frame stream)              │
│    ├── ConsoleTab (console.* log stream)                         │
│    ├── LogsTab (server activity logs)                            │
│    └── RnspySettingsModal (devices + hidden rules)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

1. **RN App** patches `console.*`, `fetch`, `XMLHttpRequest`, and `WebSocket`
2. Every intercepted call emits a JSON frame via WebSocket to `ws://HOST:PORT`
3. **Main Process** (`rnspyServer.js`) receives the frame, tags it with a server `seq` number and client metadata, and pushes it to the renderer via `mainWindow.webContents.send('rnspy:event', payload)`
4. **Preload** bridges `rnspy:event` to the renderer via `ipcRenderer.on`
5. **Renderer** (`useRnspyDevtools` hook) receives the event, routes it to the correct per-device bucket, and triggers a React re-render
6. **UI Components** (NetworkTab, WebSocketTab, ConsoleTab, LogsTab) display the data

---

## File Structure

| # | File Path | Purpose |
|---|-----------|---------|
| 1 | `src/main/rnspyServer.js` | Main-process WebSocket server (`ws` library) |
| 2 | `src/main/index.js` | IPC handler registration + server lifecycle |
| 3 | `src/preload/index.js` | Bridge exposing `window.electron.rnspy` API |
| 4 | `src/renderer/hooks/useRnspyDevtools.js` | Core React hook: server lifecycle, event accumulation, state management |
| 5 | `src/renderer/components/rnspy-devtools/RnspyDevtoolsPage.jsx` | Top-level page shell with header, tabs, empty state |
| 6 | `src/renderer/components/rnspy-devtools/DeviceTabs.jsx` | Per-device tab strip with online indicators |
| 7 | `src/renderer/components/rnspy-devtools/NetworkTab.jsx` | Virtualized HTTP request list + detail panel |
| 8 | `src/renderer/components/rnspy-devtools/WebSocketTab.jsx` | WebSocket connection list + frame stream |
| 9 | `src/renderer/components/rnspy-devtools/ConsoleTab.jsx` | Console log stream with level filters |
| 10 | `src/renderer/components/rnspy-devtools/LogsTab.jsx` | Server-side activity log viewer |
| 11 | `src/renderer/components/rnspy-devtools/RnspySettingsModal.jsx` | Settings modal: connected devices + hidden request rules |
| 12 | `src/renderer/components/rnspy-devtools/CursorMenu.jsx` | Generic right-click context menu (React portal) |
| 13 | `src/shared/rnClient.js` | React Native client SDK snippet (template string) |
| 14 | `src/renderer/utils/curl.js` | cURL/fetch/prettyBody/copyText utilities |
| 15 | `src/renderer/utils/requestFilters.js` | Request name derivation + hidden-rule matching |
| 16 | `src/renderer/hooks/useVirtualRows.js` | Fixed-height row virtualization |
| 17 | `src/main/projectSetup.js` | RN project detection + setup file writes |
| 18 | `src/main/updater.js` | Auto-update state machine (GitHub Releases) |
| 19 | `src/renderer/hooks/useUpdater.js` | Mirrors main-process updater state |
| 20 | `src/renderer/components/rnspy-devtools/UpdateButton.jsx` | Toolbar update affordance |
| 21 | `src/renderer/App.jsx` | Route registration + lazy loading |

---

## Routing & Navigation

The app is single-purpose, so routing is minimal: there is no icon rail and no
route-constants module. `App.jsx` registers the one page under both `/` and
`/rnspy`, lazy-loaded behind a `Suspense` fallback.

### Route Registration — `src/renderer/App.jsx`

```jsx
const RnspyDevtoolsPage = lazy(() => import('./components/rnspy-devtools/RnspyDevtoolsPage'))

<Routes>
  <Route path="/" element={<RnspyDevtoolsPage />} />
  <Route path="/rnspy" element={<RnspyDevtoolsPage />} />
</Routes>
```

`main.jsx` wraps this in a `HashRouter`, which is required because the packaged
app loads the renderer over `file://` where history-based routing breaks.

---

## 1. Main Process — WebSocket Server

**File:** `src/main/rnspyServer.js`

Hosts a `ws` WebSocket server that React Native apps connect to. Parses incoming JSON messages, assigns each socket a stable ID, tracks connected clients, and pushes events to the renderer.

### Exports

| Function | Description |
|----------|-------------|
| `startRnspyServer({ port, send })` | Starts or restarts the WS server on the given port. Returns a status object. |
| `stopRnspyServer()` | Terminates all clients and closes the server. |
| `getRnspyStatus()` | Returns a snapshot: running state, port, LAN address, connected clients. |
| `getRnspyLogs()` | Returns the server-side log buffer (connection lifecycle, errors). |
| `clearRnspyLogs()` | Wipes the server-side log buffer. |
| `disconnectRnspyClient(id)` | Force-disconnects a single client by its `__rnspyId`. |

### Key Behaviors

- **LAN Address Detection:** Uses `os.networkInterfaces()` to find the machine's LAN IPv4, preferring private ranges (`192.168.*`, `10.*`, `172.16-31.*`).
- **Default Port:** 8097
- **Client Metadata:** Each socket is stamped with `__rnspyId`, `__rnspyDeviceId`, `__rnspyName`, `__rnspyPlatform` from the client's `hello` frame.
- **Server Logs:** Rolling buffer capped at 500 entries, pushed to renderer via `rnspy:log` channel.
- **Status Pushes:** Connection/disconnection events push fresh status via `rnspy:status` channel.
- **Event Forwarding:** Each parsed event is tagged with a server `seq` number and forwarded via `rnspy:event`.

### Full Source Code

```js
// src/main/rnspyServer.js

import WebSocket from 'ws'
import os from 'os'

const DEFAULT_PORT = 8097

let wss = null
let currentPort = DEFAULT_PORT
let seq = 0
let clientSeq = 0
let sendToRenderer = null
const clients = new Set()

function getLanAddress() {
  try {
    const ifaces = os.networkInterfaces()
    const candidates = []
    for (const name of Object.keys(ifaces)) {
      for (const net of ifaces[name] || []) {
        const family = typeof net.family === 'string' ? net.family : `IPv${net.family}`
        if (family !== 'IPv4' || net.internal) continue
        candidates.push(net.address)
      }
    }
    const preferred = candidates.find((a) =>
      a.startsWith('192.168.') || a.startsWith('10.') || /^172\.(1[6-9]|2\d|3[01])\./.test(a),
    )
    return preferred || candidates[0] || 'localhost'
  } catch {
    return 'localhost'
  }
}

const MAX_LOGS = 500
const serverLogs = []

function pushLog(level, message) {
  const entry = { level, message, timestamp: Date.now() }
  serverLogs.push(entry)
  if (serverLogs.length > MAX_LOGS) serverLogs.splice(0, serverLogs.length - MAX_LOGS)
  if (sendToRenderer) sendToRenderer('rnspy:log', entry)
}

function buildStatus(extra) {
  return {
    running: !!wss,
    port: currentPort,
    address: getLanAddress(),
    clientCount: clients.size,
    clients: Array.from(clients).map((c) => ({
      id: c.__rnspyId || null,
      deviceId: c.__rnspyDeviceId || null,
      name: c.__rnspyName || null,
      platform: c.__rnspyPlatform || null,
    })),
    ...extra,
  }
}

function pushStatus(extra) {
  if (sendToRenderer) sendToRenderer('rnspy:status', buildStatus(extra))
}

function pushEvent(payload) {
  if (sendToRenderer) sendToRenderer('rnspy:event', payload)
}

export function startRnspyServer({ port = DEFAULT_PORT, send } = {}) {
  sendToRenderer = send || sendToRenderer
  const needsRestart = wss && port !== currentPort
  if (wss && !needsRestart) {
    return Promise.resolve({ ok: true, ...buildStatus() })
  }

  const boot = needsRestart ? stopRnspyServer() : Promise.resolve()

  return boot.then(
    () =>
      new Promise((resolve) => {
        currentPort = port
        let server
        try {
          server = new WebSocket.Server({ port })
        } catch (err) {
          pushLog('error', `Failed to start server on port ${port}: ${err?.message || err}`)
          resolve({ ok: false, reason: err?.message || 'failed-to-start' })
          return
        }

        const onListening = () => {
          wss = server
          server.off('error', onEarlyError)
          pushLog('info', `WebSocket server listening on ws://${getLanAddress()}:${port} (also ws://localhost:${port})`)
          pushStatus()
          resolve({ ok: true, ...buildStatus() })
        }

        const onEarlyError = (err) => {
          server.off('listening', onListening)
          try { server.close() } catch { /* noop */ }
          pushLog('error', `Server failed to bind port ${port}: ${err?.code || err?.message || 'listen-error'}`)
          resolve({ ok: false, reason: err?.code || err?.message || 'listen-error' })
        }

        server.once('listening', onListening)
        server.once('error', onEarlyError)

        server.on('connection', (socket, req) => {
          socket.__rnspyId = `client-${++clientSeq}`
          const remote = req?.socket?.remoteAddress || 'unknown'
          clients.add(socket)
          pushLog('info', `Client connected: ${socket.__rnspyId} from ${remote} (${clients.size} online)`)
          pushStatus()

          socket.on('message', (raw) => {
            let data
            try {
              data = JSON.parse(raw.toString())
            } catch {
              return
            }

            if (data && data.kind === 'hello') {
              if (data.deviceId) socket.__rnspyDeviceId = data.deviceId
              socket.__rnspyName = data.name || null
              socket.__rnspyPlatform = data.platform || null
              pushLog('info', `Client ${socket.__rnspyId} identified as "${data.name || 'unnamed'}"${data.platform ? ` (${data.platform})` : ''}`)
              pushStatus()
              return
            }

            if (data && data.deviceId && !socket.__rnspyDeviceId) {
              socket.__rnspyDeviceId = data.deviceId
            }

            pushEvent({
              ...data,
              seq: ++seq,
              deviceId: data.deviceId || socket.__rnspyDeviceId || null,
              clientId: socket.__rnspyId,
              clientName: socket.__rnspyName || null,
              clientPlatform: socket.__rnspyPlatform || null,
              receivedAt: data && data.timestamp ? data.timestamp : undefined,
            })
          })

          socket.on('close', () => {
            clients.delete(socket)
            pushLog('info', `Client disconnected: ${socket.__rnspyId} (${clients.size} online)`)
            pushStatus()
          })

          socket.on('error', (err) => {
            clients.delete(socket)
            pushLog('error', `Client ${socket.__rnspyId} socket error: ${err?.message || err}`)
            pushStatus()
          })
        })

        server.on('error', (err) => {
          pushLog('error', `Server error: ${err?.message || err}`)
        })
      })
  )
}

export function stopRnspyServer() {
  return new Promise((resolve) => {
    const server = wss
    clients.forEach((c) => { try { c.terminate() } catch { /* noop */ } })
    clients.clear()
    if (!server) {
      wss = null
      pushStatus()
      resolve()
      return
    }
    wss = null
    server.close(() => {
      pushLog('info', 'WebSocket server stopped')
      pushStatus()
      resolve()
    })
  })
}

export function getRnspyStatus() {
  return buildStatus()
}

export function getRnspyLogs() {
  return serverLogs.slice()
}

export function clearRnspyLogs() {
  serverLogs.length = 0
  return { ok: true }
}

export function disconnectRnspyClient(id) {
  for (const c of clients) {
    if (c.__rnspyId === id) {
      try { c.terminate() } catch { /* noop */ }
      clients.delete(c)
      pushLog('warn', `Client force-disconnected: ${id}`)
      pushStatus()
      return { ok: true, id }
    }
  }
  return { ok: false, reason: 'not-found' }
}
```

---

## 2. Main Process — IPC Registration

**File:** `src/main/index.js` (rnspy-related sections)

Registers six IPC handlers that bridge the renderer to `rnspyServer.js`. Also ensures the server is stopped on app quit.

```js
// src/main/index.js — imports
import { startRnspyServer, stopRnspyServer, getRnspyStatus, disconnectRnspyClient, getRnspyLogs, clearRnspyLogs } from './rnspyServer'

// Lifecycle hooks — stop the server when app closes
app.on('window-all-closed', () => {
  stopRnspyServer()
  // ...
})
app.on('before-quit', () => {
  stopRnspyServer()
})

// IPC bridge
function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload)
  }
}

ipcMain.handle('rnspy:start', (_event, opts) =>
  startRnspyServer({ port: opts?.port, send: sendToRenderer })
)
ipcMain.handle('rnspy:stop', () => stopRnspyServer())
ipcMain.handle('rnspy:status', () => getRnspyStatus())
ipcMain.handle('rnspy:disconnect-client', (_event, id) => disconnectRnspyClient(id))
ipcMain.handle('rnspy:get-logs', () => getRnspyLogs())
ipcMain.handle('rnspy:clear-logs', () => clearRnspyLogs())
```

### IPC Channel Summary

| Channel | Direction | Description |
|---------|-----------|-------------|
| `rnspy:start` | Renderer → Main | Start/restart WS server on specified port |
| `rnspy:stop` | Renderer → Main | Stop WS server and disconnect all clients |
| `rnspy:status` | Renderer → Main | Request current status snapshot |
| `rnspy:disconnect-client` | Renderer → Main | Force-disconnect a single client |
| `rnspy:get-logs` | Renderer → Main | Get server log buffer |
| `rnspy:clear-logs` | Renderer → Main | Clear server log buffer |
| `rnspy:event` | Main → Renderer | Push: individual RN event (console, network, ws) |
| `rnspy:status` | Main → Renderer | Push: server status change (connect/disconnect) |
| `rnspy:log` | Main → Renderer | Push: new server log entry |

---

## 3. Preload — Bridge API

**File:** `src/preload/index.js`

Exposes `window.electron.rnspy` to the renderer via `contextBridge.exposeInMainWorld`. This is the ONLY way the renderer communicates with the main process WS server.

```js
// src/preload/index.js — rnspy section

rnspy: {
  start: (opts) => ipcRenderer.invoke('rnspy:start', opts),
  stop: () => ipcRenderer.invoke('rnspy:stop'),
  getStatus: () => ipcRenderer.invoke('rnspy:status'),
  disconnectClient: (id) => ipcRenderer.invoke('rnspy:disconnect-client', id),
  getLogs: () => ipcRenderer.invoke('rnspy:get-logs'),
  clearLogs: () => ipcRenderer.invoke('rnspy:clear-logs'),
  onEvent: (callback) => {
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('rnspy:event', handler)
    return () => ipcRenderer.removeListener('rnspy:event', handler)
  },
  onStatus: (callback) => {
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('rnspy:status', handler)
    return () => ipcRenderer.removeListener('rnspy:status', handler)
  },
  onLog: (callback) => {
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('rnspy:log', handler)
    return () => ipcRenderer.removeListener('rnspy:log', handler)
  },
},
```

### API Surface

| Method | Type | Description |
|--------|------|-------------|
| `start(opts)` | Request/Response | Start server with `{ port }` |
| `stop()` | Request/Response | Stop server |
| `getStatus()` | Request/Response | Get current status |
| `disconnectClient(id)` | Request/Response | Force-disconnect client |
| `getLogs()` | Request/Response | Get log buffer |
| `clearLogs()` | Request/Response | Clear log buffer |
| `onEvent(cb)` | Push Stream | Subscribe to RN events (returns unsubscribe fn) |
| `onStatus(cb)` | Push Stream | Subscribe to status updates (returns unsubscribe fn) |
| `onLog(cb)` | Push Stream | Subscribe to server log entries (returns unsubscribe fn) |

---

## 4. Renderer — Core Hook (`useRnspyDevtools`)

**File:** `src/renderer/hooks/useRnspyDevtools.js`

The central React hook that owns the entire React Native Spy lifecycle in the renderer. It manages server start/stop, event accumulation into per-device buckets, persistence, and all state mutations.

### Key Behaviors

- **Availability Check:** Returns `{ available: false }` in web builds where `window.electron?.rnspy` doesn't exist.
- **Server Lifecycle:** Starts on mount via `rnspy.start({ port })`, stops on unmount.
- **Per-Device Grouping:** Events are grouped into a `Map<key, device>` where the key is `deviceId || clientName || clientId || 'unknown'`.
- **Network Merging:** Network requests keyed by `id` — `network-start` and `network` frames merge into one row (pending → done) via O(1) Map lookup.
- **WebSocket Tracking:** Per-connection frame arrays with open/close/error lifecycle.
- **Capped Buffers:** Per-device: 2000 console logs, 2000 network requests, 2000 WS frames per connection, 500 server logs.
- **Persistence:** Records → `sessionStorage` (survive reload, debounced 600ms). Hidden rules → `localStorage` (survive restart). Port → `localStorage`.

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `available` | `boolean` | Whether Electron rnspy API is present |
| `status` | `object` | `{ running, port, address, clientCount, clients }` |
| `port` | `number` | Current listening port |
| `setPort(n)` | `function` | Change port, persist, and restart server |
| `devices` | `array` | Per-device data with `online` flag |
| `hiddenRules` | `array` | `[{ match, hideRelated }]` |
| `addHiddenRule(rule)` | `function` | Add a filter rule |
| `removeHiddenRule(match)` | `function` | Remove a filter rule |
| `disconnectDevice(key)` | `function` | Disconnect all clients for a device |
| `disconnectClientById(id)` | `function` | Disconnect one client by server id |
| `closeDevice(key)` | `function` | Remove device tab and all records |
| `clearDevice(key)` | `function` | Clear device records, keep tab |
| `clearDeviceCategory(key, cat)` | `function` | Clear one category: `'network'`, `'websocket'`, `'console'` |
| `clear()` | `function` | Clear all devices and records |
| `serverLogs` | `array` | Server activity log entries |
| `clearServerLogs()` | `function` | Clear server logs (UI + main process) |

### Full Source Code

```js
// src/renderer/hooks/useRnspyDevtools.js

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const MAX_CONSOLE_LOGS = 2000
const MAX_NETWORK_REQUESTS = 2000
const MAX_SERVER_LOGS = 500
const MAX_WS_FRAMES = 2000
const DEFAULT_PORT = 8097
const PORT_STORAGE_KEY = 'rnspyDevtoolsPort'
const RECORDS_STORAGE_KEY = 'rnspyDevtoolsRecords'
const HIDDEN_RULES_KEY = 'rnspyDevtoolsHiddenRules'
const PERSIST_DEBOUNCE_MS = 600

function readStoredPort() {
  if (typeof window === 'undefined') return DEFAULT_PORT
  const raw = window.localStorage.getItem(PORT_STORAGE_KEY)
  const parsed = parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 && parsed < 65536 ? parsed : DEFAULT_PORT
}

function deviceKeyOf(payload) {
  return payload.deviceId || payload.clientName || payload.clientId || 'unknown'
}

function readHiddenRules() {
  if (typeof window === 'undefined') return []
  try {
    const arr = JSON.parse(window.localStorage.getItem(HIDDEN_RULES_KEY) || '[]')
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.match === 'string') : []
  } catch {
    return []
  }
}

function readStoredDevices() {
  const map = new Map()
  if (typeof window === 'undefined') return map
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(RECORDS_STORAGE_KEY) || '[]')
    if (!Array.isArray(raw)) return map
    for (const d of raw) {
      if (!d || !d.key) continue
      const networkMap = new Map()
      for (const r of Array.isArray(d.networkRequests) ? d.networkRequests : []) {
        if (r && r.id != null) networkMap.set(String(r.id), r)
      }
      const wsMap = new Map()
      for (const c of Array.isArray(d.wsConnections) ? d.wsConnections : []) {
        if (c && c.wsId != null) wsMap.set(String(c.wsId), { ...c, frames: Array.isArray(c.frames) ? c.frames : [] })
      }
      map.set(d.key, {
        key: d.key,
        name: d.name || null,
        platform: d.platform || null,
        networkMap,
        wsMap,
        consoleLogs: Array.isArray(d.consoleLogs) ? d.consoleLogs : [],
      })
    }
  } catch {
    /* ignore malformed cache */
  }
  return map
}

export function useRnspyDevtools() {
  const rnspy = typeof window !== 'undefined' ? window.electron?.rnspy : null
  const available = !!rnspy

  const [port, setPortState] = useState(readStoredPort)
  const [status, setStatus] = useState({
    running: false, clientCount: 0, port: readStoredPort(),
    address: 'localhost', clients: []
  })
  const [devices, setDevices] = useState([])
  const [hiddenRules, setHiddenRules] = useState(readHiddenRules)
  const [serverLogs, setServerLogs] = useState([])

  const devicesRef = useRef(null)
  if (devicesRef.current === null) devicesRef.current = readStoredDevices()

  const persistTimerRef = useRef(null)

  const schedulePersist = useCallback(() => {
    if (typeof window === 'undefined') return
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null
      try {
        const serial = Array.from(devicesRef.current.values()).map((d) => ({
          key: d.key, name: d.name, platform: d.platform,
          networkRequests: Array.from(d.networkMap.values()),
          wsConnections: Array.from(d.wsMap.values()),
          consoleLogs: d.consoleLogs,
        }))
        window.sessionStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(serial))
      } catch { /* quota exceeded — non-fatal */ }
    }, PERSIST_DEBOUNCE_MS)
  }, [])

  const rebuildDevices = useCallback(() => {
    const arr = Array.from(devicesRef.current.values()).map((d) => ({
      key: d.key, name: d.name, platform: d.platform,
      networkRequests: Array.from(d.networkMap.values()),
      wsConnections: Array.from(d.wsMap.values()),
      consoleLogs: d.consoleLogs,
    }))
    setDevices(arr)
    schedulePersist()
  }, [schedulePersist])

  const ensureDevice = useCallback((payload) => {
    const key = deviceKeyOf(payload)
    let dev = devicesRef.current.get(key)
    if (!dev) {
      dev = { key, name: payload.clientName || null, platform: payload.clientPlatform || null,
              networkMap: new Map(), wsMap: new Map(), consoleLogs: [] }
      devicesRef.current.set(key, dev)
    } else {
      if (payload.clientName) dev.name = payload.clientName
      if (payload.clientPlatform) dev.platform = payload.clientPlatform
    }
    return dev
  }, [])

  const startOnPort = useCallback((nextPort) => {
    if (!rnspy) return
    rnspy.start({ port: nextPort }).then((res) => {
      if (res && res.ok) {
        setStatus((s) => ({ ...s, running: true, port: nextPort,
          clientCount: res.clientCount ?? s.clientCount, clients: res.clients ?? s.clients }))
      } else {
        setStatus((s) => ({ ...s, running: false, port: nextPort,
          error: res?.reason || 'failed-to-start' }))
      }
    })
  }, [rnspy])

  useEffect(() => {
    if (!rnspy) return undefined
    startOnPort(port)

    const offEvent = rnspy.onEvent((payload) => {
      if (!payload || !payload.kind) return

      if (payload.kind === 'console') {
        const dev = ensureDevice(payload)
        const logs = dev.consoleLogs
        logs.push({
          id: payload.id || `seq-${payload.seq}`,
          seq: payload.seq,
          level: payload.level || 'log',
          args: Array.isArray(payload.args) ? payload.args : [payload.args],
          timestamp: payload.timestamp || payload.receivedAt || Date.now(),
        })
        if (logs.length > MAX_CONSOLE_LOGS) logs.splice(0, logs.length - MAX_CONSOLE_LOGS)
        rebuildDevices()
        return
      }

      if (payload.kind === 'network-start' || payload.kind === 'network') {
        const dev = ensureDevice(payload)
        const map = dev.networkMap
        const id = payload.id != null ? String(payload.id) : `seq-${payload.seq}`
        const existing = map.get(id) || {}
        const merged = {
          ...existing, ...payload, id,
          seq: payload.seq ?? existing.seq,
          pending: payload.kind === 'network-start' && existing.status == null,
        }
        if (payload.kind === 'network') merged.pending = false
        map.set(id, merged)
        if (map.size > MAX_NETWORK_REQUESTS) {
          const oldestKey = map.keys().next().value
          map.delete(oldestKey)
        }
        rebuildDevices()
        return
      }

      if (payload.kind === 'ws-open') {
        const dev = ensureDevice(payload)
        const id = String(payload.wsId || `seq-${payload.seq}`)
        if (!dev.wsMap.has(id)) {
          dev.wsMap.set(id, {
            wsId: id, url: payload.url || '', protocols: payload.protocols || null,
            status: 'open', startTime: payload.startTime || payload.timestamp,
            seq: payload.seq, frames: [],
          })
          if (dev.wsMap.size > MAX_NETWORK_REQUESTS) {
            const oldestKey = dev.wsMap.keys().next().value
            dev.wsMap.delete(oldestKey)
          }
        }
        rebuildDevices()
        return
      }

      if (payload.kind === 'ws-frame') {
        const dev = ensureDevice(payload)
        const id = String(payload.wsId || `seq-${payload.seq}`)
        let conn = dev.wsMap.get(id)
        if (!conn) {
          conn = { wsId: id, url: payload.url || '', protocols: null,
                   status: 'open', startTime: payload.timestamp, seq: payload.seq, frames: [] }
          dev.wsMap.set(id, conn)
        }
        conn.frames.push({
          dir: payload.dir === 'send' ? 'send' : 'recv',
          data: payload.data,
          size: payload.size ?? (typeof payload.data === 'string' ? payload.data.length : 0),
          timestamp: payload.timestamp || Date.now(),
        })
        if (conn.frames.length > MAX_WS_FRAMES)
          conn.frames.splice(0, conn.frames.length - MAX_WS_FRAMES)
        rebuildDevices()
        return
      }

      if (payload.kind === 'ws-close' || payload.kind === 'ws-error') {
        const dev = ensureDevice(payload)
        const id = String(payload.wsId || `seq-${payload.seq}`)
        const conn = dev.wsMap.get(id)
        if (conn) {
          conn.status = payload.kind === 'ws-error' ? 'error' : 'closed'
          if (payload.kind === 'ws-close') {
            conn.closeCode = payload.code
            conn.closeReason = payload.reason || ''
            conn.endTime = payload.endTime || payload.timestamp
          }
          rebuildDevices()
        }
        return
      }
    })

    const offStatus = rnspy.onStatus((payload) => {
      if (payload) setStatus((s) => ({ ...s, ...payload }))
    })

    if (rnspy.getLogs) {
      rnspy.getLogs().then((logs) => {
        if (Array.isArray(logs)) setServerLogs(logs.slice(-MAX_SERVER_LOGS))
      })
    }
    const offLog = rnspy.onLog
      ? rnspy.onLog((entry) => {
          if (!entry) return
          setServerLogs((prev) => {
            const next = prev.concat(entry)
            if (next.length > MAX_SERVER_LOGS) next.splice(0, next.length - MAX_SERVER_LOGS)
            return next
          })
        })
      : null

    return () => {
      offEvent && offEvent()
      offStatus && offStatus()
      offLog && offLog()
      rnspy.stop()
    }
  }, [rnspy])

  const onlineKeys = useMemo(() => {
    const set = new Set()
    for (const c of status.clients || [])
      set.add(c.deviceId || c.name || c.id || 'unknown')
    return set
  }, [status.clients])

  const devicesView = useMemo(
    () => devices.map((d) => ({ ...d, online: onlineKeys.has(d.key) })),
    [devices, onlineKeys]
  )

  const setPort = useCallback((nextPort) => {
    const parsed = parseInt(nextPort, 10)
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 65536) return
    setPortState(parsed)
    if (typeof window !== 'undefined')
      window.localStorage.setItem(PORT_STORAGE_KEY, String(parsed))
    startOnPort(parsed)
  }, [startOnPort])

  const disconnectClientById = useCallback((id) => {
    if (rnspy?.disconnectClient) rnspy.disconnectClient(id)
  }, [rnspy])

  const disconnectDevice = useCallback((key) => {
    if (!rnspy?.disconnectClient) return
    for (const c of status.clients || []) {
      if ((c.deviceId || c.name || c.id || 'unknown') === key)
        rnspy.disconnectClient(c.id)
    }
  }, [rnspy, status.clients])

  const closeDevice = useCallback((key) => {
    devicesRef.current.delete(key)
    rebuildDevices()
  }, [rebuildDevices])

  const clearDevice = useCallback((key) => {
    const dev = devicesRef.current.get(key)
    if (!dev) return
    dev.networkMap.clear()
    dev.wsMap.clear()
    dev.consoleLogs = []
    rebuildDevices()
  }, [rebuildDevices])

  const clearDeviceCategory = useCallback((key, category) => {
    const dev = devicesRef.current.get(key)
    if (!dev) return
    if (category === 'network') dev.networkMap.clear()
    else if (category === 'websocket') dev.wsMap.clear()
    else if (category === 'console') dev.consoleLogs = []
    else return
    rebuildDevices()
  }, [rebuildDevices])

  const clear = useCallback(() => {
    devicesRef.current.clear()
    rebuildDevices()
  }, [rebuildDevices])

  const clearServerLogs = useCallback(() => {
    setServerLogs([])
    if (rnspy?.clearLogs) rnspy.clearLogs()
  }, [rnspy])

  const writeHiddenRules = useCallback((rules) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HIDDEN_RULES_KEY, JSON.stringify(rules))
    }
  }, [])

  const addHiddenRule = useCallback((rule) => {
    if (!rule || !rule.match) return
    setHiddenRules((prev) => {
      const match = String(rule.match)
      const next = prev.filter((r) => r.match !== match)
        .concat({ match, hideRelated: !!rule.hideRelated })
      writeHiddenRules(next)
      return next
    })
  }, [writeHiddenRules])

  const removeHiddenRule = useCallback((match) => {
    setHiddenRules((prev) => {
      const next = prev.filter((r) => r.match !== match)
      writeHiddenRules(next)
      return next
    })
  }, [writeHiddenRules])

  return {
    available, status, port, setPort, devices: devicesView,
    hiddenRules, addHiddenRule, removeHiddenRule,
    disconnectDevice, disconnectClientById,
    closeDevice, clearDevice, clearDeviceCategory, clear,
    serverLogs, clearServerLogs,
  }
}

export default useRnspyDevtools
```

---

## 5. Renderer — Main Page Shell (`RnspyDevtoolsPage`)

**File:** `src/renderer/components/rnspy-devtools/RnspyDevtoolsPage.jsx`

The top-level page component and main shell. It renders:

- **Header bar:** Connection status pill (green/yellow/red), editable port input, tab switcher (Network / WebSocket / Console / Logs with counts), Settings button.
- **Device tabs:** `DeviceTabs` strip below header.
- **Body:** Switches between `NetworkTab`, `WebSocketTab`, `ConsoleTab`, or `LogsTab`. Shows `ConnectSnippet` empty state when no device is active.
- **Settings overlay:** `RnspySettingsModal` when settings are open.
- **Web fallback:** "Desktop only" notice when `window.electron` is absent.

Also includes two internal components:
- `AddressPill` — copyable `ws://host:port` badge (currently commented out).
- `ConnectSnippet` — empty state with instructions and the RN client SDK code block.

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/RnspyDevtoolsPage.jsx

import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, Server, Settings, Smartphone } from 'lucide-react'

import { BTN_BASE } from '../../styles/shared'
import ConsoleTab from './ConsoleTab'
import DeviceTabs from './DeviceTabs'
import LogsTab from './LogsTab'
import NetworkTab from './NetworkTab'
import WebSocketTab from './WebSocketTab'
import RnspySettingsModal from './RnspySettingsModal'
import { buildRnClient } from './rnClient'
import { useRnspyDevtools } from '../../hooks/useRnspyDevtools'

export default function RnspyDevtoolsPage() {
  const {
    available, status, port, setPort,
    devices, hiddenRules, addHiddenRule, removeHiddenRule,
    disconnectClientById, closeDevice, clearDeviceCategory,
    serverLogs, clearServerLogs,
  } = useRnspyDevtools()
  const [tab, setTab] = useState('network')
  const [portDraft, setPortDraft] = useState(String(port))
  const [activeKey, setActiveKey] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const reconcile = () => {
      if (!devices.length) {
        if (activeKey !== null) setActiveKey(null)
        return
      }
      if (!activeKey || !devices.some((d) => d.key === activeKey)) {
        setActiveKey(devices[0].key)
      }
    }
    reconcile()
  }, [devices, activeKey])

  const activeDevice = useMemo(
    () => devices.find((d) => d.key === activeKey) || null,
    [devices, activeKey]
  )

  if (!available) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10, background: 'var(--bg-base)', height: '100%',
        color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
      }}>
        <Smartphone size={32} style={{ opacity: 0.4 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>Desktop only</div>
        <div style={{ fontSize: 13, maxWidth: 360, textAlign: 'center' }}>
          React Native Spy needs the Electron desktop app — its WebSocket server
          can't run in the browser build.
        </div>
      </div>
    )
  }

  const connected = status.clientCount > 0
  const running = status.running
  const address = status.address || 'localhost'
  const pillColor = connected ? 'var(--green)' : running ? 'var(--yellow)' : 'var(--red)'
  const pillText = connected
    ? `Connected${status.clientCount > 1 ? ` (${status.clientCount})` : ''}`
    : running ? 'Waiting' : 'Disconnected'

  const commitPort = () => {
    const parsed = parseInt(portDraft, 10)
    if (Number.isFinite(parsed) && parsed !== port) setPort(parsed)
    else setPortDraft(String(port))
  }

  const TAB_LABELS = { network: 'Network', websocket: 'WebSocket', console: 'Console', logs: 'Logs' }

  const clearActiveTab = (key) => {
    if (tab === 'logs') clearServerLogs()
    else clearDeviceCategory(key, tab)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 14px', minHeight: 52,
        borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0,
      }}>
        {/* Connection status pill */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
          padding: '3px 9px', borderRadius: 12,
          background: pillColor + '1a', color: pillColor,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: pillColor }} />
          {pillText}
        </span>

        {/* Port editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 2 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Port</span>
          <input
            value={portDraft}
            onChange={(e) => setPortDraft(e.target.value.replace(/[^0-9]/g, ''))}
            onBlur={commitPort}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
            style={{
              width: 64, height: 28, padding: '0 8px', borderRadius: 6,
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
          />
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex', height: 30, marginLeft: 6,
          border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden',
        }}>
          {[
            { key: 'network', label: `Network${activeDevice?.networkRequests.length ? ` (${activeDevice.networkRequests.length})` : ''}` },
            { key: 'websocket', label: `WebSocket${activeDevice?.wsConnections?.length ? ` (${activeDevice.wsConnections.length})` : ''}` },
            { key: 'console', label: `Console${activeDevice?.consoleLogs.length ? ` (${activeDevice.consoleLogs.length})` : ''}` },
            { key: 'logs', label: `Logs${serverLogs.length ? ` (${serverLogs.length})` : ''}` },
          ].map((t, idx) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '0 14px', height: '100%', border: 'none',
                  borderLeft: idx === 0 ? 'none' : '1px solid var(--border)',
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-ui)',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setSettingsOpen(true)}
          style={{ ...BTN_BASE, height: 30, padding: '0 12px' }}
          title="DevTools settings"
        >
          <Settings size={13} /> Settings
        </button>
      </div>

      {/* Device tabs */}
      <DeviceTabs
        devices={devices}
        activeKey={activeKey}
        activeTabLabel={TAB_LABELS[tab]}
        onSelect={setActiveKey}
        onClearActive={clearActiveTab}
        onClose={closeDevice}
      />

      {/* Body */}
      {tab === 'logs' ? (
        <LogsTab logs={serverLogs} onClear={clearServerLogs} />
      ) : !activeDevice ? (
        <ConnectSnippet host={address} port={port} />
      ) : tab === 'network' ? (
        <NetworkTab
          requests={activeDevice.networkRequests}
          hiddenRules={hiddenRules}
          onHideName={addHiddenRule}
        />
      ) : tab === 'websocket' ? (
        <WebSocketTab connections={activeDevice.wsConnections || []} />
      ) : (
        <ConsoleTab logs={activeDevice.consoleLogs} />
      )}

      {settingsOpen && (
        <RnspySettingsModal
          clients={status.clients || []}
          hiddenRules={hiddenRules}
          onDisconnect={disconnectClientById}
          onAddRule={addHiddenRule}
          onRemoveRule={removeHiddenRule}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

function ConnectSnippet({ host, port }) {
  const [copied, setCopied] = useState(false)
  const snippet = useMemo(() => buildRnClient({ host, port }), [host, port])

  const copy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 720, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Smartphone size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700,
                       fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Connect your app
          </h2>
        </div>
        <p style={{ margin: '0 0 18px', fontSize: 13, lineHeight: 1.6,
                    color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
          Paste the snippet below near the top of your React Native entry file...
        </p>
        {/* Code block with Copy button */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 10,
                      overflow: 'hidden', background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', padding: '8px 12px',
                        borderBottom: '1px solid var(--border)' }}>
            <span>React Native client</span>
            <button onClick={copy}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{ margin: 0, padding: 14, maxHeight: 380, overflow: 'auto',
                        fontSize: 11, lineHeight: 1.5,
                        fontFamily: 'var(--font-mono)' }}>
            {snippet}
          </pre>
        </div>
      </div>
    </div>
  )
}
```

---

## 6. Renderer — Device Tabs

**File:** `src/renderer/components/rnspy-devtools/DeviceTabs.jsx`

A horizontal tab strip showing one tab per connected (or previously-connected) device.

### Features

- Online status dot (green = connected, gray = disconnected)
- Device name from the `hello` frame
- Network request count badge
- Clear button (eraser icon) — clears the active content tab's data for that device
- Close button (X) — removes the tab and all recorded data
- Tooltip with platform info
- Horizontally scrollable

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/DeviceTabs.jsx

import { Eraser, X } from 'lucide-react'

export default function DeviceTabs({ devices, activeKey, activeTabLabel, onSelect, onClearActive, onClose }) {
  if (!devices.length) return null

  return (
    <div style={stripStyle}>
      {devices.map((d) => {
        const active = d.key === activeKey
        const label = d.name || d.key
        return (
          <div
            key={d.key}
            onClick={() => onSelect(d.key)}
            title={d.platform ? `${label} · ${d.platform}` : label}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0 8px 0 10px', height: 30, cursor: 'pointer',
              borderRight: '1px solid var(--border)',
              background: active ? 'var(--bg-base)' : 'transparent',
              borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
              flexShrink: 0, maxWidth: 220,
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: d.online ? 'var(--green)' : 'var(--text-muted)',
            }} />
            <span style={{
              fontSize: 12, fontWeight: active ? 700 : 600,
              fontFamily: 'var(--font-ui)',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
              padding: '1px 5px', borderRadius: 4, background: 'var(--bg-elevated)',
            }}>
              {d.networkRequests.length}
            </span>
            {onClearActive && (
              <button
                onClick={(e) => { e.stopPropagation(); onClearActive(d.key) }}
                title={activeTabLabel ? `Clear ${activeTabLabel}` : 'Clear'}
                style={{
                  border: 'none', background: 'transparent', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 3, flexShrink: 0,
                }}
              >
                <Eraser size={12} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(d.key) }}
              title="Close tab"
              style={{
                border: 'none', background: 'transparent', color: 'var(--text-muted)',
                cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 3, flexShrink: 0,
              }}
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

const stripStyle = {
  display: 'flex', alignItems: 'stretch', flexShrink: 0,
  borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)',
  overflowX: 'auto', overflowY: 'hidden',
}
```

---

## 7. Renderer — Network Tab

**File:** `src/renderer/components/rnspy-devtools/NetworkTab.jsx`

A virtualized HTTP request list on the left and a detail panel on the right.

### Features

- **Virtualized list:** Uses `useVirtualRows` from `../../hooks/useVirtualRows` (30px row height)
- **Columns:** Method, URL, Status, Size, Time
- **Color coding:** Methods (GET=green, POST=orange), status codes (2xx=green, 4xx=yellow, 5xx=red)
- **Filtering:** Drops requests matching `hiddenRules` via `isRequestHidden`
- **Sorting:** Newest-first (by server `seq`, then `startTime`)
- **Detail panel:** General info, Request/Response Headers, Request/Response Body (pretty-printed JSON)
- **Right-click context menu:** Copy as cURL, Copy as fetch(), Copy URL, Copy response body, Copy request headers, Hide by name, Hide all related

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/NetworkTab.jsx

import { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowDownUp, EyeOff, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { useVirtualRows } from '../../hooks/useVirtualRows'
import CursorMenu, { MenuItem, MenuDivider } from './CursorMenu'
import { toCurl, toFetch, prettyBody, copyText } from '../../utils/curl'
import { requestName, isRequestHidden } from '../../utils/requestFilters'

const ROW_HEIGHT = 30

function statusColor(status, pending) {
  if (pending) return 'var(--text-muted)'
  if (status == null || status === 0) return 'var(--red)'
  if (status >= 500) return 'var(--red)'
  if (status >= 400) return 'var(--yellow)'
  if (status >= 300) return 'var(--cyan)'
  if (status >= 200) return 'var(--green)'
  return 'var(--text-secondary)'
}

function methodColor(method) {
  const m = (method || 'GET').toUpperCase()
  if (m === 'GET') return 'var(--method-get)'
  if (m === 'POST') return 'var(--method-post)'
  if (m === 'PUT' || m === 'PATCH') return 'var(--method-put)'
  if (m === 'DELETE') return 'var(--method-delete)'
  return 'var(--text-secondary)'
}

function formatSize(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(ms) {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function shortUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    return (u.pathname + u.search) || url
  } catch {
    return url
  }
}

export default function NetworkTab({ requests, hiddenRules = [], onHideName }) {
  const [selectedId, setSelectedId] = useState(null)
  const [menu, setMenu] = useState(null)
  const scrollRef = useRef(null)

  const sorted = useMemo(() => {
    const visible = requests.filter((r) => !isRequestHidden(r, hiddenRules))
    return visible.sort((a, b) => (b.seq ?? 0) - (a.seq ?? 0) || (b.startTime ?? 0) - (a.startTime ?? 0))
  }, [requests, hiddenRules])

  const hiddenCount = requests.length - sorted.length

  const selected = useMemo(
    () => sorted.find((r) => r.id === selectedId) || null,
    [sorted, selectedId]
  )

  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef, totalRows: sorted.length, rowHeight: ROW_HEIGHT,
  })

  const openMenu = useCallback((e, req) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, req })
  }, [])

  const closeMenu = useCallback(() => setMenu(null), [])

  const copyAnd = useCallback((text, label) => {
    copyText(text).then((ok) => { if (ok) toast.success(label) })
    setMenu(null)
  }, [])

  if (!requests.length) {
    return (
      <div style={emptyStyle}>
        <ArrowDownUp size={28} style={{ opacity: 0.4 }} />
        <div>No network requests yet.</div>
        <div style={{ fontSize: 12 }}>Requests from this device will appear here.</div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* Request list */}
      <div style={{ flex: selected ? '0 0 55%' : 1, minWidth: 0, display: 'flex',
                    flexDirection: 'column',
                    borderRight: selected ? '1px solid var(--border)' : 'none' }}>
        {hiddenCount > 0 && (
          <div style={hiddenBarStyle}>
            <EyeOff size={11} />
            <span>{hiddenCount} request{hiddenCount === 1 ? '' : 's'} hidden by your filters</span>
          </div>
        )}
        <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12,
                          fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr>
                {['Method', 'URL', 'Status', 'Size', 'Time'].map((h) => (
                  <th key={h} style={headStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSpacer > 0 && <tr style={{ height: topSpacer }}><td colSpan={5} /></tr>}
              {sorted.slice(startIdx, endIdx).map((r) => {
                const isSelected = r.id === selectedId
                return (
                  <tr key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    onContextMenu={(e) => openMenu(e, r)}
                    style={{ cursor: 'pointer', height: ROW_HEIGHT,
                             background: isSelected ? 'var(--bg-active)' : 'transparent' }}>
                    <td style={{ ...cellStyle, color: methodColor(r.method), fontWeight: 700 }}>
                      {(r.method || 'GET').toUpperCase()}
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--text-secondary)', maxWidth: 320 }}
                        title={r.url}>
                      {shortUrl(r.url)}
                    </td>
                    <td style={{ ...cellStyle, color: statusColor(r.status, r.pending), fontWeight: 700 }}>
                      {r.pending ? 'pending' : (r.status || 'failed')}
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--text-muted)' }}>{formatSize(r.size)}</td>
                    <td style={{ ...cellStyle, color: 'var(--text-muted)' }}>{formatDuration(r.duration)}</td>
                  </tr>
                )
              })}
              {bottomSpacer > 0 && <tr style={{ height: bottomSpacer }}><td colSpan={5} /></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex',
                      flexDirection: 'column' }}>
          {/* Detail header + sections (General, Headers, Bodies) */}
          {/* ... (full implementation in source) */}
        </div>
      )}

      {/* Right-click context menu */}
      {menu && (
        <CursorMenu anchor={{ x: menu.x, y: menu.y }} onClose={closeMenu}>
          <MenuItem label="Copy as cURL"
            onClick={() => copyAnd(toCurl(menu.req), 'Copied cURL')} />
          <MenuItem label="Copy as fetch"
            onClick={() => copyAnd(toFetch(menu.req), 'Copied fetch()')} />
          <MenuItem label="Copy URL"
            onClick={() => copyAnd(menu.req.url || '', 'Copied URL')} />
          <MenuItem label="Copy response body"
            onClick={() => copyAnd(prettyBody(menu.req.responseBody), 'Copied response')} />
          <MenuItem label="Copy request headers"
            onClick={() => copyAnd(JSON.stringify(menu.req.requestHeaders || {}, null, 2), 'Copied headers')} />
          <MenuDivider />
          <MenuItem icon={<EyeOff size={13} />}
            label={`Hide "${requestName(menu.req.url)}"`}
            onClick={() => {
              onHideName?.({ match: requestName(menu.req.url), hideRelated: false })
              setMenu(null)
            }} />
          <MenuItem icon={<EyeOff size={13} />}
            label={`Hide all related to "${requestName(menu.req.url)}"`}
            onClick={() => {
              onHideName?.({ match: requestName(menu.req.url), hideRelated: true })
              setMenu(null)
            }} />
        </CursorMenu>
      )}
    </div>
  )
}
```

---

## 8. Renderer — WebSocket Tab

**File:** `src/renderer/components/rnspy-devtools/WebSocketTab.jsx`

A connection list on the left (38% width) and a frame stream on the right.

### Features

- **Connection list:** Status dot (green=open, red=error, gray=closed), URL path, status label, frame count
- **Frame stream:** Direction arrow (↑ send, ↓ receive), timestamp, data content, size
- **SignalR awareness:** Detects `{"type":6}` pings and `{}` handshake responses (with 0x1E record separator), hides them by default with a "Hide pings/keepalive" checkbox
- **SignalR message splitting:** 0x1E-delimited messages are split and displayed with visual dividers (`―――`)
- **Text filter** for frames
- **Auto-scroll** (pauses when user scrolls up, 40px threshold)

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/WebSocketTab.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Radio, X } from 'lucide-react'
import { prettyBody } from '../../utils/curl'

function shortUrl(url) { /* ... */ }
function statusColor(status) { /* ... */ }
function formatTime(ts) { /* ... */ }
function formatSize(bytes) { /* ... */ }

const RECORD_SEP = '\x1e'
function isPingFrame(data) {
  if (typeof data !== 'string') return false
  const clean = data.split(RECORD_SEP).join('').trim()
  if (clean === '{"type":6}') return true
  if (clean === '{}') return true
  return false
}

function displayData(data) {
  if (typeof data !== 'string') return prettyBody(data)
  if (data.indexOf(RECORD_SEP) === -1) return prettyBody(data)
  return data.split(RECORD_SEP).filter((s) => s.length)
    .map((s) => prettyBody(s)).join('\n―――\n')
}

export default function WebSocketTab({ connections }) {
  const [selectedId, setSelectedId] = useState(null)
  const [hidePings, setHidePings] = useState(true)
  const [search, setSearch] = useState('')
  const framesRef = useRef(null)
  const stickRef = useRef(true)

  const sorted = useMemo(
    () => connections.slice().sort((a, b) =>
      (b.seq ?? 0) - (a.seq ?? 0) || (b.startTime ?? 0) - (a.startTime ?? 0)),
    [connections]
  )

  const selected = useMemo(
    () => sorted.find((c) => c.wsId === selectedId) || sorted[0] || null,
    [sorted, selectedId]
  )

  const frames = useMemo(() => {
    const all = selected?.frames || []
    const q = search.trim().toLowerCase()
    return all.filter((f) => {
      if (hidePings && isPingFrame(f.data)) return false
      if (q && !String(f.data).toLowerCase().includes(q)) return false
      return true
    })
  }, [selected, hidePings, search])

  // Auto-stick + scroll handlers...

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* Connection list (38%) */}
      {/* Frame stream */}
    </div>
  )
}
```

---

## 9. Renderer — Console Tab

**File:** `src/renderer/components/rnspy-devtools/ConsoleTab.jsx`

A scrolling log stream mirroring the connected RN app's `console.*` output.

### Features

- **Level filter chips:** log, info, warn, error, debug — each toggleable with per-level counts
- **Color coding:** red for error, yellow for warn, cyan for info, purple for debug
- **Text search box** for filtering
- **Auto-scroll** (pauses when user scrolls up, 24px threshold)
- **Background tint:** Red for error rows, yellow for warn rows
- **Timestamp:** HH:MM:SS.mmm format

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/ConsoleTab.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Terminal } from 'lucide-react'

const LEVELS = ['log', 'info', 'warn', 'error', 'debug']

function levelColor(level) {
  switch (level) {
    case 'error': return 'var(--red)'
    case 'warn': return 'var(--yellow)'
    case 'info': return 'var(--cyan)'
    case 'debug': return 'var(--method-put)'
    default: return 'var(--text-secondary)'
  }
}

function formatTime(ts) { /* HH:MM:SS.mmm */ }

function renderArg(arg) {
  if (arg == null) return String(arg)
  if (typeof arg === 'object') {
    try { return JSON.stringify(arg) } catch { return String(arg) }
  }
  return String(arg)
}

export default function ConsoleTab({ logs }) {
  const [activeLevels, setActiveLevels] = useState(() => new Set(LEVELS))
  const [search, setSearch] = useState('')
  const scrollRef = useRef(null)
  const stickRef = useRef(true)

  const toggleLevel = (level) => { /* toggle set */ }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return logs.filter((log) => {
      if (!activeLevels.has(log.level)) return false
      if (!q) return true
      const text = log.args.map(renderArg).join(' ').toLowerCase()
      return text.includes(q)
    })
  }, [logs, activeLevels, search])

  // Auto-scroll effect...

  const counts = useMemo(() => {
    const c = {}
    for (const level of LEVELS) c[level] = 0
    for (const log of logs) if (c[log.level] != null) c[log.level] += 1
    return c
  }, [logs])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Filter toolbar with level chips + search */}
      {/* Log stream */}
    </div>
  )
}
```

---

## 10. Renderer — Logs Tab

**File:** `src/renderer/components/rnspy-devtools/LogsTab.jsx`

The raw WebSocket server activity log streamed from the main process (connection events, disconnections, errors, lifecycle).

### Features

- **Level filter chips:** info, warn, error with counts
- **Text search filter**
- **Auto-scroll** with scroll-away pause (40px threshold)
- **Clear button** — wipes both UI state and main-process buffer
- **Empty state:** Server icon with "No server logs yet"

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/LogsTab.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Server, Trash2 } from 'lucide-react'

const LEVELS = ['info', 'warn', 'error']

function levelColor(level) {
  switch (level) {
    case 'error': return 'var(--red)'
    case 'warn': return 'var(--yellow)'
    default: return 'var(--cyan)'
  }
}

export default function LogsTab({ logs, onClear }) {
  const [activeLevels, setActiveLevels] = useState(() => new Set(LEVELS))
  const [search, setSearch] = useState('')
  const scrollRef = useRef(null)
  const stickRef = useRef(true)

  // Level toggle, count, filter, auto-scroll logic...

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Toolbar: level chips + search + Clear button */}
      {/* Log stream */}
    </div>
  )
}
```

---

## 11. Renderer — Settings Modal

**File:** `src/renderer/components/rnspy-devtools/RnspySettingsModal.jsx`

A modal dialog with two sections:

1. **Connected devices:** Lists live WebSocket clients with name, platform badge, and a "Disconnect" button.
2. **Hidden requests:** Shows persisted filter rules. Users can add rules by name or URL fragment, with an "All related" checkbox for substring matching. Rules persist via localStorage.

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/RnspySettingsModal.jsx

import { useState } from 'react'
import { EyeOff, Plug, Plus, Settings2, Trash2, X } from 'lucide-react'

export default function RnspySettingsModal({
  clients = [], hiddenRules = [],
  onDisconnect, onAddRule, onRemoveRule, onClose
}) {
  const [draft, setDraft] = useState('')
  const [related, setRelated] = useState(false)

  const addRule = () => {
    const match = draft.trim()
    if (!match) return
    onAddRule?.({ match, hideRelated: related })
    setDraft('')
    setRelated(false)
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header: "DevTools Settings" + close button */}
        {/* Body: Connected devices list + Hidden requests list with add form */}
        {/* Footer: rule count, online count, Done button */}
      </div>
    </div>
  )
}
```

---

## 12. Renderer — Context Menu (`CursorMenu`)

**File:** `src/renderer/components/rnspy-devtools/CursorMenu.jsx`

A generic right-click context menu rendered via React portal at an arbitrary viewport point.

### Features

- Positions at cursor coordinates with flip logic to stay within viewport
- Closes on: outside click, Escape key, scroll, resize, another contextmenu event
- Three exported components:
  - `CursorMenu` — the portal-rendered menu container
  - `MenuItem` — a single clickable row (icon, label, hint, danger, disabled)
  - `MenuDivider` — a thin horizontal separator

### Full Source Code

```jsx
// src/renderer/components/rnspy-devtools/CursorMenu.jsx

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function CursorMenu({ anchor, onClose, children }) {
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    if (!anchor) return
    const el = menuRef.current
    const w = el?.offsetWidth || 220
    const h = el?.offsetHeight || 240
    const pad = 8
    let left = anchor.x
    let top = anchor.y
    if (left + w + pad > window.innerWidth) left = Math.max(pad, window.innerWidth - w - pad)
    if (top + h + pad > window.innerHeight) top = Math.max(pad, window.innerHeight - h - pad)
    setPos({ top, left })
  }, [anchor])

  useEffect(() => {
    if (!anchor) return undefined
    const onDown = (e) => { if (!menuRef.current?.contains(e.target)) onClose() }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onClose)
    window.addEventListener('scroll', onClose, true)
    document.addEventListener('contextmenu', onDown)
    return () => { /* cleanup listeners */ }
  }, [anchor, onClose])

  if (!anchor) return null

  return createPortal(
    <div ref={menuRef} style={{ position: 'fixed', top: pos?.top, left: pos?.left,
         zIndex: 1300, minWidth: 200, padding: 4, borderRadius: 8,
         border: '1px solid var(--border)', background: 'var(--bg-surface)',
         boxShadow: 'var(--shadow-lg)' }}>
      {children}
    </div>,
    document.body,
  )
}

export function MenuItem({ icon, label, onClick, danger, disabled, hint }) {
  const [hover, setHover] = useState(false)
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%',
               padding: '7px 9px', border: 'none', borderRadius: 5,
               background: hover && !disabled ? 'var(--bg-hover)' : 'transparent',
               color: disabled ? 'var(--text-muted)' : danger ? 'var(--red)' : 'var(--text-secondary)',
               fontSize: 12, fontWeight: 600, cursor: disabled ? 'default' : 'pointer' }}>
      {icon && <span style={{ display: 'flex', flexShrink: 0, width: 14 }}>{icon}</span>}
      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{label}</span>
      {hint && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{hint}</span>}
    </button>
  )
}

export function MenuDivider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '4px 2px' }} />
}
```

---

## 13. Renderer — React Native Client SDK

**File:** `src/renderer/components/rnspy-devtools/rnClient.js`

Contains the React Native client SDK as a template string. This is the code that RN developers paste into their app. It is NOT executed in the desktop app — it's displayed in a code block with a "Copy" button.

### What the SDK Does

1. **Gate:** Wraps everything in `if (__DEV__)` — never ships to production.
2. **Device Identity:** Generates a stable `deviceId` using `react-native-device-info`'s `getUniqueIdSync()` (persists across restarts), falling back to random ID.
3. **Human-Readable Name:** Resolves device name and platform from `react-native-device-info` + `Platform`.
4. **Patches `console.*`:** Wraps all 5 levels. Serializes args safely. Emits `kind: 'console'` frames.
5. **Patches `fetch`:** Wraps `global.fetch`. Emits `network-start` and `network` frames. Implements fetch de-duplication with `markFetch`/`claimFetch`.
6. **Patches `XMLHttpRequest`:** Wraps `open`, `setRequestHeader`, `send`. Skips requests already captured by fetch (via `claimFetch`).
7. **Patches `WebSocket`:** Wraps the constructor. Emits `ws-open`, `ws-frame` (send/recv), `ws-close`, `ws-error` frames. Skips the DevTools' own connection.
8. **Auto-reconnect:** 2-second retry on disconnect.
9. **Offline queue:** Capped at 500 messages.
10. **Hello frame:** Sends `{ kind: 'hello', deviceId, name, platform }` on connect.

### `buildRnClient({ host, port })`

Replaces `__RNSPY_HOST__` and `__RNSPY_PORT__` tokens in the template and returns the final snippet string.

```js
export function buildRnClient({ host = 'localhost', port = 8097 } = {}) {
  return TEMPLATE
    .replace('__RNSPY_HOST__', host)
    .replace('__RNSPY_PORT__', String(port))
}
```

### Frame Types Emitted by the SDK

| Kind | When | Key Fields |
|------|------|------------|
| `hello` | On WebSocket connect | `deviceId`, `name`, `platform` |
| `console` | On `console.*` call | `id`, `level`, `args`, `timestamp` |
| `network-start` | On fetch/XHR start | `id`, `method`, `url`, `startTime` |
| `network` | On fetch/XHR complete | `id`, `method`, `url`, `status`, `headers`, `body`, `duration`, `size` |
| `ws-open` | On WebSocket connect | `wsId`, `url`, `protocols`, `startTime` |
| `ws-frame` | On WS send/receive | `wsId`, `dir`, `data`, `size`, `timestamp` |
| `ws-close` | On WS close | `wsId`, `code`, `reason`, `wasClean` |
| `ws-error` | On WS error | `wsId`, `message` |

---

## 14. Renderer — cURL/Fetch Utilities

**File:** `src/renderer/utils/curl.js`

Utility module with four exports for converting captured network requests into copyable text.

```js
// src/renderer/utils/curl.js

function shellQuote(str) {
  return `'${String(str).replace(/'/g, `'\\''`)}'`
}

/** Build a multi-line `curl` command. */
export function toCurl(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const parts = [`curl ${shellQuote(req.url)}`]
  if (method !== 'GET') parts.push(`-X ${method}`)
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`-H ${shellQuote(`${k}: ${v}`)}`)
  }
  const body = bodyToString(req.requestBody)
  if (body) parts.push(`--data-raw ${shellQuote(body)}`)
  return parts.join(' \\\n  ')
}

/** Build a browser `fetch()` snippet. */
export function toFetch(req) { /* ... */ }

/** Pretty-print a body (JSON if possible). */
export function prettyBody(body) { /* ... */ }

/** Copy text to clipboard; returns a promise that never rejects. */
export function copyText(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return Promise.resolve(false)
  return navigator.clipboard.writeText(text ?? '').then(() => true).catch(() => false)
}
```

---

## 15. Renderer — Request Filter Utilities

**File:** `src/renderer/utils/requestFilters.js`

Utility module for request name derivation and hidden-rule matching.

```js
// src/renderer/utils/requestFilters.js

/**
 * Short label for a request — the last meaningful path segment,
 * skipping trailing numeric IDs.
 * Example: `/api/Client/GetDashboard/729` → `GetDashboard`
 */
export function requestName(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    const segs = u.pathname.split('/').filter(Boolean)
    for (let i = segs.length - 1; i >= 0; i--) {
      if (!/^\d+$/.test(segs[i])) return segs[i]
    }
    return segs[segs.length - 1] || u.pathname
  } catch {
    const clean = url.split(/[?#]/)[0]
    const segs = clean.split('/').filter(Boolean)
    return segs[segs.length - 1] || url
  }
}

/**
 * True if `req` is hidden by any rule.
 * - hideRelated=false → exact name match
 * - hideRelated=true  → URL substring match
 */
export function isRequestHidden(req, rules) {
  if (!rules || !rules.length) return false
  const name = requestName(req.url)
  const url = req.url || ''
  for (const r of rules) {
    if (!r || !r.match) continue
    if (r.hideRelated) {
      if (url.includes(r.match)) return true
    } else if (name === r.match) {
      return true
    }
  }
  return false
}
```

---

## Dependencies

| Package | Version | Used By |
|---------|---------|---------|
| `ws` | `^8.18.0` | `rnspyServer.js` — WebSocket server |
| `lucide-react` | — | All UI components — Icons |
| `react-hot-toast` | — | `NetworkTab.jsx` — Copy-to-clipboard toasts |
| `react-router-dom` | — | Routing (`AppRoutes.jsx`, `App.jsx`) |
| `react` / `react-dom` | — | All renderer components |

---

## Storage Keys

| Key | Storage | Lifetime | Purpose |
|-----|---------|----------|---------|
| `rnspyDevtoolsPort` | `localStorage` | Survives app restart | User's chosen listening port |
| `rnspyDevtoolsRecords` | `sessionStorage` | Survives reload, cleared on app close | Per-device captured records |
| `rnspyDevtoolsHiddenRules` | `localStorage` | Survives app restart | Request filter rules |

---

## Limits & Caps

| Limit | Value | Scope |
|-------|-------|-------|
| Console logs | 2,000 | Per device |
| Network requests | 2,000 | Per device |
| WebSocket frames | 2,000 | Per WS connection |
| Server logs | 500 | Global |
| Client offline queue | 500 | Per RN app instance |
| Persist debounce | 600ms | sessionStorage writes |
| Reconnect delay | 2,000ms | RN client SDK |
| Fetch dedup window | 5,000ms | RN client SDK (claimFetch) |
