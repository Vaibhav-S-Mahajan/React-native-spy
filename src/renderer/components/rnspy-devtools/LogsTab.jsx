// src/renderer/components/rnspy-devtools/LogsTab.jsx
// Server-side activity: client connect/disconnect, server start/stop, errors.
// Virtualized, sticky-bottom, capped at 500 entries by the hook that feeds it.

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Server } from 'lucide-react'

import { useVirtualRows } from '../../hooks/useVirtualRows'
import { EmptyState, SearchInput, Toolbar, ToolbarDivider } from '../ui'
import cn from '../ui/cn'
import LevelChip from './LevelChip'
import ToolbarActions from './ToolbarActions'

const LEVELS = ['info', 'warn', 'error']

// Must stay a fixed number: useVirtualRows computes offsets arithmetically, so a
// CSS value would break the math. Kept equal to --row-height (28px).
const ROW_HEIGHT = 28

const LEVEL_CFG = {
  info: { tag: 'INF', label: 'Info', color: 'var(--status-info-text)', dot: 'var(--status-info-text)', text: 'text-info-fg', bg: '' },
  warn: { tag: 'WRN', label: 'Warn', color: 'var(--status-warning-text)', dot: 'var(--status-warning-text)', text: 'text-warn-fg', bg: 'bg-warn' },
  error: { tag: 'ERR', label: 'Error', color: 'var(--status-danger-text)', dot: 'var(--status-danger-text)', text: 'text-danger-fg', bg: 'bg-danger' },
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
    <div className="pane bg-panel">
      <Toolbar>
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

        <ToolbarDivider />

        <SearchInput
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter…"
          aria-label="Filter server logs"
          count={filtered.length}
        />

        <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
      </Toolbar>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-auto font-mono text-xs"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={Server}
            title={search ? 'No matching logs' : 'No server logs'}
            description={search ? 'Try a different filter.' : 'Server activity will appear here.'}
          />
        ) : (
          <>
            {topSpacer > 0 && <div style={{ height: topSpacer }} />}
            {filtered.slice(startIdx, endIdx).map((log, i) => {
              const cfg = LEVEL_CFG[log.level] || LEVEL_CFG.info
              return (
                <div
                  key={startIdx + i}
                  className={cn(
                    'flex h-row items-center gap-2 border-b border-subtle px-3',
                    cfg.bg,
                  )}
                >
                  <span className={cn('w-[26px] shrink-0 text-center text-[9px] font-semibold', cfg.text)}>
                    {cfg.tag}
                  </span>
                  <span className="w-20 shrink-0 text-[10px] text-faint tabular-nums">
                    {formatTime(log.timestamp)}
                  </span>
                  <span className="cell-truncate flex-1 select-text text-muted" title={log.message}>
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
