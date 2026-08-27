// src/components/Logo.jsx
// The product mark, ported from src/renderer/components/rnspy-devtools/Logo.jsx:
// a signal trace seen through a lens. The ring is the observation, the waveform
// inside it is the live stream.
//
// The desktop version reads --logo-* tokens so it can follow ten themes; here
// the palette is fixed to the dark brand colours.
//
// OPTICAL SIZING. Below 20px the waveform is dropped for a solid pupil — a 2px
// stroke on a 32-unit grid resolves to under one device pixel at size=14, so the
// trace would render as grey mud. Pass `detail` to override ('auto'|'full'|'compact').
//
// `animated` makes the trace draw itself on a loop, like a live signal sweeping
// the lens. It previously did nothing: the prop was read and turned into a class
// name, but no CSS ever defined it. Logo.css now implements it, and it opts out
// under prefers-reduced-motion.

import './Logo.css'

// Waveform trace. Every vertex stays within 5.7 of centre, so with a 2-wide
// round cap the ink reaches 6.7 — clear of the lens ring's inner edge at
// 8.25 - 2.25/2 = 7.125. Widen the ring or the trace and re-check that sum.
const TRACE = '10.3 16, 12.2 16, 13.7 11.7, 15.4 20, 17.3 13.8, 19 16, 21.7 16'

export default function Logo({ size = 28, animated = false, detail = 'auto', ...props }) {
  const compact = detail === 'compact' || (detail === 'auto' && size < 20)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="React Native Spy"
      className={animated ? 'logo logo--animated' : 'logo'}
      {...props}
    >
      {/* Badge */}
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--purple)" />

      {/* Rim light — reads as a bevel against the page's dark surface. */}
      <rect
        x="1.75"
        y="1.75"
        width="28.5"
        height="28.5"
        rx="8.4"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5"
      />

      {/* Lens: interior fill plus ring, drawn as one circle. */}
      <circle
        cx="16"
        cy="16"
        r="8.25"
        fill="var(--bg-app)"
        stroke="#ffffff"
        strokeWidth={compact ? 2.75 : 2.25}
      />

      {compact ? (
        <circle className="logo__pupil" cx="16" cy="16" r="2.75" fill="var(--accent)" />
      ) : (
        // pathLength normalises the trace to 100 units, so Logo.css can dash it
        // with round numbers instead of the real ~29.6 arc length. Re-shaping the
        // trace then never breaks the draw animation.
        <polyline
          className="logo__trace"
          points={TRACE}
          pathLength="100"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
