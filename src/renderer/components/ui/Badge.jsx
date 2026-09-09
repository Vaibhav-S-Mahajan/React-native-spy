// src/renderer/components/ui/Badge.jsx
// Compact status/priority indicator. Replaces the BADGE_* style objects in
// styles/shared.js. Two shapes:
//
//   Badge — squared (rounded-sm), for inline labels and counts
//   Pill  — fully rounded, reserved for status/severity per the design rules
//
// `tone` maps onto the semantic status tokens, so every theme themes them.

import cn from './cn'

const BASE =
  'inline-flex items-center gap-1 shrink-0 whitespace-nowrap border ' +
  'font-ui font-medium leading-tight'

const TONES = {
  neutral: 'border-subtle bg-card text-muted',
  success: 'border-success-edge bg-success text-success-fg',
  warn: 'border-warn-edge bg-warn text-warn-fg',
  danger: 'border-danger-edge bg-danger text-danger-fg',
  info: 'border-info-edge bg-info text-info-fg',
  accent: 'border-transparent bg-accent-muted text-accent',
}

const SIZES = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2 py-0.5 text-xs',
}

export function Badge({ tone = 'neutral', size = 'sm', className, children, ...rest }) {
  return (
    <span
      className={cn(BASE, 'rounded-sm', TONES[tone] || TONES.neutral, SIZES[size] || SIZES.sm, className)}
      {...rest}
    >
      {children}
    </span>
  )
}

export function Pill({ tone = 'neutral', size = 'sm', dot = false, className, children, ...rest }) {
  return (
    <span
      className={cn(BASE, 'rounded-full', TONES[tone] || TONES.neutral, SIZES[size] || SIZES.sm, className)}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  )
}

/** Uppercase section label — the `SECTION_LABEL` object from shared.js. */
export function SectionLabel({ className, children, ...rest }) {
  return (
    <span
      className={cn(
        'font-ui text-2xs font-medium uppercase tracking-caps text-faint leading-tight',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge
