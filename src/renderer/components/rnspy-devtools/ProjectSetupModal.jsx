// src/renderer/components/rnspy-devtools/ProjectSetupModal.jsx
//
// Automatic React Native project setup.
//
// Flow: pick a folder → detect RN → preview every change → confirm → apply.
// Nothing is written until the user confirms the preview, because this is the only
// part of the app that modifies a repo it doesn't own.

import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle, Check, FileCode2, FilePlus2, FolderOpen, FolderSearch,
  Info, Loader2, RefreshCw, RotateCcw, ShieldAlert, Trash2, X,
} from 'lucide-react'

import {
  BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER, BTN_GHOST,
  BADGE_SUCCESS, BADGE_INFO, BADGE_WARNING,
  SECTION_LABEL,
} from '../../styles/shared'
import Logo from './Logo'

// Human-readable copy for every failure reason the main process can return.
const REASON_COPY = {
  canceled: null, // user dismissed the dialog — not an error
  'no-directory': 'No folder was selected.',
  'not-a-directory': 'That path is not a folder.',
  'no-package-json': "No package.json here. Pick the folder that contains your app's package.json.",
  'invalid-package-json': 'The package.json in this folder could not be parsed.',
  'not-react-native': 'This does not look like a React Native project — react-native is not in its dependencies.',
  'no-entry-file': 'Could not find an entry file (index.js or App.js) to wire the import into.',
  'entry-file-unreadable': 'The entry file could not be read.',
  'path-outside-project': 'Refused to write outside the selected project folder.',
  'write-failed': 'A file could not be written.',
  'not-available': 'Setup is unavailable — the desktop bridge did not load.',
}

function reasonText(result) {
  if (!result) return 'Something went wrong.'
  const copy = REASON_COPY[result.reason]
  if (copy) return result.message ? `${copy} (${result.message})` : copy
  return result.message || `Setup failed: ${result.reason || 'unknown error'}`
}

const ACTION_META = {
  create: { label: 'Create', badge: BADGE_SUCCESS, Icon: FilePlus2 },
  overwrite: { label: 'Regenerate', badge: BADGE_WARNING, Icon: RefreshCw },
  append: { label: 'Append', badge: BADGE_INFO, Icon: FileCode2 },
  inject: { label: 'Add import', badge: BADGE_INFO, Icon: FileCode2 },
  'already-present': { label: 'Up to date', badge: BADGE_SUCCESS, Icon: Check },
  // Nothing is written for a 'manual' step — it tells the user what to add by hand.
  manual: { label: 'Your turn', badge: BADGE_WARNING, Icon: Info },
}

const MONO = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
}

const HINT = {
  fontSize: 'var(--text-xs)',
  color: 'var(--text-tertiary)',
  fontFamily: 'var(--font-ui)',
  lineHeight: 'var(--line-height-normal)',
}

function CodeLine({ children }) {
  return (
    <div style={{
      ...MONO,
      padding: '4px var(--space-2)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-code-block)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-secondary)',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      lineHeight: 'var(--line-height-normal)',
    }}>
      {children}
    </div>
  )
}

