// src/renderer/components/ui/Button.jsx
// The one button in the app. Replaces the BTN_PRIMARY / BTN_SECONDARY /
// BTN_GHOST / BTN_DANGER style objects in styles/shared.js, which had drifted
// out of sync with the .btn classes in ui.css (two competing systems).
//
// Sizes come from the token scale (--control-sm/md/lg) so no component invents
// its own height again.

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import cn from './cn'

const BASE =
  'inline-flex items-center justify-center gap-1 shrink-0 whitespace-nowrap ' +
  'rounded-md border font-ui font-medium leading-tight ' +
  'transition-colors duration-150 focus-ring ' +
  'disabled:pointer-events-none disabled:opacity-40'

const VARIANTS = {
  primary:
    'border-transparent bg-accent text-accent-fg hover:bg-accent-hover',
  secondary:
    'border-default bg-transparent text-muted hover:bg-card hover:text-fg',
  ghost:
    'border-transparent bg-transparent text-faint hover:bg-card hover:text-fg',
  danger:
    'border-danger-edge bg-danger text-danger-fg hover:bg-danger/80',
}

const SIZES = {
  // text-2xs on sm keeps dense toolbars readable without shouting.
  sm: 'h-control-sm px-2 text-2xs',
  md: 'h-control-md px-3 text-xs',
  lg: 'h-control-lg px-4 text-sm',
}

const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    disabled = false,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANTS[variant] || VARIANTS.secondary, SIZES[size] || SIZES.md, className)}
      {...rest}
    >
      {loading && <Loader2 size={12} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})

export default Button
