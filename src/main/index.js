// src/main/index.js

import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { join, isAbsolute, resolve } from 'path'
import { execFile } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import {
  startRnspyServer,
  stopRnspyServer,
  getRnspyStatus,
  disconnectRnspyClient,
  getRnspyLogs,
  clearRnspyLogs,
  sendCommandToDevice,
} from './rnspyServer'
import {
  detectRnProject,
  planSetup,
  applySetup,
  removeSetup,
} from './projectSetup'
import {
  initUpdater,
  getUpdaterState,
  checkForUpdates,
  downloadUpdate,
  quitAndInstall,
  openReleasesPage,
} from './updater'

let mainWindow = null

function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload)
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: 'React Native Spy',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 14, y: 14 },
    backgroundColor: '#0a0a0c',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC handlers
ipcMain.handle('rnspy:start', (_event, opts) =>
  startRnspyServer({ port: opts?.port, send: sendToRenderer }),
)
ipcMain.handle('rnspy:stop', () => stopRnspyServer())
ipcMain.handle('rnspy:status', () => getRnspyStatus())
ipcMain.handle('rnspy:disconnect-client', (_event, id) => disconnectRnspyClient(id))
ipcMain.handle('rnspy:get-logs', () => getRnspyLogs())
ipcMain.handle('rnspy:clear-logs', () => clearRnspyLogs())
ipcMain.handle('rnspy:send-command', (_event, { deviceKey, command, payload }) =>
  sendCommandToDevice(deviceKey, command, payload),
)

// ── Automatic React Native project setup ───────────
// Folder picker → RN detection → change preview → apply. The plan/apply split lets
// the renderer show exactly what will be written before anything touches the repo.
ipcMain.handle('rnspy:pick-project-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select your React Native project',
    message: 'Choose the folder containing your package.json',
    buttonLabel: 'Select Project',
    properties: ['openDirectory', 'createDirectory'],
  })
  if (result.canceled || !result.filePaths?.length) {
    return { ok: false, reason: 'canceled' }
  }
  return { ok: true, path: result.filePaths[0] }
})

ipcMain.handle('rnspy:detect-project', (_event, { dir } = {}) => detectRnProject(dir))

ipcMain.handle('rnspy:plan-setup', (_event, { dir, host, port } = {}) =>
  planSetup({ dir, host, port }),
)

// Takes dir/host/port rather than a plan object — applySetup re-plans internally so
// the renderer can't redirect writes to arbitrary paths.
ipcMain.handle('rnspy:apply-setup', (_event, { dir, host, port } = {}) =>
  applySetup({ dir, host, port }),
)

ipcMain.handle('rnspy:remove-setup', (_event, { dir } = {}) => removeSetup({ dir }))

// ── Symbolicate stack trace via Metro bundler ────────
// Parses raw Error().stack, extracts Metro host from bundler URLs,
// POSTs to Metro's /symbolicate endpoint, returns resolved source locations.
ipcMain.handle('rnspy:symbolicate', async (_event, { stack }) => {
  if (!stack || typeof stack !== 'string') return { ok: false, reason: 'no-stack' }

  // Parse raw stack into frames + detect Metro base URL
  const lines = stack.split('\n')
  const frames = []
  let metroBase = null

  for (const line of lines) {
    const m = line.match(/(?:at\s+(?:.*?\s+)?\(?)(\S+?):(\d+):(\d+)/)
    if (!m) continue
    const file = m[1]
    const lineNumber = parseInt(m[2], 10)
    const column = parseInt(m[3], 10)

    // Detect Metro URL: http://192.168.x.x:8081/index.bundle...
    if (!metroBase && /^https?:\/\//.test(file)) {
      try {
        const u = new URL(file)
        metroBase = u.origin
      } catch { /* skip */ }
    }

    frames.push({ file, lineNumber, column, methodName: '' })
  }

  if (!frames.length) return { ok: false, reason: 'no-frames' }
  if (!metroBase) return { ok: false, reason: 'no-metro-url', frames }

  // Call Metro's /symbolicate endpoint
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${metroBase}/symbolicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stack: frames }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return { ok: false, reason: `metro-${res.status}` }
    const data = await res.json()

    if (!data?.stack?.length) return { ok: false, reason: 'empty-response' }

    // Find the first user-code frame (skip node_modules, internal, __prelude__)
    const resolved = []
    for (const f of data.stack) {
      if (!f.file) continue
      if (f.file.includes('node_modules') && !f.file.includes('node_modules/@')) continue
      if (f.file.startsWith('__')) continue
      resolved.push({
        file: f.file,
        line: f.lineNumber ?? 1,
        col: f.column ?? 1,
        method: f.methodName || '',
      })
    }

    return {
      ok: true,
      caller: resolved[0] || null,
      frames: resolved,
    }
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : (err.message || 'fetch-failed') }
  }
})

// ── Auto-update ──────────────────────────────────────
// The renderer only reads state and triggers actions; all update state lives
// in the main process and is pushed over the `updater:state` channel.
ipcMain.handle('updater:get-state', () => getUpdaterState())
ipcMain.handle('updater:check', (_event, opts) => checkForUpdates({ silent: opts?.silent }))
ipcMain.handle('updater:download', () => downloadUpdate())
ipcMain.handle('updater:install', () => quitAndInstall())
ipcMain.handle('updater:open-releases', () => openReleasesPage())

// ── Open in VS Code ──────────────────────────────────
// Tries `code -g "file:line:column"` first (most reliable).
// Falls back to vscode:// URI via shell.openExternal.
ipcMain.handle('rnspy:open-in-editor', async (_event, { file, line, column, projectRoot }) => {
  if (!file) return { ok: false, reason: 'no-file' }

  const ln = line || 1
  const col = column || 1

  // Resolve relative paths against projectRoot
  let fullPath = file
  if (!isAbsolute(file) && projectRoot) {
    fullPath = resolve(projectRoot, file)
  }

  const gotoArg = `${fullPath}:${ln}:${col}`

  // 1) Try `code -g` CLI
  return new Promise((done) => {
    // On macOS the CLI is often at /usr/local/bin/code or in PATH after shell init.
    // `execFile` with `shell: true` picks up the user's PATH.
    execFile('code', ['-g', gotoArg], { shell: true, timeout: 5000 }, (err) => {
      if (!err) {
        done({ ok: true, method: 'cli' })
        return
      }

      // 2) Fallback: vscode:// URI scheme
      const uri = `vscode://file/${encodeURI(fullPath)}:${ln}:${col}`
      shell.openExternal(uri)
        .then(() => done({ ok: true, method: 'uri' }))
        .catch((uriErr) => {
          done({
            ok: false,
            reason: 'not-found',
            message: `VS Code CLI failed: ${err.message}. URI fallback also failed: ${uriErr.message}`,
          })
        })
    })
  })
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.rnspy.devtools')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  initUpdater({ send: sendToRenderer })

  // Background check shortly after launch so the toolbar button can appear on
  // its own. Silent, so an offline machine never shows an error badge.
  setTimeout(() => checkForUpdates({ silent: true }), 4000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopRnspyServer()
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  stopRnspyServer()
})
