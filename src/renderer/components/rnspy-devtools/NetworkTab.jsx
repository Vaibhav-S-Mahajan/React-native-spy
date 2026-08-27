// src/renderer/components/rnspy-devtools/NetworkTab.jsx

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  ArrowDownUp, BarChart3, Braces, ChevronDown, ChevronRight, Clipboard, Code,
  Copy, EyeOff, FileCode, FileJson, Globe, Link, MoreVertical, Search, Terminal, X,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useVirtualRows } from '../../hooks/useVirtualRows'
import CursorMenu, { MenuItem, MenuDivider, MenuLabel } from './CursorMenu'
import {
  toCurl, toCurlPowerShell, toFetch, toNodeFetch, toAxios, toHttpie,
  toRawHttp, toHarEntry, toQueryParams, prettyBody, headersToText, copyText,
} from '../../utils/curl'
import { requestName, isRequestHidden } from '../../utils/requestFilters'
import { EMPTY_STATE, INPUT_BASE, SECTION_LABEL, BTN_GHOST } from '../../styles/shared'
import LevelChip from './LevelChip'
import ToolbarActions from './ToolbarActions'

const ROW_HEIGHT = 34

// Column tracks. The waterfall is optional, so the grid is assembled rather
// than a single constant — header, ruler and rows all read from the same
// value so they can never drift out of alignment.
const COLS_LEAD = '60px minmax(0, 1fr) 64px 64px 64px'
const COL_WATERFALL = 'minmax(150px, 1.15fr)'
const COL_ACTIONS = '28px'

function gridFor(showWaterfall) {
  return showWaterfall
    ? `${COLS_LEAD} ${COL_WATERFALL} ${COL_ACTIONS}`
    : `${COLS_LEAD} ${COL_ACTIONS}`
}

/* ─── Sorting ───────────────────────────────────────────────
   Each column exposes an accessor plus its "natural" first direction:
   numeric columns open descending (biggest/slowest first, which is what you
   want when hunting a problem), text columns open ascending. */
const SORTS = {
  method: { get: (r) => (r.method || 'GET').toUpperCase(), type: 'text', first: 'asc' },
  url: { get: (r) => shortUrl(r.url).toLowerCase(), type: 'text', first: 'asc' },
  // Pending sorts below every real status; a failed request (0) sits just above.
  status: { get: (r) => (r.pending ? -1 : (r.status ?? 0)), type: 'num', first: 'desc' },
  size: { get: (r) => r.size ?? -1, type: 'num', first: 'desc' },
  duration: { get: (r) => r.duration ?? -1, type: 'num', first: 'desc' },
  // Chronological. `startTime` is when the request began; unlike `seq`, it
  // never changes when a pending request completes, so rows stay in place
  // instead of jumping to the top. `seq` is kept as the final tiebreaker.
  startTime: { get: (r) => r.startTime ?? 0, type: 'num', first: 'desc' },
}

const DEFAULT_SORT = { key: 'startTime', dir: 'desc' }

// Persisted so the waterfall column stays hidden across restarts once the
// user turns it off, instead of resetting to on every launch.
const WATERFALL_KEY = 'rnspyDevtoolsWaterfall'

function readWaterfallPref() {
  try {
    return window.localStorage.getItem(WATERFALL_KEY) !== '0'
  } catch {
    return true
  }
}

function compareBy(key, dir) {
  const spec = SORTS[key] || SORTS.startTime
  const sign = dir === 'asc' ? 1 : -1
  return (a, b) => {
    const av = spec.get(a)
    const bv = spec.get(b)
    let d
    if (spec.type === 'text') d = String(av).localeCompare(String(bv))
    else d = (av ?? 0) - (bv ?? 0)
    if (d !== 0) return d * sign
    // Stable tiebreak so equal values never jitter between renders.
    return ((b.startTime ?? 0) - (a.startTime ?? 0)) || ((b.seq ?? 0) - (a.seq ?? 0))
  }
}

/* ─── Waterfall time axis ───────────────────────────────────
   Picks a round tick interval (1/2/5 × 10ⁿ) so the ruler reads
   "0 / 250ms / 500ms" instead of "0 / 237ms / 474ms". */
function niceStep(span, targetTicks = 4) {
  if (!(span > 0)) return 1
  const raw = span / targetTicks
  const pow = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / pow
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  return mult * pow
}

/* An in-flight request contributes at most this much to the axis SCALE. Without
   a cap, a request abandoned when the device disconnects grows forever and
   squashes every other bar. 30s is well past any realistic API call. */
const PENDING_AXIS_CAP = 30000

function formatAxis(ms) {
  if (ms >= 1000) return `${+(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1)}s`
  return `${Math.round(ms)}ms`
}

function statusColor(status, pending) {
  if (pending) return 'var(--text-tertiary)'
  if (status == null || status === 0) return 'var(--status-danger-text)'
  if (status >= 500) return 'var(--status-danger-text)'
  if (status >= 400) return 'var(--status-warning-text)'
  if (status >= 300) return 'var(--status-info-text)'
  if (status >= 200) return 'var(--status-success-text)'
  return 'var(--text-secondary)'
}

