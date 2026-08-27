// src/renderer/components/rnspy-devtools/StorageTab.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Database, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

import {
  BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY, EMPTY_STATE, INPUT_BASE, SECTION_LABEL,
} from '../../styles/shared'
import LevelChip from './LevelChip'

const KEY_COL = 260

// Detect whether a string value is JSON (object/array) so the editor can
// pretty-print and validate it. Primitives fall through to raw text.
function tryParseJson(str) {
  if (typeof str !== 'string') return { ok: false }
  const t = str.trim()
  if (!t || (t[0] !== '{' && t[0] !== '[')) return { ok: false }
  try { return { ok: true, value: JSON.parse(t) } } catch { return { ok: false } }
}

function prettyValue(value) {
  if (value == null) return ''
  if (typeof value === 'object') {
    try { return JSON.stringify(value, null, 2) } catch { return String(value) }
  }
  const parsed = tryParseJson(String(value))
  if (parsed.ok) {
    try { return JSON.stringify(parsed.value, null, 2) } catch { /* fall through */ }
  }
  return String(value)
}

function onelinePreview(value) {
  if (value == null) return 'null'
  if (typeof value === 'object') {
    try { return JSON.stringify(value) } catch { return String(value) }
  }
  const parsed = tryParseJson(String(value))
  if (parsed.ok) {
    try { return JSON.stringify(parsed.value) } catch { /* fall through */ }
  }
  return String(value)
}

function typeBadgeColor(type) {
  if (type === 'number') return 'var(--status-info-text)'
  if (type === 'boolean') return 'var(--accent-purple)'
  return 'var(--text-tertiary)'
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false })
}

