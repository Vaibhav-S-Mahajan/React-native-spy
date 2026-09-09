// src/renderer/components/layout/AppShell.jsx
// The window frame: a fixed-height column of chrome rows with exactly one
// flexible content region at the bottom.
//
// Scroll ownership is the point of this component. `overflow-hidden` here plus
// `min-h-0` on the content region means the panel below owns the only scrollbar
// — without both, a long list stretches the shell and you get nested
// scrollbars (the single most common layout bug in this kind of app).

import cn from '../ui/cn'

export default function AppShell({ chrome, children, className }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden bg-app',
        className,
      )}
    >
      {chrome}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
