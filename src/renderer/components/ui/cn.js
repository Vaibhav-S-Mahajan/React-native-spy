// src/renderer/components/ui/cn.js
// Minimal class-name joiner. Filters out false/null/undefined so conditional
// classes read as `cn('base', active && 'on')` without leaking "false" into the
// class string. No dependency needed — clsx would be one more package for ~6 lines.

export function cn(...parts) {
  let out = ''
  for (const p of parts) {
    if (!p) continue
    out = out ? out + ' ' + p : p
  }
  return out
}

export default cn