export default function StorageTab({
  storage, online, onRefresh, onSetValue, onRemoveKey, onOpenInstance, autoRefresh, onToggleAutoRefresh,
}) {
  const backends = useMemo(
    () => (storage && Array.isArray(storage.backends) ? storage.backends : []),
    [storage],
  )
  const diag = storage?.diag || null
  const [activeBackend, setActiveBackend] = useState(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // { storageKey, value, type, isNew }
  const [instanceId, setInstanceId] = useState('')
  const requestedRef = useRef(false)

  // Ask the device for a snapshot the first time the tab is shown with a
  // connected device and no data yet.
  useEffect(() => {
    if (online && !requestedRef.current && backends.length === 0) {
      requestedRef.current = true
      onRefresh?.()
    }
  }, [online, backends.length, onRefresh])

  // Pick a sensible default backend once data arrives / when it changes.
  const backendKeys = backends.map((b) => `${b.backend}:${b.instanceId}`)
  const backendKeySig = backendKeys.join('|')
  useEffect(() => {
    if (!backendKeys.length) { setActiveBackend(null); return }
    if (!activeBackend || !backendKeys.includes(activeBackend)) {
      setActiveBackend(backendKeys[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendKeySig])

  const current = useMemo(
    () => backends.find((b) => `${b.backend}:${b.instanceId}` === activeBackend) || null,
    [backends, activeBackend],
  )

  const entries = useMemo(() => {
    const all = (current?.entries || []).slice()
    all.sort((a, b) => String(a.key).localeCompare(String(b.key)))
    const q = search.trim().toLowerCase()
    if (!q) return all
    return all.filter((e) =>
      String(e.key).toLowerCase().includes(q) ||
      onelinePreview(e.value).toLowerCase().includes(q))
  }, [current, search])

  const startEdit = useCallback((entry) => {
    setEditing({
      storageKey: entry.key,
      value: prettyValue(entry.value),
      type: entry.type || 'string',
      isNew: false,
    })
  }, [])

  const startAdd = useCallback(() => {
    setEditing({ storageKey: '', value: '', type: 'string', isNew: true })
  }, [])

  const cancelEdit = useCallback(() => setEditing(null), [])

  const canEdit = online && !!current

  const saveEdit = useCallback(() => {
    if (!current || !editing) return
    const storageKey = editing.storageKey.trim()
    if (!storageKey) { toast.error('Key is required'); return }

    let value = editing.value
    let type = editing.type

    if (current.backend === 'mmkv') {
      // Coerce to the selected primitive type; validate numbers/booleans.
      if (type === 'number' && value.trim() !== '' && Number.isNaN(Number(value))) {
        toast.error('Value is not a valid number'); return
      }
    } else {
      // AsyncStorage stores strings. If it looks like JSON, validate it so we
      // don't write malformed JSON the app can't parse back.
      const looksJson = value.trim() && (value.trim()[0] === '{' || value.trim()[0] === '[')
      if (looksJson) {
        try { JSON.parse(value) } catch { toast.error('Invalid JSON'); return }
      }
      type = 'string'
    }

    onSetValue?.({
      backend: current.backend,
      instanceId: current.instanceId,
      storageKey,
      value,
      type,
    })
    toast.success(editing.isNew ? `Added "${storageKey}"` : `Updated "${storageKey}"`)
    setEditing(null)
  }, [current, editing, onSetValue])

  const removeEntry = useCallback((entry) => {
    if (!current) return
    onRemoveKey?.({
      backend: current.backend,
      instanceId: current.instanceId,
      storageKey: entry.key,
    })
    toast.success(`Removed "${entry.key}"`)
  }, [current, onRemoveKey])

  if (!online && backends.length === 0) {
    return (
      <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
        <Database size={20} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
          Device offline
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Storage can only be read while the app is connected.
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)' }}>
      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '0 var(--space-3)', height: 38, flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-panel-alt)',
      }}>
        {/* Backend / instance selector */}
        {backends.map((b) => {
          const key = `${b.backend}:${b.instanceId}`
          const active = key === activeBackend
          return (
            <LevelChip
              key={key}
              active={active}
              color="var(--accent-primary)"
              label={b.label}
              badge={
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', opacity: 0.75 }}>
                  {b.entries?.length || 0}
                </span>
              }
              onClick={() => setActiveBackend(key)}
              title={b.label}
            />
          )
        })}

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', width: 200 }}>
          <Search size={12} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter keys/values"
            style={{ ...INPUT_BASE, width: '100%', paddingLeft: 26, fontSize: 'var(--text-xs)' }}
          />
        </div>

        {/* Auto-refresh toggle */}
        <LevelChip
          active={autoRefresh}
          color="var(--status-success-text)"
          icon={<RefreshCw size={11} />}
          label="Auto"
          onClick={onToggleAutoRefresh}
          title={autoRefresh ? 'Auto-refresh on (every 2s)' : 'Auto-refresh off'}
        />

        {/* Manual refresh */}
        <button
          onClick={onRefresh}
          disabled={!online}
          title="Refresh now"
          style={{ ...BTN_GHOST, opacity: online ? 1 : 0.4, cursor: online ? 'pointer' : 'default' }}
        >
          <RefreshCw size={12} />
        </button>

        {/* Add key */}
        <button
          onClick={startAdd}
          disabled={!canEdit}
          title="Add key"
          style={{ ...BTN_SECONDARY, height: 26, opacity: canEdit ? 1 : 0.4, cursor: canEdit ? 'pointer' : 'default' }}
        >
          <Plus size={12} />
          <span>Add</span>
        </button>
      </div>

      {/* ─── Meta line ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: '4px var(--space-3)', flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)',
        ...SECTION_LABEL, fontSize: 10,
      }}>
        <span>{current ? current.label : 'No storage'}</span>
        <span style={{ opacity: 0.6 }}>· {entries.length} key{entries.length === 1 ? '' : 's'}</span>
        {storage?.updatedAt && (
          <span style={{ opacity: 0.6 }}>· updated {formatTime(storage.updatedAt)}</span>
        )}
        {storage?.error && (
          <span style={{ color: 'var(--status-danger-text)' }}>· {storage.error}</span>
        )}
      </div>

      {/* ─── Diagnostics banner ─── */}
      {diag && (diag.mmkvResolved === false || (diag.notes && diag.notes.length > 0)) && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '6px var(--space-3)', flexShrink: 0,
          borderBottom: '1px solid var(--status-warning-border)',
          background: 'var(--status-warning-bg)',
          fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
          color: 'var(--status-warning-text)',
        }}>
          {diag.mmkvResolved === false && (
            diag.mmkvError ? (
              <span>MMKV not usable: <code>{diag.mmkvError}</code></span>
            ) : (
              <span>MMKV module not found — <code>react-native-mmkv</code> could not be required in the app.</span>
            )
          )}
          {(diag.notes || []).map((n, i) => (
            <span key={i} style={{ opacity: 0.9 }}>• {n}</span>
          ))}
        </div>
      )}

      {/* ─── Open named MMKV instance ─── */}
      {onOpenInstance && diag?.mmkvResolved !== false && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: '5px var(--space-3)', flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-panel-alt)',
        }}>
          <span style={{ ...SECTION_LABEL, fontSize: 10 }}>MMKV instance id</span>
          <input
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && instanceId.trim() && online) {
                onOpenInstance(instanceId.trim()); setInstanceId('')
              }
            }}
            placeholder="e.g. user-storage"
            disabled={!online}
            style={{ ...INPUT_BASE, width: 220, height: 24, fontSize: 'var(--text-xs)' }}
          />
          <button
            onClick={() => { if (instanceId.trim()) { onOpenInstance(instanceId.trim()); setInstanceId('') } }}
            disabled={!online || !instanceId.trim()}
            title="Open a named MMKV instance created with new MMKV({ id })"
            style={{
              ...BTN_SECONDARY, height: 24,
              opacity: online && instanceId.trim() ? 1 : 0.4,
              cursor: online && instanceId.trim() ? 'pointer' : 'default',
            }}
          >
            Open
          </button>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Data in a named store? Enter its id to inspect it.
          </span>
        </div>
      )}

      {/* ─── Table ─── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {entries.length === 0 ? (
          <div style={{ ...EMPTY_STATE, background: 'var(--bg-panel)' }}>
            <Database size={20} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {current ? 'No keys in this store' : 'No storage backends detected'}
            </div>
            {!current && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', maxWidth: 380, textAlign: 'center' }}>
                Install @react-native-async-storage/async-storage or react-native-mmkv in
                the target app, then reload.
              </div>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.key}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onDoubleClick={() => canEdit && startEdit(entry)}
                >
                  <td style={{
                    width: KEY_COL, padding: '6px var(--space-3)', verticalAlign: 'top',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    color: 'var(--text-primary)', wordBreak: 'break-all',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 8, fontWeight: 'var(--font-weight-semibold)',
                        color: typeBadgeColor(entry.type), textTransform: 'uppercase',
                        flexShrink: 0,
                      }}>
                        {(entry.type || 'string').slice(0, 3)}
                      </span>
                      <span>{entry.key}</span>
                    </div>
                  </td>
                  <td style={{
                    padding: '6px var(--space-3)', verticalAlign: 'top',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)', wordBreak: 'break-all',
                    cursor: canEdit ? 'text' : 'default',
                  }}
                    onClick={() => canEdit && startEdit(entry)}
                    title={canEdit ? 'Click to edit' : ''}
                  >
                    {onelinePreview(entry.value)}
                  </td>
                  <td style={{ width: 34, padding: '4px', verticalAlign: 'top', textAlign: 'right' }}>
                    <button
                      onClick={() => removeEntry(entry)}
                      disabled={!canEdit}
                      title="Delete key"
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, border: 'none', borderRadius: 'var(--radius-sm)',
                        background: 'transparent', color: 'var(--status-danger-text)',
                        cursor: canEdit ? 'pointer' : 'default', opacity: canEdit ? 0.7 : 0.25,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── Editor modal ─── */}
      {editing && (
        <EditorModal
          editing={editing}
          setEditing={setEditing}
          backend={current?.backend}
          onCancel={cancelEdit}
          onSave={saveEdit}
        />
      )}
    </div>
  )
}

