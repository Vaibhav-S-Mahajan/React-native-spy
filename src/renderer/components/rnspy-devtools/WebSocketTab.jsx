// src/renderer/components/rnspy-devtools/WebSocketTab.jsx

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Braces, Copy, EyeOff, Radio, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useVirtualRows } from '../../hooks/useVirtualRows'
import { EMPTY_STATE, INPUT_BASE, SECTION_LABEL, BTN_GHOST } from '../../styles/shared'
import LevelChip from './LevelChip'
import ToolbarActions from './ToolbarActions'

const CONN_ROW_HEIGHT = 52
const FRAME_ROW_HEIGHT = 28

function shortUrl(url) {
  if (!url) return ''
  try { return new URL(url).pathname + (new URL(url).search || '') }
  catch { return url }
}

function statusColor(status) {
  if (status === 'open') return 'var(--status-success-text)'
  if (status === 'error') return 'var(--status-danger-text)'
  return 'var(--text-tertiary)'
}

function statusLabel(status) {
  if (status === 'open') return 'Connected'
  if (status === 'error') return 'Error'
  if (status === 'closed') return 'Closed'
  return status
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}

function formatSize(bytes) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes}B`
  return `${(bytes / 1024).toFixed(1)}K`
}

const RS = '\x1e'

const SIGNALR_MSG_TYPES = {
  1: 'Invocation',
  2: 'StreamItem',
  3: 'Completion',
  4: 'StreamInvocation',
  5: 'CancelInvocation',
  6: 'Ping',
  7: 'Close',
}

function isSignalRFrame(data) {
  if (typeof data !== 'string') return false
  const parts = data.split(RS).filter(Boolean)
  if (parts.length === 0) return false
  try {
    const msg = JSON.parse(parts[0])
    return msg && typeof msg.type === 'number' && msg.type >= 1 && msg.type <= 7
  } catch { return false }
}

function isSignalRConnection(conn) {
  if (!conn) return false
  if (/\/hub[s]?\b/i.test(conn.url || '')) return true
  if (/signalr/i.test(conn.url || '')) return true
  const firstFrame = conn.frames?.[0]
  if (firstFrame && typeof firstFrame.data === 'string') {
    const d = firstFrame.data.split(RS).filter(Boolean)[0]
    try { const m = JSON.parse(d); if (m && m.protocol === 'json') return true } catch {}
  }
  return false
}

function isPingFrame(data) {
  if (typeof data !== 'string') return false
  const c = data.split(RS).join('').trim()
  return c === '{"type":6}' || c === '{}'
}

function signalRLabel(data) {
  if (typeof data !== 'string') return null
  const parts = data.split(RS).filter(Boolean)
  if (parts.length === 0) return null
  try {
    const msg = JSON.parse(parts[0])
    if (!msg || typeof msg.type !== 'number') return null
    const label = SIGNALR_MSG_TYPES[msg.type]
    if (!label) return null
    if (msg.type === 1 && msg.target) return `${label}:${msg.target}`
    if (msg.type === 3 && msg.invocationId) return `${label}:#${msg.invocationId}`
    return label
  } catch { return null }
}

function displayDataOneline(data) {
  if (typeof data !== 'string') {
    try { return JSON.stringify(data) } catch { return String(data) }
  }
  if (data.indexOf(RS) !== -1) {
    return data.split(RS).filter(Boolean).map((s) => {
      try { return JSON.stringify(JSON.parse(s)) } catch { return s }
    }).join(' | ')
  }
  try { return JSON.stringify(JSON.parse(data)) } catch { return data }
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}

function prettyPrintFrame(data) {
  if (typeof data !== 'string') {
    try { return JSON.stringify(data, null, 2) } catch { return String(data) }
  }
  if (data.indexOf(RS) !== -1) {
    return data.split(RS).filter(Boolean).map((part, i) => {
      try { return JSON.stringify(JSON.parse(part), null, 2) } catch { return part }
    }).join('\n\n----- part -----\n\n')
  }
  try {
    const parsed = JSON.parse(data)
    return JSON.stringify(parsed, null, 2)
  } catch { return data }
}

