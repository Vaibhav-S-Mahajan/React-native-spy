// src/hooks/useMousePosition.js
// Tracks the pointer relative to an element and writes the coordinates to CSS
// custom properties (--mx / --my). Doing it via style props rather than React
// state avoids a re-render on every mousemove.

import { useCallback, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useSpotlight() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const onMouseMove = useCallback(
    (e) => {
      const node = ref.current
      if (!node || reduced) return
      const rect = node.getBoundingClientRect()
      node.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      node.style.setProperty('--my', `${e.clientY - rect.top}px`)
    },
    [reduced]
  )

  const onMouseLeave = useCallback(() => {
    const node = ref.current
    if (!node) return
    // Park the spotlight off-card so the glow fades out cleanly.
    node.style.setProperty('--mx', '-9999px')
    node.style.setProperty('--my', '-9999px')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}

// Normalised (-1..1) pointer offset from the window centre, delivered through
// a callback so callers can drive parallax without re-rendering.
export function useParallax(onMove, strength = 1) {
  const reduced = useReducedMotion()
  const raf = useRef(0)

  return useCallback(
    (e) => {
      if (reduced) return
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
        const y = (e.clientY / window.innerHeight - 0.5) * 2 * strength
        onMove(x, y)
      })
    },
    [onMove, strength, reduced]
  )
}
