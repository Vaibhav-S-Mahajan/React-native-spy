// src/renderer/components/ui/Toolbar.jsx
// The filter/action bar at the top of every panel. Fixes its height to the
// token scale (h-toolbar) — previously each panel used its own 38px literal.

import cn from './cn'

export function Toolbar({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'flex h-toolbar shrink-0 items-center gap-2 border-b border-subtle bg-panel-alt px-3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Vertical hairline between toolbar groups. */
export function ToolbarDivider({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-3.5 w-px shrink-0 bg-subtle', className)}
    />
  )
}

/** Pushes everything after it to the right edge. */
export function ToolbarSpacer() {
  return <div className="flex-1" />
}

export default Toolbar
