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

import cn from '../ui/cn'

const IssuesButton = forwardRef(function IssuesButton(
  { errorCount = 0, warnCount = 0, total = 0, onClick },
  ref,
) {
  const hasErrors = errorCount > 0
  const hasWarnings = warnCount > 0
  const clean = !hasErrors && !hasWarnings

  const tone = hasErrors
    ? 'border-danger-edge bg-danger text-danger-fg'
    : hasWarnings
      ? 'border-warn-edge bg-warn text-warn-fg'
      : 'border-transparent bg-transparent text-faint hover:bg-card hover:text-muted'

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
      type="button"
      onClick={onClick}
      title={label}
      aria-label={`${label}. Open issues.`}
      aria-haspopup="dialog"
      className={cn(
        'inline-flex h-control-sm shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2',
        'font-ui text-2xs font-medium leading-tight transition-colors duration-150 focus-ring',
        tone,
      )}
    >
      {clean
        ? <ShieldCheck size={12} aria-hidden="true" />
        : <AlertTriangle size={12} aria-hidden="true" />}
      {/* min-w reserves space so the toolbar doesn't shift as counts change. */}
      <span className="min-w-[2ch] text-left font-mono tabular-nums">
        {clean ? '0' : occurrences > 999 ? '999+' : occurrences}
      </span>
    </button>
  )
})

export default IssuesButton
