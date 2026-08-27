// src/renderer/components/rnspy-devtools/ThemeMenu.jsx
//
// Header theme picker. Users switch on mood, so this is a one-click affordance
// in the toolbar rather than buried in Settings (it's mirrored in Settings too,
// for discoverability).
//
// Behaviour worth noting:
//   - Hovering / focusing a row previews that theme live on the whole app, and
//     leaving the menu reverts. Committing requires a click.
//   - Real menu semantics: role="menu" + role="menuitemradio", arrow-key
//     navigation, Home/End, Escape closes and restores focus to the trigger.
//     This is the pattern the rest of the app still needs (see UI-REDESIGN.md).

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Palette } from 'lucide-react'

import { BTN_GHOST } from '../../styles/shared'
import { useTheme } from '../../hooks/useTheme'

const MENU_W = 248

export default function ThemeMenu() {
  const { theme, themes, setTheme, previewTheme, clearPreview, meta } = useTheme()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef([])

  const close = (restoreFocus = true) => {
    setOpen(false)
    clearPreview()
    if (restoreFocus) btnRef.current?.focus()
  }

  // Open positioned under the trigger, flipped in if it would overflow.
  const openMenu = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    const left = Math.max(8, Math.min(r.right - MENU_W, window.innerWidth - MENU_W - 8))
    setPos({ top: r.bottom + 6, left })
    setActiveIdx(Math.max(0, themes.findIndex((t) => t.id === theme)))
    setOpen(true)
  }

  // Move DOM focus with the active index so the preview follows keyboard too.
  useLayoutEffect(() => {
    if (open) itemRefs.current[activeIdx]?.focus()
  }, [open, activeIdx])

  useEffect(() => {
    if (!open) return undefined

    // Armed on the next frame so the click that opened the menu can't close it.
    let armed = false
    const raf = requestAnimationFrame(() => { armed = true })

    const onDown = (e) => {
      if (!armed) return
      if (menuRef.current?.contains(e.target)) return
      if (btnRef.current?.contains(e.target)) return
      close(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close() }
    }
    const onBlur = () => close(false)

    document.addEventListener('mousedown', onDown, true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('blur', onBlur)
    window.addEventListener('resize', onBlur)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousedown', onDown, true)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('resize', onBlur)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMenuKeyDown = (e) => {
    const last = themes.length - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = activeIdx >= last ? 0 : activeIdx + 1
      setActiveIdx(n); previewTheme(themes[n].id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = activeIdx <= 0 ? last : activeIdx - 1
      setActiveIdx(n); previewTheme(themes[n].id)
    } else if (e.key === 'Home') {
      e.preventDefault(); setActiveIdx(0); previewTheme(themes[0].id)
    } else if (e.key === 'End') {
      e.preventDefault(); setActiveIdx(last); previewTheme(themes[last].id)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); setTheme(themes[activeIdx].id); close()
    } else if (e.key === 'Tab') {
      // Menus shouldn't leak focus into the page behind them.
      e.preventDefault()
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? close() : openMenu())}
        title={`Theme: ${meta.label}`}
        aria-label={`Change theme, current theme ${meta.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          ...BTN_GHOST,
          gap: 'var(--space-1)',
          color: open ? 'var(--text-primary)' : 'var(--text-tertiary)',
          background: open ? 'var(--bg-card)' : 'transparent',
        }}
      >
        <Palette size={12} />
        {/* Live swatch so the trigger reflects the active theme at a glance */}
        <span
          aria-hidden="true"
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent-primary)',
            border: '1px solid var(--border-default)',
            flexShrink: 0,
          }}
        />
      </button>

      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKeyDown}
          onMouseLeave={clearPreview}
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: pos.top, left: pos.left, width: MENU_W,
            zIndex: 1400,
            padding: 'var(--space-1)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '5px var(--space-2) 3px',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
          }}>
            <span>Theme</span>
            <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 'var(--font-weight-medium)' }}>
              hover to preview
            </span>
          </div>

          {themes.map((t, i) => {
            const selected = t.id === theme
            const active = i === activeIdx
            return (
              <button
                key={t.id}
                ref={(el) => { itemRefs.current[i] = el }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={active ? 0 : -1}
                onClick={() => { setTheme(t.id); close() }}
                onMouseEnter={() => { setActiveIdx(i); previewTheme(t.id) }}
                onFocus={() => previewTheme(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  width: '100%', padding: '6px var(--space-2)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--bg-card-hover)' : 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-ui)',
                  transition: 'background 120ms ease',
                }}
              >
                {/* Three-stop swatch: surface, accent, secondary */}
                <span
                  aria-hidden="true"
                  style={{
                    display: 'flex', flexShrink: 0,
                    width: 30, height: 18,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {t.swatch.map((c, si) => (
                    <span key={si} style={{ flex: si === 0 ? 2 : 1, background: c }} />
                  ))}
                </span>

                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 'var(--line-height-tight)',
                  }}>
                    {t.label}
                  </span>
                  <span style={{
                    display: 'block',
                    fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    lineHeight: 'var(--line-height-tight)', marginTop: 1,
                  }}>
                    {t.blurb}
                  </span>
                </span>

                {/* Glyph, not colour alone, marks the selection */}
                <Check
                  size={13}
                  style={{
                    flexShrink: 0,
                    color: 'var(--accent-primary)',
                    opacity: selected ? 1 : 0,
                  }}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
}
