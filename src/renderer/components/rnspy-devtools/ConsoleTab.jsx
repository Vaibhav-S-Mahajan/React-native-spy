// src/renderer/components/rnspy-devtools/ConsoleTab.jsx

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Clipboard, Code, Copy, ExternalLink, FileText, Terminal,
} from 'lucide-react'
import toast from 'react-hot-toast'

import ClickablePath, { parseLocations } from './ClickablePath'
import CursorMenu, { MenuItem, MenuDivider, MenuLabel } from './CursorMenu'
import LevelChip from './LevelChip'
import { copyText } from '../../utils/curl'
import { EmptyState, SearchInput, Toolbar, ToolbarDivider } from '../ui'
import cn from '../ui/cn'
import ToolbarActions from './ToolbarActions'

const LEVELS = ['log', 'info', 'warn', 'error', 'debug']

// `color`/`dot` stay CSS values because LevelChip mixes them at runtime via
// color-mix(). `rowBg` is a class: only warn/error tint their row, and the
// hover state has to compose with it.
const LEVEL_CFG = {
  log:   { color: 'var(--text-secondary)', rowBg: 'hover:bg-row-hover', tag: 'LOG', label: 'Log', dot: 'var(--text-tertiary)' },
  info:  { color: 'var(--status-info-text)', rowBg: 'hover:bg-row-hover', tag: 'INF', label: 'Info', dot: 'var(--status-info-text)' },
  warn:  { color: 'var(--status-warning-text)', rowBg: 'bg-warn', tag: 'WRN', label: 'Warn', dot: 'var(--status-warning-text)' },
  error: { color: 'var(--status-danger-text)', rowBg: 'bg-danger', tag: 'ERR', label: 'Error', dot: 'var(--status-danger-text)' },
  debug: { color: 'var(--accent-purple)', rowBg: 'hover:bg-row-hover', tag: 'DBG', label: 'Debug', dot: 'var(--accent-purple)' },
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0')
}

function renderArg(arg) {
  if (arg == null) return String(arg)
  if (typeof arg === 'object') {
    try { return JSON.stringify(arg) } catch { return String(arg) }
  }
  return String(arg)
}

function renderArgPretty(arg) {
  if (arg == null) return String(arg)
  if (typeof arg === 'object') {
    try { return JSON.stringify(arg, null, 2) } catch { return String(arg) }
  }
  return String(arg)
}

// Short display for caller: "App.tsx:42" instead of full path
function shortCaller(caller) {
  if (!caller || !caller.file) return null
  const parts = caller.file.replace(/\\/g, '/').split('/')
  const fileName = parts[parts.length - 1] || caller.file
  return `${fileName}:${caller.line || 1}`
}

