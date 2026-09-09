// src/renderer/components/ui/Drawer.jsx
// Right-side detail panel. Unlike Modal this is INLINE, not a portal: it sits in
// the layout as a sibling of the list it details, so the list stays visible and
// scrollable beside it (the inspector pattern from VS Code / Postman).
//
// No scrim and no focus trap for that reason — trapping focus in a panel the
// user can see past would be wrong. Escape still closes.

import { useEffect } from 'react'
import { X } from 'lucide-react'
import IconButton from './IconButton'
import cn from './cn'

const WIDTHS = {
  md: 'w-[380px]',
  lg: 'w-[420px]',
}

export default function Drawer({
  title,
  description,
  onClose,
  size = 'md',
  className,
  children,
}) {
  // Escape closes. Registered on document so it works wherever focus sits.
  useEffect(() => {
    if (!onClose) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <aside
      aria-label={typeof title === 'string' ? title : 'Details'}
      className={cn(
        'flex min-h-0 shrink-0 flex-col border-l border-default bg-panel',
        WIDTHS[size] || WIDTHS.md,
        className,
      )}
    >
      {(title || onClose) && (
        <div className="flex h-toolbar shrink-0 items-center gap-2 border-b border-subtle bg-panel-alt px-3">
          <div className="min-w-0 flex-1">
            {title && (
              <div className="truncate font-ui text-xs font-semibold text-fg leading-tight">
                {title}
              </div>
            )}
            {description && (
              <div className="truncate font-ui text-2xs text-faint leading-tight">
                {description}
              </div>
            )}
          </div>
          {onClose && (
            <IconButton label="Close panel" size="sm" onClick={onClose}>
              <X size={14} />
            </IconButton>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </aside>
  )
}
