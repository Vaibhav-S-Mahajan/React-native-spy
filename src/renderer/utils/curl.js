// src/renderer/utils/curl.js
// ─── Request copy-format utilities ───

function shellQuote(str) {
  return `'${String(str).replace(/'/g, `'\\''`)}'`
}

function psQuote(str) {
  return `"${String(str).replace(/"/g, '`"').replace(/\$/g, '`$')}"`
}

function headerEntries(headers) {
  if (!headers) return []
  if (typeof headers === 'object' && !Array.isArray(headers)) return Object.entries(headers)
  return []
}

function bodyToString(body) {
  if (!body) return ''
  if (typeof body === 'string') return body
  try { return JSON.stringify(body) } catch { return String(body) }
}

/* ─── cURL (bash) ─── */
export function toCurl(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const parts = [`curl ${shellQuote(req.url)}`]
  if (method !== 'GET') parts.push(`  -X ${method}`)
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  -H ${shellQuote(`${k}: ${v}`)}`)
  }
  const body = bodyToString(req.requestBody)
  if (body) parts.push(`  --data-raw ${shellQuote(body)}`)
  return parts.join(' \\\n')
}

/* ─── cURL (PowerShell) ─── */
export function toCurlPowerShell(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const parts = [`curl.exe ${psQuote(req.url)}`]
  if (method !== 'GET') parts.push(`  -X ${method}`)
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  -H ${psQuote(`${k}: ${v}`)}`)
  }
  const body = bodyToString(req.requestBody)
  if (body) parts.push(`  --data-raw ${psQuote(body)}`)
  return parts.join(' `\n')
}

/* ─── fetch() ─── */
export function toFetch(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const opts = {}
  if (method !== 'GET') opts.method = method
  if (req.requestHeaders && Object.keys(req.requestHeaders).length) {
    opts.headers = req.requestHeaders
  }
  const body = bodyToString(req.requestBody)
  if (body) opts.body = body
  const optsStr = Object.keys(opts).length ? `, ${JSON.stringify(opts, null, 2)}` : ''
  return `fetch(${JSON.stringify(req.url)}${optsStr})`
}

/* ─── Node.js fetch ─── */
export function toNodeFetch(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const lines = []
  lines.push(`const response = await fetch(${JSON.stringify(req.url)}, {`)
  if (method !== 'GET') lines.push(`  method: ${JSON.stringify(method)},`)
  if (req.requestHeaders && Object.keys(req.requestHeaders).length) {
    lines.push(`  headers: ${JSON.stringify(req.requestHeaders, null, 4).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')},`)
  }
  const body = bodyToString(req.requestBody)
  if (body) lines.push(`  body: ${JSON.stringify(body)},`)
  lines.push(`});`)
  lines.push(`const data = await response.json();`)
  return lines.join('\n')
}

/* ─── Axios ─── */
export function toAxios(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toLowerCase()
  const hasBody = method === 'post' || method === 'put' || method === 'patch'
  const body = bodyToString(req.requestBody)
  const headers = req.requestHeaders && Object.keys(req.requestHeaders).length
    ? req.requestHeaders : null

  const lines = []
  if (hasBody && body) {
    const config = headers ? `, {\n  headers: ${JSON.stringify(headers, null, 4).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')}\n}` : ''
    let bodyArg
    try { JSON.parse(body); bodyArg = body } catch { bodyArg = JSON.stringify(body) }
    lines.push(`const { data } = await axios.${method}(${JSON.stringify(req.url)}, ${bodyArg}${config});`)
  } else {
    const config = headers ? `, {\n  headers: ${JSON.stringify(headers, null, 4).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')}\n}` : ''
    lines.push(`const { data } = await axios.${method}(${JSON.stringify(req.url)}${config});`)
  }
  return lines.join('\n')
}