function EditorModal({ editing, setEditing, backend, onCancel, onSave }) {
  const isMmkv = backend === 'mmkv'
  const jsonParsed = tryParseJson(editing.value)
  const jsonInvalid = !isMmkv && editing.value.trim() &&
    (editing.value.trim()[0] === '{' || editing.value.trim()[0] === '[') && !jsonParsed.ok

  const formatJson = () => {
    if (!jsonParsed.ok) return
    setEditing((e) => ({ ...e, value: JSON.stringify(jsonParsed.value, null, 2) }))
  }

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'absolute', inset: 0, background: 'var(--overlay-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(680px, 90%)', maxHeight: '80%', display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <Database size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
            {editing.isNew ? 'Add key' : 'Edit value'}
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={onCancel} style={{ ...BTN_GHOST, padding: 4 }} title="Close">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-4)', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Key */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ ...SECTION_LABEL, fontSize: 10 }}>Key</label>
            <input
              value={editing.storageKey}
              onChange={(e) => setEditing((s) => ({ ...s, storageKey: e.target.value }))}
              disabled={!editing.isNew}
              placeholder="storage.key"
              autoFocus={editing.isNew}
              style={{ ...INPUT_BASE, width: '100%', opacity: editing.isNew ? 1 : 0.6 }}
            />
          </div>

          {/* MMKV type selector */}
          {isMmkv && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ ...SECTION_LABEL, fontSize: 10 }}>Type</label>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                {['string', 'number', 'boolean'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setEditing((s) => ({ ...s, type: t }))}
                    style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-sm)',
                      border: editing.type === t ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: editing.type === t ? 'var(--status-success-bg)' : 'transparent',
                      color: editing.type === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Value */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label style={{ ...SECTION_LABEL, fontSize: 10 }}>Value</label>
              <div style={{ flex: 1 }} />
              {jsonParsed.ok && (
                <button onClick={formatJson} style={{ ...BTN_GHOST }} title="Pretty-print JSON">
                  Format JSON
                </button>
              )}
              {jsonInvalid && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger-text)' }}>
                  Invalid JSON
                </span>
              )}
            </div>
            {isMmkv && editing.type === 'boolean' ? (
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                {['true', 'false'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setEditing((s) => ({ ...s, value: v }))}
                    style={{
                      padding: '6px 16px', borderRadius: 'var(--radius-sm)',
                      border: editing.value === v ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: editing.value === v ? 'var(--status-success-bg)' : 'transparent',
                      color: editing.value === v ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={editing.value}
                onChange={(e) => setEditing((s) => ({ ...s, value: e.target.value }))}
                spellCheck={false}
                rows={10}
                style={{
                  width: '100%', resize: 'vertical', minHeight: 120,
                  padding: 'var(--space-2)', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${jsonInvalid ? 'var(--status-danger-border)' : 'var(--border-default)'}`,
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)',
                  lineHeight: 'var(--line-height-normal)', outline: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--border-subtle)',
        }}>
          <button onClick={onCancel} style={{ ...BTN_SECONDARY }}>Cancel</button>
          <button onClick={onSave} disabled={jsonInvalid} style={{ ...BTN_PRIMARY, opacity: jsonInvalid ? 0.5 : 1 }}>
            {editing.isNew ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
