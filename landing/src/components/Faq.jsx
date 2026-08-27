// src/components/Faq.jsx
// Accordion. Built on real buttons with aria-expanded/aria-controls rather than
// <details>, so the open/close animation is controllable while keeping the
// semantics assistive tech expects.

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Reveal from './Reveal'
import { FAQ } from '../data/content'
import './Faq.css'

export default function Faq() {
  // Multiple items may be open at once — these are reference answers, not a
  // wizard, so collapsing a previous answer would be annoying.
  const [open, setOpen] = useState(() => new Set([0]))

  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">The questions you should be asking</h2>
          <p className="section-sub">
            Anything that touches your repo or your bundle deserves a straight answer before you install
            it.
          </p>
        </Reveal>

        <div className="faq__list">
          {FAQ.map((item, i) => {
            const isOpen = open.has(i)
            return (
              <Reveal
                key={item.q}
                className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
                delay={Math.min(i * 60, 300)}
              >
                <button
                  className="faq__q"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span>{item.q}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <Plus size={15} />
                  </span>
                </button>
                {/* Not using the `hidden` attribute here: it would cancel the
                    height transition. Collapsed content is hidden with
                    visibility instead, which keeps it out of the a11y tree
                    while still being animatable. */}
                <div
                  className="faq__a"
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