/* ─── HTTPie ─── */
export function toHttpie(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  const parts = [`http ${method} ${shellQuote(req.url)}`]
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  ${k}:${shellQuote(v)}`)
  }
  const body = bodyToString(req.requestBody)
  if (body) {
    try {
      const parsed = JSON.parse(body)
      for (const [k, v] of Object.entries(parsed)) {
        parts.push(`  ${k}=${JSON.stringify(v)}`)
      }
    } catch {
      parts.push(`  --raw ${shellQuote(body)}`)
    }
  }
  return parts.join(' \\\n')
}

/* ─── Raw HTTP ─── */
export function toRawHttp(req) {
  if (!req || !req.url) return ''
  const method = (req.method || 'GET').toUpperCase()
  let path = '/'
  let host = ''
  try {
    const u = new URL(req.url)
    path = u.pathname + u.search
    host = u.host
  } catch { /* fallback */ }
  const lines = [`${method} ${path} HTTP/1.1`]
  lines.push(`Host: ${host}`)
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    lines.push(`${k}: ${v}`)
  }
  const body = bodyToString(req.requestBody)
  if (body) {
    lines.push(`Content-Length: ${body.length}`)
    lines.push('')
    lines.push(body)
  }
  return lines.join('\r\n')
}

/* ─── HAR entry (JSON) ─── */
export function toHarEntry(req) {
  if (!req || !req.url) return '{}'
  const entry = {
    startedDateTime: req.startTime ? new Date(req.startTime).toISOString() : new Date().toISOString(),
    time: req.duration || 0,
    request: {
      method: (req.method || 'GET').toUpperCase(),
      url: req.url,
      httpVersion: 'HTTP/1.1',
      headers: headerEntries(req.requestHeaders).map(([name, value]) => ({ name, value: String(value) })),
      queryString: (() => {
        try {
          return Array.from(new URL(req.url).searchParams.entries()).map(([name, value]) => ({ name, value }))
        } catch { return [] }
      })(),
      bodySize: bodyToString(req.requestBody).length,
      postData: bodyToString(req.requestBody) ? {
        mimeType: (req.requestHeaders && (req.requestHeaders['content-type'] || req.requestHeaders['Content-Type'])) || 'application/octet-stream',
        text: bodyToString(req.requestBody),
      } : undefined,
    },
    response: {
      status: req.status || 0,
      statusText: '',
      httpVersion: 'HTTP/1.1',
      headers: headerEntries(req.responseHeaders).map(([name, value]) => ({ name, value: String(value) })),
      content: {
        size: req.size || 0,
        mimeType: (req.responseHeaders && (req.responseHeaders['content-type'] || req.responseHeaders['Content-Type'])) || '',
        text: bodyToString(req.responseBody),
      },
      bodySize: req.size || 0,
    },
    timings: {
      send: 0,
      wait: req.duration || 0,
      receive: 0,
    },
  }
  return JSON.stringify(entry, null, 2)
}

/* ─── Query string parameters as object ─── */
export function toQueryParams(req) {
  if (!req || !req.url) return '{}'
  try {
    const u = new URL(req.url)
    const params = {}
    for (const [k, v] of u.searchParams.entries()) params[k] = v
    return Object.keys(params).length ? JSON.stringify(params, null, 2) : '(no query parameters)'
  } catch {
    return '(invalid URL)'
  }
}

/* ─── Pretty-print body ─── */
export function prettyBody(body) {
  if (body == null) return ''
  if (typeof body !== 'string') {
    try { return JSON.stringify(body, null, 2) } catch { return String(body) }
  }
  try {
    const parsed = JSON.parse(body)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return body
  }
}

/* ─── Headers as formatted text ─── */
export function headersToText(headers) {
  if (!headers || !Object.keys(headers).length) return '(no headers)'
  return Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join('\n')
}

/* ─── Copy to clipboard ─── */
export function copyText(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return Promise.resolve(false)
  return navigator.clipboard.writeText(text ?? '').then(() => true).catch(() => false)
}
