// src/components/Logo.jsx
// The product mark, ported from src/renderer/components/rnspy-devtools/Logo.jsx.
// The desktop version reads --logo-* tokens so it can follow six themes; here
// the palette is fixed to the dark brand colours.

export default function Logo({ size = 28, animated = false, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="React Native Spy"
      className={animated ? 'logo logo--animated' : 'logo'}
      {...props}
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="var(--purple)" />
      <rect
        x="7"
        y="4.8"
        width="9"
        height="14.4"
        rx="2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <line
        x1="9.8"
        y1="17.4"
        x2="13.2"
        y2="17.4"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* The lens is the animated element — it pulses like a live indicator. */}
      <circle
        className="logo__lens"
        cx="15.2"
        cy="14.2"
        r="3"
        fill="var(--bg-app)"
        stroke="var(--accent)"
        strokeWidth="1.6"
      />
      <line
        x1="17.3"
        y1="16.3"
        x2="19.3"
        y2="18.3"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