function statusRowBg(status, pending) {
  if (pending) return 'transparent'
  if (status >= 500) return 'var(--status-danger-bg)'
  if (status >= 400) return 'var(--status-warning-bg)'
  return 'transparent'
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
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} K`
  return `${(bytes / 1048576).toFixed(1)} M`
}

function formatDuration(ms) {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
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

export default forwardRef(function NetworkTab({ requests, hiddenRules = [], onHideName, onClear, onReload, canReload }, ref) {
  const [selectedId, setSelectedId] = useState(null)
  const [menu, setMenu] = useState(null)
  const [search, setSearch] = useState('')
  const [detailTab, setDetailTab] = useState('headers')
  const [listPct, setListPct] = useState(55)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [showWaterfall, setShowWaterfall] = useState(readWaterfallPref)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)
  const scrollRef = useRef(null)
  const searchRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus(),
  }), [])

  // Re-render pending rows so their bars grow while in flight. Only runs when
  // something is actually pending, so an idle panel costs nothing.
  const hasPending = useMemo(() => requests.some((r) => r.pending), [requests])
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!hasPending) return undefined
    const t = setInterval(() => setTick((n) => n + 1), 250)
    return () => clearInterval(t)
  }, [hasPending])

  // Click a header: same column toggles direction, new column starts at that
  // column's natural direction. Clicking the active column a third time
  // restores the default chronological sort.
  const toggleSort = useCallback((key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: SORTS[key]?.first || 'desc' }
      const natural = SORTS[key]?.first || 'desc'
      const flipped = prev.dir === 'asc' ? 'desc' : 'asc'
      // Third click returns to default rather than cycling forever.
      if (prev.dir !== natural) return DEFAULT_SORT
      return { key, dir: flipped }
    })
  }, [])

  const startResize = useCallback((e) => {
    e.preventDefault()
    draggingRef.current = true
    const move = (ev) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((ev.clientX - rect.left) / rect.width) * 100
      setListPct(Math.min(78, Math.max(22, pct)))
    }
    const up = () => {
      draggingRef.current = false
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }, [])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return requests.filter((r) => {
      if (isRequestHidden(r, hiddenRules)) return false
      if (q && !(r.url || '').toLowerCase().includes(q) && !(r.method || '').toLowerCase().includes(q)) return false
      return true
    })
  }, [requests, hiddenRules, search])

  const sorted = useMemo(
    () => visible.slice().sort(compareBy(sort.key, sort.dir)),
    [visible, sort.key, sort.dir],
  )

  const hiddenCount = requests.length - visible.length
  // Distinguishes "nothing captured" from "your filter matched nothing" —
  // previously both rendered as a bare empty list.
  const noMatches = requests.length > 0 && visible.length === 0

  /* Shared time axis for the waterfall.
     Every bar is positioned against the same window so offsets are comparable
     across rows — that's what makes it a waterfall rather than six unrelated
     progress bars. The window spans the earliest start to the latest end among
     currently visible requests, regardless of sort order. */
  const axis = useMemo(() => {
    if (!visible.length) return null

    const now = Date.now()
    const starts = []
    let max = -Infinity
    let maxDur = 0

    for (const r of visible) {
      const s = r.startTime
      if (typeof s !== 'number' || !Number.isFinite(s)) continue
      /* A request that never completes — device disconnected mid-flight — would
         otherwise grow without bound and inflate the axis forever, collapsing
         every other bar to a sliver. Its contribution to the SCALE is capped;
         the bar itself still reports the true elapsed time in its tooltip. */
      const raw = r.pending ? Math.max(0, now - s) : (r.duration || 0)
      const dur = r.pending ? Math.min(raw, PENDING_AXIS_CAP) : raw
      const end = s + dur
      starts.push(s)
      if (end > max) max = end
      if (dur > maxDur) maxDur = dur
    }
    if (!starts.length || !Number.isFinite(max)) return null

    /* The axis is WINDOWED, not min→max.
       A naive full-span axis breaks in normal use: the buffer holds up to 2000
       requests, so after a few minutes the oldest request stretches the span to
       minutes and every recent bar collapses to an invisible sliver. One request
       with a skewed clock does the same thing instantly.

       So the window drops the oldest 10% of start times, then widens if needed
       to fit the single longest bar. Anything starting before the window is
       clamped to the left edge and flagged, rather than silently distorting the
       scale for everything else. */
    starts.sort((a, b) => a - b)
    const p10 = starts[Math.floor(starts.length * 0.1)]
    const span = Math.max(max - p10, maxDur, 50)
    const min = max - span

    return { min, max, span, step: niceStep(span) }
  }, [visible])

  const selected = useMemo(
    () => sorted.find((r) => r.id === selectedId) || null,
    [sorted, selectedId],
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

  const DETAIL_TABS = [
    { key: 'headers', label: 'Headers' },
    { key: 'request', label: 'Payload' },
    { key: 'response', label: 'Response' },
    { key: 'timing', label: 'Timing' },
  ]

  return (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* ─── Request List (left panel) ─── */}
      <div style={{
        flex: selected ? `0 0 ${listPct}%` : 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-panel)',
        borderRight: selected ? '1px solid var(--border-subtle)' : 'none',
      }}>
        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: '0 var(--space-3)',
          height: 38, flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel-alt)',
        }}>
          <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter…"
            style={{
              ...INPUT_BASE, flex: 1, height: 30, fontSize: 'var(--text-sm)',
              border: 'none', background: 'transparent', padding: 0,
            }}
          />
          {hiddenCount > 0 && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 2,
              fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
            }}>
              <EyeOff size={9} />
              {hiddenCount}
            </span>
          )}
          {/* Waterfall toggle. aria-pressed (on the chip) + the icon carry
              the state, not colour alone. */}
          <LevelChip
            active={showWaterfall}
            color="var(--accent-primary)"
            icon={<BarChart3 size={11} />}
            label="Waterfall"
            onClick={() => setShowWaterfall((v) => {
              const next = !v
              try { window.localStorage.setItem(WATERFALL_KEY, next ? '1' : '0') } catch { /* non-fatal */ }
              return next
            })}
            title={showWaterfall ? 'Hide waterfall' : 'Show waterfall'}
          />
          <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
        </div>

        {requests.length === 0 ? (
          <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
            <ArrowDownUp size={20} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
              No network requests yet
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              HTTP requests from this device will appear here
            </div>
          </div>
        ) : (
          <>
            {/* Column headers — clickable to sort */}
            <div
              role="row"
              style={{
                display: 'grid', gridTemplateColumns: gridFor(showWaterfall),
                alignItems: 'stretch', height: 24, flexShrink: 0,
                padding: '0 var(--space-3)',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-panel-alt)',
              }}
            >
              <SortHeader label="Method" sortKey="method" sort={sort} onSort={toggleSort} />
              <SortHeader label="URL" sortKey="url" sort={sort} onSort={toggleSort} />
              <SortHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} align="right" />
              <SortHeader label="Size" sortKey="size" sort={sort} onSort={toggleSort} align="right" />
              <SortHeader label="Time" sortKey="duration" sort={sort} onSort={toggleSort} align="right" />
              {showWaterfall && (
                <WaterfallRuler axis={axis} sort={sort} onSort={toggleSort} />
              )}
              <span />
            </div>

            {/* Filter matched nothing — distinct from "nothing captured yet",
                which previously rendered as a bare empty scroll area. */}
            {noMatches && (
              <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
                <Search size={20} style={{ opacity: 0.3 }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
                  No matching requests
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  {requests.length} captured
                  {search.trim() ? <> · no match for “{search.trim()}”</> : null}
                  {hiddenCount > 0 ? <> · {hiddenCount} hidden by rules</> : null}
                </div>
                {search.trim() && (
                  <button onClick={() => setSearch('')} style={{ ...BTN_GHOST, marginTop: 'var(--space-1)' }}>
                    Clear filter
                  </button>
                )}
              </div>
            )}

            {/* Virtualized rows */}
            <div
              ref={scrollRef}
              onScroll={onScroll}
              style={{ flex: 1, minHeight: 0, overflow: 'auto', display: noMatches ? 'none' : undefined }}
            >
          {topSpacer > 0 && <div style={{ height: topSpacer }} />}
          {sorted.slice(startIdx, endIdx).map((r) => {
            const isSelected = r.id === selectedId
            return (
              <div
                key={r.id}
                onClick={() => { setSelectedId(r.id) }}
                onContextMenu={(e) => openMenu(e, r)}
                style={{
                  display: 'grid', gridTemplateColumns: gridFor(showWaterfall),
                  alignItems: 'center', height: ROW_HEIGHT,
                  padding: '0 var(--space-3)', cursor: 'pointer',
                  background: isSelected
                    ? 'var(--bg-card-hover)'
                    : statusRowBg(r.status, r.pending),
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)',
                  lineHeight: 'var(--line-height-tight)',
                  transition: 'background-color 60ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-card-hover)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = statusRowBg(r.status, r.pending) || ''
                }}
              >
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: methodColor(r.method), fontSize: 'var(--text-xs)' }}>
                  {(r.method || 'GET').toUpperCase()}
                </span>
                <span style={{
                  color: 'var(--text-secondary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontSize: 'var(--text-xs)', paddingRight: 'var(--space-2)',
                }} title={r.url}>
                  {shortUrl(r.url)}
                </span>
                <span style={{
                  textAlign: 'right', fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-xs)', color: statusColor(r.status, r.pending),
                }}>
                  {r.pending ? (
                    <span className="bubble-dots" role="status" aria-label="Pending">
                      <span /><span /><span />
                    </span>
                  ) : (r.status || '0')}
                </span>
                <span style={{ textAlign: 'right', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                  {formatSize(r.size)}
                </span>
                <span style={{ textAlign: 'right', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                  {formatDuration(r.duration)}
                </span>
                {showWaterfall && <WaterfallBar req={r} axis={axis} />}
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); openMenu(e, r) }}
                    style={{
                      border: 'none', background: 'transparent',
                      color: 'var(--text-tertiary)', cursor: 'pointer',
                      padding: 2, display: 'flex', borderRadius: 'var(--radius-sm)',
                      opacity: 0, transition: 'opacity 80ms',
                    }}
                    className="row-action-btn"
                    title="Actions"
                  >
                    <MoreVertical size={12} />
                  </button>
                </span>
              </div>
            )
          })}
          {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
          </div>
          </>
        )}
      </div>

      {/* ─── Detail Panel (right) ─── */}
      {selected && (
        <>
          <div
            className="panel-resizer"
            onMouseDown={startResize}
            style={{ cursor: 'col-resize', flexShrink: 0 }}
          />
          <div style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
            background: 'var(--bg-panel-alt)', overflow: 'hidden',
          }}>
          {/* Detail header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: 'var(--space-2) var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-sidebar)',
            gap: 'var(--space-2)', flexShrink: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                lineHeight: 'var(--line-height-tight)',
              }}>
                <span style={{ color: methodColor(selected.method) }}>
                  {(selected.method || 'GET').toUpperCase()}
                </span>{' '}
                {shortUrl(selected.url)}
              </div>
            </div>
            <button onClick={() => setSelectedId(null)} style={{
              ...BTN_GHOST, padding: 2, height: 20,
            }}>
              <X size={12} />
            </button>
          </div>

          {/* Detail sub-tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-sidebar)', flexShrink: 0,
          }}>
            {DETAIL_TABS.map((dt) => (
              <button
                key={dt.key}
                onClick={() => setDetailTab(dt.key)}
                style={{
                  padding: '0 var(--space-3)', height: 26,
                  border: 'none',
                  borderBottom: detailTab === dt.key ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  background: 'transparent',
                  color: detailTab === dt.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-ui)', cursor: 'pointer',
                }}
              >
                {dt.label}
              </button>
            ))}
          </div>

          {/* Detail content */}
          <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-3)' }}>
            {detailTab === 'headers' && <HeadersDetail req={selected} />}
            {detailTab === 'request' && <BodyDetail body={selected.requestBody} label="Request Body" />}
            {detailTab === 'response' && <BodyDetail body={selected.responseBody} label="Response Body" />}
            {detailTab === 'timing' && <TimingDetail req={selected} />}
          </div>
        </div>
      </>)}

      {/* ─── Context Menu ─── */}
      {menu && (
        <CursorMenu anchor={{ x: menu.x, y: menu.y }} onClose={closeMenu} width={280}>
          {/* ── Quick Copy ── */}
          <MenuItem
            icon={<Clipboard size={11} />}
            label="Copy"
            hint="⌘⇧C"
            onClick={() => {
              const r = menu.req
              const parts = [
                `URL: ${r.url || ''}`,
                `Method: ${(r.method || 'GET').toUpperCase()}`,
                `Status: ${r.pending ? 'Pending' : (r.status || '0')}`,
                r.requestBody ? `Payload: ${prettyBody(r.requestBody)}` : null,
                r.responseBody ? `Response: ${prettyBody(r.responseBody)}` : null,
              ].filter(Boolean).join('\n')
              copyAnd(parts, 'Copied request details')
            }}
          />

          <MenuDivider />

          {/* ── Copy as code ── */}
          <MenuLabel>Copy as</MenuLabel>
          <MenuItem
            icon={<Terminal size={11} />}
            label="Copy as cURL (bash)"
            hint="⌘C"
            onClick={() => copyAnd(toCurl(menu.req), 'Copied as cURL')}
          />
          <MenuItem
            icon={<Terminal size={11} />}
            label="Copy as cURL (PowerShell)"
            onClick={() => copyAnd(toCurlPowerShell(menu.req), 'Copied as cURL (PS)')}
          />
          <MenuItem
            icon={<Code size={11} />}
            label="Copy as fetch()"
            onClick={() => copyAnd(toFetch(menu.req), 'Copied as fetch()')}
          />
          <MenuItem
            icon={<FileCode size={11} />}
            label="Copy as Node.js fetch"
            onClick={() => copyAnd(toNodeFetch(menu.req), 'Copied as Node.js fetch')}
          />
          <MenuItem
            icon={<Braces size={11} />}
            label="Copy as Axios"
            onClick={() => copyAnd(toAxios(menu.req), 'Copied as Axios')}
          />
          <MenuItem
            icon={<Terminal size={11} />}
            label="Copy as HTTPie"
            onClick={() => copyAnd(toHttpie(menu.req), 'Copied as HTTPie')}
          />
          <MenuItem
            icon={<FileCode size={11} />}
            label="Copy as raw HTTP"
            onClick={() => copyAnd(toRawHttp(menu.req), 'Copied raw HTTP')}
          />

          <MenuDivider />

          {/* ── Copy values ── */}
          <MenuLabel>Copy value</MenuLabel>
          <MenuItem
            icon={<Link size={11} />}
            label="Copy URL"
            onClick={() => copyAnd(menu.req.url || '', 'Copied URL')}
          />
          <MenuItem
            icon={<Globe size={11} />}
            label="Copy query parameters"
            onClick={() => copyAnd(toQueryParams(menu.req), 'Copied query params')}
            disabled={!menu.req.url || !menu.req.url.includes('?')}
          />
          <MenuItem
            icon={<Clipboard size={11} />}
            label="Copy request headers"
            onClick={() => copyAnd(headersToText(menu.req.requestHeaders), 'Copied request headers')}
          />
          <MenuItem
            icon={<Clipboard size={11} />}
            label="Copy response headers"
            onClick={() => copyAnd(headersToText(menu.req.responseHeaders), 'Copied response headers')}
            disabled={!menu.req.responseHeaders}
          />
          <MenuItem
            icon={<Copy size={11} />}
            label="Copy request body"
            onClick={() => copyAnd(prettyBody(menu.req.requestBody), 'Copied request body')}
            disabled={!menu.req.requestBody}
          />
          <MenuItem
            icon={<Copy size={11} />}
            label="Copy response body"
            onClick={() => copyAnd(prettyBody(menu.req.responseBody), 'Copied response body')}
            disabled={!menu.req.responseBody}
          />

          <MenuDivider />

          {/* ── Export ── */}
          <MenuLabel>Export</MenuLabel>
          <MenuItem
            icon={<FileJson size={11} />}
            label="Copy as HAR entry"
            onClick={() => copyAnd(toHarEntry(menu.req), 'Copied HAR entry')}
          />
          <MenuItem
            icon={<FileJson size={11} />}
            label="Copy all headers as JSON"
            onClick={() => copyAnd(JSON.stringify({
              request: menu.req.requestHeaders || {},
              response: menu.req.responseHeaders || {},
            }, null, 2), 'Copied headers JSON')}
          />

          <MenuDivider />

          {/* ── Filter ── */}
          <MenuLabel>Filter</MenuLabel>
          <MenuItem
            icon={<EyeOff size={11} />}
            label={`Hide "${requestName(menu.req.url)}"`}
            onClick={() => { onHideName?.({ match: requestName(menu.req.url), hideRelated: false }); setMenu(null) }}
          />
          <MenuItem
            icon={<EyeOff size={11} />}
            label="Hide all related requests"
            onClick={() => { onHideName?.({ match: requestName(menu.req.url), hideRelated: true }); setMenu(null) }}
          />
        </CursorMenu>
      )}
    </div>
  )
})

/* ─── Sorting + waterfall sub-components ─── */

/**
 * A clickable column header. Real <button> so it's keyboard-reachable, and
 * aria-sort tells assistive tech which column orders the grid — the direction
 * caret alone is colour/shape-only signalling.
 */
function SortHeader({ label, sortKey, sort, onSort, align = 'left' }) {
  const active = sort.key === sortKey
  const dir = active ? sort.dir : null
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={`Sort by ${label.toLowerCase()}`}
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      style={{
        display: 'flex', alignItems: 'center', gap: 2,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        height: '100%', padding: 0,
        border: 'none', background: 'transparent', cursor: 'pointer',
        ...SECTION_LABEL,
        fontSize: 10,
        color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active ? 'var(--text-secondary)' : 'var(--text-tertiary)'
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {/* Caret is present but transparent when inactive, so the label never
          shifts position as sort moves between columns. */}
      <ChevronDown
        size={9}
        style={{
          flexShrink: 0,
          opacity: active ? 1 : 0,
          color: 'var(--accent-primary)',
          transform: dir === 'asc' ? 'rotate(180deg)' : 'none',
          transition: 'transform 120ms ease, opacity 120ms ease',
        }}
        aria-hidden="true"
      />
    </button>
  )
}

/**
 * Waterfall column header: doubles as the time-axis ruler and as a
 * chronological sort control (clicking sorts by start order, which is the
 * only sort under which a waterfall reads top-to-bottom).
 */
function WaterfallRuler({ axis, sort, onSort }) {
  const active = sort.key === 'startTime'
  const ticks = []
  if (axis && axis.step > 0) {
    for (let t = 0; t <= axis.span + 0.5; t += axis.step) {
      const pct = (t / axis.span) * 100
      if (pct > 100) break
      ticks.push({ t, pct })
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSort('startTime')}
      title="Waterfall — click to sort chronologically"
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      style={{
        position: 'relative', height: '100%',
        marginLeft: 'var(--space-2)',
        border: 'none', background: 'transparent',
        cursor: 'pointer', padding: 0, overflow: 'hidden',
      }}
    >
      {ticks.map(({ t, pct }, i) => (
        <span key={t} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* Tick line */}
          <span style={{
            position: 'absolute', left: `${pct}%`, top: 0, bottom: 0,
            width: 1, background: 'var(--border-subtle)',
          }} />
          {/* Label. The last tick is right-anchored so it can't clip. */}
          <span style={{
            position: 'absolute',
            left: pct > 90 ? undefined : `${pct}%`,
            right: pct > 90 ? 0 : undefined,
            top: '50%', transform: 'translateY(-50%)',
            paddingLeft: pct > 90 ? 0 : 3,
            ...SECTION_LABEL,
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)',
            whiteSpace: 'nowrap',
          }}>
            {i === 0 ? '0' : formatAxis(t)}
          </span>
        </span>
      ))}
      {!ticks.length && (
        <span style={{ ...SECTION_LABEL, fontSize: 10, color: 'var(--text-tertiary)' }}>
          Waterfall
        </span>
      )}
    </button>
  )
}

/**
 * One request's bar, positioned on the shared axis.
 *
 * Two segments when TTFB is known: wait (server thinking) then download
 * (bytes arriving). That split is the whole point — a slow request caused by
 * a slow server looks completely different from one caused by a large payload,
 * and a single bar can't distinguish them.
 *
 * TTFB only exists for requests captured after the SDK update, so this
 * degrades to a single bar rather than guessing.
 */
function WaterfallBar({ req, axis }) {
  if (!axis || typeof req.startTime !== 'number') {
    return <span />
  }

  const now = Date.now()
  const dur = req.pending
    ? Math.max(0, now - req.startTime)
    : (req.duration || 0)

  const offsetPct = ((req.startTime - axis.min) / axis.span) * 100
  const widthPct = (dur / axis.span) * 100

  // Requests older than the axis window are pinned to the left edge and marked,
  // so a stale row reads as "starts off-screen" instead of quietly rescaling
  // the axis for every other row.
  const clipped = offsetPct < 0

  // Always leave the bar visible even for sub-millisecond requests.
  const clampedLeft = Math.max(0, Math.min(99.5, offsetPct))
  const clampedWidth = Math.max(0.6, Math.min(100 - clampedLeft, widthPct))

  const ttfb = typeof req.ttfb === 'number' && req.ttfb >= 0 && dur > 0
    ? Math.min(req.ttfb, dur)
    : null
  // Fraction of the bar that is "waiting" rather than "downloading".
  const waitFrac = ttfb != null ? ttfb / dur : null

  const barColor = statusColor(req.status, req.pending)

  const title = [
    clipped
      ? 'Started before the visible window'
      : `Started +${formatAxis(Math.max(0, req.startTime - axis.min))}`,
    ttfb != null ? `Wait (TTFB) ${formatDuration(ttfb)}` : null,
    ttfb != null ? `Download ${formatDuration(dur - ttfb)}` : null,
    `Total ${req.pending ? formatDuration(dur) + ' (in flight)' : formatDuration(dur)}`,
  ].filter(Boolean).join('\n')

  return (
    <span
      title={title}
      style={{
        position: 'relative', height: '100%',
        marginLeft: 'var(--space-2)',
        display: 'block', overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: `${clampedLeft}%`,
          width: `${clampedWidth}%`,
          top: '50%', transform: 'translateY(-50%)',
          height: 8,
          // Square off the left edge when the bar is clipped, so it reads as
          // "continues off-screen" rather than a normal rounded start.
          borderRadius: clipped ? '0 2px 2px 0' : 2,
          display: 'flex', overflow: 'hidden',
          background: 'var(--bg-card)',
          borderLeft: clipped ? '2px dotted var(--text-tertiary)' : undefined,
          // Only animate width for in-flight bars; animating every row on a
          // re-sort would look like the data was moving on its own.
          transition: req.pending ? 'width 240ms linear' : 'none',
        }}
      >
        {waitFrac != null ? (
          <>
            {/* Wait phase — hollow, so it reads as "nothing arriving yet" */}
            <span style={{
              width: `${waitFrac * 100}%`,
              background: 'var(--bg-card-hover)',
              borderLeft: `2px solid ${barColor}`,
            }} />
            {/* Download phase — solid, coloured by status */}
            <span style={{ flex: 1, background: barColor, opacity: 0.85 }} />
          </>
        ) : (
          <span
            className={req.pending ? 'animate-pulse' : undefined}
            style={{ flex: 1, background: barColor, opacity: req.pending ? 0.5 : 0.85 }}
          />
        )}
      </span>
    </span>
  )
}

/* ─── Detail Sub-components ─── */

function HeadersDetail({ req }) {
  const generalText = [
    `URL: ${req.url}`,
    `Method: ${(req.method || 'GET').toUpperCase()}`,
    `Status: ${req.pending ? 'Pending' : (req.status || 'Failed')}`,
    `Size: ${formatSize(req.size)}`,
    `Duration: ${formatDuration(req.duration)}`,
  ].join('\n')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <DetailSection title="General" defaultOpen copyValue={generalText}>
        <KV label="URL" value={req.url} mono copyable />
        <KV label="Method" value={(req.method || 'GET').toUpperCase()} valueColor={methodColor(req.method)} copyable />
        <KV label="Status" value={req.pending ? 'Pending…' : String(req.status || 'Failed')} valueColor={statusColor(req.status, req.pending)} copyable />
        <KV label="Size" value={formatSize(req.size)} copyable />
        <KV label="Duration" value={formatDuration(req.duration)} copyable />
      </DetailSection>
      {req.requestHeaders && Object.keys(req.requestHeaders).length > 0 && (
        <DetailSection title="Request Headers" defaultOpen copyValue={headersToText(req.requestHeaders)}>
          {Object.entries(req.requestHeaders).map(([k, v]) => (
            <KV key={k} label={k} value={String(v)} mono copyable />
          ))}
        </DetailSection>
      )}
      {req.responseHeaders && Object.keys(req.responseHeaders).length > 0 && (
        <DetailSection title="Response Headers" defaultOpen copyValue={headersToText(req.responseHeaders)}>
          {Object.entries(req.responseHeaders).map(([k, v]) => (
            <KV key={k} label={k} value={String(v)} mono copyable />
          ))}
        </DetailSection>
      )}
    </div>
  )
}

function DetailSection({ title, defaultOpen = true, copyValue, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
            flex: 1, padding: 'var(--space-1) 0',
            border: 'none', background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)',
            fontFamily: 'var(--font-ui)', cursor: 'pointer',
            lineHeight: 'var(--line-height-tight)',
          }}
        >
          {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          {title}
        </button>
        {copyValue && (
          <button
            onClick={() => copyText(copyValue).then((ok) => { if (ok) toast.success(`Copied ${title.toLowerCase()}`) })}
            title={`Copy ${title.toLowerCase()}`}
            style={{
              border: 'none', background: 'transparent', color: 'var(--text-tertiary)',
              cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 'var(--radius-sm)',
              opacity: 0.6, transition: 'opacity 100ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.color = 'var(--text-tertiary)' }}
          >
            <Copy size={11} />
          </button>
        )}
      </div>
      <div style={{ borderBottom: '1px solid var(--border-subtle)' }} />
      {open && <div style={{ padding: 'var(--space-1) 0 0 var(--space-4)' }}>{children}</div>}
    </div>
  )
}

function KV({ label, value, valueColor, mono, copyable }) {
  return (
    <div className="kv-row" style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '2px 0',
      fontSize: 'var(--text-xs)', lineHeight: 'var(--line-height-tight)',
    }}>
      <span style={{
        width: 140, flexShrink: 0, color: 'var(--text-tertiary)',
        fontWeight: 'var(--font-weight-medium)',
        fontFamily: 'var(--font-ui)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{
        flex: 1, minWidth: 0, color: valueColor || 'var(--text-secondary)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
        wordBreak: 'break-all', userSelect: 'text',
      }}>
        {value}
      </span>
      {copyable && value && (
        <button
          className="kv-copy-btn"
          onClick={() => copyText(String(value)).then((ok) => { if (ok) toast.success('Copied') })}
          title="Copy value"
          style={{
            border: 'none', background: 'transparent', color: 'var(--text-tertiary)',
            cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 'var(--radius-sm)',
            flexShrink: 0, opacity: 0, transition: 'opacity 100ms',
          }}
        >
          <Copy size={10} />
        </button>
      )}
    </div>
  )
}

const JSON_TREE_INDENT = 14

function valueType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function JsonPrimitive({ value, type }) {
  if (type === 'string') return <span style={{ color: 'var(--json-string)' }}>{JSON.stringify(value)}</span>
  if (type === 'number') return <span style={{ color: 'var(--json-number)' }}>{String(value)}</span>
  if (type === 'boolean') return <span style={{ color: 'var(--json-keyword)' }}>{String(value)}</span>
  if (type === 'null') return <span style={{ color: 'var(--json-keyword)' }}>null</span>
  return <span>{String(value)}</span>
}

/* DevTools-style disclosure triangle: a small CSS triangle that rotates 90°
   when open, instead of chevron icons. */
function JsonArrow({ open, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        border: 'none', background: 'transparent', padding: '0 3px 0 0', margin: 0,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
        verticalAlign: 'middle', lineHeight: 1,
      }}
    >
      <span style={{
        width: 0, height: 0,
        borderLeft: '4px solid var(--text-tertiary)',
        borderTop: '3.5px solid transparent',
        borderBottom: '3.5px solid transparent',
        transform: open ? 'rotate(90deg)' : 'none',
        transition: 'transform 100ms ease',
      }} />
    </button>
  )
}

/* One-line summary shown for a collapsed node, mirroring the DevTools object
   inspector: objects show "key: value" pairs, arrays show their items, both
   truncated with an ellipsis. Nested containers collapse to {…} / […]. */
function JsonPreviewValue({ value }) {
  const type = valueType(value)
  if (type === 'object') return <span style={{ color: 'var(--text-tertiary)' }}>{'{…}'}</span>
  if (type === 'array') return <span style={{ color: 'var(--text-tertiary)' }}>[…]</span>
  return <JsonPrimitive value={value} type={type} />
}

const PREVIEW_LIMIT = 5

function JsonPreview({ value, type }) {
  const muted = { color: 'var(--text-tertiary)' }
  if (type === 'array') {
    const items = value.slice(0, PREVIEW_LIMIT)
    return (
      <span style={muted}>
        {'['}
        {items.map((v, i) => (
          <span key={i}>
            {i > 0 && ', '}
            <JsonPreviewValue value={v} />
          </span>
        ))}
        {value.length > PREVIEW_LIMIT && ', …'}
        {']'}
      </span>
    )
  }
  const entries = Object.entries(value)
  const shown = entries.slice(0, PREVIEW_LIMIT)
  return (
    <span style={muted}>
      {'{'}
      {shown.map(([k, v], i) => (
        <span key={k}>
          {i > 0 && ', '}
          <span style={{ color: 'var(--json-key)' }}>{k}</span>
          {': '}
          <JsonPreviewValue value={v} />
        </span>
      ))}
      {entries.length > PREVIEW_LIMIT && ', …'}
      {'}'}
    </span>
  )
}

function JsonNode({ name, value, level }) {
  const [isOpen, setIsOpen] = useState(true)
  const type = valueType(value)

  if (type === 'object' || type === 'array') {
    const entries = type === 'object' ? Object.entries(value) : value.map((v, i) => [i, v])
    const isEmpty = entries.length === 0
    const openBracket = type === 'object' ? '{' : '['
    const closeBracket = type === 'object' ? '}' : ']'
    const keyPrefix = name != null ? <span style={{ color: 'var(--json-key)' }}>{name}: </span> : null

    // Empty containers render inline ("data": []) — nothing to expand.
    if (isEmpty) {
      return (
        <div style={{ marginLeft: level * JSON_TREE_INDENT }}>
          {keyPrefix}
          <span style={{ color: 'var(--text-tertiary)' }}>{openBracket}{closeBracket}</span>
        </div>
      )
    }

    if (!isOpen) {
      return (
        <div style={{ marginLeft: level * JSON_TREE_INDENT }}>
          <JsonArrow open={false} onClick={() => setIsOpen(true)} label="Expand" />
          {keyPrefix}
          <JsonPreview value={value} type={type} />
        </div>
      )
    }

    return (
      <div>
        <div style={{ marginLeft: level * JSON_TREE_INDENT }}>
          <JsonArrow open onClick={() => setIsOpen(false)} label="Collapse" />
          {keyPrefix}
          <span style={{ color: 'var(--text-tertiary)' }}>{openBracket}</span>
        </div>
        {entries.map(([key, val]) => (
          <JsonNode
            key={String(key)}
            name={type === 'object' ? key : null}
            value={val}
            level={level + 1}
          />
        ))}
        <div style={{ marginLeft: level * JSON_TREE_INDENT }}>
          <span style={{ color: 'var(--text-tertiary)' }}>{closeBracket}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginLeft: level * JSON_TREE_INDENT }}>
      {name != null && <span style={{ color: 'var(--json-key)' }}>{name}: </span>}
      <JsonPrimitive value={value} type={type} />
    </div>
  )
}

function JsonTree({ data }) {
  const parsed = useMemo(() => {
    if (data == null) return null
    if (typeof data === 'object') return data
    try { return JSON.parse(data) } catch { return null }
  }, [data])

  if (parsed === null) return null

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
      lineHeight: 'var(--line-height-normal)', color: 'var(--text-secondary)',
      userSelect: 'text', wordBreak: 'break-all',
    }}>
      <JsonNode value={parsed} level={0} />
    </div>
  )
}

function BodyDetail({ body, label }) {
  const text = prettyBody(body)
  if (!text) {
    return (
      <div style={{
        padding: 'var(--space-4)', textAlign: 'center',
        color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)',
      }}>
        No {label.toLowerCase()}
      </div>
    )
  }

  const isJson = useMemo(() => {
    if (body == null) return false
    if (typeof body === 'object') return true
    try { JSON.parse(body); return true } catch { return false }
  }, [body])

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => copyText(text).then((ok) => { if (ok) toast.success(`Copied ${label.toLowerCase()}`) })}
        title={`Copy ${label.toLowerCase()}`}
        style={{
          position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)',
          border: 'none', background: 'var(--bg-sidebar)', color: 'var(--text-tertiary)',
          cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 'var(--radius-sm)',
          opacity: 0.7, transition: 'opacity 100ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = 'var(--text-tertiary)' }}
      >
        <Copy size={12} />
      </button>
      <div style={{
        margin: 0, fontSize: 'var(--text-xs)', lineHeight: 'var(--line-height-normal)',
        fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
        userSelect: 'text',
        background: 'var(--bg-code-block)', padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
      }}>
        {isJson ? <JsonTree data={body} /> : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {text}
          </pre>
        )}
      </div>
    </div>
  )
}

/**
 * Per-request phase breakdown.
 *
 * The bar here is derived from real measurements. It previously hard-coded
 * `width: '100%'`, so every request rendered an identical full bar regardless
 * of duration — displaying a measurement that did not exist.
 *
 * Phases available today: wait (TTFB) and content download. `ttfb` is only
 * present on requests captured after the SDK gained the measurement, so when
 * it's missing we say so rather than inventing a split.
 */
function TimingDetail({ req }) {
  const isPending = !!req.pending
  const duration = isPending
    ? Math.max(0, Date.now() - (req.startTime || Date.now()))
    : (req.duration || 0)

  const ttfb = typeof req.ttfb === 'number' && req.ttfb >= 0 && duration > 0
    ? Math.min(req.ttfb, duration)
    : null
  const download = ttfb != null ? Math.max(0, duration - ttfb) : null

  const phases = ttfb != null
    ? [
      { key: 'wait', label: 'Waiting (TTFB)', ms: ttfb, color: 'var(--status-warning-text)' },
      { key: 'download', label: 'Content download', ms: download, color: 'var(--accent-primary)' },
    ]
    : [{ key: 'total', label: 'Total', ms: duration, color: 'var(--accent-primary)' }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <DetailSection title="Timing" defaultOpen>
        <KV
          label="Started"
          value={req.startTime ? new Date(req.startTime).toISOString() : '—'}
          mono
        />
        <KV label="Duration" value={isPending ? `${formatDuration(duration)} (in flight)` : formatDuration(duration)} />
        {ttfb != null && <KV label="Waiting (TTFB)" value={formatDuration(ttfb)} />}
        {download != null && <KV label="Content download" value={formatDuration(download)} />}
        {req.size != null && <KV label="Transferred" value={formatSize(req.size)} />}
      </DetailSection>

      {duration > 0 && (
        <div>
          {/* Segmented bar — each segment is proportional to its real duration */}
          <div
            role="img"
            aria-label={phases.map((p) => `${p.label} ${formatDuration(p.ms)}`).join(', ')}
            style={{
              display: 'flex', height: 8, borderRadius: 2,
              background: 'var(--bg-card)', overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {phases.map((p) => (
              <span
                key={p.key}
                title={`${p.label} — ${formatDuration(p.ms)}`}
                style={{
                  width: `${(p.ms / duration) * 100}%`,
                  background: p.color,
                  opacity: p.key === 'wait' ? 0.45 : 0.85,
                  transition: 'width 180ms ease',
                }}
              />
            ))}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 'var(--space-1)', fontSize: 10,
            color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
          }}>
            <span>0ms</span>
            <span>{formatDuration(duration)}</span>
          </div>

          {/* Legend. Percentages make the dominant phase obvious at a glance. */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            marginTop: 'var(--space-2)',
          }}>
            {phases.map((p) => (
              <div key={p.key} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)', fontFamily: 'var(--font-ui)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                  background: p.color, opacity: p.key === 'wait' ? 0.45 : 0.85,
                }} />
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{p.label}</span>
                <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {formatDuration(p.ms)}
                </span>
                <span style={{
                  width: 40, textAlign: 'right',
                  color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
                }}>
                  {Math.round((p.ms / duration) * 100)}%
                </span>
              </div>
            ))}
          </div>

          {ttfb == null && !isPending && (
            <div style={{
              marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
              lineHeight: 'var(--line-height-normal)',
            }}>
              Phase breakdown needs the updated SDK snippet — reconnect the app
              to capture time-to-first-byte.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
