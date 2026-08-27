// src/renderer/components/rnspy-devtools/IssuesButton.jsx
//
// Toolbar affordance for the issues modal.
//
// Always visible — unlike UpdateButton, which hides when there's nothing to do.
// A health indicator that disappears when healthy is worse than useless: you
// can't tell "no problems" from "the check isn't running". So it shows a calm
// shield at zero and a counted badge when something is wrong.

import { forwardRef } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

import { BTN_GHOST } from '../../styles/shared'

const IssuesButton = forwardRef(function IssuesButton(
  { errorCount = 0, warnCount = 0, total = 0, onClick },
  ref,
) {
  const hasErrors = errorCount > 0
  const hasWarnings = warnCount > 0
  const clean = !hasErrors && !hasWarnings

  const tone = hasErrors
    ? { fg: 'var(--status-danger-text)', bg: 'var(--status-danger-bg)', bd: 'var(--status-danger-border)' }
    : hasWarnings
      ? { fg: 'var(--status-warning-text)', bg: 'var(--status-warning-bg)', bd: 'var(--status-warning-border)' }
      : { fg: 'var(--text-tertiary)', bg: 'transparent', bd: 'transparent' }

  // Count occurrences for the badge, but describe distinct problems in the
  // label — 200 repeats of one broken endpoint is one thing to fix.
  const occurrences = errorCount + warnCount
  const label = clean
    ? 'No issues detected'
    : `${errorCount} error${errorCount === 1 ? '' : 's'}, ` +
      `${warnCount} warning${warnCount === 1 ? '' : 's'} ` +
      `across ${total} distinct issue${total === 1 ? '' : 's'}`

  return (
    <button
      ref={ref}
      onClick={onClick}
      title={label}
      aria-label={`${label}. Open issues.`}
      aria-haspopup="dialog"
      style={{
        ...BTN_GHOST,
        gap: 'var(--space-1)',
        color: tone.fg,
        background: tone.bg,
        border: `1px solid ${tone.bd}`,
      }}
    >
      {clean
        ? <ShieldCheck size={12} aria-hidden="true" />
        : <AlertTriangle size={12} aria-hidden="true" />}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontVariantNumeric: 'tabular-nums',
        // Reserved width so the toolbar doesn't shift as counts change.
        minWidth: '2ch', textAlign: 'left',
      }}>
        {clean ? '0' : occurrences > 999 ? '999+' : occurrences}
      </span>
    </button>
  )
})

export default IssuesButton
