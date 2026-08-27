// src/renderer/hooks/useIssues.js
//
// Aggregates every problem in the session into one ranked list so users don't
// have to visit six panels to find out what's wrong.
//
// Sources, all already in memory — nothing new is captured:
//   console  → error / warn level logs (per device)
//   network  → failed requests (status 0, 4xx, 5xx) and transport errors
//   server   → error / warn entries from the WebSocket server
//   storage  → snapshot errors + MMKV diagnostics
//   database → WatermelonDB errors + per-table read failures
//
// Deliberately NOT an error *log*: issues are deduplicated by signature so a
// request failing 200 times is one row with a count, not 200 rows. A raw
// firehose is what the Console tab already is.

import { useMemo } from 'react'

export const SEVERITY = { error: 2, warn: 1 }

export const SOURCES = [
  { id: 'setup', label: 'Setup' },
  { id: 'console', label: 'Console' },
  { id: 'network', label: 'Network' },
  { id: 'server', label: 'Server' },
  { id: 'storage', label: 'Storage' },
  { id: 'database', label: 'Database' },
]

/**
 * Connection lifecycle chatter that is NOT actionable.
 *
 * A device dropping off Wi-Fi, a socket closing, or the user force-disconnecting
 * a client are all normal events — surfacing them as "issues" buries the things
 * you can actually fix (a missing library, a port conflict, a 500).
 *
 * Deliberately narrow: it matches transient connection events only. Real server
 * faults like "Failed to bind port 8097: EADDRINUSE" are still reported, because
 * that one you have to go fix.
 */
const NOISE = [
  /^client connected\b/i,
  /^client disconnected\b/i,
  /^client force-disconnected\b/i,
  /\bsocket error\b/i,
  /^replacing stale connection\b/i,
  /^client .* identified as\b/i,
  /^sent ".*" to device\b/i,
  /^websocket server listening\b/i,
]

function isNoise(message) {
  const m = String(message || '').trim()
  return NOISE.some((re) => re.test(m))
}

function argToText(arg) {
  if (arg == null) return String(arg)
  if (typeof arg === 'object') {
    try { return JSON.stringify(arg) } catch { return String(arg) }
  }
  return String(arg)
}

function firstLine(text, max = 200) {
  const line = String(text || '').split('\n')[0].trim()
  return line.length > max ? line.slice(0, max) + '…' : line
}

/**
 * Collapse repeats into one entry with a count. Signature intentionally excludes
 * timestamps and request ids so "the same thing happening again" merges, while
 * genuinely different failures stay separate.
 */
function addIssue(map, issue) {
  const existing = map.get(issue.signature)
  if (existing) {
    existing.count += 1
    // Keep the most recent occurrence — that's the one worth jumping to.
    if ((issue.timestamp || 0) > (existing.timestamp || 0)) {
      existing.timestamp = issue.timestamp
      existing.detail = issue.detail
      existing.caller = issue.caller || existing.caller
      existing.stack = issue.stack || existing.stack
    }
    return
  }
  map.set(issue.signature, { ...issue, count: 1 })
}

