// src/renderer/components/layout/PanelTabs.jsx
// Panel switcher. Proper ARIA tablist semantics: roving tabindex so the group is
// one Tab stop, arrow keys move between tabs, and aria-selected marks the
// active one. Previously these were plain buttons with no relationship declared.
//
// The Cmd/Ctrl+1..N shortcuts live in the page, not here — they are global.

import { useRef } from 'react'
import cn from '../ui/cn'

export default function PanelTabs({ tabs, active, counts = {}, onSelect }) {
  const listRef = useRef(null)

  // Left/Right (and Home/End) move focus AND selection, which is the expected
  // behaviour for an automatic-activation tablist.
  const onKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.key === active)
    if (idx < 0) return
    let next = null
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next == null) return
    e.preventDefault()
    onSelect(tabs[next].key)
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Inspector panels"
      onKeyDown={onKeyDown}
      className="flex h-tab shrink-0 items-stretch border-b border-subtle bg-panel-alt"
    >
      {tabs.map((t) => {
        const isActive = active === t.key
        const count = counts[t.key]
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(t.key)}
            className={cn(
              'flex shrink-0 items-center gap-1 border-b-2 px-4 font-ui text-sm',
              'transition-colors duration-150 focus-ring',
              isActive
                ? 'border-accent font-semibold text-fg'
                : 'border-transparent font-medium text-faint hover:text-muted',
            )}
          >
            {t.label}
            {count > 0 && (
              <span
                className={cn(
                  'ml-0.5 font-mono text-2xs font-medium tabular-nums',
                  isActive ? 'text-accent' : 'text-faint',
                )}
              >
                {count > 999 ? '1k+' : count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