function FrameDetail({ frame, onClear }) {
  if (!frame) {
    return (
      <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)', padding: 'var(--space-3)' }}>
        <Braces size={18} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Select a frame to view its payload
        </div>
      </div>
    )
  }

  const pretty = prettyPrintFrame(frame.data)
  const srLabel = signalRLabel(frame.data)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)', flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-panel-alt)',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
          fontSize: 'var(--text-xs)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--font-weight-medium)',
          color: frame.dir === 'send' ? 'var(--status-success-text)' : 'var(--status-info-text)',
        }}>
          {frame.dir === 'send' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {frame.dir === 'send' ? 'Sent' : 'Received'}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {formatTime(frame.timestamp)}
        </span>
        {srLabel && (
          <span style={{
            fontSize: 9, padding: '1px 4px', borderRadius: 3,
            background: 'var(--accent-muted)', color: 'var(--accent-primary)',
            fontFamily: 'var(--font-ui)', fontWeight: 'var(--font-weight-medium)',
          }}>
            {srLabel}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {formatSize(frame.size)}
        </span>
        <button
          onClick={() => {
            copyText(pretty)
            toast.success('Frame copied', { duration: 1200 })
          }}
          style={{ ...BTN_GHOST, height: 22, padding: '0 var(--space-2)' }}
          title="Copy payload"
        >
          <Copy size={11} />
          <span style={{ fontSize: 10 }}>Copy</span>
        </button>
        <button
          onClick={onClear}
          style={{ ...BTN_GHOST, height: 22, padding: '0 var(--space-2)' }}
          title="Close detail"
        >
          <span style={{ fontSize: 10 }}>Close</span>
        </button>
      </div>
      <pre style={{
        flex: 1, minHeight: 0, overflow: 'auto',
        margin: 0, padding: 'var(--space-3)',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        lineHeight: 'var(--line-height-base)', color: 'var(--text-primary)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        background: 'var(--bg-panel)',
      }}>
        {pretty}
      </pre>
    </div>
  )
}

export default forwardRef(function WebSocketTab({ connections, onClear, onReload, canReload }, ref) {
  const [selectedId, setSelectedId] = useState(null)
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(null)
  const [hidePings, setHidePings] = useState(true)
  const [search, setSearch] = useState('')
  const [connWidth, setConnWidth] = useState(280)
  const [detailHeight, setDetailHeight] = useState(240)
  const detailResizeRef = useRef(false)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  const connScrollRef = useRef(null)
  const framesScrollRef = useRef(null)
  const searchRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus(),
  }), [])

  const startResize = useCallback((e) => {
    e.preventDefault()
    draggingRef.current = true
    const move = (ev) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const w = ev.clientX - rect.left
      setConnWidth(Math.min(rect.width - 240, Math.max(180, w)))
    }
    const up = () => {
      draggingRef.current = false
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }, [])

  const selectConnection = useCallback((wsId) => {
    setSelectedId(wsId)
    setSelectedFrameIdx(null)
  }, [])

  const startDetailResize = useCallback((e) => {
    e.preventDefault()
    detailResizeRef.current = true
    const move = (ev) => {
      if (!detailResizeRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const h = rect.bottom - ev.clientY
      setDetailHeight(Math.min(rect.height - 120, Math.max(120, h)))
    }
    const up = () => {
      detailResizeRef.current = false
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }, [])

  const sorted = useMemo(
    () => connections.slice().sort((a, b) =>
      (b.seq ?? 0) - (a.seq ?? 0) || (b.startTime ?? 0) - (a.startTime ?? 0)),
    [connections],
  )

  const selected = useMemo(
    () => sorted.find((c) => c.wsId === selectedId) || sorted[0] || null,
    [sorted, selectedId],
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

  // Virtualize connections list
  const connVirt = useVirtualRows({
    scrollRef: connScrollRef, totalRows: sorted.length, rowHeight: CONN_ROW_HEIGHT,
  })

  // Virtualize frames list
  const frameVirt = useVirtualRows({
    scrollRef: framesScrollRef, totalRows: frames.length, rowHeight: FRAME_ROW_HEIGHT,
    stickyBottom: true,
  })

  return (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* ─── Connection List (virtualized) ─── */}
      <div style={{
        flex: `0 0 ${connWidth}px`, minWidth: 0, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-panel-alt)',
      }}>
        <div style={{
          padding: 'var(--space-2) var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
          ...SECTION_LABEL, fontSize: 10,
        }}>
          CONNECTIONS ({sorted.length})
        </div>
        <div ref={connScrollRef} onScroll={connVirt.onScroll}
          style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {sorted.length === 0 ? (
            <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel-alt)' }}>
              <Radio size={20} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
                No WebSocket connections
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                WebSocket connections will appear here
              </div>
            </div>
          ) : (
            <>
              {connVirt.topSpacer > 0 && <div style={{ height: connVirt.topSpacer }} />}
              {sorted.slice(connVirt.startIdx, connVirt.endIdx).map((conn) => {
            const isSel = conn.wsId === (selected?.wsId || null)
            const isSR = isSignalRConnection(conn)
            return (
              <div
                key={conn.wsId}
                onClick={() => selectConnection(conn.wsId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)', cursor: 'pointer',
                  height: CONN_ROW_HEIGHT,
                  background: isSel ? 'var(--bg-card-hover)' : 'transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 80ms',
                }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = '' }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                  background: statusColor(conn.status),
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                    lineHeight: 'var(--line-height-tight)',
                  }}>
                    {isSR && (
                      <span style={{
                        fontSize: 8, padding: '0 3px', borderRadius: 2, flexShrink: 0,
                        background: 'var(--accent-muted)', color: 'var(--accent-primary)',
                        fontFamily: 'var(--font-ui)', fontWeight: 'var(--font-weight-bold)',
                        lineHeight: '14px',
                      }}>SR</span>
                    )}
                    <span style={{
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }} title={conn.url}>
                      {shortUrl(conn.url)}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
                    display: 'flex', gap: 'var(--space-2)', marginTop: 1,
                    lineHeight: 'var(--line-height-tight)',
                  }}>
                    <span style={{ color: statusColor(conn.status) }}>{statusLabel(conn.status)}</span>
                    <span>{conn.frames?.length || 0} frames</span>
                  </div>
                </div>
              </div>
            )
          })}
              {connVirt.bottomSpacer > 0 && <div style={{ height: connVirt.bottomSpacer }} />}
            </>
          )}
        </div>
      </div>

      {/* ─── Resizer ─── */}
      <div
        className="panel-resizer"
        onMouseDown={startResize}
        style={{ cursor: 'col-resize', flexShrink: 0 }}
      />

      {/* ─── Frame Stream (virtualized) ─── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-panel)' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: '0 var(--space-3)', height: 38, flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel-alt)',
        }}>
          <Search size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter frames…"
            style={{
              ...INPUT_BASE, flex: 1, height: 30, fontSize: 'var(--text-sm)',
              border: 'none', background: 'transparent', padding: 0,
            }}
          />
          <LevelChip
            active={hidePings}
            color="var(--accent-primary)"
            icon={<EyeOff size={11} />}
            label="Hide pings"
            onClick={() => setHidePings((v) => !v)}
            title={hidePings ? 'Show ping/pong frames' : 'Hide ping/pong frames'}
          />
          <span style={{
            fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
          }}>
            {frames.length}
          </span>
          <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Virtualized frames */}
          <div ref={framesScrollRef} onScroll={frameVirt.onScroll}
            style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {!selected ? (
              <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
                <Radio size={20} style={{ opacity: 0.3 }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
                  Select a WebSocket connection
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Frames sent and received will appear here
                </div>
              </div>
            ) : (
              <>
                {frameVirt.topSpacer > 0 && <div style={{ height: frameVirt.topSpacer }} />}
                {frames.slice(frameVirt.startIdx, frameVirt.endIdx).map((f, i) => {
                  const idx = frameVirt.startIdx + i
                  const srLabel = signalRLabel(f.data)
                  const isSelected = selectedFrameIdx === idx
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedFrameIdx(idx)}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: '0 var(--space-3)', height: FRAME_ROW_HEIGHT,
                        fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected
                          ? 'var(--bg-card-hover)'
                          : f.dir === 'send'
                            ? 'var(--diff-add-bg)'
                            : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 80ms',
                      }}
                    >
                      <span style={{ flexShrink: 0 }}>
                        {f.dir === 'send'
                          ? <ArrowUp size={10} color="var(--status-success-text)" />
                          : <ArrowDown size={10} color="var(--status-info-text)" />}
                      </span>
                      <span style={{ width: 80, flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10 }}>
                        {formatTime(f.timestamp)}
                      </span>
                      {srLabel && (
                        <span style={{
                          flexShrink: 0, fontSize: 9, padding: '1px 4px', borderRadius: 3,
                          background: 'var(--accent-muted)', color: 'var(--accent-primary)',
                          fontFamily: 'var(--font-ui)', fontWeight: 'var(--font-weight-medium)',
                        }}>
                          {srLabel}
                        </span>
                      )}
                      <span style={{
                        flex: 1, minWidth: 0, color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        userSelect: 'text',
                      }} title={String(f.data)}>
                        {displayDataOneline(f.data)}
                      </span>
                      <span style={{ flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10 }}>
                        {formatSize(f.size)}
                      </span>
                    </div>
                  )
                })}
                {frameVirt.bottomSpacer > 0 && <div style={{ height: frameVirt.bottomSpacer }} />}
              </>
            )}
          </div>
        </div>

        {/* ─── Detail resizer ─── */}
        <div
          className="panel-resizer"
          onMouseDown={startDetailResize}
          style={{ cursor: 'row-resize', flexShrink: 0, height: 6 }}
        />

        {/* ─── Frame detail ─── */}
        <div style={{ height: detailHeight, flexShrink: 0, minHeight: 0, display: 'flex' }}>
          <FrameDetail
            frame={selectedFrameIdx != null ? frames[selectedFrameIdx] : null}
            onClear={() => setSelectedFrameIdx(null)}
          />
        </div>
      </div>
    </div>
  )
})
