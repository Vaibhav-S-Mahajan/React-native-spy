// src/renderer/utils/collectionExport.js
// ─── Collection export: Postman + Apidog (Apifox) ───
// Turns captured network requests into JSON files that import into the two API
// clients people actually reach for after inspecting traffic:
//
//   • Postman Collection v2.1 (`.postman_collection.json`) — the standard
//     format, also importable by Insomnia and the like.
//   • Apifox/Apidog project format (`.apifox.json`) — Apidog is the
//     international build of Apifox and shares the project data format; it can
//     additionally import a Postman v2.1 file directly.
//
// Both exporters share grouping (one folder per host) and request naming, so
// the two files mirror each other. Captured responses ride along as saved
// example responses (Postman) so the round-trip keeps what was observed.

import { bodyToString, headerEntries } from './curl'

const REQUEST_LIMIT = 2000

/* ─── Shared helpers ──────────────────────────────────────── */

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16)
  })
}

function headerValue(headers, name) {
  const lower = String(name).toLowerCase()
  for (const [k, v] of headerEntries(headers)) {
    if (String(k).toLowerCase() === lower) return String(v)
  }
  return null
}

function isJsonString(text) {
  if (typeof text !== 'string') return false
  const t = text.trim()
  if (!(t.startsWith('{') || t.startsWith('['))) return false
  try { JSON.parse(t); return true } catch { return false }
}

function hostOf(url) {
  try {
    return new URL(url).host || 'Other'
  } catch {
    return 'Other'
  }
}

// "GET /users?page=2" — path + query carry the identity; host lives in the
// folder name. Duplicate endpoint calls get a (2), (3) suffix rather than
// silently overwriting each other on import.
function requestNames(requests) {
  const counts = new Map()
  return requests.map((r) => {
    let path = r.url || ''
    try {
      const u = new URL(r.url)
      path = (u.pathname || '/') + (u.search || '')
    } catch { /* keep raw */ }
    const base = `${(r.method || 'GET').toUpperCase()} ${path}`
    const n = (counts.get(base) || 0) + 1
    counts.set(base, n)
    return n === 1 ? base : `${base} (${n})`
  })
}

// Index-aligned with the input list; folder objects differ per format, so each
// exporter maps items into its own shape first, then buckets them by host.
function groupItems(requests, makeItem) {
  const names = requestNames(requests)
  const groups = new Map()
  requests.forEach((r, i) => {
    const host = hostOf(r.url)
    if (!groups.has(host)) groups.set(host, [])
    groups.get(host).push(makeItem(r, names[i]))
  })
  // A single host doesn't earn a folder — the collection root is already that.
  if (groups.size === 1) return { item: [...groups.values()][0], folderCount: 1 }
  return {
    item: [...groups.entries()].map(([host, items]) => ({ folderName: host, items })),
    folderCount: groups.size,
  }
}

function capturedRequests(requests) {
  return (Array.isArray(requests) ? requests : []).filter((r) => r && r.url).slice(0, REQUEST_LIMIT)
}

function exportName({ deviceName } = {}) {
  return deviceName ? `${deviceName} — captured requests` : 'Captured requests'
}

/* ─── Postman Collection v2.1 ─────────────────────────────── */

function postmanUrl(req) {
  try {
    const u = new URL(req.url)
    return {
      raw: req.url,
      protocol: u.protocol.replace(/:$/, ''),
      host: u.hostname.split('.'),
      path: u.pathname.split('/').filter(Boolean),
      query: [...u.searchParams.entries()].map(([key, value]) => ({ key, value })),
    }
  } catch {
    return { raw: req.url || '', host: [], path: [] }
  }
}

function postmanBody(req) {
  const text = bodyToString(req.requestBody)
  if (!text) return undefined
  const contentType = headerValue(req.requestHeaders, 'content-type')
  if (contentType && /x-www-form-urlencoded/i.test(contentType)) {
    try {
      const urlencoded = [...new URLSearchParams(text).entries()].map(([key, value]) => ({ key, value }))
      if (urlencoded.length) return { mode: 'urlencoded', urlencoded }
    } catch { /* fall through to raw */ }
  }
  const looksJson = (contentType && /json/i.test(contentType)) || isJsonString(text)
  return {
    mode: 'raw',
    raw: text,
    ...(looksJson ? { options: { raw: { language: 'json' } } } : {}),
  }
}

