// src/renderer/components/rnspy-devtools/ToolbarActions.jsx
// Icon-only Clear + Reload buttons used in every panel toolbar.
//
// These were 30px squares from a local ICON_BTN object — the only 30px controls
// in the app. Now h-control-md (28px) via IconButton, matching every other
// control, which is one of the height inconsistencies the redesign set out to fix.

import { RefreshCw, Trash2 } from 'lucide-react'
import { IconButton } from '../ui'

export default function ToolbarActions({ onClear, onReload, canReload }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <IconButton label="Clear" variant="danger" onClick={onClear}>
        <Trash2 size={14} aria-hidden="true" />
      </IconButton>
      <IconButton
        label="Reload app"
        variant="info"
        onClick={onReload}
        disabled={!canReload}
      >
        <RefreshCw size={14} aria-hidden="true" />
      </IconButton>
    </div>
  )
}
