// src/renderer/components/rnspy-devtools/WatermelonTab.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Database, RefreshCw, Search, Table2 } from 'lucide-react'

import {
  Button, EmptyState, ErrorState, IconButton, Input, Modal, ModalBody, ModalHeader,
  SectionLabel, Toolbar, ToolbarSpacer,
} from '../ui'
import cn from '../ui/cn'
import LevelChip from './LevelChip'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false })
}

function cellText(v) {
  if (v == null) return ''
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch { return String(v) }
  }
  return String(v)
}

const PAGE_SIZE = 50

export default function WatermelonTab({
  watermelon, online, onRefresh, onLoadPage, autoRefresh, onToggleAutoRefresh,
}) {
  const tables = useMemo(
    () => (watermelon && Array.isArray(watermelon.tables) ? watermelon.tables : []),
    [watermelon],
  )
  const pages = watermelon?.pages || {}
  const diag = watermelon?.diag || null
  const available = watermelon?.available

  const [activeTable, setActiveTable] = useState(null)
  const [search, setSearch] = useState('')
  const [detailRow, setDetailRow] = useState(null)
  const requestedRef = useRef(false)
  const scrollRef = useRef(null)
  const loadingRef = useRef(false)

  // Ask the device for the table list the first time the tab is shown.
  useEffect(() => {
    if (online && !requestedRef.current && tables.length === 0) {
      requestedRef.current = true
      onRefresh?.()
    }
  }, [online, tables.length, onRefresh])

  // Default to the first (or largest) table once metadata arrives.
  const tableNames = tables.map((t) => t.table)
  const tableSig = tableNames.join('|')
  useEffect(() => {
    if (!tableNames.length) { setActiveTable(null); return }
    if (!activeTable || !tableNames.includes(activeTable)) {
      const largest = tables.slice().sort((a, b) => (b.rowCount || 0) - (a.rowCount || 0))[0]
      setActiveTable(largest ? largest.table : tableNames[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableSig])

  const current = useMemo(
    () => tables.find((t) => t.table === activeTable) || null,
    [tables, activeTable],
  )

  const page = activeTable ? pages[activeTable] : null
  const loadedRows = page?.rows || []
  const total = page?.total ?? current?.rowCount ?? 0
  const columns = (current?.columns?.length ? current.columns : page?.columns) || []
  const hasMore = loadedRows.length < total

  // Load the first batch when a table becomes active and has no rows yet.
  useEffect(() => {
    if (!online || !activeTable) return
    if (!pages[activeTable] && onLoadPage) {
      loadingRef.current = true
      onLoadPage(activeTable, 0, PAGE_SIZE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable, online])

  // Clear the loading latch whenever a page arrives.
  useEffect(() => { loadingRef.current = false }, [loadedRows.length])

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || !onLoadPage || !activeTable) return
    loadingRef.current = true
    onLoadPage(activeTable, loadedRows.length, PAGE_SIZE)
  }, [hasMore, onLoadPage, activeTable, loadedRows.length])

  const onScroll = useCallback((e) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240) loadMore()
  }, [loadMore])

  // Client-side filter over already-loaded rows (server paging stays by offset).
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return loadedRows
    return loadedRows.filter((r) => {
      if (String(r.id).toLowerCase().includes(q)) return true
      return Object.values(r.fields || {}).some((v) => cellText(v).toLowerCase().includes(q))
    })
  }, [loadedRows, search])

  if (!online && tables.length === 0) {
    return (
      <div className="pane bg-panel">
        <EmptyState
          icon={Database}
          title="Device offline"
          description="WatermelonDB can only be read while the app is connected."
        />
      </div>
    )
  }

  return (
    <div className="pane bg-panel">
      <Toolbar>
        <SectionLabel>WatermelonDB</SectionLabel>
        {current && (
          <span className="font-mono text-xs text-faint">
            {current.table} · {total} row{total === 1 ? '' : 's'}
            {total > 0 ? ` (loaded ${loadedRows.length})` : ''}
          </span>
        )}

        <ToolbarSpacer />

        <div className="relative w-[220px] shrink-0">
          <Search
            size={12}
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-faint"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter rows"
            aria-label="Filter rows"
            className="w-full pl-[26px] text-xs"
          />
        </div>

        <LevelChip
          active={autoRefresh}
          color="var(--status-success-text)"
          icon={<RefreshCw size={11} />}
          label="Auto"
          onClick={onToggleAutoRefresh}
          title={autoRefresh ? 'Auto-refresh on (every 3s)' : 'Auto-refresh off'}
        />
        <IconButton label="Refresh now" onClick={onRefresh} disabled={!online}>
          <RefreshCw size={12} aria-hidden="true" />
        </IconButton>
      </Toolbar>

      {/* ─── Diagnostics banner ─── */}
      {diag && (diag.resolved === false || diag.error || available === false) && tables.length === 0 && (
        <div
          role="status"
          className="flex shrink-0 flex-col gap-0.5 border-b border-warn-edge bg-warn px-3 py-1.5 font-mono text-xs text-warn-fg"
        >
          {diag.resolved === false && !diag.error && (
            <span>WatermelonDB not found — <code>@nozbe/watermelondb</code> is not installed in the app.</span>
          )}
          {diag.error && <span>WatermelonDB error: <code>{diag.error}</code></span>}
          {diag.resolved && available === false && (
            <span>
              WatermelonDB is installed but no Database instance was captured. Re-run{' '}
              <strong>Set it up for me</strong> — it finds where you call <code>new Database(...)</code>{' '}
              and exposes it for you. If your database is not a top-level variable, add{' '}
              <code>if (__DEV__) &#123; global.__rnspyWatermelonDB = database &#125;</code> there yourself,
              then reload.
            </span>
          )}
          {(diag.notes || []).map((n, i) => (
            <span key={i} className="opacity-90">• {n}</span>
          ))}
        </div>
      )}

      {/* ─── Body: table list + records grid ─── */}
      <div className="flex min-h-0 flex-1">
        {/* Table list */}
        <div className="flex w-[200px] min-w-0 shrink-0 flex-col border-r border-subtle bg-panel-alt">
          <div className="border-b border-subtle bg-sidebar px-3 py-2">
            <SectionLabel>Tables ({tables.length})</SectionLabel>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {tables.length === 0 ? (
              <div className="p-3 text-xs text-faint">No tables</div>
            ) : (
              tables.slice().sort((a, b) => a.table.localeCompare(b.table)).map((t) => {
                const active = t.table === activeTable
                return (
                  <button
                    key={t.table}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => { setActiveTable(t.table); setDetailRow(null) }}
                    className={cn(
                      'flex w-full items-center gap-1.5 border-b border-subtle border-l-2 px-3 py-2',
                      'text-left font-mono text-xs transition-colors duration-150 focus-ring',
                      active
                        ? 'border-l-accent bg-success text-fg'
                        : 'border-l-transparent bg-transparent text-muted hover:bg-row-hover hover:text-fg',
                    )}
                  >
                    <Table2 size={12} className="shrink-0 opacity-70" aria-hidden="true" />
                    <span className="cell-truncate flex-1">{t.table}</span>
                    <span className="shrink-0 text-[9px] text-faint tabular-nums">{t.rowCount}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Records grid */}
        <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-auto">
          {!current ? (
            <EmptyState
              icon={Database}
              title={tables.length ? 'Select a table' : 'No WatermelonDB tables'}
            />
          ) : current.error ? (
            <ErrorState
              title={`Error reading ${current.table}`}
              description={current.error}
              onRetry={onRefresh}
            />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Database}
              title={search ? 'No rows match the filter' : 'No records in this table'}
              description={search ? 'Try a different filter.' : undefined}
            />
          ) : (
            <table className="w-auto min-w-full border-collapse text-xs [table-layout:auto]">
              <thead>
                <tr className="sticky top-0 z-[1] bg-sidebar">
                  <th className={TH}>id</th>
                  {columns.map((c) => (
                    <th key={c} className={TH}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setDetailRow(r)}
                    className="cursor-pointer border-b border-subtle transition-colors duration-150 hover:bg-row-hover"
                  >
                    <td className={cn(TD, 'text-accent')}>{r.id}</td>
                    {columns.map((c) => (
                      <td key={c} className={TD} title={cellText(r.fields?.[c])}>
                        {cellText(r.fields?.[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Infinite-scroll footer: shows load progress for the active table. */}
          {current && !current.error && rows.length > 0 && !search && (
            <div className="flex items-center justify-center p-2 font-mono text-xs text-faint">
              {hasMore ? (
                <Button variant="ghost" size="md" onClick={loadMore} title="Load more rows">
                  <RefreshCw size={11} aria-hidden="true" />
                  Load more ({loadedRows.length} / {total})
                </Button>
              ) : (
                <span className="opacity-60">All {total} row{total === 1 ? '' : 's'} loaded</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Meta line ─── */}
      <div className="flex shrink-0 items-center gap-2 border-t border-subtle bg-sidebar px-3 py-1">
        <SectionLabel>{rows.length} row{rows.length === 1 ? '' : 's'} shown</SectionLabel>
        {watermelon?.updatedAt && (
          <SectionLabel className="opacity-60">· updated {formatTime(watermelon.updatedAt)}</SectionLabel>
        )}
        <SectionLabel className="opacity-60">· read-only</SectionLabel>
      </div>

      {/* ─── Row detail ─── */}
      {detailRow && (
        <Modal size="lg" onClose={() => setDetailRow(null)} labelledBy="wm-row-title">
          <ModalHeader
            id="wm-row-title"
            title={`${current?.table} · ${detailRow.id}`}
            onClose={() => setDetailRow(null)}
          />
          <ModalBody>
            <pre className="m-0 select-text whitespace-pre-wrap break-words font-mono text-xs text-muted">
              {JSON.stringify({ id: detailRow.id, ...detailRow.fields }, null, 2)}
            </pre>
          </ModalBody>
        </Modal>
      )}
    </div>
  )
}

// Shared cell classes. Kept as constants because <th>/<td> repeat per column.
const TH =
  'border-b border-default bg-sidebar px-3 py-1.5 text-left font-mono text-[10px] ' +
  'font-semibold uppercase tracking-[0.04em] text-faint whitespace-nowrap'

const TD =
  'max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap px-3 py-[5px] font-mono text-muted'
