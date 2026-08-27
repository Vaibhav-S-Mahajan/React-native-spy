// src/components/Extras.jsx
// Secondary capabilities that matter to daily use but do not need their own
// section: reconnect behaviour, hidden rules, remote reload, the __DEV__ guard,
// reversible setup, and the virtualization caps.

import { EyeOff, Gauge, RefreshCw, Rocket, ShieldCheck, Undo2 } from 'lucide-react'
import Reveal from './Reveal'
import { EXTRAS } from '../data/content'
import './Extras.css'

const ICONS = { Rocket, EyeOff, RefreshCw, ShieldCheck, Undo2, Gauge }

export default function Extras() {
  return (
    <section className="section extras">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Details</span>
          <h2 className="section-title">The parts you notice on day three</h2>
          <p className="section-sub">
            Small decisions that decide whether a debugger stays in your workflow or gets closed after
            the first afternoon.
          </p>
        </Reveal>

        <div className="extras__grid">
          {EXTRAS.map((x, i) => {
            const Icon = ICONS[x.icon]
            return (
              <Reveal key={x.title} className="extras__card" delay={(i % 3) * 90 + Math.floor(i / 3) * 60}>
                <span className="extras__icon">
                  <Icon size={19} />
                </span>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
