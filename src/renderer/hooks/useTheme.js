// src/renderer/hooks/useTheme.js
//
// Theme selection, persistence, and application.
//
// The active theme is a `data-theme` attribute on <html>, which every palette
// in styles/themes.css keys off. Because themes only override CSS custom
// properties (never rules), switching can change appearance but never layout.
//
// Applied to <html> rather than <body> or a React root so the attribute is set
// before React mounts (see applyStoredTheme, called from main.jsx) — otherwise
// the first paint uses the default palette and visibly flips.

import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'rnspyDevtoolsTheme'
export const DEFAULT_THEME = 'graphite'

/**
 * The theme registry. `swatch` is [surface, accent, secondary] and drives the
 * picker previews, so a new theme needs no picker changes — add it here plus a
 * [data-theme] block in styles/themes.css.
 */
export const THEMES = [
  {
    id: 'graphite',
    label: 'Graphite',
    blurb: 'Neutral greys, green accent',
    dark: true,
    swatch: ['#101013', '#22c55e', '#85858f'],
  },
  {
    id: 'midnight',
    label: 'Midnight',
    blurb: 'Blue-black, indigo accent',
    dark: true,
    swatch: ['#0f111a', '#6d7cff', '#4ade9f'],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    blurb: 'Phosphor green, mono, square',
    dark: true,
    swatch: ['#0a0d0a', '#00ff66', '#5cd8f7'],
  },
  {
    id: 'aurora',
    label: 'Aurora',
    blurb: 'Violet accent, soft glow',
    dark: true,
    swatch: ['#121423', '#a78bfa', '#4fe8c0'],
  },
  {
    id: 'paper',
    label: 'Paper',
    blurb: 'Light theme, warm off-white',
    dark: false,
    swatch: ['#fffefc', '#1f7a45', '#a25d06'],
  },
  {
    id: 'neonbrut',
    label: 'Neon Brut',
    blurb: 'Brutalist, magenta and lime',
    dark: true,
    swatch: ['#16161d', '#ff2e97', '#b6ff3d'],
  },
  {
    id: 'claude',
    label: 'Claude',
    blurb: 'Warm dark, amber-copper accent',
    dark: true,
    swatch: ['#1a1917', '#d97757', '#7dd87d'],
  },
  {
    id: 'mono',
    label: 'Mono',
    blurb: 'Black and white minimal',
    dark: true,
    swatch: ['#111111', '#ffffff', '#777777'],
  },
  {
    id: 'mono-light',
    label: 'Mono Light',
    blurb: 'White and black minimal',
    dark: false,
    swatch: ['#f5f5f5', '#000000', '#888888'],
  },
  {
    id: 'neo-brut',
    label: 'Neo Brut',
    blurb: 'Cream, black ink, hard shadows',
    dark: false,
    swatch: ['#FFFDF5', '#FF6B6B', '#FFD93D'],
  },
  {
    id: 'chrome-devtools',
    label: 'Chrome DevTools',
    blurb: 'Chrome DevTools dark palette',
    dark: true,
    swatch: ['#1e1e1e', '#0e639c', '#858585'],
  },
]

const VALID = new Set(THEMES.map((t) => t.id))

export function isValidTheme(id) {
  return VALID.has(id)
}

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

function readStored() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(THEME_KEY)
    return isValidTheme(raw) ? raw : DEFAULT_THEME
  } catch {
    // localStorage can throw in restricted contexts — never let that break boot.
    return DEFAULT_THEME
  }
}

/**
 * Write the attribute. Kept separate from React so it can run pre-mount.
 * Also sets `color-scheme` so native form controls, scrollbars and the
 * caret match the theme instead of always rendering dark.
 */
function setAttr(id) {
  const el = document.documentElement
  el.setAttribute('data-theme', id)
  el.style.colorScheme = getTheme(id).dark ? 'dark' : 'light'
}

/**
 * Call once, synchronously, before React renders. Prevents a flash of the
 * default palette on launch.
 */
export function applyStoredTheme() {
  if (typeof document === 'undefined') return DEFAULT_THEME
  const id = readStored()
  setAttr(id)
  return id
}

export function useTheme() {
  const [theme, setThemeState] = useState(readStored)
  // Hover-preview target. When set, the app renders in that theme without
  // committing, so users can browse palettes and back out.
  const [preview, setPreview] = useState(null)

  const active = preview || theme

  // Apply whichever theme is active (previewed or committed).
  useEffect(() => {
    setAttr(active)
  }, [active])

  // Persist only real selections, never previews.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* non-fatal — the theme still applies for this session */
    }
  }, [theme])

  const setTheme = useCallback((id) => {
    if (!isValidTheme(id)) return
    // Enable colour transitions for the duration of the switch only. Leaving
    // them on permanently would animate every hover in a dense table.
    const el = document.documentElement
    el.classList.add('theme-switching')
    window.setTimeout(() => el.classList.remove('theme-switching'), 260)
    setPreview(null)
    setThemeState(id)
  }, [])

  // Keep multiple windows in sync if one changes the theme.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_KEY && isValidTheme(e.newValue)) setThemeState(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return {
    theme,
    active,
    setTheme,
    previewTheme: setPreview,
    clearPreview: () => setPreview(null),
    themes: THEMES,
    meta: getTheme(active),
  }
}
