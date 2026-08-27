// src/renderer/components/rnspy-devtools/IssuesModal.jsx
//
// One place to see everything wrong in the session: console errors and
// warnings, failed requests, server errors, storage and database diagnostics.
//
// Aggregation lives in hooks/useIssues.js. This is presentation only.
//
// Accessibility: this is the first modal in the app built properly —
// role="dialog" + aria-modal, focus trap, focus restore on close, Escape to
// dismiss, and position:fixed via a portal. The other four modals still need
// the same treatment (tracked in design/UI-REDESIGN.md §8).

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle, Check, Copy, Database, FileCode2, Globe,
  HardDrive, PlugZap, Server, ShieldCheck, Terminal, X, XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { BTN_GHOST, BTN_SECONDARY, SECTION_LABEL } from '../../styles/shared'
import { SOURCES } from '../../hooks/useIssues'
import { copyText } from '../../utils/curl'

const SOURCE_ICON = {
  setup: PlugZap,
  console: Terminal,
  network: Globe,
  server: Server,
  storage: HardDrive,
  database: Database,
}

function formatWhen(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (v, n = 2) => String(v).padStart(n, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function shortCaller(caller) {
  if (!caller?.file) return null
  const file = caller.file.split('/').pop()
  return caller.line ? `${file}:${caller.line}` : file
}

export default function IssuesModal({
  issues = [], errorCount = 0, warnCount = 0, bySource = {},
  onOpenInEditor, onClose,
  // The element to hand focus back to on close. Passed explicitly rather than
  // captured from document.activeElement: a click doesn't necessarily focus the
  // button it activates, so capturing would sometimes restore to <body>.
  returnFocusRef,
}) {
  const [severity, setSeverity] = useState('all')   // all | error | warn
  const [source, setSource] = useState('all')
  const [expanded, setExpanded] = useState(() => new Set())

  const cardRef = useRef(null)
  const closeRef = useRef(null)
  // Remember what had focus so it can be restored — otherwise closing the
  // dialog drops focus to <body> and keyboard users lose their place.
  const restoreRef = useRef(null)

  useEffect(() => {
    // Prefer the explicit trigger; fall back to whatever had focus.
    restoreRef.current = returnFocusRef?.current || document.activeElement
    closeRef.current?.focus()
    return () => {
      const el = restoreRef.current
      if (el && typeof el.focus === 'function') el.focus()
    }
  }, [returnFocusRef])

  // Escape to dismiss + focus trap.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose?.(); return }
      if (e.key !== 'Tab') return
      const card = cardRef.current
      if (!card) return
      const focusable = card.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = useMemo(() => issues.filter((i) => {
    if (severity !== 'all' && i.severity !== severity) return false
    if (source !== 'all' && i.source !== source) return false
    return true
  }), [issues, severity, source])

  const toggle = (id) => setExpanded((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const copyAll = () => {
    const text = filtered.map((i) => {
      const head = `[${i.severity.toUpperCase()}] ${i.source}${i.device ? ` · ${i.device}` : ''}` +
        `${i.count > 1 ? ` (×${i.count})` : ''}`
      return `${head}\n${i.detail}\n`
    }).join('\n')
    copyText(text).then((ok) => {
      if (ok) toast.success(`Copied ${filtered.length} issue${filtered.length === 1 ? '' : 's'}`)
    })
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1250,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--overlay)',
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issues-title"
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 680, maxWidth: '92vw', maxHeight: '82vh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)', flexShrink: 0,
        }}>
          <AlertTriangle
            size={14}
            style={{ color: errorCount > 0 ? 'var(--status-danger-text)' : 'var(--status-warning-text)' }}
          />
          <span id="issues-title" style={{
            fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
          }}>
            Issues
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ color: 'var(--status-danger-text)' }}>{errorCount} errors</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ color: 'var(--status-warning-text)' }}>{warnCount} warnings</span>
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={copyAll} style={{ ...BTN_GHOST }} disabled={!filtered.length} title="Copy visible issues">
            <Copy size={11} />
            Copy all
          </button>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close issues"
            style={{ ...BTN_GHOST, padding: 2, height: 22 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel-alt)', flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          <div className="seg" role="group" aria-label="Severity">
            {[
              { id: 'all', label: 'All', n: errorCount + warnCount },
              { id: 'error', label: 'Errors', n: errorCount },
              { id: 'warn', label: 'Warnings', n: warnCount },
            ].map((s) => (
              <button
                key={s.id}
                className="seg-btn"
                aria-pressed={severity === s.id}
                onClick={() => setSeverity(s.id)}
              >
                <span className="tick" aria-hidden="true">✓</span>
                {s.label}
                <span style={{ opacity: 0.7 }}>{s.n}</span>
              </button>
            ))}
          </div>

          <span className="rule" aria-hidden="true" />

          <div className="seg" role="group" aria-label="Source">
            <button
              className="seg-btn"
              aria-pressed={source === 'all'}
              onClick={() => setSource('all')}
            >
              <span className="tick" aria-hidden="true">✓</span>
              Any
            </button>
            {SOURCES.filter((s) => (bySource[s.id] || 0) > 0).map((s) => (
              <button
                key={s.id}
                className="seg-btn"
                aria-pressed={source === s.id}
                onClick={() => setSource(s.id)}
              >
                <span className="tick" aria-hidden="true">✓</span>
                {s.label}
                <span style={{ opacity: 0.7 }}>{bySource[s.id]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {!filtered.length ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-8) var(--space-4)', textAlign: 'center',
            }}>
              <ShieldCheck size={22} style={{ color: 'var(--status-success-text)', opacity: 0.8 }} />
              <div style={{
                fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)',
              }}>
                {issues.length ? 'Nothing matches these filters' : 'No issues detected'}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)', maxWidth: 380,
                lineHeight: 'var(--line-height-normal)',
              }}>
                {issues.length
                  ? 'Try widening the severity or source filter.'
                  : 'Console errors, failed requests, and server or storage problems will collect here.'}
              </div>
            </div>
          ) : filtered.map((issue) => {
            const Icon = SOURCE_ICON[issue.source] || AlertTriangle
            const isErr = issue.severity === 'error'
            const open = expanded.has(issue.id)
            const caller = shortCaller(issue.caller)
            return (
              <div
                key={issue.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: isErr
                    ? 'color-mix(in srgb, var(--status-danger-bg) 35%, transparent)'
                    : 'transparent',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                }}>
                  {/* Severity: glyph + colour, never colour alone */}
                  {isErr
                    ? <XCircle size={13} style={{ color: 'var(--status-danger-text)', flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                    : <AlertTriangle size={13} style={{ color: 'var(--status-warning-text)', flexShrink: 0, marginTop: 1 }} aria-hidden="true" />}
                  <span className="sr-only">{isErr ? 'Error' : 'Warning'}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <button
                      onClick={() => toggle(issue.id)}
                      aria-expanded={open}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        border: 'none', background: 'transparent', padding: 0,
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                        lineHeight: 'var(--line-height-normal)',
                        cursor: 'pointer',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: open ? 'normal' : 'nowrap',
                        wordBreak: open ? 'break-word' : 'normal',
                      }}
                    >
                      {issue.title}
                    </button>

                    {/* Meta line */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      marginTop: 2, flexWrap: 'wrap',
                      fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-ui)',
                      color: 'var(--text-tertiary)',
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Icon size={9} aria-hidden="true" />
                        {issue.source}
                      </span>
                      {issue.device && <span>· {issue.device}</span>}
                      {issue.timestamp && <span>· {formatWhen(issue.timestamp)}</span>}
                      {issue.count > 1 && (
                        <span style={{
                          padding: '0 4px', borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-secondary)',
                        }}>
                          ×{issue.count}
                        </span>
                      )}
                    </div>

                    {open && issue.detail && issue.detail !== issue.title && (
                      <pre style={{
                        margin: 'var(--space-2) 0 0',
                        padding: 'var(--space-2)',
                        background: 'var(--bg-code-block)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        userSelect: 'text', maxHeight: 180, overflow: 'auto',
                      }}>
                        {issue.detail}
                      </pre>
                    )}
                  </div>

                  {/* Jump to source when we know where it came from */}
                  {caller && onOpenInEditor && (
                    <button
                      onClick={() => onOpenInEditor(issue.caller.file, issue.caller.line, issue.caller.col)}
                      title={`Open ${issue.caller.file}:${issue.caller.line} in editor`}
                      style={{
                        ...BTN_GHOST, flexShrink: 0, gap: 3,
                        color: 'var(--text-link)', maxWidth: 160,
                      }}
                    >
                      <FileCode2 size={10} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {caller}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)', flexShrink: 0,
        }}>
          <span style={{ ...SECTION_LABEL, fontSize: 'var(--text-2xs)' }}>
            {filtered.length} of {issues.length} shown
          </span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
          }}>
            Repeats are grouped
          </span>
          <button onClick={onClose} style={{ ...BTN_SECONDARY, height: 26 }}>
            <Check size={11} />
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
