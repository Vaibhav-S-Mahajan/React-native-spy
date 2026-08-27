// src/renderer/components/rnspy-devtools/ConsoleTab.jsx

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Clipboard, Code, Copy, ExternalLink, FileText, Search, Terminal,
} from 'lucide-react'
import toast from 'react-hot-toast'

import ClickablePath, { parseLocations } from './ClickablePath'
import CursorMenu, { MenuItem, MenuDivider, MenuLabel } from './CursorMenu'
import LevelChip from './LevelChip'
import { copyText } from '../../utils/curl'
import { EMPTY_STATE, INPUT_BASE, BTN_GHOST } from '../../styles/shared'
import ToolbarActions from './ToolbarActions'

const LEVELS = ['log', 'info', 'warn', 'error', 'debug']
const CAP_HEIGHT = 200

const LEVEL_CFG = {
  log:   { color: 'var(--text-secondary)', bg: 'transparent', tag: 'LOG', tagBg: 'var(--bg-card)', label: 'Log', dot: 'var(--text-tertiary)' },
  info:  { color: 'var(--status-info-text)', bg: 'transparent', tag: 'INF', tagBg: 'var(--status-info-bg)', label: 'Info', dot: 'var(--status-info-text)' },
  warn:  { color: 'var(--status-warning-text)', bg: 'var(--status-warning-bg)', tag: 'WRN', tagBg: 'var(--status-warning-bg)', label: 'Warn', dot: 'var(--status-warning-text)' },
  error: { color: 'var(--status-danger-text)', bg: 'var(--status-danger-bg)', tag: 'ERR', tagBg: 'var(--status-danger-bg)', label: 'Error', dot: 'var(--status-danger-text)' },
  debug: { color: 'var(--accent-purple)', bg: 'transparent', tag: 'DBG', tagBg: 'var(--bg-card)', label: 'Debug', dot: 'var(--accent-purple)' },
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

      {/* ─── Log Stream ─── */}
      <div
        style={{ flex: 1, minHeight: 0, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
      >
        {filtered.length === 0 ? (
          <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
            <Terminal size={20} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
              No console output
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Console logs will stream here
            </div>
          </div>
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
  const [hover, setHover] = useState(false)
  const pretty = log.args.map(renderArgPretty).join('\n')
  const capped = isCapped && !expanded

  return (
    <div
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '5px var(--space-3)',
        borderBottom: '1px solid var(--border-subtle)',
        background: cfg.bg,
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 2 }}>
        <span style={{
          width: 26, flexShrink: 0, textAlign: 'center',
          fontSize: 9, fontWeight: 'var(--font-weight-semibold)',
          color: cfg.color, letterSpacing: '0.02em',
        }}>
          {cfg.tag}
        </span>
        <span style={{ width: 80, flexShrink: 0, color: 'var(--text-tertiary)', fontSize: 10 }}>
          {formatTime(log.timestamp)}
        </span>
        <span style={{ flex: 1 }} />
        {callerLabel && (
          <CallerBadge
            caller={caller}
            label={callerLabel}
            onClick={onOpenSource}
          />
        )}
      </div>
      <div
        style={{
          marginLeft: 106,
          color: textColor,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: 'text',
          overflow: capped ? 'hidden' : 'visible',
          maxHeight: capped ? CAP_HEIGHT : 'none',
        }}
      >
        <ClickablePath text={pretty} color={textColor} openInEditor={openInEditor} />
      </div>

      {capped && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            ...BTN_GHOST, marginLeft: 106, marginTop: 2, fontSize: 10,
            color: 'var(--text-link)', gap: 2,
          }}
        >
          Show more
        </button>
      )}

      {hover && (
        <button
          onClick={onCopy}
          title="Copy"
          style={{
            position: 'absolute', top: 4, right: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-panel)', color: 'var(--text-tertiary)',
            cursor: 'pointer',
          }}
        >
          <Copy size={11} />
        </button>
      )}
    </div>
  )
}

// ─── Caller badge (right side of each row) ───────────
function CallerBadge({ caller, label, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick() } : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={onClick ? `Open ${caller.file}:${caller.line}:${caller.col} in VS Code` : `${caller.file}:${caller.line}:${caller.col}`}
      style={{
        flexShrink: 0,
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: hover ? 'var(--text-link)' : 'var(--text-tertiary)',
        textDecoration: hover ? 'underline' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        padding: '1px 6px',
        borderRadius: 'var(--radius-sm)',
        background: hover ? 'var(--status-info-bg)' : 'transparent',
        transition: 'all 80ms ease',
        maxWidth: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
