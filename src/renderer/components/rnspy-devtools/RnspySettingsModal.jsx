// src/renderer/components/rnspy-devtools/RnspySettingsModal.jsx

import { useState } from 'react'
import {
  AlertTriangle, Check, EyeOff, FolderOpen, Palette, Plug, Plus,
  RefreshCw, RotateCcw, Server, Smartphone, Trash2, X,
} from 'lucide-react'
import {
  BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER, BTN_GHOST,
  INPUT_BASE, SECTION_LABEL,
} from '../../styles/shared'
import Logo from './Logo'
import { useTheme } from '../../hooks/useTheme'

export default function RnspySettingsModal({
  clients = [], hiddenRules = [],
  port = 8097, onSetPort,
  projectRoot = '', onSetProjectRoot,
  onDisconnect, onReload, onAddRule, onRemoveRule,
  onReset, onClose,
}) {
  const [draft, setDraft] = useState('')
  const [related, setRelated] = useState(false)
  const [rootDraft, setRootDraft] = useState(projectRoot)
  const [portDraft, setPortDraft] = useState(String(port))
  const [confirmReset, setConfirmReset] = useState(false)
  const { theme, themes, setTheme, previewTheme, clearPreview } = useTheme()

  const commitPort = () => {
    const parsed = parseInt(portDraft, 10)
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 65536 && parsed !== port) {
      onSetPort?.(parsed)
    } else {
      setPortDraft(String(port))
    }
  }

  const addRule = () => {
    const match = draft.trim()
    if (!match) return
    onAddRule?.({ match, hideRelated: related })
    setDraft('')
    setRelated(false)
  }

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
          width: 480, maxHeight: '80vh',
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
            React Native Spy · Settings
          </span>
          <button onClick={onClose} style={{ ...BTN_GHOST, padding: 2, height: 20 }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-4)' }}>
          {/* Appearance — mirrors the header ThemeMenu for discoverability.
              Hovering a card previews it live; clicking commits. */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <Palette size={10} />
              APPEARANCE
              <span style={{
                fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)', textTransform: 'none',
                letterSpacing: 0, fontWeight: 'var(--font-weight-medium)',
              }}>
                hover to preview
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Theme"
              onMouseLeave={clearPreview}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 'var(--space-2)',
              }}
            >
              {themes.map((t) => {
                const selected = t.id === theme
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTheme(t.id)}
                    onMouseEnter={() => previewTheme(t.id)}
                    onFocus={() => previewTheme(t.id)}
                    onBlur={clearPreview}
                    title={t.blurb}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
                      padding: 'var(--space-2)',
                      border: `1px solid ${selected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: selected ? 'var(--accent-muted)' : 'var(--bg-card)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'border-color 120ms ease, background 120ms ease',
                    }}
                  >
                    {/* Swatch preview: surface + accent + secondary */}
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'flex', height: 26,
                        borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {t.swatch.map((c, i) => (
                        <span key={i} style={{ flex: i === 0 ? 2 : 1, background: c }} />
                      ))}
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      lineHeight: 'var(--line-height-tight)',
                    }}>
                      {/* Glyph, not colour alone, marks selection */}
                      <Check
                        size={11}
                        aria-hidden="true"
                        style={{ color: 'var(--accent-primary)', opacity: selected ? 1 : 0, flexShrink: 0 }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.label}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Server */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <Server size={10} />
              SERVER
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{
                fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
              }}>
                Port
              </span>
              <input
                value={portDraft}
                onChange={(e) => setPortDraft(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={commitPort}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                style={{ ...INPUT_BASE, width: 80, height: 28, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}
              />
              <span style={{
                fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}>
                ws://0.0.0.0:{port || portDraft}
              </span>
            </div>
          </div>

          {/* Connected Devices */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <Plug size={10} />
              CONNECTED DEVICES
              <span style={{
                fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
              }}>
                {clients.length}
              </span>
            </div>

            {!clients.length ? (
              <div style={{
                padding: 'var(--space-3) 0', fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
              }}>
                No devices connected
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {clients.map((c) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--status-success-text)', flexShrink: 0,
                    }} />
                    <Smartphone size={12} color="var(--text-tertiary)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
                        lineHeight: 'var(--line-height-tight)',
                      }}>
                        {c.name || c.id}
                      </div>
                      {c.platform && (
                        <div style={{
                          fontSize: 10, color: 'var(--text-tertiary)',
                          fontFamily: 'var(--font-mono)', lineHeight: 'var(--line-height-tight)',
                        }}>
                          {c.platform}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const key = c.deviceId || c.name || c.id || 'unknown'
                        onReload?.(key)
                      }}
                      style={{ ...BTN_GHOST, color: 'var(--status-info-text)', fontSize: 10 }}
                      title="Reload app on device"
                    >
                      <RefreshCw size={10} /> Reload
                    </button>
                    <button onClick={() => onDisconnect?.(c.id)} style={{
                      ...BTN_GHOST, color: 'var(--status-danger-text)', fontSize: 10,
                    }}>
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Root */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <FolderOpen size={10} />
              PROJECT ROOT
            </div>
            <div style={{
              fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)', marginBottom: 'var(--space-2)',
              lineHeight: 'var(--line-height-normal)',
            }}>
              Absolute path to your RN project. Relative stack trace paths resolve against this.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input
                value={rootDraft}
                onChange={(e) => setRootDraft(e.target.value)}
                onBlur={() => onSetProjectRoot?.(rootDraft)}
                onKeyDown={(e) => { if (e.key === 'Enter') { onSetProjectRoot?.(rootDraft); e.currentTarget.blur() } }}
                placeholder="/Users/you/projects/my-rn-app"
                style={{ ...INPUT_BASE, flex: 1, height: 28, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Hidden Requests */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <EyeOff size={10} />
              HIDDEN REQUEST RULES
              <span style={{
                fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
              }}>
                {hiddenRules.length}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}>
              <input
                value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addRule() }}
                placeholder="Name or URL fragment…"
                style={{ ...INPUT_BASE, flex: 1, height: 26, fontSize: 'var(--text-xs)' }}
              />
              <label style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <input type="checkbox" checked={related}
                  onChange={(e) => setRelated(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: 11, height: 11 }} />
                Related
              </label>
              <button onClick={addRule} style={{
                ...BTN_PRIMARY, height: 26, padding: '0 var(--space-2)', fontSize: 'var(--text-xs)',
              }}>
                <Plus size={10} /> Add
              </button>
            </div>
            {hiddenRules.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {hiddenRules.map((r) => (
                  <div key={r.match} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: '4px var(--space-2)', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)', lineHeight: 'var(--line-height-tight)',
                  }}>
                    <EyeOff size={9} color="var(--text-tertiary)" />
                    <span style={{ flex: 1 }}>{r.match}</span>
                    {r.hideRelated && (
                      <span style={{
                        fontSize: 9, padding: '1px 4px', borderRadius: 3,
                        background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}>
                        related
                      </span>
                    )}
                    <button onClick={() => onRemoveRule?.(r.match)} style={{
                      border: 'none', background: 'transparent', color: 'var(--text-tertiary)',
                      cursor: 'pointer', padding: 1, display: 'flex',
                    }}>
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Reset Everything ─── */}
          <div>
            <div style={{
              ...SECTION_LABEL, display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
            }}>
              <RotateCcw size={10} />
              DANGER ZONE
            </div>

            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                style={{
                  ...BTN_DANGER,
                  width: '100%', justifyContent: 'center',
                  height: 32, fontSize: 'var(--text-xs)',
                }}
              >
                <RotateCcw size={11} />
                Reset everything
              </button>
            ) : (
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
                  This will clear everything
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)', lineHeight: 'var(--line-height-normal)',
                  marginBottom: 'var(--space-3)',
                }}>
                  All captured data, hidden rules, project root, port settings, and connected devices will be reset to defaults. This cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setConfirmReset(false)}
                    style={{ ...BTN_SECONDARY, height: 26, fontSize: 'var(--text-xs)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onReset?.()}
                    style={{
                      ...BTN_DANGER, height: 26, fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    <RotateCcw size={10} />
                    Reset now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
        }}>
          <span style={{
            fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
          }}>
            {clients.length} online · {hiddenRules.length} rules
          </span>
          <button onClick={onClose} style={{ ...BTN_SECONDARY, height: 26, fontSize: 'var(--text-xs)' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
