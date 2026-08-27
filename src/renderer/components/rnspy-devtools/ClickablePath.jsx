// src/renderer/components/rnspy-devtools/ClickablePath.jsx
// Parses stack-trace-like strings and renders file references as clickable links
// that open in VS Code via the main-process IPC handler.

import { useState, useMemo, useCallback, Fragment } from 'react'
import toast from 'react-hot-toast'

// ── Stack location parser ────────────────────────────
// Handles:
//   "at App (src/App.tsx:42:10)"
//   "at src/App.tsx:42:10"
//   "src/App.tsx:42"
//   "/absolute/path/App.tsx:42:10"
//   "at Object.<anonymous> (/Users/x/project/src/App.tsx:42:10)"
//   "(src/App.tsx:42:10)"
//   "http://192.168.x.x:8081/index.bundle:12345:10"  (bundler URLs — extract path after port)
const FILE_LOC_RE =
  /(?:^|[()\s])([A-Za-z]:[\\/][^\s:()]+|\/?(?:[\w.@\-]+\/)*[\w.@\-]+\.\w{1,10})(?::(\d+))?(?::(\d+))?/g

export function parseLocations(text) {
  if (!text || typeof text !== 'string') return null
  const segments = []
  let lastIndex = 0

  FILE_LOC_RE.lastIndex = 0
  let match
  while ((match = FILE_LOC_RE.exec(text)) !== null) {
    const file = match[1]
    const line = match[2] ? parseInt(match[2], 10) : 1
    const col = match[3] ? parseInt(match[3], 10) : 1
    const fullMatch = match[0]

    // Skip URLs that look like http://, ws://, data:, etc.
    const beforeIdx = match.index
    const before2 = text.slice(Math.max(0, beforeIdx - 8), beforeIdx + fullMatch.indexOf(file))
    if (/https?:\/\/|wss?:\/\/|data:|blob:/i.test(before2)) continue

    // Skip node_modules internals and RN framework paths
    if (/node_modules/.test(file) && !/node_modules\/@/.test(file)) continue

    const matchStart = match.index + fullMatch.indexOf(file)
    const matchEnd = matchStart + file.length + (match[2] ? 1 + match[2].length : 0) + (match[3] ? 1 + match[3].length : 0)

    if (matchStart > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, matchStart) })
    }

    segments.push({
      type: 'link',
      value: text.slice(matchStart, matchEnd),
      file,
      line,
      col,
    })

    lastIndex = matchEnd
  }

  if (!segments.length) return null
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return segments
}

// ── ClickablePath component ──────────────────────────
// Renders a log message string with file:line:col links inline.
export default function ClickablePath({ text, color, openInEditor }) {
  const segments = useMemo(() => parseLocations(text), [text])

  const handleClick = useCallback((file, line, col) => {
    if (!openInEditor) return
    openInEditor(file, line, col).then((res) => {
      if (res && !res.ok && res.reason === 'not-found') {
        toast.error(
          "VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH",
          { duration: 5000 },
        )
      }
    })
  }, [openInEditor])

  if (!segments) {
    return <span>{text}</span>
  }

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>
        }
        return (
          <PathLink
            key={i}
            display={seg.value}
            file={seg.file}
            line={seg.line}
            col={seg.col}
            color={color}
            onClick={handleClick}
          />
        )
      })}
    </>
  )
}

function PathLink({ display, file, line, col, color, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onClick(file, line, col) }}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(file, line, col) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? 'var(--text-link)' : (color || 'var(--text-link)'),
        textDecoration: hover ? 'underline' : 'none',
        cursor: 'pointer',
        borderRadius: 2,
        transition: 'color 80ms ease',
      }}
      title={`Open ${file}:${line}:${col} in VS Code`}
    >
      {display}
    </span>
  )
}
