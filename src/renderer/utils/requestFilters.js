// src/renderer/utils/requestFilters.js

/**
 * Short label for a request — the last meaningful path segment,
 * skipping trailing numeric IDs.
 * Example: `/api/Client/GetDashboard/729` → `GetDashboard`
 */
export function requestName(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    const segs = u.pathname.split('/').filter(Boolean)
    for (let i = segs.length - 1; i >= 0; i--) {
      if (!/^\d+$/.test(segs[i])) return segs[i]
    }
    return segs[segs.length - 1] || u.pathname
  } catch {
    const clean = url.split(/[?#]/)[0]
    const segs = clean.split('/').filter(Boolean)
    return segs[segs.length - 1] || url
  }
}

/**
 * True if `req` is hidden by any rule.
 * - hideRelated=false → exact name match
 * - hideRelated=true  → URL substring match
 */
export function isRequestHidden(req, rules) {
  if (!rules || !rules.length) return false
  const name = requestName(req.url)
  const url = req.url || ''
  for (const r of rules) {
    if (!r || !r.match) continue
    if (r.hideRelated) {
      if (url.includes(r.match)) return true
    } else if (name === r.match) {
      return true
    }
  }
  return false
}
