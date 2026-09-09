// src/renderer/components/rnspy-devtools/WebSocketTab.jsx

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Braces, Copy, EyeOff, Radio } from 'lucide-react'
import toast from 'react-hot-toast'
import { useVirtualRows } from '../../hooks/useVirtualRows'
import {
  Badge, Button, EmptyState, SearchInput, SectionLabel, Toolbar,
} from '../ui'
import cn from '../ui/cn'
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
      <div className="pane bg-panel">
        <EmptyState icon={Braces} description="Select a frame to view its payload" />
      </div>
    )
  }

  const pretty = prettyPrintFrame(frame.data)
  const srLabel = signalRLabel(frame.data)

  return (
    <div className="pane bg-panel">
      <div className="flex shrink-0 items-center gap-2 border-b border-subtle bg-panel-alt px-3 py-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 font-ui text-xs font-medium',
            frame.dir === 'send' ? 'text-success-fg' : 'text-info-fg',
          )}
        >
          {frame.dir === 'send'
            ? <ArrowUp size={10} aria-hidden="true" />
            : <ArrowDown size={10} aria-hidden="true" />}
          {frame.dir === 'send' ? 'Sent' : 'Received'}
        </span>
        <span className="font-mono text-xs text-faint tabular-nums">
          {formatTime(frame.timestamp)}
        </span>
        {srLabel && (
          <Badge tone="accent" size="sm">{srLabel}</Badge>
        )}
        <span className="ml-auto font-mono text-[10px] text-faint tabular-nums">
          {formatSize(frame.size)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            copyText(pretty)
            toast.success('Frame copied', { duration: 1200 })
          }}
          title="Copy payload"
        >
          <Copy size={11} aria-hidden="true" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear} title="Close detail">
          Close
        </Button>
      </div>
      <pre className="m-0 min-h-0 flex-1 select-text overflow-auto bg-panel p-3 font-mono text-xs text-fg leading-normal whitespace-pre-wrap break-words">
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
    <div ref={containerRef} className="flex min-h-0 flex-1">
      {/* ─── Connection List (virtualized) ─── */}
      {/* Width is drag-resizable, so the flex-basis stays inline. */}
      <div
        className="flex min-w-0 flex-col border-r border-subtle bg-panel-alt"
        style={{ flex: `0 0 ${connWidth}px` }}
      >
        <div className="border-b border-subtle bg-sidebar px-3 py-2">
          <SectionLabel>Connections ({sorted.length})</SectionLabel>
        </div>
        <div
          ref={connScrollRef}
          onScroll={connVirt.onScroll}
          className="min-h-0 flex-1 overflow-auto"
        >
          {sorted.length === 0 ? (
            <EmptyState
              icon={Radio}
              title="No WebSocket connections"
              description="WebSocket connections will appear here."
            />
          ) : (
            <>
              {connVirt.topSpacer > 0 && <div style={{ height: connVirt.topSpacer }} />}
              {sorted.slice(connVirt.startIdx, connVirt.endIdx).map((conn) => {
                const isSel = conn.wsId === (selected?.wsId || null)
                const isSR = isSignalRConnection(conn)
                return (
                  <button
                    key={conn.wsId}
                    type="button"
                    aria-current={isSel ? 'true' : undefined}
                    onClick={() => selectConnection(conn.wsId)}
                    className={cn(
                      'flex h-row-lg w-full items-center gap-2 border-b border-subtle px-3 py-2',
                      'text-left transition-colors duration-100 focus-ring',
                      isSel ? 'bg-card-hover' : 'bg-transparent hover:bg-card-hover',
                    )}
                  >
                    {/* Status colour comes from statusColor() — a runtime value. */}
                    <span
                      aria-hidden="true"
                      className="h-[5px] w-[5px] shrink-0 rounded-full"
                      style={{ background: statusColor(conn.status) }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 leading-tight">
                        {isSR && (
                          <span
                            title="SignalR connection"
                            className="shrink-0 rounded-sm bg-accent-muted px-[3px] font-ui text-[8px] font-bold leading-[14px] text-accent"
                          >
                            SR
                          </span>
                        )}
                        <span className="cell-truncate font-mono text-xs text-muted" title={conn.url}>
                          {shortUrl(conn.url)}
                        </span>
                      </div>
                      <div className="mt-px flex gap-2 font-ui text-[10px] text-faint leading-tight">
                        <span style={{ color: statusColor(conn.status) }}>
                          {statusLabel(conn.status)}
                        </span>
                        <span>{conn.frames?.length || 0} frames</span>
                      </div>
                    </div>
                  </button>
                )
              })}
              {connVirt.bottomSpacer > 0 && <div style={{ height: connVirt.bottomSpacer }} />}
            </>
          )}
        </div>
      </div>

      {/* ─── Resizer ─── */}
      <div
        className="panel-resizer shrink-0 cursor-col-resize"
        onMouseDown={startResize}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize connection list"
      />

      {/* ─── Frame Stream (virtualized) ─── */}
      <div className="pane bg-panel">
        <Toolbar>
          <SearchInput
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter frames…"
            aria-label="Filter WebSocket frames"
            count={frames.length}
          />
          <LevelChip
            active={hidePings}
            color="var(--accent-primary)"
            icon={<EyeOff size={11} />}
            label="Hide pings"
            onClick={() => setHidePings((v) => !v)}
            title={hidePings ? 'Show ping/pong frames' : 'Hide ping/pong frames'}
          />
          <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
        </Toolbar>

        {/* Virtualized frames */}
        <div
          ref={framesScrollRef}
          onScroll={frameVirt.onScroll}
          className="min-h-0 flex-1 overflow-auto"
        >
          {!selected ? (
            <EmptyState
              icon={Radio}
              title="Select a WebSocket connection"
              description="Frames sent and received will appear here."
            />
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
                    className={cn(
                      'flex h-row cursor-pointer items-center gap-2 border-b border-subtle px-3',
                      'font-mono text-xs transition-colors duration-100',
                      isSelected
                        ? 'bg-card-hover'
                        // Outgoing frames get the diff-add tint so direction is
                        // readable without reading the arrow.
                        : f.dir === 'send'
                          ? 'bg-diff-add hover:bg-card-hover'
                          : 'bg-transparent hover:bg-row-hover',
                    )}
                  >
                    <span className="shrink-0">
                      {f.dir === 'send'
                        ? <ArrowUp size={10} className="text-success-fg" aria-hidden="true" />
                        : <ArrowDown size={10} className="text-info-fg" aria-hidden="true" />}
                      <span className="sr-only">{f.dir === 'send' ? 'Sent' : 'Received'}</span>
                    </span>
                    <span className="w-20 shrink-0 text-[10px] text-faint tabular-nums">
                      {formatTime(f.timestamp)}
                    </span>
                    {srLabel && (
                      <span className="shrink-0 rounded-sm bg-accent-muted px-1 py-px font-ui text-[9px] font-medium text-accent">
                        {srLabel}
                      </span>
                    )}
                    <span
                      className="cell-truncate flex-1 select-text text-muted"
                      title={String(f.data)}
                    >
                      {displayDataOneline(f.data)}
                    </span>
                    <span className="shrink-0 text-[10px] text-faint tabular-nums">
                      {formatSize(f.size)}
                    </span>
                  </div>
                )
              })}
              {frameVirt.bottomSpacer > 0 && <div style={{ height: frameVirt.bottomSpacer }} />}
            </>
          )}
        </div>

        {/* ─── Detail resizer ─── */}
        <div
          className="panel-resizer h-1.5 shrink-0 cursor-row-resize"
          onMouseDown={startDetailResize}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize frame detail"
        />

        {/* ─── Frame detail ─── Height is drag-resizable. */}
        <div className="flex min-h-0 shrink-0" style={{ height: detailHeight }}>
          <FrameDetail
            frame={selectedFrameIdx != null ? frames[selectedFrameIdx] : null}
            onClear={() => setSelectedFrameIdx(null)}
          />
        </div>
      </div>
    </div>
  )
})
