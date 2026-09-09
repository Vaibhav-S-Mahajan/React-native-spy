// src/renderer/components/rnspy-devtools/LevelChip.jsx

import cn from '../ui/cn'

/**
 * Premium pill-shaped chip with an optional glowing status dot or icon,
 * and an optional trailing badge. Used across the devtools tabs for
 * filter and toggle controls.
 *
 * All tinting is derived from `color` via color-mix(), so any severity
 * colour from the theme works without extra per-level tokens.
 */
export default function LevelChip({ active, color, dot, icon, label, badge, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        'inline-flex h-control-sm shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full',
        'border-none px-[11px] font-ui text-[11px] font-semibold leading-none tracking-[0.02em]',
        'transition-all duration-150 focus-ring',
        active
          ? 'text-[--chip-color]'
          : 'text-faint shadow-[inset_0_0_0_1px_var(--border-subtle)] hover:bg-card hover:text-muted hover:shadow-[inset_0_0_0_1px_var(--border-default)]',
      )}
      /* The tint is derived from the caller's severity colour via color-mix, so
         it cannot be a static utility — `color` is a runtime value. Exposed as a
         custom property so the classes above can reference it. */
      style={active ? {
        '--chip-color': color,
        backgroundImage: `linear-gradient(180deg,
          color-mix(in srgb, ${color} 18%, transparent),
          color-mix(in srgb, ${color} 10%, transparent))`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 55%, transparent),
                    0 1px 8px color-mix(in srgb, ${color} 20%, transparent)`,
      } : undefined}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center">
          {icon}
        </span>
      ) : dot ? (
        <span
          aria-hidden="true"
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-150',
            !active && 'bg-faint opacity-55',
          )}
          style={active ? {
            background: dot,
            boxShadow: `0 0 6px color-mix(in srgb, ${dot} 80%, transparent)`,
          } : undefined}
        />
      ) : null}
      {label}
      {badge}
    </button>
  )
}
