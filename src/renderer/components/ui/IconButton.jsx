// src/renderer/components/ui/IconButton.jsx
// Square icon-only button. `label` is required and becomes both the accessible
// name and the tooltip — an icon-only control with no label is unusable with a
// screen reader, so it is not optional here.

import { forwardRef } from 'react'
import cn from './cn'

const BASE =
  'inline-flex items-center justify-center shrink-0 rounded-md border ' +
  'transition-colors duration-150 focus-ring ' +
  'disabled:pointer-events-none disabled:opacity-40'

const VARIANTS = {
  ghost: 'border-transparent bg-transparent text-faint hover:bg-card hover:text-fg',
  secondary: 'border-default bg-transparent text-muted hover:bg-card hover:text-fg',
  // Tinted variants: the icon carries the colour, the wash appears on hover so
  // a row of them doesn't read as a traffic light at rest.
  danger: 'border-transparent bg-transparent text-danger-fg hover:bg-danger',
  info: 'border-transparent bg-transparent text-info-fg hover:bg-info',
  success: 'border-transparent bg-transparent text-success-fg hover:bg-success',
}

const SIZES = {
  sm: 'h-control-sm w-control-sm',
  md: 'h-control-md w-control-md',
  lg: 'h-control-lg w-control-lg',
}

const IconButton = forwardRef(function IconButton(
  {
    label,
    variant = 'ghost',
    size = 'md',
    active = false,
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
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        BASE,
        VARIANTS[variant] || VARIANTS.ghost,
        SIZES[size] || SIZES.md,
        active && 'bg-card text-fg',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

export default IconButton
