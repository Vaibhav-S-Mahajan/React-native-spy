// src/components/AppMock.jsx
// The hero centrepiece: a recreation of the debugger window that actually
// runs. Rows stream in from useLiveFeed, the panel tabs are clickable, and
// the whole window auto-advances through Network → Console → WebSocket so a
// visitor who never interacts still sees all three.
//
// This is a mock, not the product: it renders synthetic data with no sockets.
// The point is to show the real layout, grid and colour language at a glance.

import { useEffect, useState } from 'react'
import {
  ChevronRight,
  Database,
  Folder,
  Globe,
  Radio,
  ScrollText,
  Search,
  Settings,
  Table2,
  Terminal
} from 'lucide-react'
import Logo from './Logo'
import { useLiveFeed } from '../hooks/useLiveFeed'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './AppMock.css'

const TABS = [
  { id: 'network', label: 'Network', Icon: Globe },
  { id: 'websocket', label: 'WebSocket', Icon: Radio },
  { id: 'console', label: 'Console', Icon: Terminal },
  { id: 'storage', label: 'Storage', Icon: Database },
  { id: 'watermelon', label: 'WatermelonDB', Icon: Table2 },
  { id: 'logs', label: 'Logs', Icon: ScrollText }
]

// Only these three have mock data; the rotation cycles through them.
const ROTATION = ['network', 'console', 'websocket']

export default function AppMock({ active = true }) {
  const [tab, setTab] = useState('network')
  const [pinned, setPinned] = useState(false)
  const reduced = useReducedMotion()
  const { rows, logs, frames } = useLiveFeed({ active })

  // Auto-advance through the three populated panels, unless the visitor has
  // clicked a tab themselves (then it is their window, leave it alone).
  useEffect(() => {
    if (!active || pinned || reduced) return
    const timer = setInterval(() => {
      setTab((cur) => {
        const i = ROTATION.indexOf(cur)
        return ROTATION[(i + 1) % ROTATION.length]
      })
    }, 6200)
    return () => clearInterval(timer)
  }, [active, pinned, reduced])

  const counts = {
    network: rows.length,
    console: logs.length,
    websocket: frames.length,
    storage: 24,
    watermelon: 7,
    logs: 12
  }

  return (
    <div className="mock mock--tilt">
      {/* Title bar */}
      <div className="mock__bar">
        <div className="mock__dots">
          <span className="mock__dot" />
          <span className="mock__dot" />
          <span className="mock__dot" />
        </div>
        <div className="mock__title">
          <Logo size={16} />
          React Native Spy
        </div>
        <div className="mock__spacer" />
        <span className="mock__pill">
          <span className="mock__live" />
          2 CONNECTED
        </span>
        <span className="mock__chip">ws://192.168.1.20:8097</span>
        <div className="mock__icons">
          <Folder size={14} />
          <Settings size={14} />
        </div>
      </div>

      {/* Panel tabs */}
      <div className="mock__tabs" role="tablist" aria-label="Debugger panels">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className="mock__tab"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id)
              setPinned(true)
            }}
          >
            <Icon size={13} />
            {label}
            <span className="mock__count">{counts[id]}</span>
          </button>
        ))}
      </div>

      {/* Device strip */}
      <div className="mock__devices">
        <span className="mock__device mock__device--on">
          <span className="mock__ddot" />
          iPhone 15 Pro
          <span className="mock__count">{rows.length}</span>
        </span>
        <span className="mock__device">
          <span className="mock__ddot" />
          Pixel 8 · Android 14
          <span className="mock__count">31</span>
        </span>
      </div>

      {/* Body */}
      <div className="mock__body">
        <div key={tab} className="mock__panel mock__panel--enter" role="tabpanel">
          {tab === 'network' ? <NetworkPanel rows={rows} /> : null}
          {tab === 'console' ? <ConsolePanel logs={logs} /> : null}
          {tab === 'websocket' ? <WsPanel frames={frames} /> : null}
          {tab === 'storage' ? <StoragePanel /> : null}
          {tab === 'watermelon' ? <WatermelonPanel /> : null}
          {tab === 'logs' ? <LogsPanel /> : null}
        </div>
      </div>
    </div>
  )
}

/* ─── Network ─── */

