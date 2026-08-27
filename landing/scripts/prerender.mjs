// scripts/prerender.mjs
// Turns the client-rendered build into static HTML.
//
// Why this exists: the page is a React SPA, so `vite build` alone ships an empty
// <div id="root">. Google can execute JS, but social scrapers (Slack, X,
// LinkedIn, Discord) and most other crawlers cannot — they would see a blank
// page with no copy to index and no card to render. Prerendering bakes the real
// markup into dist/index.html, so the HTML is complete before any JS runs.
//
// Flow (see the `build` script in package.json):
//   1. vite build              → dist/ with the client bundle + shell index.html
//   2. vite build --ssr ...    → .ssr-dist/entry-server.js (temp, gitignored)
//   3. this script             → render to a string, inject markup + head tags
//
// The client then hydrates that markup instead of mounting from scratch.

import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const ssrDist = resolve(root, '.ssr-dist')

const APP_MARKER = '<!--PRERENDER_APP-->'
const HEAD_MARKER = '<!--PRERENDER_HEAD-->'

// Below this, a "successful" render almost certainly means a component bailed
// on the server. Failing the build beats silently publishing an empty page.
const MIN_HTML_BYTES = 5000

async function main() {
  // Node needs a file:// URL to import an absolute path on Windows.
  const { render } = await import(pathToFileURL(resolve(ssrDist, 'entry-server.js')).href)
  const { SITE } = await import(pathToFileURL(resolve(root, 'src/data/site.js')).href)
  const { PRODUCT } = await import(pathToFileURL(resolve(root, 'src/data/content.js')).href)

  const template = await readFile(resolve(dist, 'index.html'), 'utf8')

  for (const marker of [APP_MARKER, HEAD_MARKER]) {
    if (!template.includes(marker)) {
      throw new Error(`index.html is missing the ${marker} placeholder.`)
    }
  }

  const { appHtml, jsonLd } = render()

  if (!appHtml || appHtml.length < MIN_HTML_BYTES) {
    throw new Error(
      `Prerendered HTML is only ${appHtml?.length ?? 0} bytes, expected at least ` +
        `${MIN_HTML_BYTES}. A component probably threw during server rendering.`
    )
  }

  const html = template
    .replace(HEAD_MARKER, headTags({ SITE, PRODUCT, jsonLd }))
    .replace(APP_MARKER, appHtml)

  await writeFile(resolve(dist, 'index.html'), html, 'utf8')

  // Pages serves 404.html for any unknown path. Reusing the rendered page means
  // a stale or mistyped URL still lands on the site instead of a bare 404.
  await writeFile(resolve(dist, '404.html'), html, 'utf8')

  await writeFile(resolve(dist, 'robots.txt'), robotsTxt(SITE), 'utf8')
  await writeFile(resolve(dist, 'sitemap.xml'), sitemap(SITE), 'utf8')

  // The SSR bundle is scaffolding, not published output.
  await rm(ssrDist, { recursive: true, force: true })

  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1)
  console.log(`prerender: dist/index.html → ${kb} kB of static HTML`)
  console.log('prerender: wrote 404.html, robots.txt, sitemap.xml')
}

// Everything that needs an absolute URL, or that would be error-prone to keep
// in sync by hand. Static tags stay in index.html.
function headTags({ SITE, PRODUCT, jsonLd }) {
  const title = 'React Native Spy — Remote Debugger for React Native'
  const description = PRODUCT.description
  const imageAlt =
    'The React Native Spy debugger window showing the Network, Console and WebSocket panels'

  const lines = [
    `<link rel="canonical" href="${SITE.url}" />`,
    '',
    '<!-- Open Graph -->',
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(PRODUCT.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${SITE.url}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:image" content="${SITE.ogImage}" />`,
    `<meta property="og:image:width" content="${SITE.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${SITE.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    '',
    '<!-- Twitter / X -->',
    `<meta name="twitter:card" content="${SITE.twitterCard}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${SITE.ogImage}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
    '',
    '<!-- Structured data -->',
    ...jsonLd.map((graph) => `<script type="application/ld+json">${ldJson(graph)}</script>`)
  ]

  // First line inherits the marker's indentation; the rest need their own.
  return lines.map((line, i) => (i === 0 || line === '' ? line : `    ${line}`)).join('\n')
}

function robotsTxt(SITE) {
  return `User-agent: *
Allow: /

Sitemap: ${SITE.origin}${SITE.base}sitemap.xml
`
}

function sitemap(SITE) {
  // One page, so no <lastmod>: a hardcoded date goes stale immediately, and
  // overstating freshness is worse than omitting the field.
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}

// `</script>` inside a JSON string would close the script element early, so the
// opening bracket is escaped. Valid JSON, inert HTML.
function ldJson(graph) {
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exitCode = 1
})
