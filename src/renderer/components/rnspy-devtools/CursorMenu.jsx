// src/renderer/components/rnspy-devtools/CursorMenu.jsx

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import cn from '../ui/cn'

export default function CursorMenu({ anchor, onClose, children, width }) {
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    if (!anchor) return
    const el = menuRef.current
    const w = el?.offsetWidth || 240
    const h = el?.offsetHeight || 300
    const pad = 6
    let left = anchor.x
    let top = anchor.y
    if (left + w + pad > window.innerWidth) left = Math.max(pad, window.innerWidth - w - pad)
    if (top + h + pad > window.innerHeight) top = Math.max(pad, window.innerHeight - h - pad)
    setPos({ top, left })
  }, [anchor])

  useEffect(() => {
    if (!anchor) return undefined

    // Delay listener registration by one frame so the originating
    // contextmenu / mousedown event doesn't immediately close the menu.
    let active = false
    const frame = requestAnimationFrame(() => { active = true })

    const onDown = (e) => {
      if (!active) return
      if (!menuRef.current?.contains(e.target)) onClose()
    }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    const onContext = (e) => {
      if (!active) return
      if (!menuRef.current?.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', onDown, true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onClose)
    window.addEventListener('scroll', onClose, true)
    document.addEventListener('contextmenu', onContext, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousedown', onDown, true)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onClose)
      window.removeEventListener('scroll', onClose, true)
      document.removeEventListener('contextmenu', onContext, true)
    }
  }, [anchor, onClose])

  if (!anchor) return null

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      className="animate-fade-in fixed z-[1300] max-h-[calc(100vh-24px)] overflow-y-auto rounded-lg border border-default bg-card p-1 shadow-lg"
      /* Position is computed from the cursor and flipped to stay on screen, so
         it is inherently dynamic. minWidth is caller-supplied. */
      style={{
        top: pos?.top ?? anchor.y,
        left: pos?.left ?? anchor.x,
        minWidth: width || 240,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

export function MenuLabel({ children }) {
  return (
    <div className="select-none px-2 pb-[3px] pt-[5px] font-ui text-[10px] font-semibold uppercase tracking-caps text-faint leading-tight">
      {children}
    </div>
  )
}

export function MenuItem({ icon, label, onClick, danger, disabled, hint }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm border-none bg-transparent px-2 py-[5px]',
        'text-left font-ui text-xs font-medium leading-tight',
        'transition-colors duration-100 focus-ring',
        disabled
          ? 'cursor-default text-faint'
          : cn(
              'cursor-pointer hover:bg-card-hover',
              danger ? 'text-danger-fg' : 'text-muted hover:text-fg',
            ),
      )}
    >
      {icon && <span className="flex w-3.5 shrink-0 justify-center">{icon}</span>}
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {hint && <span className="font-mono text-[10px] text-faint">{hint}</span>}
    </button>
  )
}

export function MenuDivider() {
  return <div role="separator" className="mx-0.5 my-[3px] h-px bg-subtle" />
}
