// src/entry-server.jsx
// Server entry used only by the prerender step. It renders the page to a static
// HTML string and derives the structured data from the same content module the
// page renders from, so the JSON-LD can never disagree with the visible copy.
//
// This is prerendering, not SSR: there is no server at runtime. The output is
// baked into dist/index.html at build time and served as a static file.

import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { FAQ, PANELS, PRODUCT } from './data/content.js'
import { SITE } from './data/site.js'

export function render() {
  return {
    appHtml: renderToString(<App />),
    jsonLd: buildJsonLd()
  }
}

// Two graphs crawlers actually act on: SoftwareApplication drives the app-style
// result, FAQPage is eligible for the expandable FAQ treatment. Both are built
// from content.js rather than hand-maintained.
function buildJsonLd() {
  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: PRODUCT.name,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Debugger',
    operatingSystem: 'macOS, Windows, Linux',
    description: PRODUCT.description,
    softwareVersion: PRODUCT.version,
    url: SITE.url,
    downloadUrl: `${PRODUCT.repo}/releases/latest`,
    installUrl: `${PRODUCT.repo}/releases/latest`,
    codeRepository: PRODUCT.repo,
    license: 'https://opensource.org/licenses/MIT',
    isAccessibleForFree: true,
    screenshot: SITE.ogImage,
    featureList: PANELS.map((p) => `${p.name} inspector — ${p.summary}`),
    // Free and open source. Schema.org wants an Offer even at zero cost,
    // otherwise the price is treated as unknown rather than free.
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Person',
      name: 'Vaibhav Mahajan'
    }
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  }

  return [softwareApplication, faqPage]
}
