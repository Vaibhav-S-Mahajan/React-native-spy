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

import cn from '../ui/cn'
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
        className={cn(
          'inline-flex h-control-sm shrink-0 items-center gap-1 rounded-md border-none px-2',
          'font-ui text-2xs font-medium leading-tight transition-colors duration-150 focus-ring',
          open ? 'bg-card text-fg' : 'bg-transparent text-faint hover:bg-card hover:text-muted',
        )}
      >
        <Palette size={12} aria-hidden="true" />
        {/* Live swatch so the trigger reflects the active theme at a glance */}
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full border border-default bg-accent"
        />
      </button>

      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKeyDown}
          onMouseLeave={clearPreview}
          className="animate-fade-in fixed z-[1400] rounded-lg border border-default bg-card p-1 shadow-lg"
          /* Anchored to the trigger and flipped to stay on screen — computed. */
          style={{ top: pos.top, left: pos.left, width: MENU_W }}
        >
          <div className="flex items-center justify-between px-2 pb-[3px] pt-[5px] font-ui text-xs font-semibold uppercase tracking-caps text-faint">
            <span>Theme</span>
            <span className="font-medium normal-case tracking-normal">
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
                className={cn(
                  'flex w-full items-center gap-2 rounded-md border-none px-2 py-1.5',
                  'text-left font-ui transition-colors duration-150 focus-ring',
                  active ? 'bg-card-hover' : 'bg-transparent',
                )}
              >
                {/* Three-stop swatch: surface, accent, secondary. These are the
                    theme's OWN colours being previewed, so they are literal
                    values by definition — not themeable tokens. */}
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[30px] shrink-0 overflow-hidden rounded-sm border border-default"
                >
                  {t.swatch.map((c, si) => (
                    <span key={si} className={si === 0 ? 'flex-[2]' : 'flex-1'} style={{ background: c }} />
                  ))}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block text-sm leading-tight',
                      selected ? 'font-semibold text-fg' : 'font-medium text-muted',
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="cell-truncate mt-px block text-xs text-faint leading-tight">
                    {t.blurb}
                  </span>
                </span>

                {/* Glyph, not colour alone, marks the selection */}
                <Check
                  size={13}
                  className={cn('shrink-0 text-accent', selected ? 'opacity-100' : 'opacity-0')}
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