export default forwardRef(function ConsoleTab({ logs, openInEditor, symbolicateAndOpen, onClear, onReload, canReload }, ref) {
  const [activeLevels, setActiveLevels] = useState(() => new Set(LEVELS))
  const [search, setSearch] = useState('')
  const [menu, setMenu] = useState(null)
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
      if (!activeLevels.has(log.level)) return false
      if (q && !log.args.map(renderArg).join(' ').toLowerCase().includes(q)) return false
      return true
    })
  }, [logs, activeLevels, search])

  const openContextMenu = useCallback((e, log) => {
    e.preventDefault()
    const msgText = log.args.map(renderArg).join(' ')
    const locations = parseLocations(msgText)
    setMenu({ x: e.clientX, y: e.clientY, log, msgText, locations })
  }, [])

  const closeMenu = useCallback(() => setMenu(null), [])

  const copyAnd = useCallback((text, label) => {
    copyText(text).then((ok) => { if (ok) toast.success(label) })
    setMenu(null)
  }, [])

  const handleOpenSource = useCallback((log) => {
    const fn = symbolicateAndOpen || openInEditor
    if (!fn) return

    if (symbolicateAndOpen && log.stack) {
      symbolicateAndOpen(log.stack, log.caller).then((res) => {
        if (res && !res.ok) {
          if (res.reason === 'not-found') {
            toast.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5000 })
          } else if (res.reason !== 'no-stack-or-caller') {
            toast.error('Could not resolve source location', { duration: 3000 })
          }
        }
      })
    } else if (openInEditor && log.caller?.file) {
      openInEditor(log.caller.file, log.caller.line || 1, log.caller.col || 1).then((res) => {
        if (res && !res.ok && res.reason === 'not-found') {
          toast.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5000 })
        }
      })
    }
    setMenu(null)
  }, [symbolicateAndOpen, openInEditor])

  const handleOpenFile = useCallback((file, line, col) => {
    if (!openInEditor) return
    openInEditor(file, line, col).then((res) => {
      if (res && !res.ok && res.reason === 'not-found') {
        toast.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5000 })
      }
    })
    setMenu(null)
  }, [openInEditor])

  // Build all "Open in" targets for the context menu
  const menuCaller = menu?.log?.caller || null
  const menuMsgLocations = menu?.locations?.filter((s) => s.type === 'link') || []

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
          aria-label="Filter console output"
          count={filtered.length}
        />

        <ToolbarActions onClear={onClear} onReload={onReload} canReload={canReload} />
      </Toolbar>

      {/* ─── Log Stream ─── */}
      <div className="min-h-0 flex-1 overflow-auto font-mono text-xs">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Terminal}
            title={search ? 'No matching logs' : 'No console output'}
            description={search ? 'Try a different filter.' : 'Console logs will stream here.'}
          />
        ) : (
          filtered.map((log, i) => {
          const cfg = LEVEL_CFG[log.level] || LEVEL_CFG.log
          const textColor = cfg.color === 'var(--text-secondary)' ? 'var(--text-primary)' : cfg.color
          const caller = log.caller
          const callerLabel = shortCaller(caller)
          const isCapped = log.level === 'error' || log.level === 'warn'
          return (
            <ConsoleRow
              key={log.id || i}
              log={log}
              cfg={cfg}
              textColor={textColor}
              callerLabel={callerLabel}
              isCapped={isCapped}
              onContextMenu={(e) => openContextMenu(e, log)}
              onCopy={() => copyAnd(log.args.map(renderArgPretty).join('\n'), 'Copied')}
              onOpenSource={(symbolicateAndOpen || openInEditor) ? () => handleOpenSource(log) : null}
              caller={caller}
              openInEditor={openInEditor}
            />
          )
        })
        )}
      </div>

      {/* ─── Right-Click Context Menu ─── */}
      {menu && (
        <CursorMenu anchor={{ x: menu.x, y: menu.y }} onClose={closeMenu} width={300}>

          {/* ── Open in VS Code — caller (primary, uses Metro symbolication) ── */}
          {(menuCaller || menu?.log?.stack) && (
            <>
              <MenuLabel>Open in VS Code</MenuLabel>
              <MenuItem
                icon={<ExternalLink size={11} />}
                label={menuCaller ? `${menuCaller.file}:${menuCaller.line}${menuCaller.col > 1 ? ':' + menuCaller.col : ''}` : 'Resolve source & open'}
                hint="caller"
                onClick={() => handleOpenSource(menu.log)}
              />
            </>
          )}

          {/* ── Open in VS Code — from message text ── */}
          {menuMsgLocations.length > 0 && (
            <>
              {!menuCaller && !menu?.log?.stack && <MenuLabel>Open in VS Code</MenuLabel>}
              {menuMsgLocations.map((loc, i) => (
                <MenuItem
                  key={i}
                  icon={<ExternalLink size={11} />}
                  label={`${loc.file}:${loc.line}${loc.col > 1 ? ':' + loc.col : ''}`}
                  hint="stack"
                  onClick={() => handleOpenFile(loc.file, loc.line, loc.col)}
                />
              ))}
            </>
          )}

          {(menuCaller || menu?.log?.stack || menuMsgLocations.length > 0) && <MenuDivider />}

          {/* ── Copy ── */}
          <MenuLabel>Copy</MenuLabel>
          <MenuItem
            icon={<Copy size={11} />}
            label="Copy message"
            hint="⌘C"
            onClick={() => copyAnd(menu.msgText, 'Copied message')}
          />
          <MenuItem
            icon={<FileText size={11} />}
            label="Copy message (pretty)"
            onClick={() => copyAnd(menu.log.args.map(renderArgPretty).join('\n'), 'Copied (pretty)')}
          />
          <MenuItem
            icon={<Clipboard size={11} />}
            label="Copy with timestamp"
            onClick={() => copyAnd(
              `[${formatTime(menu.log.timestamp)}] [${(menu.log.level || 'log').toUpperCase()}] ${menu.msgText}`,
              'Copied with timestamp',
            )}
          />
          {menuCaller && (
            <MenuItem
              icon={<Code size={11} />}
              label="Copy caller path"
              onClick={() => copyAnd(
                `${menuCaller.file}:${menuCaller.line}:${menuCaller.col}`,
                'Copied caller path',
              )}
            />
          )}

          {/* ── Copy paths from message ── */}
          {menuMsgLocations.length > 0 && (
            <>
              <MenuDivider />
              <MenuLabel>Copy path</MenuLabel>
              {menuMsgLocations.map((loc, i) => (
                <MenuItem
                  key={i}
                  icon={<Code size={11} />}
                  label={loc.value}
                  onClick={() => copyAnd(loc.value, 'Copied path')}
                />
              ))}
            </>
          )}

        </CursorMenu>
      )}
    </div>
  )
})