function StepRow({ step }) {
  const meta = ACTION_META[step.action] || ACTION_META.append
  const { Icon } = meta
  const isNoop = step.action === 'already-present'
  // A manual step still shows its snippet — that snippet IS the instruction.
  const isManual = step.action === 'manual'
  const showLines = step.lines?.length > 0 && !isNoop

  return (
    <div style={{
      padding: 'var(--space-2)',
      borderRadius: 'var(--radius-md)',
      background: isManual ? 'var(--status-warning-bg)' : 'var(--bg-card)',
      border: `1px solid ${isManual ? 'var(--status-warning-border)' : 'var(--border-subtle)'}`,
      opacity: isNoop ? 0.65 : 1,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        marginBottom: showLines ? 'var(--space-2)' : 0,
      }}>
        <Icon size={11} color="var(--text-tertiary)" />
        <span style={{ ...MONO, flex: 1, color: 'var(--text-primary)' }}>
          {step.relativePath}
        </span>
        <span style={{ ...meta.badge, fontSize: 10 }}>{meta.label}</span>
      </div>
      <div style={{ ...HINT, marginLeft: 19 }}>{step.detail}</div>
      {showLines && (
        <div style={{
          marginLeft: 19, marginTop: 'var(--space-2)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {step.lines.map((line) => (
            <CodeLine key={line}>{line}</CodeLine>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Standing reminder that the integration is a debug build artifact.
 *
 * Shown both before writing and after, because the risk is real: the SDK streams
 * console output, request/response bodies and storage contents in plaintext over
 * the local network. __DEV__ means Metro strips it from a release bundle, but a
 * user who copies the generated file, changes the guard, or ships from a branch
 * that still has it wired up loses that protection — so this says both things.
 */
function ProductionWarning({ onRemove }) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-2)',
      padding: 'var(--space-2)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--status-warning-bg)',
      border: '1px solid var(--status-warning-border)',
      marginBottom: 'var(--space-3)',
    }}>
      <ShieldAlert
        size={12}
        color="var(--status-warning-text)"
        style={{ flexShrink: 0, marginTop: 1 }}
      />
      <div style={{ ...HINT, color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--status-warning-text)' }}>Debug builds only.</strong>{' '}
        This streams console output, network bodies, storage and database contents in
        plaintext to this app over your local network. Everything is wrapped
        in <span style={MONO}>__DEV__</span> so Metro drops it from a release bundle,
        but don&apos;t ship a branch with it wired up
        {onRemove ? (
          <> — use <strong>Remove integration</strong> when you&apos;re done debugging.</>
        ) : (
          <> — remove the integration when you&apos;re done debugging.</>
        )}
      </div>
    </div>
  )
}

export default function ProjectSetupModal({
  projectRoot = '',
  host = 'localhost',
  port = 8097,
  onPickFolder,
  onPlan,
  onApply,
  onRemove,
  onSetProjectRoot,
  onOpenFile,
  onClose,
}) {
  // idle → busy → plan | error → applying → done
  const [phase, setPhase] = useState('idle')
  const [dir, setDir] = useState(projectRoot)
  const [plan, setPlan] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  // The WatermelonDB step, when the project uses it. Absent for projects without
  // @nozbe/watermelondb, so every read has to tolerate undefined.
  const wmStep = plan?.steps?.find((s) => s.id === 'watermelon')

  // Escape to dismiss — the settings modal lacks this, but a flow that can write
  // files should always be trivially escapable.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const runPlan = useCallback(async (target) => {
    setPhase('busy')
    setError(null)
    setConfirming(false)
    const res = await onPlan?.(target)
    if (res?.ok) {
      setPlan(res)
      setDir(res.dir)
      setPhase('plan')
    } else {
      setPlan(null)
      setError(res)
      setPhase('error')
    }
  }, [onPlan])

  const pick = useCallback(async () => {
    setError(null)
    const picked = await onPickFolder?.()
    if (!picked?.ok) {
      // A canceled dialog should leave the modal exactly as it was.
      if (picked?.reason !== 'canceled') {
        setError(picked)
        setPhase('error')
      }
      return
    }
    await runPlan(picked.path)
  }, [onPickFolder, runPlan])

  const apply = useCallback(async () => {
    setPhase('applying')
    const res = await onApply?.(dir)
    if (res?.ok) {
      // Remember the folder so stack traces resolve against it too.
      onSetProjectRoot?.(res.dir)
      setResult(res)
      setPhase('done')
    } else {
      setError(res)
      setPhase('error')
    }
  }, [onApply, dir, onSetProjectRoot])

  const remove = useCallback(async () => {
    setPhase('applying')
    const res = await onRemove?.(dir)
    if (res?.ok) {
      setConfirmRemove(false)
      await runPlan(dir)
    } else {
      setError(res)
      setPhase('error')
    }
  }, [onRemove, dir, runPlan])

  // Offer to re-check a previously chosen folder as soon as the modal opens.
  useEffect(() => {
    if (projectRoot && phase === 'idle') runPlan(projectRoot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const busy = phase === 'busy' || phase === 'applying'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--overlay)',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: 520, maxHeight: '80vh',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
        }}>
          <Logo size={16} />
          <span style={{
            flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
          }}>
            Connect a React Native project
          </span>
          <button onClick={onClose} style={{ ...BTN_GHOST, padding: 2, height: 20 }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-4)' }}>
          {/* Folder picker */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <FolderOpen size={10} />
              PROJECT FOLDER
            </div>
            <div style={{ ...HINT, marginBottom: 'var(--space-2)' }}>
              Pick the folder containing your package.json. The connection file is
              generated there, gitignored, and imported for you.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                ...MONO, flex: 1, minWidth: 0,
                height: 28, padding: '0 var(--space-2)',
                display: 'flex', alignItems: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-input)',
                color: dir ? 'var(--text-primary)' : 'var(--text-tertiary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {dir || 'No folder selected'}
              </div>
              <button
                onClick={pick}
                disabled={busy}
                style={{
                  ...BTN_SECONDARY, height: 28, fontSize: 'var(--text-xs)',
                  opacity: busy ? 0.5 : 1, cursor: busy ? 'default' : 'pointer',
                }}
              >
                <FolderSearch size={11} />
                {dir ? 'Change…' : 'Browse…'}
              </button>
            </div>
          </div>

          {busy && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              ...HINT, color: 'var(--text-secondary)',
            }}>
              <Loader2 size={12} className="animate-spin" />
              {phase === 'applying' ? 'Writing files…' : 'Inspecting project…'}
            </div>
          )}

          {phase === 'error' && (
            <div style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--status-danger-text)', fontFamily: 'var(--font-ui)',
              }}>
                <AlertTriangle size={12} />
                Could not set up this folder
              </div>
              <div style={{ ...HINT, color: 'var(--text-secondary)' }}>
                {reasonText(error)}
              </div>
            </div>
          )}

          {/* Detected project + change preview */}
          {phase === 'plan' && plan && (
            <>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{
                  ...SECTION_LABEL, display: 'flex', alignItems: 'center',
                  gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
                }}>
                  <Check size={10} />
                  DETECTED
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', flexWrap: 'wrap',
                  gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
                }}>
                  <span style={{
                    ...MONO, color: 'var(--text-primary)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}>
                    {plan.appName}
                  </span>
                  <span style={{ ...BADGE_INFO, fontSize: 10 }}>
                    react-native {plan.rnVersion}
                  </span>
                  {plan.isExpo && <span style={{ ...BADGE_INFO, fontSize: 10 }}>Expo</span>}
                </div>
                <div style={HINT}>
                  Entry file <span style={{ ...MONO, color: 'var(--text-secondary)' }}>
                    {plan.entryFileRelative}
                  </span> · connects to <span style={{ ...MONO, color: 'var(--text-secondary)' }}>
                    ws://{plan.host}:{plan.port}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{
                  ...SECTION_LABEL, display: 'flex', alignItems: 'center',
                  gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
                }}>
                  <FileCode2 size={10} />
                  {plan.upToDate ? 'NO CHANGES NEEDED' : `PLANNED CHANGES · ${plan.changeCount}`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {plan.steps.map((step) => <StepRow key={step.id} step={step} />)}
                </div>
              </div>

              {!plan.upToDate && (
                <>
                  <div style={{
                    display: 'flex', gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--status-info-bg)',
                    border: '1px solid var(--status-info-border)',
                    marginBottom: 'var(--space-3)',
                  }}>
                    <Info size={12} color="var(--status-info-text)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ ...HINT, color: 'var(--text-secondary)' }}>
                      The import goes in as the <strong>first</strong> import so the SDK can
                      patch <span style={MONO}>console</span>, <span style={MONO}>fetch</span>,{' '}
                      <span style={MONO}>XMLHttpRequest</span> and <span style={MONO}>WebSocket</span>{' '}
                      before any app code runs.
                      {wmStep?.action === 'append' && (
                        <>
                          {' '}Your WatermelonDB database in{' '}
                          <span style={MONO}>{wmStep.relativePath}</span> is exposed at the end of
                          that file so the database panel can read it.
                        </>
                      )}
                      {' '}Every modified file is backed up
                      as <span style={MONO}>.rnspy.bak</span> first.
                    </div>
                  </div>

                  <ProductionWarning />

                  {!confirming ? (
                    <button
                      onClick={() => setConfirming(true)}
                      style={{
                        ...BTN_PRIMARY, width: '100%', justifyContent: 'center',
                        height: 32, fontSize: 'var(--text-xs)',
                      }}
                    >
                      <FilePlus2 size={11} />
                      Set up automatically
                    </button>
                  ) : (
                    <div style={{
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--status-warning-bg)',
                      border: '1px solid var(--status-warning-border)',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        marginBottom: 'var(--space-2)',
                        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--status-warning-text)', fontFamily: 'var(--font-ui)',
                      }}>
                        <AlertTriangle size={12} />
                        Write {plan.changeCount} file{plan.changeCount === 1 ? '' : 's'} into your project?
                      </div>
                      <div style={{ ...HINT, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                        This modifies files in{' '}
                        <span style={{ ...MONO, color: 'var(--text-secondary)' }}>{plan.dir}</span>.
                        Backups are written alongside each changed file, and you can undo this
                        from here afterwards.
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setConfirming(false)}
                          style={{ ...BTN_SECONDARY, height: 26, fontSize: 'var(--text-xs)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={apply}
                          style={{
                            ...BTN_PRIMARY, height: 26, fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-semibold)',
                          }}
                        >
                          <Check size={10} />
                          Write files
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Already wired up — offer a re-check and an undo. */}
              {plan.upToDate && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ ...HINT, color: 'var(--text-secondary)' }}>
                    This project is already wired up. Reload your app to connect.
                  </div>

                  {/* Shown here too: this is the state a user lands on when they come
                      back to a project that is still instrumented. */}
                  <ProductionWarning onRemove />
                  {!confirmRemove ? (
                    <button
                      onClick={() => setConfirmRemove(true)}
                      style={{
                        ...BTN_DANGER, width: '100%', justifyContent: 'center',
                        height: 30, fontSize: 'var(--text-xs)',
                      }}
                    >
                      <Trash2 size={11} />
                      Remove integration
                    </button>
                  ) : (
                    <div style={{
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--status-danger-bg)',
                      border: '1px solid var(--status-danger-border)',
                    }}>
                      <div style={{ ...HINT, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                        Deletes the generated connection file and removes the import from{' '}
                        <span style={{ ...MONO, color: 'var(--text-secondary)' }}>
                          {plan.entryFileRelative}
                        </span>
                        {wmStep?.action === 'already-present' && (
                          <>
                            , and the database line from{' '}
                            <span style={{ ...MONO, color: 'var(--text-secondary)' }}>
                              {wmStep.relativePath}
                            </span>
                          </>
                        )}
                        . The .gitignore entries are left alone.
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setConfirmRemove(false)}
                          style={{ ...BTN_SECONDARY, height: 26, fontSize: 'var(--text-xs)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={remove}
                          style={{ ...BTN_DANGER, height: 26, fontSize: 'var(--text-xs)' }}
                        >
                          <Trash2 size={10} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Success */}
          {phase === 'done' && result && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--status-success-text)', fontFamily: 'var(--font-ui)',
              }}>
                <Check size={14} />
                {result.appName} is wired up
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', gap: 2,
                marginBottom: 'var(--space-4)',
              }}>
                {result.written.map((w) => (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: '4px var(--space-2)', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  }}>
                    <Check size={10} color="var(--status-success-text)" />
                    <span style={{ ...MONO, flex: 1, color: 'var(--text-secondary)' }}>
                      {w.path}
                    </span>
                    <span style={{ ...BADGE_SUCCESS, fontSize: 10 }}>
                      {ACTION_META[w.action]?.label || w.action}
                    </span>
                  </div>
                ))}
                {result.skipped.map((s) => {
                  // 'manual' means nothing was written and the user still has work
                  // to do — badging it "Up to date" would hide that.
                  const isManual = s.reason === 'manual'
                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      padding: '4px var(--space-2)', borderRadius: 'var(--radius-sm)',
                      background: isManual ? 'var(--status-warning-bg)' : 'var(--bg-card)',
                      border: `1px solid ${isManual ? 'var(--status-warning-border)' : 'var(--border-subtle)'}`,
                      opacity: isManual ? 1 : 0.65,
                    }}>
                      {isManual
                        ? <Info size={10} color="var(--status-warning-text)" />
                        : <Check size={10} color="var(--text-tertiary)" />}
                      <span style={{ ...MONO, flex: 1, color: 'var(--text-secondary)' }}>
                        {s.path}
                      </span>
                      <span style={{
                        ...(isManual ? BADGE_WARNING : BADGE_SUCCESS), fontSize: 10,
                      }}>
                        {isManual ? 'Your turn' : 'Up to date'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* A WatermelonDB database we could not reference — repeat the
                  instruction here so it survives the transition off the preview. */}
              {result.skipped.some((s) => s.reason === 'manual') && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  {result.skipped.filter((s) => s.reason === 'manual').map((s) => (
                    <div key={s.id} style={{ marginBottom: 'var(--space-2)' }}>
                      <div style={{ ...HINT, marginBottom: 'var(--space-2)' }}>{s.detail}</div>
                      {(s.lines || []).map((line) => <CodeLine key={line}>{line}</CodeLine>)}
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                display: 'flex', gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-info-bg)',
                border: '1px solid var(--status-info-border)',
                marginBottom: 'var(--space-3)',
              }}>
                <Info size={12} color="var(--status-info-text)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ ...HINT, color: 'var(--text-secondary)' }}>
                  Reload your app (press <strong>R</strong> twice, or <strong>r</strong> in Expo)
                  and a device tab will appear here.
                </div>
              </div>

              <ProductionWarning onRemove />

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => onOpenFile?.(result.entryFile)}
                  style={{ ...BTN_SECONDARY, flex: 1, justifyContent: 'center', height: 30, fontSize: 'var(--text-xs)' }}
                >
                  <FileCode2 size={11} />
                  Open {result.entryFileRelative}
                </button>
                <button
                  onClick={() => runPlan(result.dir)}
                  style={{ ...BTN_SECONDARY, height: 30, fontSize: 'var(--text-xs)' }}
                >
                  <RotateCcw size={11} />
                  Re-check
                </button>
              </div>
            </div>
          )}

          {/* First-run empty state */}
          {phase === 'idle' && !dir && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'var(--space-2)', padding: 'var(--space-5) 0',
              textAlign: 'center',
            }}>
              <FolderSearch size={22} color="var(--text-tertiary)" />
              <div style={HINT}>
                Choose your React Native project to set up the connection automatically.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
        }}>
          <span style={{ ...MONO, color: 'var(--text-tertiary)' }}>
            ws://{host}:{port}
          </span>
          <button onClick={onClose} style={{ ...BTN_SECONDARY, height: 26, fontSize: 'var(--text-xs)' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
