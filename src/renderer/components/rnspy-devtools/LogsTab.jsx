// src/renderer/components/rnspy-devtools/LogsTab.jsx

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Search, Server } from 'lucide-react'
import { useVirtualRows } from '../../hooks/useVirtualRows'
import { EMPTY_STATE, INPUT_BASE } from '../../styles/shared'
import LevelChip from './LevelChip'
import ToolbarActions from './ToolbarActions'

const LEVELS = ['info', 'warn', 'error']
const ROW_HEIGHT = 28

const LEVEL_CFG = {
  info:  { color: 'var(--status-info-text)', tag: 'INF', bg: 'transparent', label: 'Info', dot: 'var(--status-info-text)' },
  warn:  { color: 'var(--status-warning-text)', tag: 'WRN', bg: 'var(--status-warning-bg)', label: 'Warn', dot: 'var(--status-warning-text)' },
  error: { color: 'var(--status-danger-text)', tag: 'ERR', bg: 'var(--status-danger-bg)', label: 'Error', dot: 'var(--status-danger-text)' },
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}

export default forwardRef(function LogsTab({ logs, onClear, onReload, canReload }, ref) {
  const [activeLevels, setActiveLevels] = useState(() => new Set(LEVELS))
  const [search, setSearch] = useState('')
  const scrollRef = useRef(null)
  const searchRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus(),
  }), [])

  const toggleLevel = (level) => {
    setActiveLevels((prev) => {
      const next = new Set(prev)
      next.has(level) ? next.delete(level) : next.add(level)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return logs.filter((log) => {
      if (!activeLevels.has(log.level || 'info')) return false
      if (q && !(log.message || '').toLowerCase().includes(q)) return false
      return true
    })
  }, [logs, activeLevels, search])

  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef, totalRows: filtered.length, rowHeight: ROW_HEIGHT, stickyBottom: true,
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)' }}>
      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '0 var(--space-3)', height: 38, flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-panel-alt)',
      }}>
        {LEVELS.map((level) => {
          const active = activeLevels.has(level)
          const cfg = LEVEL_CFG[level]
          return (
            <LevelChip
              key={level}
              active={active}
              color={cfg.color}
              dot={cfg.dot}
              label={cfg.label}
              onClick={() => toggleLevel(level)}
              title={`${active ? 'Hide' : 'Show'} ${cfg.label.toLowerCase()} logs`}
            />
          )
        })}

        <div style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />

        <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          ref={searchRef}
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter…"
          style={{
            ...INPUT_BASE, flex: 1, height: 30, fontSize: 'var(--text-sm)',
            border: 'none', background: 'transparent', padding: 0,
          }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length}
        </span>
        <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
      </div>

      {/* ─── Virtualized Log Stream ─── */}
      <div ref={scrollRef} onScroll={onScroll}
        style={{ flex: 1, minHeight: 0, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
        {filtered.length === 0 ? (
          <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
            <Server size={20} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
              No server logs
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Server activity will appear here
            </div>
          </div>
        ) : (
          <>
            {topSpacer > 0 && <div style={{ height: topSpacer }} />}
            {filtered.slice(startIdx, endIdx).map((log, i) => {
              const cfg = LEVEL_CFG[log.level] || LEVEL_CFG.info
              return (
                <div key={startIdx + i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: '0 var(--space-3)', height: ROW_HEIGHT,
                  borderBottom: '1px solid var(--border-subtle)',
                  background: cfg.bg,
                }}>
                  <span style={{
                    width: 26, flexShrink: 0, textAlign: 'center',
                    fontSize: 9, fontWeight: 'var(--font-weight-semibold)',
                    color: cfg.color,
                  }}>
                    {cfg.tag}
                  </span>
                  <span style={{
                    width: 80, flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10,
                  }}>
                    {formatTime(log.timestamp)}
                  </span>
                  <span style={{
                    flex: 1, minWidth: 0, color: 'var(--text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    userSelect: 'text',
                  }} title={log.message}>
                    {log.message}
                  </span>
                </div>
              )
            })}
            {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
          </>
        )}
      </div>
    </div>
  )
})
