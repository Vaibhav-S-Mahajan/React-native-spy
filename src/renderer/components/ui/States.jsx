// src/renderer/components/ui/States.jsx
// Empty / loading / error states. Every panel hand-rolled its own before this,
// so the copy, spacing and icon sizes all differed. One implementation, three
// exports, so a new panel gets the right thing for free.

import { AlertTriangle, RotateCw } from 'lucide-react'
import Button from './Button'
import cn from './cn'

const SHELL =
  'flex flex-1 min-h-0 flex-col items-center justify-center gap-2 px-6 py-8 text-center'

/**
 * Empty state. `icon` is a lucide component (not an element) so sizing stays
 * consistent here rather than at each call site.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn(SHELL, className)}>
      {Icon && <Icon size={20} className="text-faint opacity-30" aria-hidden="true" />}
      {title && (
        <div className="font-ui text-sm font-medium text-muted leading-tight">{title}</div>
      )}
      {description && (
        <div className="max-w-md font-ui text-xs text-faint leading-normal">{description}</div>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

/**
 * Skeleton rows. Matches the real row height so the list does not jump when
 * data lands. Deliberately not a centred spinner: a spinner hides the layout,
 * skeletons show it arriving.
 */
export function LoadingState({ rows = 8, className }) {
  return (
    <div className={cn('flex flex-1 min-h-0 flex-col', className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex h-row items-center gap-3 border-b border-subtle px-3"
          aria-hidden="true"
        >
          <div className="h-2 w-10 shrink-0 animate-pulse rounded-sm bg-card" />
          <div
            className="h-2 animate-pulse rounded-sm bg-card"
            /* Varying widths read as content rather than a progress bar.
               Arbitrary values are justified: this is decorative geometry, not
               a spacing decision. */
            style={{ width: `${38 + ((i * 17) % 44)}%` }}
          />
        </div>
      ))}
    </div>
  )
}

/** Error state. Always actionable — `onRetry` renders a retry button. */
export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Retry',
  className,
}) {
  return (
    <div className={cn(SHELL, className)} role="alert">
      <AlertTriangle size={20} className="text-danger-fg" aria-hidden="true" />
      <div className="font-ui text-sm font-medium text-fg leading-tight">{title}</div>
      {description && (
        <div className="max-w-md font-ui text-xs text-faint leading-normal">{description}</div>
      )}
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry} className="mt-1">
          <RotateCw size={12} aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
