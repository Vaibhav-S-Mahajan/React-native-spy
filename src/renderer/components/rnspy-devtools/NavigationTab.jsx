// src/renderer/components/rnspy-devtools/NavigationTab.jsx
// Live React Navigation stack + route-change timeline, with click-to-open in
// VS Code. Read-only: the desktop app never drives the app's navigator.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ChevronRight, Compass, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { useVirtualRows } from '../../hooks/useVirtualRows'
import { EmptyState, SearchInput, SectionLabel, Toolbar, ToolbarDivider } from '../ui'
import cn from '../ui/cn'
import LevelChip from './LevelChip'
import ToolbarActions from './ToolbarActions'

const ROW_HEIGHT = 28

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}

function paramsPreview(params) {
  if (!params) return ''
  if (params.__rnspyTruncated) return `(${params.bytes} bytes, too large to send)`
  if (params.__rnspyUnserializable) return '(unserializable)'
  try {
    const json = JSON.stringify(params)
    return json === '{}' ? '' : json
  } catch {
    return ''
  }
}

function prettyParams(params) {
  if (!params) return ''
  try { return JSON.stringify(params, null, 2) } catch { return String(params) }
}

// Maps a resolver/editor failure to something the user can act on. The panel
// can't open a file without a connected project folder, and that's by far the
// most common reason a click does nothing.
function reportOpenFailure(res, routeName) {
  const reason = res?.reason
  // The file was found but VS Code would not open it. Distinguished by `stage`
  // because the resolver and the editor handler share a 'not-found' reason.
  if (res?.stage === 'open') {
    toast.error(
      "VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH",
      { duration: 5000 },
    )
    return
  }
  if (reason === 'no-project-root') {
    toast.error('Connect your project folder first — click "Project" in the top bar.', { duration: 5000 })
    return
  }
  if (reason === 'not-found') {
    // Common and not really an error: React Navigation route names include
    // things that are not screens at all (tab icon names, for instance).
    toast.error(
      `No screen file found for "${routeName}". It may not be a screen, or its component is not imported anywhere.`,
      { duration: 5000 },
    )
    return
  }
  if (reason === 'project-root-missing' || reason === 'project-root-not-a-directory') {
    toast.error('The connected project folder no longer exists. Pick it again from "Project".', { duration: 5000 })
    return
  }
  if (reason === 'not-available') {
    toast.error('Route resolution needs the desktop app.')
    return
  }
  if (reason === 'no-source-files') {
    toast.error('No source files found in the connected project folder.', { duration: 5000 })
    return
  }
  if (reason === 'scan-failed') {
    toast.error(`Could not search the project folder: ${res.message || 'scan failed'}`, { duration: 5000 })
    return
  }
  toast.error(`Could not find the file for "${routeName}"${reason ? ` (${reason})` : ''}.`)
}

