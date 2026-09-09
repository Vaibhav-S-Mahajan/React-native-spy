// src/renderer/components/rnspy-devtools/IssuesModal.jsx
//
// One place to see everything wrong in the session: console errors and
// warnings, failed requests, server errors, storage and database diagnostics.
//
// Aggregation lives in hooks/useIssues.js. This is presentation only.
//
// Accessibility: role="dialog" + aria-modal, focus trap, focus restore on
// close, Escape to dismiss, and position:fixed via a portal. All of that now
// comes from the shared Modal primitive (components/ui/Modal.jsx), which was
// extracted from the implementation this file used to carry alone.

import { useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, Check, Copy, Database, FileCode2, Globe,
  HardDrive, PlugZap, Server, ShieldCheck, Terminal, X, XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Button, IconButton, Modal, SectionLabel } from '../ui'
import cn from '../ui/cn'
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

  // Focus management (trap, restore, Escape) now lives in the Modal primitive
  // via useFocusTrap — extracted from the implementation that used to sit here,
  // so the other modals get the same behaviour instead of reimplementing it.
  const closeRef = useRef(null)

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

  return (
    <Modal
      size="xl"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      initialFocusRef={closeRef}
      labelledBy="issues-title"
      className="max-h-[82vh] bg-panel"
    >
      {/* Header. Not ModalHeader: this one carries live counts and a bulk
          action, so it composes its own row. */}
      <div className="flex shrink-0 items-center gap-2 border-b border-subtle bg-sidebar px-4 py-3">
        <AlertTriangle
          size={14}
          className={errorCount > 0 ? 'text-danger-fg' : 'text-warn-fg'}
          aria-hidden="true"
        />
        <h2 id="issues-title" className="font-ui text-base font-semibold text-fg">
          Issues
        </h2>
        <span className="flex items-center gap-2 font-mono text-xs">
          <span className="text-danger-fg">{errorCount} errors</span>
          <span className="text-faint">·</span>
          <span className="text-warn-fg">{warnCount} warnings</span>
        </span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={copyAll}
          disabled={!filtered.length}
          title="Copy visible issues"
        >
          <Copy size={11} aria-hidden="true" />
          Copy all
        </Button>
        <IconButton ref={closeRef} label="Close issues" size="sm" onClick={onClose}>
          <X size={14} aria-hidden="true" />
        </IconButton>
      </div>

      {/* Filters. `.seg`/`.seg-btn`/`.tick` are the project's existing segmented
          control in ui.css — already token-driven, so they stay as-is. */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-subtle bg-panel-alt px-4 py-2">
        <div className="seg" role="group" aria-label="Severity">
          {[
            { id: 'all', label: 'All', n: errorCount + warnCount },
            { id: 'error', label: 'Errors', n: errorCount },
            { id: 'warn', label: 'Warnings', n: warnCount },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              className="seg-btn"
              aria-pressed={severity === s.id}
              onClick={() => setSeverity(s.id)}
            >
              <span className="tick" aria-hidden="true">✓</span>
              {s.label}
              <span className="opacity-70 tabular-nums">{s.n}</span>
            </button>
          ))}
        </div>

        <span className="rule" aria-hidden="true" />

        <div className="seg" role="group" aria-label="Source">
          <button
            type="button"
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
              type="button"
              className="seg-btn"
              aria-pressed={source === s.id}
              onClick={() => setSource(s.id)}
            >
              <span className="tick" aria-hidden="true">✓</span>
              {s.label}
              <span className="opacity-70 tabular-nums">{bySource[s.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-auto">
        {!filtered.length ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <ShieldCheck size={22} className="text-success-fg opacity-80" aria-hidden="true" />
            <div className="font-ui text-sm font-medium text-muted">
              {issues.length ? 'Nothing matches these filters' : 'No issues detected'}
            </div>
            <div className="max-w-[380px] font-ui text-xs text-faint leading-normal">
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
              className={cn(
                'border-b border-subtle',
                // A 35% wash: full --status-danger-bg on every error row would
                // overwhelm a long list.
                isErr && 'bg-[color-mix(in_srgb,var(--status-danger-bg)_35%,transparent)]',
              )}
            >
              <div className="flex items-start gap-2 px-4 py-2">
                {/* Severity: glyph + colour, never colour alone */}
                {isErr
                  ? <XCircle size={13} className="mt-px shrink-0 text-danger-fg" aria-hidden="true" />
                  : <AlertTriangle size={13} className="mt-px shrink-0 text-warn-fg" aria-hidden="true" />}
                <span className="sr-only">{isErr ? 'Error' : 'Warning'}</span>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggle(issue.id)}
                    aria-expanded={open}
                    className={cn(
                      'block w-full border-none bg-transparent p-0 text-left',
                      'font-mono text-xs text-fg leading-normal focus-ring',
                      open ? 'whitespace-normal break-words' : 'cell-truncate',
                    )}
                  >
                    {issue.title}
                  </button>

                  {/* Meta line */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 font-ui text-2xs text-faint">
                    <span className="inline-flex items-center gap-[3px]">
                      <Icon size={9} aria-hidden="true" />
                      {issue.source}
                    </span>
                    {issue.device && <span>· {issue.device}</span>}
                    {issue.timestamp && <span>· {formatWhen(issue.timestamp)}</span>}
                    {issue.count > 1 && (
                      <span className="rounded-sm border border-subtle bg-card px-1 font-mono text-muted tabular-nums">
                        ×{issue.count}
                      </span>
                    )}
                  </div>

                  {open && issue.detail && issue.detail !== issue.title && (
                    <pre className="mt-2 max-h-[180px] select-text overflow-auto rounded-sm border border-subtle bg-code p-2 font-mono text-2xs text-muted whitespace-pre-wrap break-words">
                      {issue.detail}
                    </pre>
                  )}
                </div>

                {/* Jump to source when we know where it came from */}
                {caller && onOpenInEditor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenInEditor(issue.caller.file, issue.caller.line, issue.caller.col)}
                    title={`Open ${issue.caller.file}:${issue.caller.line} in editor`}
                    className="max-w-[160px] gap-[3px] text-link"
                  >
                    <FileCode2 size={10} aria-hidden="true" />
                    <span className="cell-truncate">{caller}</span>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-2 border-t border-subtle bg-sidebar px-4 py-2">
        <SectionLabel>{filtered.length} of {issues.length} shown</SectionLabel>
        <div className="flex-1" />
        <span className="font-ui text-2xs text-faint">Repeats are grouped</span>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <Check size={11} aria-hidden="true" />
          Done
        </Button>
      </div>
    </Modal>
  )
}
