// src/components/Problem.jsx
// Frames the product against the alternatives before showing any features.
// The three gaps are the ones called out in the README: no WebSocket frames in
// RN DevTools, Flipper's weight, and single-device debugging.

import { Crosshair } from 'lucide-react'
import Reveal from './Reveal'
import { PROBLEMS } from '../data/content'
import './Problem.css'

export default function Problem() {
  return (
    <section className="section problem" id="why">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">The gap</span>
          <h2 className="section-title">Three things the existing tools leave you guessing about</h2>
          <p className="section-sub">
            React Native has debuggers. It does not have a fast one that covers the whole surface you
            touch while building a feature.
          </p>
        </Reveal>

        <div className="problem__grid">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} className="problem__card" delay={i * 110}>
              <span className="problem__n">0{i + 1}</span>
              <h3 className="problem__title">{p.title}</h3>
              <p className="problem__body">{p.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="problem__answer" delay={180}>
          <div className="problem__answer-icon">
            <Crosshair size={24} />
          </div>
          <div>
            <h3>So this focuses on exactly that surface</h3>
            <p>
              A tiny WebSocket server on your desktop, a snippet in your app that patches{' '}
              <code>console</code>, <code>fetch</code>, <code>XMLHttpRequest</code> and{' '}
              <code>WebSocket</code>, and a Chrome-DevTools-style UI that buckets every event by
              device. Six panels, virtualized rows, and a setup flow that shows you every file it will
              touch before it touches it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
