// src/hooks/useLiveFeed.js
// Drives the animated app mock. Emits synthetic network requests, console lines
// and WebSocket frames on a timer so the hero shows a debugger that is visibly
// working, rather than a static screenshot.
//
// Design notes:
//   - Rows are appended with a `pending` status, then resolved after a delay,
//     which reproduces the real two-phase network-start → network flow.
//   - The buffer is capped like the real app (oldest dropped) so memory is flat
//     no matter how long the page stays open.
//   - Everything stops when reduced motion is requested or the tab is hidden.

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const CAP = 9

const REQUESTS = [
  { method: 'GET', url: '/api/v2/feed?cursor=eyJ0IjoxNzA', status: 200, size: '18.4 kB', ms: 214 },
  { method: 'POST', url: '/api/v2/auth/refresh', status: 200, size: '512 B', ms: 96 },
  { method: 'GET', url: '/api/v2/users/me', status: 200, size: '2.1 kB', ms: 63 },
  { method: 'PATCH', url: '/api/v2/users/me/preferences', status: 204, size: '0 B', ms: 128 },
  { method: 'GET', url: '/api/v2/products?page=2&limit=20', status: 200, size: '41.9 kB', ms: 388 },
  { method: 'POST', url: '/api/v2/cart/items', status: 201, size: '744 B', ms: 172 },
  { method: 'GET', url: '/api/v2/orders/48210/status', status: 304, size: '0 B', ms: 41 },
  { method: 'DELETE', url: '/api/v2/cart/items/9f2a', status: 200, size: '96 B', ms: 118 },
  { method: 'GET', url: '/api/v2/search?q=running+shoes', status: 200, size: '12.7 kB', ms: 246 },
  { method: 'POST', url: '/api/v2/analytics/batch', status: 500, size: '284 B', ms: 1042 },
  { method: 'GET', url: '/api/v2/config/flags', status: 200, size: '3.3 kB', ms: 71 },
  { method: 'PUT', url: '/api/v2/profile/avatar', status: 413, size: '162 B', ms: 604 }
]

const LOGS = [
  { level: 'log', msg: 'Navigation → ProductDetail { id: "9f2a", from: "Feed" }', caller: 'useNavigation.ts:44' },
  { level: 'info', msg: 'Query cache hit for key ["products", 2]', caller: 'queryClient.ts:118' },
  { level: 'warn', msg: 'Image source missing width/height, layout may shift', caller: 'ProductCard.tsx:72' },
  { level: 'log', msg: 'AsyncStorage.setItem("cart:v2", …) 1.2 kB', caller: 'cartStore.ts:158' },
  { level: 'error', msg: 'TypeError: Cannot read property "id" of undefined', caller: 'CheckoutScreen.tsx:203' },
  { level: 'debug', msg: 'Realtime socket heartbeat ack, rtt 38ms', caller: 'socket.ts:91' },
  { level: 'log', msg: 'Rendered FeedList with 40 items in 12.4ms', caller: 'FeedList.tsx:31' },
  { level: 'info', msg: 'Feature flag "new_checkout" resolved to true', caller: 'flags.ts:27' }
]

const FRAMES = [
  { dir: 'send', data: '{"op":"subscribe","channel":"orders:48210"}', size: '42 B' },
  { dir: 'recv', data: '{"op":"ack","channel":"orders:48210","seq":1}', size: '46 B' },
  { dir: 'recv', data: '{"event":"order.updated","status":"packed"}', size: '44 B' },
  { dir: 'send', data: '{"type":6}', size: '10 B' },
  { dir: 'recv', data: '{"type":6}', size: '10 B' },
  { dir: 'recv', data: '{"event":"price.changed","sku":"RS-9","d":-400}', size: '48 B' },
  { dir: 'send', data: '{"op":"presence","state":"foreground"}', size: '39 B' },
  { dir: 'recv', data: '{"event":"order.updated","status":"shipped"}', size: '45 B' }
]

let uid = 0

export function useLiveFeed({ active = true, interval = 1500 } = {}) {
  const reduced = useReducedMotion()
  const [rows, setRows] = useState(() => seedRows())
  const [logs, setLogs] = useState(() => LOGS.slice(0, 5).map((l, i) => ({ ...l, id: `l${i}`, t: stamp(i) })))
  const [frames, setFrames] = useState(() => FRAMES.slice(0, 5).map((f, i) => ({ ...f, id: `f${i}`, t: stamp(i) })))
  const tick = useRef(0)

  useEffect(() => {
    // Reduced motion keeps the seeded snapshot: informative, but still.
    if (!active || reduced) return

    let timer = 0
    const pendingTimers = new Set()

    const run = () => {
      // Pause while the tab is backgrounded — no point animating offscreen.
      if (document.hidden) {
        timer = window.setTimeout(run, interval)
        return
      }

      const n = tick.current++

      // Network: append pending, then resolve shortly after.
      const req = REQUESTS[n % REQUESTS.length]
      const id = `r${uid++}`
      setRows((prev) => cap([...prev, { ...req, id, status: 'pending', t: nowStamp(), fresh: true }]))

      const resolve = window.setTimeout(
        () => {
          setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: req.status, fresh: false } : r)))
          pendingTimers.delete(resolve)
        },
        Math.min(req.ms, 900)
      )
      pendingTimers.add(resolve)

      // Console and WebSocket advance at their own rates so the three panels
      // never look like they are stepping in lockstep.
      if (n % 2 === 0) {
        const log = LOGS[n % LOGS.length]
        setLogs((prev) => cap([...prev, { ...log, id: `l${uid++}`, t: nowStamp(), fresh: true }]))
      }
      if (n % 3 !== 2) {
        const frame = FRAMES[n % FRAMES.length]
        setFrames((prev) => cap([...prev, { ...frame, id: `f${uid++}`, t: nowStamp(), fresh: true }]))
      }

      timer = window.setTimeout(run, interval)
    }

    timer = window.setTimeout(run, 700)
    return () => {
      clearTimeout(timer)
      pendingTimers.forEach(clearTimeout)
    }
  }, [active, interval, reduced])

  return { rows, logs, frames }
}

function cap(arr) {
  return arr.length > CAP ? arr.slice(arr.length - CAP) : arr
}

function seedRows() {
  return REQUESTS.slice(0, 6).map((r, i) => ({ ...r, id: `s${i}`, status: r.status, t: stamp(i) }))
}

// Deterministic stamps for the seeded rows, so first paint is stable.
function stamp(i) {
  const base = 9 * 3600 + 41 * 60 + 12
  const s = base + i * 7
  return `${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
}

function nowStamp() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function pad(n) {
  return String(n).padStart(2, '0')
}
