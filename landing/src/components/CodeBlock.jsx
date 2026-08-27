// src/components/CodeBlock.jsx
// A small code panel with a copy button and a deliberately minimal highlighter.
//
// Why hand-rolled instead of Prism/Shiki: the page shows a handful of short
// snippets in three shapes (bash, js, plain text). Pulling in a full highlighter
// would add more bundle weight than the entire rest of the site. This tokenizer
// handles comments, strings, keywords and numbers, which is all these snippets
// contain.

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import './CodeBlock.css'

const KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|if|else|await|async|new|class|extends|default|true|false|null|undefined)\b/

export default function CodeBlock({ code, lang = 'text', label }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  // Clear the pending reset if the component unmounts mid-timeout.
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Clipboard can be blocked (insecure context, denied permission). Fall
      // back to a hidden textarea + execCommand so the button still works.
      const ta = document.createElement('textarea')
      ta.value = code
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={`code code--${lang}`}>
      <div className="code__bar">
        <span className="code__lang">{label || lang}</span>
        <button
          className={`code__copy ${copied ? 'code__copy--done' : ''}`}
          onClick={copy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code__pre">
        <code>{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}

// Splits each line into spans. Order matters: comments and strings win over
// keywords, so a keyword inside a string is not re-coloured.
function highlight(code, lang) {
  if (lang === 'text') return code

  return code.split('\n').map((line, li) => (
    <span key={li}>
      {tokenizeLine(line, lang)}
      {li < code.split('\n').length - 1 ? '\n' : ''}
    </span>
  ))
}

function tokenizeLine(line, lang) {
  // Whole-line comment: no further parsing needed.
  const commentAt = line.indexOf(lang === 'bash' ? '#' : '//')
  if (commentAt === 0) {
    return <span className="tok-comment">{line}</span>
  }

  const head = commentAt > 0 ? line.slice(0, commentAt) : line
  const tail = commentAt > 0 ? line.slice(commentAt) : null

  // Split on quoted strings first, then keyword/number-tint the rest.
  const parts = head.split(/('[^']*'|"[^"]*"|`[^`]*`)/g).filter((p) => p !== '')

  const nodes = parts.map((part, i) => {
    if (/^['"`]/.test(part)) {
      return (
        <span key={i} className="tok-string">
          {part}
        </span>
      )
    }
    return <span key={i}>{tintWords(part)}</span>
  })

  return (
    <>
      {nodes}
      {tail ? <span className="tok-comment">{tail}</span> : null}
    </>
  )
}

function tintWords(text) {
  return text.split(/(\s+|[(){}[\],;:=<>|&.]+)/g).map((word, i) => {
    if (KEYWORDS.test(word)) {
      return (
        <span key={i} className="tok-keyword">
          {word}
        </span>
      )
    }
    if (/^\d[\d_.]*$/.test(word)) {
      return (
        <span key={i} className="tok-number">
          {word}
        </span>
      )
    }
    return word
  })
}
