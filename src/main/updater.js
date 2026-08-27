// src/main/updater.js
//
// Auto-update wiring for React Native Spy.
//
// Update feed is GitHub Releases (see `publish` in electron-builder.yml).
// The renderer drives everything through IPC and only ever *reacts* to state
// pushed from here — the main process is the single source of truth.
//
// Platform reality check (this drives the whole design):
//   • Windows (NSIS) + Linux (AppImage) → download + quitAndInstall works.
//   • macOS unsigned                    → Squirrel.Mac REQUIRES a valid code
//     signature to apply an update. We ship unsigned, so an in-app install would
//     fail at the verification step. On macOS we therefore check + notify, then
//     send the user to the release page to download manually.

import { app, shell } from 'electron'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater

const RELEASES_URL = 'https://github.com/dev-vaibhav0220/React-native-spy/releases/latest'

// macOS builds are unsigned, so in-app install is not possible there.
const CAN_INSTALL_IN_APP = process.platform !== 'darwin'

// Mirrors to the renderer. Kept flat and serialisable so it can be sent over IPC
// and dropped straight into React state.
const state = {
  // idle | checking | available | downloading | ready | none | error
  status: 'idle',
  currentVersion: app.getVersion(),
  version: null,
  releaseNotes: null,
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  error: null,
  // Tells the renderer whether the button should install or open a download page.
  canInstallInApp: CAN_INSTALL_IN_APP,
  manualDownloadUrl: RELEASES_URL,
}

let send = () => {}
let initialized = false

function patch(next) {
  Object.assign(state, next)
  send('updater:state', { ...state })
}

export function getUpdaterState() {
  return { ...state }
}

/**
 * Wire the autoUpdater event stream to renderer pushes.
 * Safe to call once on app ready; no-ops on repeat calls.
 */
export function initUpdater({ send: sendToRenderer } = {}) {
  if (typeof sendToRenderer === 'function') send = sendToRenderer
  if (initialized) return
  initialized = true

  // We surface a button instead of downloading behind the user's back —
  // this app runs alongside a live debugging session and a surprise restart
  // in the middle of one is hostile.
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = CAN_INSTALL_IN_APP
  autoUpdater.logger = null

  autoUpdater.on('checking-for-update', () => {
    patch({ status: 'checking', error: null })
  })

  autoUpdater.on('update-available', (info) => {
    patch({
      status: 'available',
      version: info?.version || null,
      releaseNotes: typeof info?.releaseNotes === 'string' ? info.releaseNotes : null,
      error: null,
    })
  })

  autoUpdater.on('update-not-available', () => {
    patch({ status: 'none', version: null, error: null })
  })

  autoUpdater.on('download-progress', (p) => {
    patch({
      status: 'downloading',
      percent: Math.round(p?.percent || 0),
      bytesPerSecond: p?.bytesPerSecond || 0,
      transferred: p?.transferred || 0,
      total: p?.total || 0,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    patch({
      status: 'ready',
      version: info?.version || state.version,
      percent: 100,
    })
  })

  autoUpdater.on('error', (err) => {
    patch({
      status: 'error',
      error: err?.message || 'Update check failed',
    })
  })
}

/**
 * Check the feed for a newer release.
 * `silent: true` suppresses the "up to date" / error states so a background
 * check never flashes UI at the user.
 */
export async function checkForUpdates({ silent = false } = {}) {
  // Dev builds have no update feed and electron-updater throws on them.
  if (!app.isPackaged) {
    if (!silent) patch({ status: 'none', error: null })
    return { ok: false, reason: 'dev-mode' }
  }

  try {
    const result = await autoUpdater.checkForUpdates()
    return { ok: true, version: result?.updateInfo?.version || null }
  } catch (err) {
    const message = err?.message || 'Update check failed'
    // A silent background check that fails (offline, rate limited) should stay
    // invisible rather than parking an error badge in the toolbar.
    if (silent) {
      if (state.status === 'checking') patch({ status: 'idle', error: null })
    } else {
      patch({ status: 'error', error: message })
    }
    return { ok: false, reason: message }
  }
}

export async function downloadUpdate() {
  if (!app.isPackaged) return { ok: false, reason: 'dev-mode' }

  // Unsigned macOS build: hand off to the browser instead of failing at
  // Squirrel's signature check after a full download.
  if (!CAN_INSTALL_IN_APP) {
    await shell.openExternal(RELEASES_URL)
    return { ok: true, method: 'external' }
  }

  try {
    patch({ status: 'downloading', percent: 0, error: null })
    await autoUpdater.downloadUpdate()
    return { ok: true, method: 'in-app' }
  } catch (err) {
    patch({ status: 'error', error: err?.message || 'Download failed' })
    return { ok: false, reason: err?.message || 'Download failed' }
  }
}

/**
 * Restart into the new version. Only meaningful once status is `ready`.
 */
export function quitAndInstall() {
  if (!app.isPackaged) return { ok: false, reason: 'dev-mode' }
  if (!CAN_INSTALL_IN_APP) {
    shell.openExternal(RELEASES_URL)
    return { ok: true, method: 'external' }
  }
  if (state.status !== 'ready') return { ok: false, reason: 'not-downloaded' }

  // setImmediate lets the IPC reply flush before the app tears itself down.
  setImmediate(() => autoUpdater.quitAndInstall(false, true))
  return { ok: true }
}

export function openReleasesPage() {
  shell.openExternal(RELEASES_URL)
  return { ok: true }
}