// ─── Console row (full pretty-printed output) ───────────
function ConsoleRow({ log, cfg, textColor, callerLabel, isCapped, onContextMenu, onCopy, onOpenSource, caller, openInEditor }) {
  const [expanded, setExpanded] = useState(false)
  const pretty = log.args.map(renderArgPretty).join('\n')
  const capped = isCapped && !expanded

  return (
    <div
      onContextMenu={onContextMenu}
      className={cn(
        'group relative border-b border-subtle px-3 py-[5px]',
        cfg.rowBg,
      )}
    >
      <div className="mb-0.5 flex items-baseline gap-2">
        {/* Severity tag. Colour is per-level and comes from LEVEL_CFG, so it
            stays a style prop rather than becoming five near-identical classes. */}
        <span
          className="w-[26px] shrink-0 text-center text-[9px] font-semibold tracking-[0.02em]"
          style={{ color: cfg.color }}
        >
          {cfg.tag}
        </span>
        <span className="w-20 shrink-0 text-[10px] text-faint tabular-nums">
          {formatTime(log.timestamp)}
        </span>
        <span className="flex-1" />
        {callerLabel && (
          <CallerBadge
            caller={caller}
            label={callerLabel}
            onClick={onOpenSource}
          />
        )}
      </div>

      {/* ml-[106px] aligns the message under the tag+time gutter (26+80). */}
      <div
        className={cn(
          'ml-[106px] select-text whitespace-pre-wrap break-words',
          capped ? 'max-h-[200px] overflow-hidden' : 'overflow-visible',
        )}
        style={{ color: textColor }}
      >
        <ClickablePath text={pretty} color={textColor} openInEditor={openInEditor} />
      </div>

      {capped && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="ml-[106px] mt-0.5 inline-flex h-control-sm items-center gap-0.5 rounded-sm px-1 font-ui text-[10px] font-medium text-link hover:bg-card focus-ring"
        >
          Show more
        </button>
      )}

      {/* Revealed on row hover or keyboard focus — previously gated on a hover
          state hook, which made it unreachable without a mouse. */}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy message"
        title="Copy"
        className="absolute right-1.5 top-1 flex h-[22px] w-[22px] items-center justify-center rounded-sm border border-subtle bg-panel text-faint opacity-0 transition-opacity duration-100 hover:text-fg focus-ring group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Copy size={11} aria-hidden="true" />
      </button>
    </div>
  )
}

// ─── Caller badge (right side of each row) ───────────
// Renders as a real <button> when clickable — it was a role="button" <span>,
// which meant no native keyboard or focus behaviour. Hover styling is now CSS,
// so the component no longer re-renders on mouse enter/leave.
function CallerBadge({ caller, label, onClick }) {
  const location = `${caller.file}:${caller.line}:${caller.col}`
  const shared = 'cell-truncate max-w-[160px] shrink-0 rounded-sm px-1.5 py-px font-mono text-[10px]'

  if (!onClick) {
    return (
      <span className={cn(shared, 'text-faint')} title={location}>
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      title={`Open ${location} in VS Code`}
      className={cn(
        shared,
        'bg-transparent text-faint transition-colors duration-100',
        'hover:bg-info hover:text-link hover:underline focus-ring',
      )}
    >
      {label}
    </button>
  )
}
