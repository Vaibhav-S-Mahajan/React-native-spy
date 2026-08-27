// src/renderer/components/rnspy-devtools/Logo.jsx
// Brand mark: a signal trace seen through a lens.
//
// The ring is the observation, the waveform inside it is the live stream. One
// idea, two elements — the previous mark stacked a phone outline, a speaker
// line, a lens ring and a diagonal handle, which collapsed into a smudge at the
// 14–18px sizes this component is actually rendered at.
//
// Colours are tokenised (--logo-*) so the mark follows the active theme; a fixed
// purple/green logo looked wrong on Paper, Terminal and Mono Light.
//
// OPTICAL SIZING. Below 20px the waveform is dropped for a solid pupil. A 2px
// stroke on a 32-unit grid resolves to 0.875 device pixels at size=14, so the
// trace renders as grey mud rather than a line. Real icon systems ship separate
// small-size cuts for the same reason. Pass `detail` to override the automatic
// choice ('auto' | 'full' | 'compact').

// Waveform trace. Every vertex stays within 5.7 of centre, so with a 2-wide
// round cap the ink reaches 6.7 — clear of the lens ring's inner edge at
// 8.25 - 2.25/2 = 7.125. Widen the ring or the trace and re-check that sum.
const TRACE = '10.3 16, 12.2 16, 13.7 11.7, 15.4 20, 17.3 13.8, 19 16, 21.7 16'

export default function Logo({ size = 18, detail = 'auto', ...props }) {
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
      style={{ display: 'block', flexShrink: 0, ...(props.style || {}) }}
      {...props}
    >
      {/* Badge */}
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--logo-body)" />

      {/* Rim light. Reads as a bevel on dark themes and disappears politely on
          light ones. No gradient, so no id to collide when several logos share
          a page. */}
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
        fill="var(--logo-lens-bg)"
        stroke="var(--logo-outline)"
        strokeWidth={compact ? 2.75 : 2.25}
      />

      {compact ? (
        <circle cx="16" cy="16" r="2.75" fill="var(--logo-lens-ring)" />
      ) : (
        <polyline
          points={TRACE}
          fill="none"
          stroke="var(--logo-lens-ring)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
