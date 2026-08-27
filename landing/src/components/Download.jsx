// src/components/Download.jsx
// Primary conversion block. Shows the three electron-builder targets from
// electron-builder.yml and the build-from-source path, since the project is
// MIT-licensed and running it locally is a legitimate first step.

import { Apple, Github, Monitor, Terminal } from 'lucide-react'
import Button from './Button'
import CodeBlock from './CodeBlock'
import DownloadButton from './DownloadButton'
import Logo from './Logo'
import Reveal from './Reveal'
import { PLATFORMS, PRODUCT } from '../data/content'
import './Download.css'

const PLATFORM_ICONS = { Apple, Monitor, Terminal }

const BUILD = `git clone ${PRODUCT.repo}
cd react-native-spy
npm install
npm run dev            # hot-reload development
npm run build:mac      # or build:win / build:linux`

export default function Download() {
  return (
    <section className="section download" id="download">
      <div className="container">
        <Reveal className="download__panel">
          <div className="download__inner">
            <span className="download__logo">
              <Logo size={36} />
            </span>

            <h2 className="download__title">Start debugging in about a minute</h2>
            <p className="download__sub">
              Free and MIT licensed. No account, no backend, no telemetry — the whole thing runs on
              your machine.
            </p>

            <div className="download__actions">
              <DownloadButton releasesUrl={`${PRODUCT.repo}/releases/latest`} />
              <Button size="lg" variant="secondary" href={PRODUCT.repo} icon={<Github size={17} />}>
                View source
              </Button>
            </div>

            <div className="download__platforms">
              {PLATFORMS.map((p) => {
                const Icon = PLATFORM_ICONS[p.icon]
                return (
                  <div key={p.name} className="download__plat">
                    <Icon size={20} />
                    <b>{p.name}</b>
                    <span>
                      {p.ext} · {p.arch}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="download__source">
              <CodeBlock code={BUILD} lang="bash" label="build from source" />
            </div>

            <p className="download__note">
              Requires Node 18+. Version {PRODUCT.version} · {PRODUCT.license} license · auto-updates via
              GitHub Releases.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
