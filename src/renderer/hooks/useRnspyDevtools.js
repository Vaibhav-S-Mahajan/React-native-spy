// src/renderer/hooks/useRnspyDevtools.js

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const MAX_CONSOLE_LOGS = 2000
const MAX_NETWORK_REQUESTS = 2000
const MAX_SERVER_LOGS = 500
const MAX_WS_FRAMES = 2000
const MAX_NAV_HISTORY = 500
const DEFAULT_PORT = 8097
const PORT_STORAGE_KEY = 'rnspyDevtoolsPort'
const RECORDS_STORAGE_KEY = 'rnspyDevtoolsRecords'
const HIDDEN_RULES_KEY = 'rnspyDevtoolsHiddenRules'
const PROJECT_ROOT_KEY = 'rnspyDevtoolsProjectRoot'
const PERSIST_DEBOUNCE_MS = 600

function readStoredPort() {
  if (typeof window === 'undefined') return DEFAULT_PORT
  const raw = window.localStorage.getItem(PORT_STORAGE_KEY)
  const parsed = parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 && parsed < 65536 ? parsed : DEFAULT_PORT
}

function readProjectRoot() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(PROJECT_ROOT_KEY) || ''
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
        storage: d.storage && Array.isArray(d.storage.backends) ? d.storage : null,
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
    address: 'localhost', clients: [],
  })
  const [devices, setDevices] = useState([])
  const [hiddenRules, setHiddenRules] = useState(readHiddenRules)
  const [projectRoot, setProjectRootState] = useState(readProjectRoot)
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
      wsConnections: Array.from(d.wsMap.values()).map((c) => ({
        ...c, frames: c.frames.slice(),
      })),
      consoleLogs: d.consoleLogs.slice(),
      storage: d.storage,
      watermelon: d.watermelon,
      navigation: d.navigation,
    }))
    setDevices(arr)
    schedulePersist()
  }, [schedulePersist])

  const ensureDevice = useCallback((payload) => {
    const key = deviceKeyOf(payload)
    let dev = devicesRef.current.get(key)
    if (!dev) {
      dev = {
        key, name: payload.clientName || null, platform: payload.clientPlatform || null,
        networkMap: new Map(), wsMap: new Map(), consoleLogs: [],
        storage: null, watermelon: null, navigation: null,
      }
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
        setStatus((s) => ({
          ...s, running: true, port: nextPort,
          clientCount: res.clientCount ?? s.clientCount, clients: res.clients ?? s.clients,
        }))
      } else {
        setStatus((s) => ({
          ...s, running: false, port: nextPort,
          error: res?.reason || 'failed-to-start',
        }))
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
          caller: payload.caller || null,
          stack: payload.stack || null,
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
          conn = {
            wsId: id, url: payload.url || '', protocols: null,
            status: 'open', startTime: payload.timestamp, seq: payload.seq, frames: [],
          }
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

      if (payload.kind === 'storage-snapshot') {
        const dev = ensureDevice(payload)
        const failedMutation = payload.mutation && payload.mutation.ok === false
        const incoming = Array.isArray(payload.backends) ? payload.backends : []
        const haveData = dev.storage && Array.isArray(dev.storage.backends) && dev.storage.backends.length > 0

        // A failed mutation reports empty backends — keep the last good snapshot
        // and just attach the error rather than wiping the view.
        if (failedMutation && dev.storage) {
          dev.storage = { ...dev.storage, mutation: payload.mutation, diag: payload.diag || dev.storage.diag || null }
        } else if (incoming.length === 0 && haveData && !payload.error) {
          // Empty snapshot while we already hold real data. This happens when a
          // second socket for the same device (e.g. a remote/JS debugger context
          // with no native MMKV) answers the same storage-read and would clobber
          // the good snapshot — causing a ~2s flicker. Ignore it; a socket that
          // truly owns the storage never reports zero backends. Refresh diag only.
          dev.storage = { ...dev.storage, diag: payload.diag || dev.storage.diag || null }
        } else {
          dev.storage = {
            backends: incoming,
            updatedAt: Date.now(),
            error: payload.error || null,
            mutation: payload.mutation || null,
            diag: payload.diag || null,
          }
        }
        rebuildDevices()
        return
      }

      if (payload.kind === 'navigation') {
        const dev = ensureDevice(payload)
        const stack = Array.isArray(payload.stack) ? payload.stack : []
        const focused = stack.length ? stack[stack.length - 1] : null
        const prev = dev.navigation || null
        const history = prev && Array.isArray(prev.history) ? prev.history : []

        // Append only real route changes. A poll-triggered read of an unchanged
        // route would otherwise fill the timeline with duplicates.
        const last = history.length ? history[history.length - 1] : null
        const isNewRoute = focused && (
          !last || last.key !== focused.key || last.name !== focused.name ||
          JSON.stringify(last.params) !== JSON.stringify(focused.params)
        )
        if (isNewRoute) {
          history.push({
            id: `nav-${payload.seq}`,
            name: focused.name,
            key: focused.key,
            params: focused.params,
            from: payload.prevRouteName || null,
            path: stack.map((r) => r.name),
            timestamp: payload.timestamp || payload.receivedAt || Date.now(),
          })
          if (history.length > MAX_NAV_HISTORY) {
            history.splice(0, history.length - MAX_NAV_HISTORY)
          }
        }

        dev.navigation = {
          stack,
          current: focused,
          prevRouteName: payload.prevRouteName || null,
          // Screens arrive on their own event too; never let an omitted field
          // wipe a registry we already hold.
          screens: payload.screens || (prev && prev.screens) || {},
          history,
          available: !!payload.available,
          updatedAt: Date.now(),
          diag: payload.diag || (prev && prev.diag) || null,
        }
        rebuildDevices()
        return
      }

      if (payload.kind === 'navigation-registry') {
        const dev = ensureDevice(payload)
        const prev = dev.navigation
        const screens = { ...((prev && prev.screens) || {}), ...(payload.screens || {}) }
        dev.navigation = prev
          ? { ...prev, screens }
          : {
              stack: [], current: null, prevRouteName: null, screens,
              history: [], available: true, updatedAt: Date.now(), diag: null,
            }
        rebuildDevices()
        return
      }

      if (payload.kind === 'watermelon-snapshot') {
        const dev = ensureDevice(payload)
        const incoming = Array.isArray(payload.tables) ? payload.tables : []
        const haveData = dev.watermelon && Array.isArray(dev.watermelon.tables) && dev.watermelon.tables.length > 0
        // Same anti-flicker guard as storage: don't let an empty snapshot from a
        // second socket (no WatermelonDB) clobber real data we already hold.
        if (incoming.length === 0 && haveData && !payload.error && payload.available === false) {
          dev.watermelon = { ...dev.watermelon, diag: payload.diag || dev.watermelon.diag || null }
        } else {
          dev.watermelon = {
            tables: incoming,
            // Preserve already-loaded row pages across table-list refreshes.
            pages: (dev.watermelon && dev.watermelon.pages) || {},
            available: !!payload.available,
            updatedAt: Date.now(),
            error: payload.error || null,
            diag: payload.diag || null,
          }
        }
        rebuildDevices()
        return
      }

      if (payload.kind === 'watermelon-page') {
        const dev = ensureDevice(payload)
        const p = payload.page || {}
        if (!p.table) return
        if (!dev.watermelon) {
          dev.watermelon = { tables: [], pages: {}, available: !!payload.available, updatedAt: Date.now(), error: null, diag: null }
        }
        if (!dev.watermelon.pages) dev.watermelon.pages = {}
        const prev = dev.watermelon.pages[p.table] || { rows: [], total: 0, columns: [] }
        const offset = p.offset || 0
        // Accumulate: replace from `offset` onward with the incoming batch so a
        // re-fetch of the same offset overwrites rather than duplicates.
        const merged = prev.rows.slice(0, offset).concat(Array.isArray(p.rows) ? p.rows : [])
        // Column set: prefer schema columns from metadata; else derive from rows.
        const meta = (dev.watermelon.tables || []).find((t) => t.table === p.table)
        const columns = (meta && meta.columns && meta.columns.length)
          ? meta.columns
          : (merged.length ? Object.keys(merged[0].fields || {}) : prev.columns)
        dev.watermelon.pages = {
          ...dev.watermelon.pages,
          [p.table]: {
            rows: merged,
            total: p.total != null ? p.total : prev.total,
            columns,
            paged: !!p.paged,
            error: p.error || null,
            loadedAt: Date.now(),
          },
        }
        // Fresh object so React sees the change.
        dev.watermelon = { ...dev.watermelon }
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
    [devices, onlineKeys],
  )

  const setPort = useCallback((nextPort) => {
    const parsed = parseInt(nextPort, 10)
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 65536) return
    setPortState(parsed)
    if (typeof window !== 'undefined')
      window.localStorage.setItem(PORT_STORAGE_KEY, String(parsed))
    startOnPort(parsed)
  }, [startOnPort])

  const setProjectRoot = useCallback((root) => {
    const val = (root || '').trim()
    setProjectRootState(val)
    if (typeof window !== 'undefined')
      window.localStorage.setItem(PROJECT_ROOT_KEY, val)
  }, [])

  // ── Automatic project setup ──
  // Host/port default to the running server's own values so the generated
  // connection file always points at the address this app is actually listening on.
  const setupHost = status.address || 'localhost'

  const pickProjectFolder = useCallback(() => {
    if (!rnspy?.pickProjectFolder)
      return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.pickProjectFolder()
  }, [rnspy])

  const detectProject = useCallback((dir) => {
    if (!rnspy?.detectProject) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.detectProject({ dir })
  }, [rnspy])

  const planProjectSetup = useCallback((dir) => {
    if (!rnspy?.planSetup) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.planSetup({ dir, host: setupHost, port })
  }, [rnspy, setupHost, port])

  const applyProjectSetup = useCallback((dir) => {
    if (!rnspy?.applySetup) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.applySetup({ dir, host: setupHost, port })
  }, [rnspy, setupHost, port])

  const removeProjectSetup = useCallback((dir) => {
    if (!rnspy?.removeSetup) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.removeSetup({ dir })
  }, [rnspy])

  const openInEditor = useCallback((file, line, column) => {
    if (!rnspy?.openInEditor) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.openInEditor({ file, line, column, projectRoot })
  }, [rnspy, projectRoot])

  const symbolicateAndOpen = useCallback((rawStack, fallbackCaller) => {
    if (!rnspy) return Promise.resolve({ ok: false, reason: 'not-available' })

    if (rawStack && rnspy.symbolicate) {
      return rnspy.symbolicate({ stack: rawStack }).then((res) => {
        if (res?.ok && res.caller?.file) {
          return rnspy.openInEditor({
            file: res.caller.file,
            line: res.caller.line || 1,
            column: res.caller.col || 1,
            projectRoot,
          })
        }
        if (fallbackCaller?.file) {
          return rnspy.openInEditor({
            file: fallbackCaller.file,
            line: fallbackCaller.line || 1,
            column: fallbackCaller.col || 1,
            projectRoot,
          })
        }
        return { ok: false, reason: res?.reason || 'no-caller' }
      })
    }

    if (fallbackCaller?.file) {
      return rnspy.openInEditor({
        file: fallbackCaller.file,
        line: fallbackCaller.line || 1,
        column: fallbackCaller.col || 1,
        projectRoot,
      })
    }
    return Promise.resolve({ ok: false, reason: 'no-stack-or-caller' })
  }, [rnspy, projectRoot])

  const disconnectClientById = useCallback((id) => {
    if (rnspy?.disconnectClient) rnspy.disconnectClient(id)
  }, [rnspy])

  const reloadDevice = useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({ deviceKey: key, command: 'reload' })
  }, [rnspy])

  // ── Storage inspector commands ──
  // The device responds to every storage command with a `storage-snapshot`
  // event, which the event handler above stores on dev.storage. So callers
  // just fire the command; the UI updates when the snapshot arrives.
  const readStorage = useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({ deviceKey: key, command: 'storage-read', payload: { reqId: Date.now() } })
  }, [rnspy])

  const setStorageValue = useCallback((key, { backend, instanceId, storageKey, value, type }) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({
      deviceKey: key, command: 'storage-set',
      payload: { reqId: Date.now(), backend, instanceId, key: storageKey, value, type: type || 'string' },
    })
  }, [rnspy])

  const removeStorageKey = useCallback((key, { backend, instanceId, storageKey }) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({
      deviceKey: key, command: 'storage-remove',
      payload: { reqId: Date.now(), backend, instanceId, key: storageKey },
    })
  }, [rnspy])

  // Ask the device to open a named MMKV instance (id) the app created before
  // the SDK loaded, so its keys become visible.
  const openStorageInstance = useCallback((key, instanceId) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({
      deviceKey: key, command: 'storage-open-instance',
      payload: { reqId: Date.now(), instanceId },
    })
  }, [rnspy])

  // The device answers with a `navigation` event, handled above.
  const readNavigation = useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({ deviceKey: key, command: 'navigation-read', payload: { reqId: Date.now() } })
  }, [rnspy])

  // Route name → source file, then open it. Resolution runs in the main process
  // against the connected project folder; `componentName` (when the SDK captured
  // it) makes the match far more reliable than the route name alone.
  const openRouteInEditor = useCallback(({ routeName, componentName }) => {
    if (!rnspy?.resolveRoute) return Promise.resolve({ ok: false, reason: 'not-available' })
    if (!projectRoot) return Promise.resolve({ ok: false, reason: 'no-project-root' })
    // `stage` disambiguates the two failures that share a reason: the resolver
    // reports 'not-found' for "no file matches this route", and the editor
    // handler reports 'not-found' for "VS Code could not be launched".
    return rnspy.resolveRoute({ routeName, componentName, projectRoot }).then((res) => {
      if (!res?.ok || !res.file) {
        return { ok: false, stage: 'resolve', ...(res || { reason: 'not-found' }) }
      }
      return rnspy.openInEditor({
        file: res.file, line: res.line || 1, column: 1, projectRoot,
      }).then((open) => ({
        ...open,
        stage: 'open',
        file: res.file,
        line: res.line,
        tier: res.tier,
        ambiguous: res.ambiguous,
        candidates: res.candidates,
      }))
    })
  }, [rnspy, projectRoot])

  const readWatermelon = useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({ deviceKey: key, command: 'watermelon-read', payload: { reqId: Date.now() } })
  }, [rnspy])

  const readWatermelonPage = useCallback((key, table, offset, limit = 50) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: 'not-available' })
    return rnspy.sendCommand({
      deviceKey: key, command: 'watermelon-page',
      payload: { reqId: Date.now(), table, offset, limit },
    })
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
    else if (category === 'navigation') {
      // Clear the timeline only — the current stack is live device state, not
      // a record we captured, so wiping it would just show a false empty.
      if (dev.navigation) dev.navigation = { ...dev.navigation, history: [] }
    }
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

  const resetAll = useCallback(() => {
    // Clear all device records
    devicesRef.current.clear()
    rebuildDevices()
    // Clear server logs
    setServerLogs([])
    if (rnspy?.clearLogs) rnspy.clearLogs()
    // Reset hidden rules
    setHiddenRules([])
    writeHiddenRules([])
    // Reset project root
    setProjectRootState('')
    if (typeof window !== 'undefined')
      window.localStorage.removeItem(PROJECT_ROOT_KEY)
    // Reset port to default
    setPortState(DEFAULT_PORT)
    if (typeof window !== 'undefined')
      window.localStorage.removeItem(PORT_STORAGE_KEY)
    startOnPort(DEFAULT_PORT)
    // Clear session storage
    if (typeof window !== 'undefined')
      window.sessionStorage.removeItem(RECORDS_STORAGE_KEY)
    // Disconnect all clients
    if (rnspy?.disconnectClient) {
      for (const c of status.clients || []) rnspy.disconnectClient(c.id)
    }
  }, [rebuildDevices, rnspy, writeHiddenRules, startOnPort, status.clients])

  return {
    available, status, port, setPort, devices: devicesView,
    projectRoot, setProjectRoot, openInEditor, symbolicateAndOpen,
    setupHost,
    pickProjectFolder, detectProject,
    planProjectSetup, applyProjectSetup, removeProjectSetup,
    hiddenRules, addHiddenRule, removeHiddenRule,
    disconnectDevice, disconnectClientById, reloadDevice,
    readStorage, setStorageValue, removeStorageKey, openStorageInstance,
    readWatermelon, readWatermelonPage,
    readNavigation, openRouteInEditor,
    closeDevice, clearDevice, clearDeviceCategory, clear,
    serverLogs, clearServerLogs, resetAll,
  }
}

export default useRnspyDevtools
