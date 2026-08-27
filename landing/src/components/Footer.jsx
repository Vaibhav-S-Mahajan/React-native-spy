// src/components/Footer.jsx
// Site footer. Doc links point at the real files in the repo's docs/ folder.

import { ArrowUp, Github } from 'lucide-react'
import Logo from './Logo'
import { PRODUCT } from '../data/content'
import './Footer.css'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#setup' },
      { label: 'Compare', href: '#compare' },
      { label: 'Download', href: '#download' }
    ]
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Getting started', href: `${PRODUCT.repo}/blob/main/docs/getting-started.md` },
      { label: 'Features walkthrough', href: `${PRODUCT.repo}/blob/main/docs/features.md` },
      { label: 'Client SDK', href: `${PRODUCT.repo}/blob/main/docs/client-sdk.md` },
      { label: 'Configuration', href: `${PRODUCT.repo}/blob/main/docs/configuration.md` }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'Architecture', href: `${PRODUCT.repo}/blob/main/docs/architecture.md` },
      { label: 'Troubleshooting', href: `${PRODUCT.repo}/blob/main/docs/troubleshooting.md` },
      { label: 'Report an issue', href: `${PRODUCT.repo}/issues` },
      { label: 'Releases', href: `${PRODUCT.repo}/releases` }
    ]
  }
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <Logo size={24} />
              {PRODUCT.name}
            </div>
            <p className="footer__about">
              A lightweight Electron remote debugger for React Native. Console, network, WebSocket,
              storage and WatermelonDB inspection across multiple devices — with nothing added to your
              dependency tree.
            </p>
            <div className="footer__socials">
              <a
                className="footer__social"
                href={PRODUCT.repo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub repository"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(/^https?:/.test(link.href)
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer__bottom">
          <span>
            {PRODUCT.license} licensed · v{PRODUCT.version} · Built with Electron, React and{' '}
            <code>ws</code>
          </span>
          <a className="footer__top" href="#top">
            <ArrowUp size={13} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
