// src/renderer/components/rnspy-devtools/NavigationTab.jsx
// Live React Navigation stack + route-change timeline, with click-to-open in
// VS Code. Read-only: the desktop app never drives the app's navigator.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ChevronRight, Compass, RefreshCw, Search } from 'lucide-react'
import toast from 'react-hot-toast'

import { useVirtualRows } from '../../hooks/useVirtualRows'
import { EMPTY_STATE, INPUT_BASE, SECTION_LABEL } from '../../styles/shared'
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)' }}>
      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '0 var(--space-3)', height: 38, flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-panel-alt)',
      }}>
        <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          ref={searchRef}
          value={search} onChange={(e) => { setSearch(e.target.value); setSelectedIdx(null) }}
          placeholder="Filter route history…"
          style={{
            ...INPUT_BASE, flex: 1, height: 30, fontSize: 'var(--text-sm)',
            border: 'none', background: 'transparent', padding: 0,
          }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length}
        </span>

        <div style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />

        <LevelChip
          active={autoRefresh}
          color="var(--status-success-text)"
          icon={<RefreshCw size={11} />}
          label="Auto"
          onClick={onToggleAutoRefresh}
          title={autoRefresh ? 'Resync every 5s (route changes always arrive live)' : 'Resync off'}
        />
        <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
      </div>

      {/* ─── Not-detected banner ─── */}
      {notDetected && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '6px var(--space-3)', flexShrink: 0,
          borderBottom: '1px solid var(--status-warning-border)',
          background: 'var(--status-warning-bg)',
          fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
          color: 'var(--status-warning-text)',
        }}>
          <span>React Navigation was not detected in this app.</span>
          {diag?.error && <span>{diag.error}</span>}
        </div>
      )}

      {/* ─── Current stack breadcrumb ─── */}
      {stack.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
          padding: 'var(--space-2) var(--space-3)', flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel-alt)',
        }}>
          <span style={SECTION_LABEL}>Current screen</span>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            {stack.map((route, i) => {
              const isLast = i === stack.length - 1
              const component = screens[route.name]
              return (
                <div key={route.key || `${route.name}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {i > 0 && <ChevronRight size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
                  <button
                    onClick={() => openRoute(route.name)}
                    title={
                      `Open ${component || route.name} in VS Code` +
                      (component && component !== route.name ? ` (rendered by ${component})` : '')
                    }
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      height: 22, padding: '0 var(--space-2)',
                      border: `1px solid ${isLast ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      background: isLast ? 'var(--status-info-bg)' : 'var(--bg-card)',
                      color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isLast ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    {route.name}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Route-change timeline ─── */}
      <div ref={scrollRef} onScroll={onScroll}
        style={{ flex: 1, minHeight: 0, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
        {filtered.length === 0 ? (
          <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
            <Compass size={20} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
              {search ? 'No matching routes' : notDetected ? 'React Navigation not detected' : 'No route changes yet'}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
              maxWidth: 420, textAlign: 'center', lineHeight: 'var(--line-height-normal)',
            }}>
              {notDetected
                ? 'This panel reads @react-navigation/native. Expo Router builds its own navigation container and is not supported.'
                : search
                  ? 'Try a different filter.'
                  : 'Navigate in your app and every route change will appear here.'}
            </div>
          </div>
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
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: '0 var(--space-3)', height: ROW_HEIGHT,
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--status-info-bg)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 80, flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10 }}>
                    {formatTime(entry.timestamp)}
                  </span>
                  {entry.from && (
                    <span style={{
                      flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10,
                      maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {entry.from} →
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); openRoute(entry.name) }}
                    title={`Open ${entry.name} in VS Code`}
                    style={{
                      flexShrink: 0, border: 'none', background: 'transparent', padding: 0,
                      color: 'var(--text-link)', fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-mono)',
                      cursor: 'pointer', textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    {entry.name}
                  </button>
                  <span style={{
                    flex: 1, minWidth: 0, color: 'var(--text-tertiary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    userSelect: 'text',
                  }} title={preview}>
                    {preview}
                  </span>
                </div>
              )
            })}
            {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
          </>
        )}
      </div>

      {/* ─── Params of the selected (or focused) route ─── */}
      {detail && detail.params && (
        <div style={{
          flexShrink: 0, maxHeight: 200, overflow: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel-alt)',
          padding: 'var(--space-2) var(--space-3)',
        }}>
          <div style={{ ...SECTION_LABEL, marginBottom: 'var(--space-1)' }}>
            {detail.name} params
          </div>
          <pre style={{
            margin: 0, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            userSelect: 'text',
          }}>
            {prettyParams(detail.params)}
          </pre>
        </div>
      )}
    </div>
  )
})
