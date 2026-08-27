// src/renderer/components/rnspy-devtools/WatermelonTab.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Database, RefreshCw, Search, Table2, X } from 'lucide-react'

import {
  BTN_GHOST, BTN_SECONDARY, EMPTY_STATE, INPUT_BASE, SECTION_LABEL,
} from '../../styles/shared'
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
      <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
        <Database size={20} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
          Device offline
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          WatermelonDB can only be read while the app is connected.
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)' }}>
      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '0 var(--space-3)', height: 38, flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-panel-alt)',
      }}>
        <span style={{ ...SECTION_LABEL, fontSize: 10 }}>WatermelonDB</span>
        {current && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {current.table} · {total} row{total === 1 ? '' : 's'}
            {total > 0 ? ` (loaded ${loadedRows.length})` : ''}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', width: 220 }}>
          <Search size={12} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter rows"
            style={{ ...INPUT_BASE, width: '100%', paddingLeft: 26, fontSize: 'var(--text-xs)' }}
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
        <button
          onClick={onRefresh}
          disabled={!online}
          title="Refresh now"
          style={{ ...BTN_GHOST, opacity: online ? 1 : 0.4, cursor: online ? 'pointer' : 'default' }}
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* ─── Diagnostics banner ─── */}
      {diag && (diag.resolved === false || diag.error || available === false) && tables.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '6px var(--space-3)', flexShrink: 0,
          borderBottom: '1px solid var(--status-warning-border)',
          background: 'var(--status-warning-bg)',
          fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
          color: 'var(--status-warning-text)',
        }}>
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
            <span key={i} style={{ opacity: 0.9 }}>• {n}</span>
          ))}
        </div>
      )}

      {/* ─── Body: table list + records grid ─── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Table list */}
        <div style={{
          flex: '0 0 200px', minWidth: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-panel-alt)',
        }}>
          <div style={{
            padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-sidebar)', ...SECTION_LABEL, fontSize: 10,
          }}>
            TABLES ({tables.length})
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {tables.length === 0 ? (
              <div style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                No tables
              </div>
            ) : (
              tables.slice().sort((a, b) => a.table.localeCompare(b.table)).map((t) => {
                const active = t.table === activeTable
                return (
                  <button
                    key={t.table}
                    onClick={() => { setActiveTable(t.table); setDetailRow(null) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                      padding: 'var(--space-2) var(--space-3)', border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderLeft: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                      background: active ? 'var(--status-success-bg)' : 'transparent',
                      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Table2 size={12} style={{ flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.table}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>{t.rowCount}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Records grid */}
        <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          {!current ? (
            <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
              <Database size={20} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {tables.length ? 'Select a table' : 'No WatermelonDB tables'}
              </div>
            </div>
          ) : current.error ? (
            <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--status-danger-text)' }}>
                Error reading {current.table}: {current.error}
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {search ? 'No rows match the filter' : 'No records in this table'}
              </div>
            </div>
          ) : (
            <table style={{
              width: 'auto', minWidth: '100%', borderCollapse: 'collapse',
              fontSize: 'var(--text-xs)', tableLayout: 'auto',
            }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--bg-sidebar)' }}>
                  <th style={thStyle}>id</th>
                  {columns.map((c) => (
                    <th key={c} style={thStyle}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setDetailRow(r)}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  >
                    <td style={{ ...tdStyle, color: 'var(--accent-primary)' }}>{r.id}</td>
                    {columns.map((c) => (
                      <td key={c} style={tdStyle} title={cellText(r.fields?.[c])}>
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
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'var(--space-2)', fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
            }}>
              {hasMore ? (
                <button
                  onClick={loadMore}
                  style={{ ...BTN_GHOST }}
                  title="Load more rows"
                >
                  <RefreshCw size={11} />
                  Load more ({loadedRows.length} / {total})
                </button>
              ) : (
                <span style={{ opacity: 0.6 }}>All {total} row{total === 1 ? '' : 's'} loaded</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Meta line ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '4px var(--space-3)', flexShrink: 0,
        borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)',
        ...SECTION_LABEL, fontSize: 10,
      }}>
        <span>{rows.length} row{rows.length === 1 ? '' : 's'} shown</span>
        {watermelon?.updatedAt && <span style={{ opacity: 0.6 }}>· updated {formatTime(watermelon.updatedAt)}</span>}
        <span style={{ opacity: 0.6 }}>· read-only</span>
      </div>

      {/* ─── Row detail ─── */}
      {detailRow && (
        <div
          onClick={() => setDetailRow(null)}
          style={{
            position: 'absolute', inset: 0, background: 'var(--overlay-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(640px, 90%)', maxHeight: '80%', display: 'flex', flexDirection: 'column',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <Database size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {current?.table} · {detailRow.id}
              </span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setDetailRow(null)} style={{ ...BTN_GHOST, padding: 4 }} title="Close">
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 'var(--space-4)', overflow: 'auto' }}>
              <pre style={{
                margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {JSON.stringify({ id: detailRow.id, ...detailRow.fields }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle = {
  textAlign: 'left', padding: '6px var(--space-3)', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)',
  fontSize: 10, fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-tertiary)',
  textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--bg-sidebar)',
}

const tdStyle = {
  padding: '5px var(--space-3)', fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)', maxWidth: 280, overflow: 'hidden',
  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
}