export default forwardRef(function NavigationTab({
  navigation, online, onRefresh, onOpenRoute, onClear, onReload, canReload,
  autoRefresh, onToggleAutoRefresh,
}, ref) {
  const stack = useMemo(
    () => (navigation && Array.isArray(navigation.stack) ? navigation.stack : []),
    [navigation],
  )
  const history = useMemo(
    () => (navigation && Array.isArray(navigation.history) ? navigation.history : []),
    [navigation],
  )
  const screens = navigation?.screens || {}
  const diag = navigation?.diag || null
  const available = navigation?.available

  const [search, setSearch] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(null)
  const searchRef = useRef(null)
  const scrollRef = useRef(null)
  const requestedRef = useRef(false)

  useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus(),
  }), [])

  // Ask the device for its current route the first time the tab is shown; the
  // SDK only pushes on change, so without this a stationary app looks empty.
  useEffect(() => {
    if (online && !requestedRef.current && stack.length === 0) {
      requestedRef.current = true
      onRefresh?.()
    }
    if (!online) requestedRef.current = false
  }, [online, stack.length, onRefresh])

  const openRoute = useCallback((routeName) => {
    if (!routeName) return
    const componentName = screens[routeName] || null
    Promise.resolve(onOpenRoute?.({ routeName, componentName })).then((res) => {
      if (!res) return
      if (!res.ok) { reportOpenFailure(res, routeName); return }
      // Only warn when the match was genuinely uncertain. A file found from the
      // app's own Screen registration or its imports is authoritative, so
      // announcing it would just be noise.
      const guessed = res.tier === 'filename' || res.tier === 'declaration'
      if (res.ambiguous && res.candidates?.length > 1) {
        toast.success(`Opened ${res.file} — ${res.candidates.length} files matched "${routeName}"`)
      } else if (guessed) {
        toast.success(`Opened ${res.file} (best guess from the file name)`)
      }
    })
  }, [onOpenRoute, screens])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return history
    return history.filter((h) =>
      (h.name || '').toLowerCase().includes(q) ||
      paramsPreview(h.params).toLowerCase().includes(q),
    )
  }, [history, search])

  // Newest at the bottom, matching the Console and Logs panels.
  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef, totalRows: filtered.length, rowHeight: ROW_HEIGHT, stickyBottom: true,
  })

  const focused = stack.length ? stack[stack.length - 1] : null
  const selected = selectedIdx != null ? filtered[selectedIdx] : null
  const detail = selected || focused

  const notDetected = stack.length === 0 && (available === false || diag?.resolved === false)

  return (
    <div className="pane bg-panel">
      <Toolbar>
        <SearchInput
          ref={searchRef}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSelectedIdx(null) }}
          placeholder="Filter route history…"
          aria-label="Filter route history"
          count={filtered.length}
        />

        <ToolbarDivider />

        <LevelChip
          active={autoRefresh}
          color="var(--status-success-text)"
          icon={<RefreshCw size={11} />}
          label="Auto"
          onClick={onToggleAutoRefresh}
          title={autoRefresh ? 'Resync every 5s (route changes always arrive live)' : 'Resync off'}
        />
        <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
      </Toolbar>

      {notDetected && (
        <div
          role="status"
          className="flex shrink-0 flex-col gap-0.5 border-b border-warn-edge bg-warn px-3 py-1.5 font-mono text-xs text-warn-fg"
        >
          <span>React Navigation was not detected in this app.</span>
          {diag?.error && <span>{diag.error}</span>}
        </div>
      )}

      {stack.length > 0 && (
        <div className="flex shrink-0 flex-col gap-1 border-b border-subtle bg-panel-alt px-3 py-2">
          <SectionLabel>Current screen</SectionLabel>
          {/* nav + ol: this is a breadcrumb trail, and the nesting order is
              meaningful, so it should be announced as an ordered list. */}
          <nav aria-label="Navigation stack">
            <ol className="flex flex-wrap items-center gap-0.5">
              {stack.map((route, i) => {
                const isLast = i === stack.length - 1
                const component = screens[route.name]
                return (
                  <li key={route.key || `${route.name}-${i}`} className="flex items-center gap-0.5">
                    {i > 0 && (
                      <ChevronRight size={12} className="shrink-0 text-faint" aria-hidden="true" />
                    )}
                    <button
                      type="button"
                      onClick={() => openRoute(route.name)}
                      aria-current={isLast ? 'page' : undefined}
                      title={
                        `Open ${component || route.name} in VS Code` +
                        (component && component !== route.name ? ` (rendered by ${component})` : '')
                      }
                      className={cn(
                        'inline-flex h-[22px] items-center rounded-sm border px-2',
                        'font-mono text-xs transition-colors duration-150 focus-ring',
                        isLast
                          ? 'border-accent bg-info font-semibold text-fg'
                          : 'border-subtle bg-card font-medium text-muted hover:text-fg',
                      )}
                    >
                      {route.name}
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-auto font-mono text-xs"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={Compass}
            title={search ? 'No matching routes' : notDetected ? 'React Navigation not detected' : 'No route changes yet'}
            description={
              notDetected
                ? 'This panel reads @react-navigation/native. Expo Router builds its own navigation container and is not supported.'
                : search
                  ? 'Try a different filter.'
                  : 'Navigate in your app and every route change will appear here.'
            }
          />
        ) : (
          <>
            {topSpacer > 0 && <div style={{ height: topSpacer }} />}
            {filtered.slice(startIdx, endIdx).map((entry, i) => {
              const idx = startIdx + i
              const isSelected = selectedIdx === idx
              const preview = paramsPreview(entry.params)
              return (
                <div
                  key={entry.id || idx}
                  onClick={() => setSelectedIdx(isSelected ? null : idx)}
                  onDoubleClick={() => openRoute(entry.name)}
                  title="Click to inspect params, double-click to open in VS Code"
                  className={cn(
                    'flex h-row cursor-pointer items-center gap-2 border-b border-subtle px-3',
                    'transition-colors duration-150',
                    isSelected ? 'bg-row-selected' : 'hover:bg-row-hover',
                  )}
                >
                  <span className="w-20 shrink-0 text-[10px] text-faint tabular-nums">
                    {formatTime(entry.timestamp)}
                  </span>
                  {entry.from && (
                    <span className="cell-truncate max-w-[140px] shrink-0 text-[10px] text-faint">
                      {entry.from} →
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openRoute(entry.name) }}
                    title={`Open ${entry.name} in VS Code`}
                    className="shrink-0 bg-transparent p-0 font-mono text-xs font-semibold text-link hover:underline focus-ring"
                  >
                    {entry.name}
                  </button>
                  <span className="cell-truncate flex-1 select-text text-faint" title={preview}>
                    {preview}
                  </span>
                </div>
              )
            })}
            {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
          </>
        )}
      </div>

      {detail && detail.params && (
        <div className="max-h-[200px] shrink-0 overflow-auto border-t border-subtle bg-panel-alt px-3 py-2">
          <SectionLabel className="mb-1 block">{detail.name} params</SectionLabel>
          <pre className="m-0 select-text whitespace-pre-wrap break-words font-mono text-xs text-muted">
            {prettyParams(detail.params)}
          </pre>
        </div>
      )}
    </div>
  )
})
