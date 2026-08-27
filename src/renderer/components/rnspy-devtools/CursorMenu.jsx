// src/renderer/components/rnspy-devtools/CursorMenu.jsx

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: pos?.top ?? anchor.y,
        left: pos?.left ?? anchor.x,
        zIndex: 1300,
        minWidth: width || 240,
        maxHeight: 'calc(100vh - 24px)',
        overflowY: 'auto',
        padding: 'var(--space-1)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

export function MenuLabel({ children }) {
  return (
    <div style={{
      padding: '5px var(--space-2) 3px',
      fontSize: 10,
      fontWeight: 'var(--font-weight-semibold)',
      fontFamily: 'var(--font-ui)',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      lineHeight: 'var(--line-height-tight)',
      userSelect: 'none',
    }}>
      {children}
    </div>
  )
}

export function MenuItem({ icon, label, onClick, danger, disabled, hint }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        width: '100%', padding: '5px var(--space-2)',
        border: 'none', borderRadius: 'var(--radius-sm)',
        background: hover && !disabled ? 'var(--bg-card-hover)' : 'transparent',
        color: disabled ? 'var(--text-tertiary)' : danger ? 'var(--status-danger-text)' : 'var(--text-secondary)',
        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)',
        fontFamily: 'var(--font-ui)', cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left', lineHeight: 'var(--line-height-tight)',
      }}
    >
      {icon && <span style={{ display: 'flex', flexShrink: 0, width: 14, justifyContent: 'center' }}>{icon}</span>}
      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{label}</span>
      {hint && <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{hint}</span>}
    </button>
  )
}

export function MenuDivider() {
  return <div style={{ height: 1, background: 'var(--border-subtle)', margin: '3px 2px' }} />
}
