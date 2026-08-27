// src/renderer/components/rnspy-devtools/Logo.jsx
// Brand mark: React Native phone + spyglass.
// Colours are tokenised (--logo-*) so the mark follows the active theme —
// a fixed purple/green logo looked wrong on Paper and Terminal.

export default function Logo({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="React Native Spy"
      style={{ display: 'block', flexShrink: 0, ...(props.style || {}) }}
      {...props}
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="var(--logo-body)" />
      <rect x="7" y="4.8" width="9" height="14.4" rx="2" fill="none" stroke="var(--logo-outline)" strokeWidth="1.5" />
      <line x1="9.8" y1="17.4" x2="13.2" y2="17.4" stroke="var(--logo-outline)" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <circle cx="15.2" cy="14.2" r="3" fill="var(--logo-lens-bg)" stroke="var(--logo-lens-ring)" strokeWidth="1.6" />
      <line x1="17.3" y1="16.3" x2="19.3" y2="18.3" stroke="var(--logo-lens-ring)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
