// src/components/Compare.jsx
// Capability matrix against RN DevTools and Flipper, plus the 12 copy-as
// formats from utils/curl.js.
//
// A note on honesty: the comparison marks "partial" where a rival tool does
// something in a limited way rather than not at all. Overstating a gap is the
// fastest way to lose a developer audience that can check in five minutes.

import { Check, Minus, X } from 'lucide-react'
import Logo from './Logo'
import Reveal from './Reveal'
import { CAPABILITIES, COPY_FORMATS } from '../data/content'
import './Compare.css'

export default function Compare() {
  return (
    <section className="section compare" id="compare">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Compare</span>
          <h2 className="section-title">Where it fits next to what you already use</h2>
          <p className="section-sub">
            This is not a Flipper replacement for native profiling. It covers the JavaScript surface you
            touch while building a feature, and it covers all of it.
          </p>
        </Reveal>

        <Reveal className="compare__wrap">
          <div className="compare__scroll">
            <table className="compare__table">
              <caption className="sr-only">
                Capability comparison between React Native Spy, React Native DevTools and Flipper
              </caption>
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  <th scope="col" className="compare__cell compare__ours">
                    <span className="compare__ours-head">
                      <Logo size={14} />
                      RN Spy
                    </span>
                  </th>
                  <th scope="col" className="compare__cell">
                    RN DevTools
                  </th>
                  <th scope="col" className="compare__cell">
                    Flipper
                  </th>
                </tr>
              </thead>
              <tbody>
                {CAPABILITIES.map((row) => (
                  <tr key={row.name}>
                    <th scope="row" className="compare__feat">
                      {row.name}
                    </th>
                    <td className="compare__cell compare__ours">
                      <Mark value={row.spy} />
                    </td>
                    <td className="compare__cell">
                      <Mark value={row.devtools} />
                    </td>
                    <td className="compare__cell">
                      <Mark value={row.flipper} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="compare__legend" delay={100}>
          <span>
            <Mark value={true} /> Supported
          </span>
          <span>
            <Mark value="partial" /> Partial or limited
          </span>
          <span>
            <Mark value={false} /> Not supported
          </span>
        </Reveal>

        <Reveal className="compare__note" delay={140}>
          Flipper remains the better choice for native crash reporting, layout inspection and native
          performance traces. Reach for whichever tool matches the layer you are debugging.
        </Reveal>

        <Reveal className="compare__formats" delay={120}>
          <h3>Twelve ways to take a request with you</h3>
          <p>
            Right-click any row in the Network panel. Reproduce a failing call in your terminal, paste
            it into a bug report, or hand a colleague a runnable snippet in the language they use.
          </p>
          <div className="compare__chips">
            {COPY_FORMATS.map((f) => (
              <span key={f} className="compare__chip">
                {f}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Mark({ value }) {
  if (value === 'partial') {
    return (
      <span className="compare__mark compare__mark--partial" title="Partial support">
        <Minus size={14} strokeWidth={3} />
        <span className="sr-only">Partial support</span>
      </span>
    )
  }
  if (value) {
    return (
      <span className="compare__mark compare__mark--yes" title="Supported">
        <Check size={14} strokeWidth={3} />
        <span className="sr-only">Supported</span>
      </span>
    )
  }
  return (
    <span className="compare__mark compare__mark--no" title="Not supported">
      <X size={13} strokeWidth={3} />
      <span className="sr-only">Not supported</span>
    </span>
  )
}
