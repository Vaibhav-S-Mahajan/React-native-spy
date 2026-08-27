// src/components/DownloadButton.jsx
// Platform-aware split button: the wide half leads with the visitor's own OS,
// the caret half opens every other build.
//
// Two accessibility notes:
//   - The menu is a real menu (role="menu"/"menuitem") with arrow-key, Home/End,
//     Escape and click-outside handling, plus focus restore to the toggle.
//   - Until the OS is detected the label stays neutral ("Download latest
//     release"). Naming the wrong OS is worse than naming none.

import { useEffect, useRef, useState } from 'react'
import { Apple, ChevronDown, Download, Monitor, Terminal } from 'lucide-react'
import { PLATFORMS, usePlatform } from '../hooks/usePlatform'
import './DownloadButton.css'

const OS_ICONS = { mac: Apple, windows: Monitor, linux: Terminal }

// Every build, in a stable order, for the menu.
const ALL_TARGETS = [
  ...PLATFORMS.mac.targets.map((t) => ({ ...t, os: 'mac' })),
  ...PLATFORMS.windows.targets.map((t) => ({ ...t, os: 'windows' })),
  ...PLATFORMS.linux.targets.map((t) => ({ ...t, os: 'linux' }))
]

export default function DownloadButton({ releasesUrl }) {
  const platform = usePlatform()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  // Close on click-outside and on Escape, restoring focus to the toggle.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Move focus into the menu when it opens, as menu semantics require.
  useEffect(() => {
    if (open) menuRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [open])

  // Roving focus between menu items.
  const onMenuKeyDown = (e) => {
    const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') || [])]
    if (!items.length) return
    const i = items.indexOf(document.activeElement)
    let next = null

    if (e.key === 'ArrowDown') next = i < items.length - 1 ? i + 1 : 0
    else if (e.key === 'ArrowUp') next = i > 0 ? i - 1 : items.length - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else if (e.key === 'Tab') {
      // Tabbing out of a menu should dismiss it.
      setOpen(false)
      return
    }

    if (next === null) return
    e.preventDefault()
    items[next].focus()
  }

  const OsIcon = platform ? OS_ICONS[platform.id] : Download
  const lead = platform ? `Download for ${platform.label}` : 'Download latest release'
  const meta = platform
    ? `${platform.note} · free & MIT`
    : 'macOS · Windows · Linux'

  return (
    <div className={`dlb ${platform ? '' : 'dlb--plain'}`} ref={rootRef}>
      <div className="dlb__group">
        <a
          className="dlb__main"
          href={releasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-describedby="dlb-meta"
        >
          <span className="dlb__icon" aria-hidden="true">
            <OsIcon size={19} />
          </span>
          <span className="dlb__text">
            <span className="dlb__lead">{lead}</span>
            <span className="dlb__meta" id="dlb-meta">
              {meta}
            </span>
          </span>
        </a>

        {/* The caret is only useful once we know which OS was auto-selected,
            but it is always rendered so every build stays reachable. */}
        <button
          className="dlb__toggle"
          ref={toggleRef}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Choose a different platform"
        >
          <ChevronDown size={17} className="dlb__caret" />
        </button>
      </div>

      {open ? (
        <div className="dlb__menu" role="menu" ref={menuRef} onKeyDown={onMenuKeyDown}>
          <span className="dlb__group-label">All builds</span>
          {ALL_TARGETS.map((t, i) => {
            const Icon = OS_ICONS[t.os]
            return (
              <a
                key={t.label}
                className="dlb__opt"
                role="menuitem"
                tabIndex={i === 0 ? 0 : -1}
                href={releasesUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
              >
                <Icon size={16} />
                <span>{t.label}</span>
                <span className="dlb__opt-ext">{t.ext}</span>
              </a>
            )
          })}
          <span className="dlb__sep" />
          <a
            className="dlb__opt"
            role="menuitem"
            tabIndex={-1}
            href={releasesUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setOpen(false)}
          >
            <Download size={16} />
            <span>All releases &amp; changelog</span>
          </a>
        </div>
      ) : null}
    </div>
  )
}
