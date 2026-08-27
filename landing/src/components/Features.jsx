// src/components/Features.jsx
// The six-panel showcase. A vertical selector on the left drives a detail card
// on the right. Keyboard support matters here: the list is a real tablist with
// arrow-key navigation, since the desktop app's own audit flagged mouse-only
// interaction as a P1 issue and the marketing site should not repeat it.

import { useRef, useState } from 'react'
import {
  Check,
  ChevronRight,
  Database,
  Globe,
  Info,
  Radio,
  ScrollText,
  Table2,
  Terminal
} from 'lucide-react'
import Reveal from './Reveal'
import { useSpotlight } from '../hooks/useMousePosition'
import { PANELS } from '../data/content'
import './Features.css'

const ICONS = { Globe, Radio, Terminal, Database, Table2, ScrollText }

export default function Features() {
  const [index, setIndex] = useState(0)
  const listRef = useRef(null)
  const spotlight = useSpotlight()

  const panel = PANELS[index]
  const DetailIcon = ICONS[panel.icon]

  // Arrow keys move between panels, matching tablist conventions.
  const onKeyDown = (e) => {
    const last = PANELS.length - 1
    let next = null

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last

    if (next === null) return
    e.preventDefault()
    setIndex(next)
    // Move focus with selection so the two never disagree.
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  return (
    <section className="section features" id="features">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Six panels</span>
          <h2 className="section-title">One window for every layer of your app</h2>
          <p className="section-sub">
            Network, WebSocket, Console, Storage, WatermelonDB and Logs. Every event is tagged with the
            device that sent it and bucketed into its own tab.
          </p>
        </Reveal>

        <div className="features__layout">
          <div
            className="features__list"
            role="tablist"
            aria-label="Inspector panels"
            aria-orientation="vertical"
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {PANELS.map((p, i) => {
              const Icon = ICONS[p.icon]
              const selected = i === index
              return (
                <button
                  key={p.id}
                  role="tab"
                  id={`panel-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-detail-${p.id}`}
                  tabIndex={selected ? 0 : -1}
                  className="features__item"
                  style={{ '--panel-accent': p.accent }}
                  onClick={() => setIndex(i)}
                >
                  <span className="features__icon">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="features__name">{p.name}</span>
                    <span className="features__hint">{p.points.length} capabilities</span>
                  </span>
                  <ChevronRight size={16} className="features__arrow" />
                </button>
              )
            })}
          </div>

          <div
            key={panel.id}
            id={`panel-detail-${panel.id}`}
            role="tabpanel"
            aria-labelledby={`panel-tab-${panel.id}`}
            tabIndex={0}
            className="features__detail features__detail--enter"
            style={{ '--panel-accent': panel.accent }}
            ref={spotlight.ref}
            onMouseMove={spotlight.onMouseMove}
            onMouseLeave={spotlight.onMouseLeave}
          >
            <div className="features__detail-head">
              <span className="features__detail-icon">
                <DetailIcon size={22} />
              </span>
              <h3>{panel.name}</h3>
              <span className="features__tag">Panel {index + 1} of {PANELS.length}</span>
            </div>

            <p className="features__summary">{panel.summary}</p>

            <ul className="features__points">
              {panel.points.map((point, i) => (
                <li key={point} style={{ animationDelay: `${120 + i * 80}ms` }}>
                  <Check size={15} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="features__foot">
              <Info size={13} />
              {panel.footnote}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
