import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE } from './src/data/site.js'

// GitHub Pages serves this project site from a subpath, so every asset URL has
// to be prefixed. `base` is the single place that lives — SITE.base is also what
// the prerender step uses to build canonical and og:image URLs, so the two can
// never drift.
export default defineConfig({
  base: SITE.base,
  plugins: [react()],
  server: { port: 5180, open: false },
  build: {
    // Pages sits behind a CDN that handles compression; a slightly larger single
    // bundle beats extra round-trips for a one-page site.
    assetsInlineLimit: 2048,
    reportCompressedSize: false
  }
})