function NetworkPanel({ rows }) {
  return (
    <>
      <div className="mock__toolbar">
        <span className="mock__search">
          <Search size={11} />
          Filter by URL or method
        </span>
        <span style={{ marginLeft: 'auto' }}>2000 cap · 3 hidden</span>
      </div>
      <div className="mock__cols">
        <span>Method</span>
        <span>URL</span>
        <span>Status</span>
        <span style={{ textAlign: 'right' }}>Size</span>
        <span style={{ textAlign: 'right' }}>Time</span>
      </div>
      <div className="mock__scroll">
        {rows.map((r) => (
          <div key={r.id} className={`mock__row ${r.fresh ? 'mock__row--fresh' : ''}`}>
            <span className={`mock__method m-${r.method}`}>{r.method}</span>
            <span className="mock__url">{r.url}</span>
            {r.status === 'pending' ? (
              <span className="mock__status s-p mock__dots3" />
            ) : (
              <span className={`mock__status s-${String(r.status)[0]}`}>{r.status}</span>
            )}
            <span className="mock__num">{r.status === 'pending' ? '—' : r.size}</span>
            <span className="mock__num">{r.status === 'pending' ? '—' : `${r.ms} ms`}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Console ─── */

function ConsolePanel({ logs }) {
  const levels = ['log', 'info', 'warn', 'error', 'debug']
  return (
    <>
      <div className="mock__toolbar">
        <span className="mock__search">
          <Search size={11} />
          Search messages
        </span>
        <div className="mock__chips">
          {levels.map((l) => (
            <span
              key={l}
              className={`mock__lchip ${
                l === 'error' ? 'mock__lchip--err' : l === 'warn' ? 'mock__lchip--warn' : 'mock__lchip--on'
              }`}
            >
              {l.slice(0, 3).toUpperCase()} {logs.filter((x) => x.level === l).length}
            </span>
          ))}
        </div>
      </div>
      <div className="mock__scroll">
        {logs.map((l) => (
          <div key={l.id} className={`mock__log ${l.fresh ? 'mock__log--fresh' : ''}`}>
            <span className={`mock__lvl lvl-${l.level}`}>{l.level.slice(0, 3).toUpperCase()}</span>
            <span className="mock__t">{l.t}</span>
            <span className="mock__msg">{l.msg}</span>
            <span className="mock__caller">{l.caller}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── WebSocket ─── */

function WsPanel({ frames }) {
  return (
    <div className="mock__ws">
      <div className="mock__conns">
        <div className="mock__conn mock__conn--on">
          <b>wss://rt.example.com</b>
          <span>Connected</span> · {frames.length} frames
        </div>
        <div className="mock__conn">
          <b>wss://push.example.com</b>
          Closed · 218 frames
        </div>
      </div>
      <div className="mock__scroll">
        {frames.map((f) => (
          <div
            key={f.id}
            className={`mock__frame mock__frame--${f.dir} ${f.fresh ? 'mock__frame--fresh' : ''}`}
          >
            <span className={`mock__dir--${f.dir}`}>{f.dir === 'send' ? '↑' : '↓'}</span>
            <span className="mock__t">{f.t}</span>
            <span className="mock__data">{f.data}</span>
            <span className="mock__num">{f.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Storage, WatermelonDB, Logs — static stand-ins ─── */

const KV = [
  ['auth:token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6…', 'string'],
  ['cart:v2', '{"items":[{"sku":"RS-9","qty":2}]}', 'json'],
  ['user:prefs', '{"theme":"dark","haptics":true}', 'json'],
  ['onboarding:seen', 'true', 'boolean'],
  ['lastSync', '1751385072414', 'number'],
  ['device:id', 'rn-8f2c41', 'string']
]

function StoragePanel() {
  return (
    <>
      <div className="mock__toolbar">
        <span className="mock__lchip mock__lchip--on">AsyncStorage</span>
        <span className="mock__lchip">MMKV</span>
        <span style={{ marginLeft: 'auto' }}>24 keys · auto-refresh 2s</span>
      </div>
      <div className="mock__scroll" style={{ justifyContent: 'flex-start' }}>
        {KV.map(([k, v, t]) => (
          <div
            key={k}
            className="mock__log"
            style={{ gridTemplateColumns: '132px minmax(0, 1fr) 58px' }}
          >
            <span className="mock__caller" style={{ borderBottom: 'none', color: 'var(--purple)' }}>
              {k}
            </span>
            <span className="mock__msg">{v}</span>
            <span className="mock__t">{t}</span>
          </div>
        ))}
      </div>
    </>
  )
}

const TABLES = [
  ['posts', '12,481'],
  ['comments', '48,102'],
  ['users', '3,204'],
  ['likes', '91,776'],
  ['tags', '412']
]

function WatermelonPanel() {
  return (
    <>
      <div className="mock__toolbar">
        <span>7 tables</span>
        <span style={{ marginLeft: 'auto' }}>read-only · offset pagination</span>
      </div>
      <div className="mock__scroll" style={{ justifyContent: 'flex-start' }}>
        {TABLES.map(([name, rows]) => (
          <div key={name} className="mock__row" style={{ gridTemplateColumns: '1fr auto' }}>
            <span className="mock__url">
              <ChevronRight size={11} style={{ verticalAlign: -1, opacity: 0.5 }} /> {name}
            </span>
            <span className="mock__num">{rows} rows</span>
          </div>
        ))}
      </div>
    </>
  )
}

const SERVER_LOGS = [
  ['INF', 'WebSocket server listening on 0.0.0.0:8097'],
  ['INF', 'Client connected: iPhone 15 Pro (ios) rn-8f2c41'],
  ['INF', 'Client connected: Pixel 8 (android) rn-2b91de'],
  ['WRN', 'Client rn-4d02aa closed without close frame'],
  ['INF', 'Client reconnected: rn-4d02aa after 2 retries'],
  ['ERR', 'Frame parse failed: unexpected token at position 0']
]

function LogsPanel() {
  return (
    <>
      <div className="mock__toolbar">
        <div className="mock__chips" style={{ marginLeft: 0 }}>
          <span className="mock__lchip mock__lchip--on">INF</span>
          <span className="mock__lchip mock__lchip--warn">WRN</span>
          <span className="mock__lchip mock__lchip--err">ERR</span>
        </div>
        <span style={{ marginLeft: 'auto' }}>500-entry buffer</span>
      </div>
      <div className="mock__scroll" style={{ justifyContent: 'flex-start' }}>
        {SERVER_LOGS.map(([lvl, msg], i) => (
          <div key={i} className="mock__log" style={{ gridTemplateColumns: '34px minmax(0, 1fr)' }}>
            <span
              className={`mock__lvl ${
                lvl === 'ERR' ? 'lvl-error' : lvl === 'WRN' ? 'lvl-warn' : 'lvl-info'
              }`}
            >
              {lvl}
            </span>
            <span className="mock__msg">{msg}</span>
          </div>
        ))}
      </div>
    </>
  )
}