function postmanItem(req, name) {
  const method = (req.method || 'GET').toUpperCase()
  const header = headerEntries(req.requestHeaders).map(([key, value]) => ({ key, value: String(value) }))
  const request = { method, header, url: postmanUrl(req) }
  const body = postmanBody(req)
  if (body) request.body = body

  const item = { name, request, response: [] }

  // The captured response becomes a saved example, so the collection documents
  // what the app actually received, not just what it asked for.
  if (!req.pending && req.status) {
    const responseText = bodyToString(req.responseBody)
    const contentType = headerValue(req.responseHeaders, 'content-type')
    item.response = [{
      name: `${req.status} — ${new Date(req.startTime || Date.now()).toISOString()}`,
      originalRequest: request,
      code: req.status,
      _postman_previewlanguage: isJsonString(responseText) || (contentType && /json/i.test(contentType)) ? 'json' : 'text',
      header: headerEntries(req.responseHeaders).map(([key, value]) => ({ key, value: String(value) })),
      cookie: [],
      body: responseText,
    }]
  }
  return item
}

export function toPostmanCollection(requests, opts = {}) {
  const list = capturedRequests(requests)
  const grouped = groupItems(list, postmanItem)
  return JSON.stringify({
    info: {
      _postman_id: uuid(),
      name: exportName(opts),
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      description: `Captured by React Native Spy — ${list.length} request${list.length === 1 ? '' : 's'}, exported ${new Date().toLocaleString()}`,
    },
    item: grouped.item.map((entry) => (entry.folderName
      ? { name: entry.folderName, item: entry.items }
      : entry)),
  }, null, 2)
}

/* ─── Apifox / Apidog project format ──────────────────────── */

function apifoxBody(req) {
  const text = bodyToString(req.requestBody)
  if (!text) return { type: 'none' }
  const contentType = headerValue(req.requestHeaders, 'content-type')
  if (contentType && /x-www-form-urlencoded/i.test(contentType)) {
    try {
      const params = [...new URLSearchParams(text).entries()].map(([pName, value]) => ({ name: pName, value, type: 'text' }))
      if (params.length) return { type: 'form-urlencoded', params }
    } catch { /* fall through */ }
  }
  if ((contentType && /json/i.test(contentType)) || isJsonString(text)) return { type: 'json', raw: text }
  if (contentType && /xml/i.test(contentType)) return { type: 'xml', raw: text }
  return { type: 'raw', raw: text }
}

function apifoxItem(req, name) {
  const method = (req.method || 'GET').toUpperCase()
  let pathname = '/'
  let queryParams = []
  try {
    const u = new URL(req.url)
    pathname = u.pathname || '/'
    queryParams = [...u.searchParams.entries()].map(([qName, value]) => ({
      name: qName, value, required: false, example: value,
    }))
  } catch { /* keep defaults */ }

  return {
    id: uuid(),
    type: 'api',
    name,
    method,
    path: pathname,
    request: {
      headers: headerEntries(req.requestHeaders).map(([hName, value]) => ({
        name: hName, value: String(value), required: true, example: String(value),
      })),
      queryParams,
      body: apifoxBody(req),
    },
    responses: [],
  }
}

export function toApifoxCollection(requests, opts = {}) {
  const list = capturedRequests(requests)
  const grouped = groupItems(list, apifoxItem)
  return JSON.stringify({
    info: {
      name: exportName(opts),
      schema: 'apifox-app/1.0.0 (https://apifox.com)',
      currentTime: new Date().toISOString(),
    },
    items: grouped.item.map((entry) => (entry.folderName
      ? { name: entry.folderName, items: entry.items }
      : entry)),
    models: [],
    schemas: [],
    environments: [],
  }, null, 2)
}

/* ─── File download ───────────────────────────────────────── */

function slug(s) {
  return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'device'
}

export function exportFilename(deviceName, ext) {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`
  const base = [deviceName ? slug(deviceName) : 'rnspy-network', stamp].join('-')
  return `${base}.${ext}`
}

export function downloadJson(filename, json) {
  if (typeof document === 'undefined') return false
  try {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
    return true
  } catch {
    return false
  }
}
