// src/renderer/components/panels/ConnectPanel.jsx
// Shown when no device has ever connected: the onboarding path. Extracted from
// RnspyDevtoolsPage (where it lived as `ConnectSnippet`) so the page holds state
// and this holds presentation.
//
// Two routes to a connected app, ranked: the automatic setup button, then the
// copyable snippet for anyone who would rather wire it up by hand.

import { useMemo, useState } from 'react'
import { Check, Copy, Wand2, Wifi } from 'lucide-react'

import { buildRnClient } from '../../../shared/rnClient'
import Logo from '../rnspy-devtools/Logo'
import { Button } from '../ui'

const STEPS = ['Copy snippet', 'Paste in index.js', 'Reload app']

export default function ConnectPanel({ host, port, onAutoSetup }) {
  const [copied, setCopied] = useState(false)
  const snippet = useMemo(() => buildRnClient({ host, port }), [host, port])

  const copy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex min-h-0 flex-1 justify-center overflow-y-auto bg-panel px-6 py-8">
      <div className="animate-slide-up w-full max-w-[620px]">
        <div className="mb-4 flex items-center gap-3">
          <Logo size={22} />
          <div className="min-w-0">
            <h2 className="font-ui text-md font-semibold text-fg leading-tight">
              Connect your app
            </h2>
            <p className="font-ui text-sm text-faint leading-tight">
              Paste near the top of your React Native entry file
            </p>
          </div>
          <div className="flex-1" />
          <Button
            variant="primary"
            size="lg"
            onClick={onAutoSetup}
            title="Pick your project folder and set up the connection automatically"
          >
            <Wand2 size={12} aria-hidden="true" />
            Set it up for me
          </Button>
        </div>

        {/* Ordered because the steps are sequential, not a set. */}
        <ol className="mb-4 flex gap-2">
          {STEPS.map((text, i) => (
            <li
              key={text}
              className="flex flex-1 items-center gap-2 rounded-md border border-subtle bg-card px-3 py-2 font-ui text-xs text-muted leading-tight"
            >
              <span
                aria-hidden="true"
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-info font-mono text-[10px] font-semibold text-info-fg"
              >
                {i + 1}
              </span>
              {text}
            </li>
          ))}
        </ol>

        <div className="overflow-hidden rounded-lg border border-subtle">
          <div className="flex items-center justify-between border-b border-subtle bg-card px-3 py-2">
            <span className="font-ui text-xs font-medium text-faint">rnClient.js</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copy}
              className={copied ? 'text-success-fg' : undefined}
            >
              {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          {/* max-h is arbitrary by necessity: the snippet is ~1100 lines, so it
              needs a fixed viewport rather than a token-scale height. */}
          <pre className="m-0 max-h-[360px] select-text overflow-auto bg-code p-3 font-mono text-xs text-muted leading-normal">
            {snippet}
          </pre>
        </div>

        <p className="mt-3 flex items-center gap-2 font-ui text-xs text-faint leading-tight">
          <Wifi size={11} className="shrink-0 text-faint" aria-hidden="true" />
          <span>
            Same network required · connects to{' '}
            <code className="rounded-sm bg-code px-1 py-px font-mono text-xs text-muted">
              ws://{host}:{port}
            </code>
          </span>
        </p>
      </div>
    </div>
  )
}
