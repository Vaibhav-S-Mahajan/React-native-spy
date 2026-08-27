// src/components/Setup.jsx
// The four-step automatic integration flow from docs/getting-started.md §4A.
// Each step pairs prose with the exact artifact it produces, so a visitor can
// judge how invasive the setup is before downloading anything.

import { FileCheck2, ShieldCheck, Undo2 } from 'lucide-react'
import CodeBlock from './CodeBlock'
import Reveal from './Reveal'
import { SETUP_STEPS } from '../data/content'
import './Setup.css'

const SAFETY = [
  {
    Icon: FileCheck2,
    title: 'Plan before apply',
    body: 'A read-only phase computes every change without touching disk. You approve a preview of the exact lines first.'
  },
  {
    Icon: ShieldCheck,
    title: 'Backed up and atomic',
    body: 'Each modified file is copied to .rnspy.bak before the write, and a failure part-way through rolls the whole operation back.'
  },
  {
    Icon: Undo2,
    title: 'Idempotent and reversible',
    body: 'Re-running reports Up to date instead of duplicating lines. Remove integration deletes the file and strips the import.'
  }
]

export default function Setup() {
  return (
    <section className="section setup" id="setup">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title">Connected in four steps, with nothing hidden</h2>
          <p className="section-sub">
            The app can wire itself into your project, but it shows you every file it will create or
            modify before it does. You can also paste the snippet by hand if you would rather it never
            touch your repo.
          </p>
        </Reveal>

        <div className="setup__steps">
          {SETUP_STEPS.map((step, i) => (
            <Reveal key={step.n} className="setup__step" delay={i * 90} from="up">
              <div className="setup__n">{step.n}</div>
              <div className="setup__card">
                <div className="setup__head">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <CodeBlock code={step.code} lang={step.lang} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="setup__safety">
          {SAFETY.map(({ Icon, title, body }, i) => (
            <Reveal key={title} className="setup__safety-card" delay={i * 90}>
              <Icon size={20} />
              <h4>{title}</h4>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
