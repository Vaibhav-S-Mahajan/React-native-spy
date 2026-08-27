// src/components/Hero.jsx
// First screen. The headline animates word-by-word behind clipping masks, the
// app mock tilts subtly with the pointer, and the stats strip counts up once
// it scrolls into view.

import { useCallback, useRef } from 'react'
import { ArrowRight, Check, Download, Github, Wifi } from 'lucide-react'
import AppMock from './AppMock'
import Button from './Button'
import Reveal from './Reveal'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { useParallax } from '../hooks/useMousePosition'
import { PRODUCT, STATS } from '../data/content'
import './Hero.css'

const LINE_1 = ['See', 'everything']
const LINE_2 = ['your', 'RN', 'app', 'does.']

export default function Hero() {
  const mockRef = useRef(null)
  const [mockWrapRef, mockInView] = useInView({ once: false, threshold: 0.15 })

  // Pointer-driven tilt. Written straight to the node's transform so moving the
  // mouse never triggers a React render.
  const onMove = useParallax(
    useCallback((x, y) => {
      const node = mockRef.current
      if (!node) return
      node.style.transform = `perspective(1800px) rotateY(${x * 3}deg) rotateX(${-y * 2.4}deg) translateZ(0)`
    }, []),
    1
  )

  const resetTilt = useCallback(() => {
    const node = mockRef.current
    if (node) node.style.transform = 'perspective(1800px) rotateY(0) rotateX(0)'
  }, [])

  let wordIndex = 0

  return (
    <section className="hero" id="top" onMouseMove={onMove} onMouseLeave={resetTilt}>
      <div className="container hero__inner">
        <div className="hero__badge">
          <span className="hero__badge-tag">NEW</span>
          <span>
            Storage &amp; WatermelonDB inspectors — <b>six panels, one window</b>
          </span>
        </div>

        <h1 className="hero__title">
          {LINE_1.map((w) => (
            <Word key={w} delay={wordIndex++ * 90}>
              {w}
            </Word>
          ))}
          <br />
          {LINE_2.map((w, i) => (
            <Word key={w} delay={wordIndex++ * 90} gradient={i >= 1}>
              {w}
            </Word>
          ))}
        </h1>

        <p className="hero__sub">
          A lightweight Electron remote debugger for React Native. Console logs, HTTP traffic, live
          WebSocket frames, device storage and WatermelonDB — across multiple devices at once. No Metro
          dependency, and nothing added to your <code>package.json</code>.
        </p>

        <div className="hero__actions">
          <Button size="lg" href="#download" icon={<Download size={17} />}>
            Download for free
          </Button>
          <Button size="lg" variant="secondary" href="#setup" iconRight={<ArrowRight size={17} />}>
            See how it works
          </Button>
          <Button size="lg" variant="ghost" href={PRODUCT.repo} icon={<Github size={17} />}>
            Star on GitHub
          </Button>
        </div>

        <div className="hero__meta">
          <span>
            <Check size={14} /> MIT licensed
          </span>
          <span>
            <Check size={14} /> macOS · Windows · Linux
          </span>
          <span>
            <Wifi size={14} /> Runs entirely on your machine
          </span>
        </div>

        <div className="hero__mock mock-wrap" ref={mockWrapRef}>
          <div className="hero__mock-inner" ref={mockRef}>
            <AppMock active={mockInView} />
          </div>
        </div>

        <StatsStrip />
      </div>
    </section>
  )
}

function Word({ children, delay, gradient }) {
  return (
    <span className="hero__word">
      <span style={{ animationDelay: `${delay}ms` }} className={gradient ? 'hero__grad' : undefined}>
        {children}
      </span>
    </span>
  )
}

function StatsStrip() {
  const [ref, inView] = useInView({ threshold: 0.35 })

  return (
    <div className="hero__stats" ref={ref}>
      {STATS.map((s, i) => (
        <Reveal key={s.label} className="hero__stat" delay={i * 90} from="up">
          <Stat value={s.value} suffix={s.suffix} label={s.label} start={inView} />
        </Reveal>
      ))}
    </div>
  )
}

function Stat({ value, suffix, label, start }) {
  const n = useCountUp(value, { start, duration: 1500 })
  return (
    <>
      <span className="hero__stat-v">
        {n.toLocaleString()}
        {suffix}
      </span>
      <span className="hero__stat-l">{label}</span>
    </>
  )
}
