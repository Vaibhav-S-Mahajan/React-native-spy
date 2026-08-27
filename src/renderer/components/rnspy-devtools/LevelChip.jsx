// src/renderer/components/rnspy-devtools/LevelChip.jsx

import { useState } from 'react'

/**
 * Premium pill-shaped chip with an optional glowing status dot or icon,
 * and an optional trailing badge. Used across the devtools tabs for
 * filter and toggle controls.
 *
 * All tinting is derived from `color` via color-mix(), so any severity
 * colour from the theme works without extra per-level tokens.
 */
export default function LevelChip({ active, color, dot, icon, label, badge, onClick, title }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 11px',
        border: 'none', borderRadius: 999,
        background: active
          ? `linear-gradient(180deg,
              color-mix(in srgb, ${color} 18%, transparent),
              color-mix(in srgb, ${color} 10%, transparent))`
          : hover
            ? 'var(--bg-card)'
            : 'transparent',
        boxShadow: active
          ? `inset 0 0 0 1px color-mix(in srgb, ${color} 55%, transparent),
             0 1px 8px color-mix(in srgb, ${color} 20%, transparent)`
          : `inset 0 0 0 1px ${hover ? 'var(--border-default)' : 'var(--border-subtle)'}`,
        color: active ? color : hover ? 'var(--text-secondary)' : 'var(--text-tertiary)',
        fontSize: 11, fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.02em',
        fontFamily: 'var(--font-ui)', cursor: 'pointer', lineHeight: 1,
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'all 140ms ease',
      }}
    >
      {icon ? (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {icon}
        </span>
      ) : dot ? (
        <span
          aria-hidden="true"
          style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: active ? dot : 'var(--text-tertiary)',
            opacity: active ? 1 : 0.55,
            boxShadow: active ? `0 0 6px color-mix(in srgb, ${dot} 80%, transparent)` : 'none',
            transition: 'all 140ms ease',
          }}
        />
      ) : null}
      {label}
      {badge}
    </button>
  )
}
