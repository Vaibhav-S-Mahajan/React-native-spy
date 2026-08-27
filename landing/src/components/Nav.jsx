// src/components/Nav.jsx
// Sticky navigation. Three behaviours worth noting:
//   1. Chrome (blur + border) only appears after scrolling, so the hero is clean.
//   2. A scroll-progress bar is driven by a transform on a ref, not state, to
//      avoid re-rendering the nav on every scroll event.
//   3. The active section is tracked with IntersectionObserver so the current
//      link is marked for both sighted and assistive-tech users.

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Download, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { NAV_LINKS, PRODUCT } from '../data/content'
import './Nav.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const progressRef = useRef(null)

  // Scroll listener drives both the chrome flag and the progress bar.
  useEffect(() => {
    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 12)

        const max = document.documentElement.scrollHeight - window.innerHeight
        const ratio = max > 0 ? Math.min(y / max, 1) : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${ratio})`
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Highlight whichever section currently occupies the middle of the viewport.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Close the mobile sheet on Escape, and lock body scroll while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <a className="nav__brand" href="#top">
          <Logo size={26} animated />
          <span>{PRODUCT.name}</span>
          <span className="nav__ver">v{PRODUCT.version}</span>
        </a>

        <div className="nav__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="nav__link"
              href={link.href}
              aria-current={active === link.href.slice(1) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <Button variant="ghost" size="sm" href={PRODUCT.repo} iconRight={<ArrowUpRight size={15} />}>
            GitHub
          </Button>
          <Button variant="primary" size="sm" href="#download" icon={<Download size={15} />}>
            Download
          </Button>
        </div>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div ref={progressRef} className="nav__progress" style={{ width: '100%', transform: 'scaleX(0)' }} />
      </nav>

      {open ? (
        <div className="nav__mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Button variant="primary" href="#download" icon={<Download size={16} />} onClick={() => setOpen(false)}>
            Download
          </Button>
        </div>
      ) : null}
    </header>
  )
}
