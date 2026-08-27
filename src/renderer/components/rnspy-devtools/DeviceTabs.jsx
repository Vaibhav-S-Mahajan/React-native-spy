import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { BTN_DANGER, BTN_SECONDARY } from '../../styles/shared'

export default function DeviceTabs({ devices, activeKey, onSelect, onClose }) {
  const [pendingClose, setPendingClose] = useState(null)
  if (!devices.length) return null

  const pendingDevice = devices.find((d) => d.key === pendingClose)
  const pendingLabel = pendingDevice?.name || pendingDevice?.key || 'this device'

  const confirmClose = () => {
    if (pendingClose != null) onClose(pendingClose)
    setPendingClose(null)
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'stretch', flexShrink: 0,
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-sidebar)',
        overflowX: 'auto', overflowY: 'hidden',
        height: 38,
      }}>
        {devices.map((d) => {
          const active = d.key === activeKey
          const label = d.name || d.key
          return (
            <div
              key={d.key}
              onClick={() => onSelect(d.key)}
              title={d.platform ? `${label} · ${d.platform}` : label}
              className="device-tab-row"
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: '0 var(--space-2) 0 var(--space-3)',
                height: '100%', cursor: 'pointer',
                borderRight: '1px solid var(--border-subtle)',
                background: active ? 'var(--bg-panel)' : 'transparent',
                borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                flexShrink: 0, maxWidth: 280, minWidth: 120,
                transition: 'background-color 120ms ease',
              }}
            >
              {/* Online indicator */}
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: d.online ? 'var(--status-success-text)' : 'var(--text-tertiary)',
                boxShadow: d.online ? '0 0 4px var(--status-success-text)' : 'none',
                transition: 'background-color 300ms ease, box-shadow 300ms ease',
              }} />

              {/* Device name */}
              <span style={{
                fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                fontFamily: 'var(--font-ui)',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                lineHeight: 'var(--line-height-tight)',
                flex: 1, minWidth: 0,
              }}>
                {label}
              </span>

              {/* Request count badge */}
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                background: 'var(--bg-card)',
                padding: '1px 5px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                lineHeight: 'var(--line-height-tight)',
                flexShrink: 0,
              }}>
                {d.networkRequests.length}
              </span>

              {/* Close */}
              <button
                onClick={(e) => { e.stopPropagation(); setPendingClose(d.key) }}
                title="Close"
                className="device-tab-btn"
                style={{
                  border: '1px solid transparent', background: 'transparent',
                  color: 'var(--text-tertiary)', cursor: 'pointer',
                  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  opacity: 0, transition: 'opacity 100ms, border-color 100ms, background 100ms',
                }}
              >
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {pendingClose != null && (
        <div
          onClick={() => setPendingClose(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--overlay-soft)', backdropFilter: 'blur(2px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360, maxWidth: '90vw',
              background: 'var(--bg-panel)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)',
              }}>
                <AlertTriangle size={16} />
              </span>
              <div style={{
                fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
              }}>
                Close {pendingLabel}?
              </div>
            </div>

            <div style={{
              fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: 'var(--line-height-normal)',
            }}>
              All captured data for this device — network requests, WebSocket frames, console logs and server logs — will be lost. This cannot be undone.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
              <button onClick={() => setPendingClose(null)} style={{ ...BTN_SECONDARY, height: 30 }}>
                Cancel
              </button>
              <button onClick={confirmClose} style={{ ...BTN_DANGER, height: 30 }}>
                Close device
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
