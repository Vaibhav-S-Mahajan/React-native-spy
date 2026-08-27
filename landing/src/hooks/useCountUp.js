// src/hooks/useCountUp.js
// Animates a number from 0 to `end` once its container is in view.
// Uses requestAnimationFrame with an ease-out curve, and returns the final
// value immediately when the user prefers reduced motion.

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useCountUp(end, { duration = 1600, start = false } = {}) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()
  const frameRef = useRef(0)

  useEffect(() => {
    if (!start) return

    if (reduced || duration <= 0) {
      setValue(end)
      return
    }

    let cancelled = false
    const t0 = performance.now()

    const tick = (now) => {
      if (cancelled) return
      const p = Math.min((now - t0) / duration, 1)
      // easeOutExpo — fast start, long settle. Reads as "counting up".
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Math.round(end * eased))
      if (p < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
    }
  }, [end, duration, start, reduced])

  return value
}
