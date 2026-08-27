// src/data/site.js
// Deployment identity for the site. Kept separate from content.js because
// vite.config.js imports this at config time, and content.js pulls in copy that
// has no business loading inside the Vite config.
//
// Change these four values and the Vite base path, canonical URL, OG tags,
// sitemap and JSON-LD all follow. Nothing else hardcodes the domain.

// Repo-relative base path. GitHub Pages serves a project site from
// /<repo>/, so this must match the repo name and keep both slashes.
// For a custom domain or a <user>.github.io repo, set this to '/'.
export const BASE = '/React-native-spy/'

export const ORIGIN = 'https://vaibhav-s-mahajan.github.io'

export const SITE = {
  base: BASE,
  origin: ORIGIN,
  // Canonical URL of the one page this site has.
  url: ORIGIN + BASE,
  // Social cards need an absolute URL and a raster image; SVG is not accepted
  // by Facebook, LinkedIn or X.
  ogImage: ORIGIN + BASE + 'og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'en_US',
  twitterCard: 'summary_large_image'
}

// Resolves a path inside public/ to an absolute URL for metadata.
export function absolute(path) {
  return ORIGIN + BASE + String(path).replace(/^\/+/, '')
}
