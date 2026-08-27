// src/renderer/components/rnspy-devtools/UpdateButton.jsx
//
// Toolbar affordance for app updates. Renders nothing at all unless there is
// something actionable — no "you're up to date" noise in a dense dev toolbar.
//
// States it renders:
//   available   → "Update to x.y.z"      (click = download, or open releases on mac)
//   downloading → inline progress bar
//   ready       → "Restart to update"    (click = quitAndInstall)
//   error       → "Update failed"        (click = retry)

import { useState } from 'react'
import { Download, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

import { useUpdater } from '../../hooks/useUpdater'

const PILL = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  height: 24,
  padding: '0 var(--space-2)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid transparent',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-ui)',
  lineHeight: 'var(--line-height-tight)',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'all 120ms ease',
}

export default function UpdateButton() {
  const {
    available, status, version, percent, canInstallInApp,
    error, download, install, check,
  } = useUpdater()
  const [busy, setBusy] = useState(false)

  // Nothing worth showing for idle / checking / up-to-date.
  if (!available) return null
  if (status !== 'available' && status !== 'downloading' && status !== 'ready' && status !== 'error') {
    return null
  }

  // ── Downloading: progress only, not clickable ──
  if (status === 'downloading') {
    return (
      <div
        title={`Downloading update${version ? ` ${version}` : ''} — ${percent}%`}
        style={{
          ...PILL,
          cursor: 'default',
          background: 'var(--status-info-bg)',
          color: 'var(--status-info-text)',
          borderColor: 'var(--status-info-border)',
        }}
      >
        <Download size={11} />
        <span>{percent}%</span>
        <span
          aria-hidden="true"
          style={{
            width: 44, height: 3, borderRadius: 2, overflow: 'hidden',
            background: 'var(--status-info-border)',
          }}
        >
          <span style={{
            display: 'block', height: '100%', width: `${percent}%`,
            background: 'currentColor', transition: 'width 200ms ease',
          }} />
        </span>
      </div>
    )
  }

  // ── Ready: restart to apply ──
  if (status === 'ready') {
    return (
      <button
        onClick={async () => {
          setBusy(true)
          const res = await install()
          if (!res?.ok) {
            setBusy(false)
            toast.error(res?.reason === 'dev-mode'
              ? 'Updates only work in the packaged app'
              : 'Could not install the update')
          }
        }}
        disabled={busy}
        title={`Version ${version || 'update'} downloaded — restart to apply`}
        style={{
          ...PILL,
          background: 'var(--status-success-bg)',
          color: 'var(--status-success-text)',
          borderColor: 'var(--status-success-border)',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <RefreshCw size={11} />
        <span>Restart to update</span>
      </button>
    )
  }

  // ── Error: click to retry ──
  if (status === 'error') {
    return (
      <button
        onClick={() => check()}
        title={error ? `${error} — click to retry` : 'Update check failed — click to retry'}
        style={{
          ...PILL,
          background: 'var(--status-danger-bg)',
          color: 'var(--status-danger-text)',
          borderColor: 'var(--status-danger-border)',
        }}
      >
        <AlertTriangle size={11} />
        <span>Update failed</span>
      </button>
    )
  }

  // ── Available ──
  // On unsigned macOS an in-app install is impossible, so the click opens the
  // releases page instead of starting a download that could never be applied.
  return (
    <button
      onClick={async () => {
        setBusy(true)
        const res = await download()
        setBusy(false)
        if (res?.ok && res.method === 'external') {
          toast.success('Opened the download page')
        } else if (!res?.ok) {
          toast.error(res?.reason === 'dev-mode'
            ? 'Updates only work in the packaged app'
            : 'Could not start the download')
        }
      }}
      disabled={busy}
      title={canInstallInApp
        ? `Version ${version} is available — click to download`
        : `Version ${version} is available — opens the download page`}
      style={{
        ...PILL,
        background: 'var(--accent-primary)',
        color: 'var(--accent-fg)',
        borderColor: 'transparent',
        fontWeight: 'var(--font-weight-semibold)',
        opacity: busy ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-primary)' }}
    >
      {canInstallInApp ? <Download size={11} /> : <ExternalLink size={11} />}
      <span>Update{version ? ` to ${version}` : ''}</span>
    </button>
  )
}
