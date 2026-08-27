// src/renderer/components/rnspy-devtools/ToolbarActions.jsx
// Icon-only Clear + Reload buttons used in every panel toolbar.

import { RefreshCw, Trash2 } from 'lucide-react'

const ICON_BTN = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  padding: 0,
  border: 'none',
  borderRadius: 'var(--radius-md)',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 120ms ease',
}

export default function ToolbarActions({ onClear, onReload, canReload }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
      <button
        onClick={onClear}
        title="Clear"
        style={{ ...ICON_BTN, color: 'var(--status-danger-text)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--status-danger-bg)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Trash2 size={15} />
      </button>
      <button
        onClick={onReload}
        disabled={!canReload}
        title="Reload app"
        style={{
          ...ICON_BTN,
          color: 'var(--status-info-text)',
          opacity: canReload ? 1 : 0.4,
          cursor: canReload ? 'pointer' : 'default',
        }}
        onMouseEnter={(e) => { if (canReload) e.currentTarget.style.background = 'var(--status-info-bg)' }}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <RefreshCw size={15} />
      </button>
    </div>
  )
}
