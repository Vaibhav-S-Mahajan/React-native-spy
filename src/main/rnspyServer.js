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

// ── Per-device event ring buffers (for MCP server read access) ──
const MAX_EVENTS = 1000
const deviceEvents = new Map() // deviceId -> { network: [], console: [], ws: [] }

function getDeviceBuffer(deviceId) {
  if (!deviceId) return null
  if (!deviceEvents.has(deviceId)) {
    deviceEvents.set(deviceId, { network: [], console: [], ws: [] })
  }
  return deviceEvents.get(deviceId)
}

function pushToRing(arr, entry) {
  arr.push(entry)
  if (arr.length > MAX_EVENTS) arr.splice(0, arr.length - MAX_EVENTS)
}

function bufferEvent(payload) {
  const buf = getDeviceBuffer(payload.deviceId)
  if (!buf) return
  const kind = payload.kind
  if (kind === 'network-start' || kind === 'network') {
    pushToRing(buf.network, payload)
  } else if (kind === 'console') {
    pushToRing(buf.console, payload)
  } else if (kind === 'ws-open' || kind === 'ws-frame' || kind === 'ws-close' || kind === 'ws-error') {
    pushToRing(buf.ws, payload)
  }
}

function pushLog(level, message) {
  const entry = { level, message, timestamp: Date.now() }
  serverLogs.push(entry)
  if (serverLogs.length > MAX_LOGS) serverLogs.splice(0, serverLogs.length - MAX_LOGS)
  if (sendToRenderer) sendToRenderer('rnspy:log', entry)
}

function buildStatus(extra) {
  // Deduplicate by deviceId — keep the latest (last) socket per device
  const seen = new Map()
  for (const c of clients) {
    const key = c.__rnspyDeviceId || c.__rnspyId || null
    seen.set(key, {
      id: c.__rnspyId || null,
      deviceId: c.__rnspyDeviceId || null,
      name: c.__rnspyName || null,
      platform: c.__rnspyPlatform || null,
    })
  }
  return {
    running: !!wss,
    port: currentPort,
    address: getLanAddress(),
    clientCount: seen.size,
    clients: Array.from(seen.values()),
    ...extra,
  }
}

function pushStatus(extra) {
  if (sendToRenderer) sendToRenderer('rnspy:status', buildStatus(extra))
}

// MCP/observer subscribers — functions called with each event
const eventObservers = new Set()

export function addEventObserver(fn) { eventObservers.add(fn) }
export function removeEventObserver(fn) { eventObservers.delete(fn) }

function pushEvent(payload) {
  bufferEvent(payload)
  if (sendToRenderer) sendToRenderer('rnspy:event', payload)
  for (const fn of eventObservers) {
    try { fn(payload) } catch { /* observer errors must not crash server */ }
  }
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

              // Disconnect previous sockets from the same device (reconnect dedup)
              if (data.deviceId) {
                for (const old of clients) {
                  if (old !== socket && old.__rnspyDeviceId === data.deviceId) {
                    pushLog('info', `Replacing stale connection ${old.__rnspyId} for device "${data.deviceId}"`)
                    clients.delete(old)
                    try { old.terminate() } catch { /* noop */ }
                  }
                }
              }

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
      }),
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

export function sendCommandToDevice(deviceKey, command, payload) {
  let sent = 0
  const msg = JSON.stringify({ kind: 'command', command, ...(payload || {}) })
  for (const c of clients) {
    const key = c.__rnspyDeviceId || c.__rnspyName || c.__rnspyId || 'unknown'
    if (key === deviceKey && c.readyState === 1) {
      try { c.send(msg); sent++ } catch { /* noop */ }
    }
  }
  if (sent > 0) {
    pushLog('info', `Sent "${command}" to device "${deviceKey}" (${sent} socket${sent > 1 ? 's' : ''})`)
    return { ok: true, sent }
  }
  return { ok: false, reason: 'device-not-connected' }
}

// ── MCP data access (read-only) ──
export function getDeviceEvents(deviceId) {
  return deviceEvents.get(deviceId) || { network: [], console: [], ws: [] }
}

export function getConnectedDevices() {
  const seen = new Map()
  for (const c of clients) {
    const key = c.__rnspyDeviceId || c.__rnspyId || 'unknown'
    seen.set(key, {
      deviceId: c.__rnspyDeviceId || null,
      name: c.__rnspyName || null,
      platform: c.__rnspyPlatform || null,
      id: c.__rnspyId || null,
    })
  }
  return Array.from(seen.values())
}

export function getAllDeviceIds() {
  return Array.from(deviceEvents.keys())
}