export function useIssues({ devices = [], serverLogs = [] } = {}) {
  return useMemo(() => {
    const map = new Map()

    for (const dev of devices) {
      const where = dev.name || dev.key

      // ── Console: error and warn ──
      for (const log of dev.consoleLogs || []) {
        if (log.level !== 'error' && log.level !== 'warn') continue
        const text = (log.args || []).map(argToText).join(' ')
        if (!text.trim()) continue
        addIssue(map, {
          id: `console:${dev.key}:${log.id}`,
          source: 'console',
          severity: log.level,
          title: firstLine(text),
          detail: text,
          device: where,
          deviceKey: dev.key,
          caller: log.caller || null,
          stack: log.stack || null,
          timestamp: log.timestamp,
          // Level + message identity, so the same warning repeated merges.
          signature: `console|${dev.key}|${log.level}|${firstLine(text, 160)}`,
        })
      }

      // ── Network: failures ──
      for (const req of dev.networkRequests || []) {
        if (req.pending) continue
        const status = req.status
        const failed = req.error || status == null || status === 0 || status >= 400
        if (!failed) continue

        const method = (req.method || 'GET').toUpperCase()
        let label
        let severity
        if (req.error || status == null || status === 0) {
          label = `${method} failed — ${req.error || 'no response'}`
          severity = 'error'
        } else {
          label = `${method} ${status}`
          severity = status >= 500 ? 'error' : 'warn'
        }

        addIssue(map, {
          id: `network:${dev.key}:${req.id}`,
          source: 'network',
          severity,
          title: `${label} · ${req.url || ''}`,
          detail: [
            `${method} ${req.url || ''}`,
            `Status: ${status == null || status === 0 ? 'failed' : status}`,
            req.error ? `Error: ${req.error}` : null,
            req.duration != null ? `Duration: ${Math.round(req.duration)}ms` : null,
          ].filter(Boolean).join('\n'),
          device: where,
          deviceKey: dev.key,
          timestamp: req.startTime,
          // Group by endpoint + outcome, not by request id — one broken endpoint
          // hit repeatedly is one issue.
          signature: `network|${dev.key}|${method}|${status || 'fail'}|${(req.url || '').split('?')[0]}`,
        })
      }

      // ── Storage: snapshot + MMKV diagnostics ──
      const st = dev.storage
      if (st?.error) {
        addIssue(map, {
          id: `storage:${dev.key}:error`,
          source: 'storage',
          severity: 'error',
          title: `Storage read failed — ${firstLine(st.error)}`,
          detail: String(st.error),
          device: where, deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `storage|${dev.key}|${firstLine(st.error, 160)}`,
        })
      }
      /* ── Setup: libraries the SDK could not reach ──
         This is the class of issue that actually matters — "AsyncStorage is not
         available" means a whole panel will sit empty and the reason is a
         missing or unlinked package, not a transient blip. Each carries the fix
         in its detail, so the modal is the only place you need to look. */
      if (st?.diag && st.diag.asyncResolved === false) {
        addIssue(map, {
          id: `setup:${dev.key}:asyncstorage`,
          source: 'setup',
          severity: 'warn',
          title: 'AsyncStorage is not available',
          detail: [
            'The SDK could not load @react-native-async-storage/async-storage,',
            'so the AsyncStorage section of the Storage panel will stay empty.',
            '',
            'Fix: install it, then rebuild the native app —',
            '  npm install @react-native-async-storage/async-storage',
            '  npx pod-install ios',
            '',
            'If it is already installed, a JS-only reload is not enough:',
            'the native module needs a fresh build.',
          ].join('\n'),
          device: where, deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `setup|${dev.key}|asyncstorage`,
        })
      }

      if (st?.diag?.mmkvResolved === false) {
        const why = st.diag.mmkvError || 'no MMKV instance was found'
        const notInstalled = /require failed|cannot find module|not installed/i.test(why)
        addIssue(map, {
          id: `setup:${dev.key}:mmkv`,
          source: 'setup',
          severity: 'warn',
          title: notInstalled
            ? 'MMKV is not available'
            : 'MMKV is installed but no instance was found',
          detail: notInstalled
            ? [
              `react-native-mmkv could not be loaded: ${why}`,
              'The MMKV section of the Storage panel will stay empty.',
              '',
              'Fix: npm install react-native-mmkv, then rebuild the native app.',
            ].join('\n')
            : [
              `MMKV could not be inspected: ${why}`,
              '',
              'The SDK auto-detects instances created after it loads. If yours is',
              'created earlier, expose it once:',
              '  global.__rnspyMMKV = myStorage',
            ].join('\n'),
          device: where, deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `setup|${dev.key}|mmkv|${notInstalled ? 'missing' : 'no-instance'}`,
        })
      }

      /* NOTE: `resolved` lives on the diag object (see wmDiag() in rnClient.js),
         not on the snapshot root — reading dev.watermelon.resolved silently
         yields undefined and this check never fires. */
      if (dev.watermelon?.diag?.resolved === false) {
        const why = dev.watermelon.diag.error || dev.watermelon.error || 'require failed'
        addIssue(map, {
          id: `setup:${dev.key}:watermelon`,
          source: 'setup',
          severity: 'warn',
          title: 'WatermelonDB is not available',
          detail: [
            `@nozbe/watermelondb could not be loaded: ${why}`,
            'The WatermelonDB panel will stay empty.',
            '',
            'If your app does not use WatermelonDB, ignore this.',
            'Otherwise re-run "Set it up for me" — setup finds where you call',
            'new Database(...) and exposes that instance automatically. If your',
            'database is not a top-level variable, add this line there yourself:',
            '  if (__DEV__) { global.__rnspyWatermelonDB = database }',
          ].join('\n'),
          device: where, deviceKey: dev.key,
          timestamp: dev.watermelon.updatedAt,
          signature: `setup|${dev.key}|watermelon`,
        })
      }

      /* Remaining storage notes. The require-failure notes are dropped because
         the Setup issues above already say the same thing in plain language —
         listing both would double-report one problem. */
      for (const note of st?.diag?.notes || []) {
        if (/require failed/i.test(note)) continue
        addIssue(map, {
          id: `storage:${dev.key}:note:${note}`,
          source: 'storage',
          severity: 'warn',
          title: firstLine(note),
          detail: String(note),
          device: where, deviceKey: dev.key,
          timestamp: st?.updatedAt,
          signature: `storage|${dev.key}|note|${firstLine(note, 160)}`,
        })
      }

      // ── WatermelonDB ──
      const wm = dev.watermelon
      if (wm?.error) {
        addIssue(map, {
          id: `database:${dev.key}:error`,
          source: 'database',
          severity: 'error',
          title: `WatermelonDB error — ${firstLine(wm.error)}`,
          detail: String(wm.error),
          device: where, deviceKey: dev.key,
          timestamp: wm.updatedAt,
          signature: `database|${dev.key}|${firstLine(wm.error, 160)}`,
        })
      }
      for (const t of wm?.tables || []) {
        if (!t?.error) continue
        addIssue(map, {
          id: `database:${dev.key}:${t.table}`,
          source: 'database',
          severity: 'error',
          title: `Table "${t.table}" — ${firstLine(t.error)}`,
          detail: String(t.error),
          device: where, deviceKey: dev.key,
          timestamp: wm?.updatedAt,
          signature: `database|${dev.key}|table|${t.table}|${firstLine(t.error, 120)}`,
        })
      }
    }

    /* ── Server logs ──
       Connection lifecycle events are filtered out here. A device dropping off
       Wi-Fi or a socket closing is normal and not something you act on; leaving
       it in buried the problems that matter. Genuine faults — a port conflict,
       a bind failure — still come through. */
    for (const entry of serverLogs) {
      if (entry.level !== 'error' && entry.level !== 'warn') continue
      if (isNoise(entry.message)) continue
      addIssue(map, {
        id: `server:${entry.timestamp}:${entry.message}`,
        source: 'server',
        severity: entry.level,
        title: firstLine(entry.message),
        detail: String(entry.message || ''),
        device: null, deviceKey: null,
        timestamp: entry.timestamp,
        signature: `server|${entry.level}|${firstLine(entry.message, 160)}`,
      })
    }

    // Errors before warnings, then newest first.
    const issues = Array.from(map.values()).sort((a, b) => {
      const s = (SEVERITY[b.severity] || 0) - (SEVERITY[a.severity] || 0)
      if (s !== 0) return s
      return (b.timestamp || 0) - (a.timestamp || 0)
    })

    const errorCount = issues.reduce((n, i) => n + (i.severity === 'error' ? i.count : 0), 0)
    const warnCount = issues.reduce((n, i) => n + (i.severity === 'warn' ? i.count : 0), 0)

    const bySource = {}
    for (const s of SOURCES) bySource[s.id] = 0
    for (const i of issues) bySource[i.source] = (bySource[i.source] || 0) + i.count

    return {
      issues,
      errorCount,
      warnCount,
      // Distinct problems, which is what the badge shows — 200 repeats of one
      // broken endpoint is one thing to fix, not 200.
      total: issues.length,
      occurrences: errorCount + warnCount,
      bySource,
    }
  }, [devices, serverLogs])
}
