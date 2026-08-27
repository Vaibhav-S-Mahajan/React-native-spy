// src/components/Reveal.jsx
// Scroll-triggered entrance animation. One component handles every reveal on
// the page so timing and easing stay consistent, and reduced-motion users get
// the final state with no transform.
//
// Prerendering note: the first render is deliberately *visible*. If it started
// hidden, the prerendered HTML would ship every section at `opacity: 0` — which
// non-rendering crawlers read as hidden content, and which leaves the page blank
// for anyone whose JS fails to load.
//
// Hiding therefore happens in a layout effect, before the browser paints, and
// only for elements that are actually below the fold. Above-the-fold content is
// left alone: arming it would hide content the browser has already painted and
// produce a visible flash before the observer fires.

import { useEffect, useLayoutEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Reveal.css'

const OFFSETS = {
  up: 'translate3d(0, 28px, 0)',
  down: 'translate3d(0, -28px, 0)',
  left: 'translate3d(28px, 0, 0)',
  right: 'translate3d(-28px, 0, 0)',
  scale: 'scale(0.96)',
  none: 'none'
}

// useLayoutEffect warns during server rendering, and the pre-paint timing it
// provides only means anything in a browser.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function Reveal({
  children,
  delay = 0,
  duration = 700,
  from = 'up',
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}) {
  const [ref, inView] = useInView()
  const reduced = useReducedMotion()

  // false on the server and on the hydration render, so the two agree.
  const [armed, setArmed] = useState(false)

  useIsoLayoutEffect(() => {
    if (reduced) return
    // Without an observer the element would never be un-hidden.
    if (typeof IntersectionObserver === 'undefined') return

    const node = ref.current
    if (!node) return

    // Only animate what the visitor has not seen yet.
    const top = node.getBoundingClientRect().top
    if (top < window.innerHeight) return

    setArmed(true)
  }, [reduced, ref])

  const hidden = armed && !inView && !reduced

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? OFFSETS[from] : 'none',
        transitionDuration: reduced ? '0ms' : `${duration}ms`,
        transitionDelay: reduced ? '0ms' : `${delay}ms`,
        ...style
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
