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
import cn from '../ui/cn'

// Shared pill geometry. Not the Button primitive: this is a status affordance
// whose colour IS its meaning, and one state (downloading) is not a button at all.
const PILL =
  'inline-flex h-control-sm shrink-0 items-center gap-1 whitespace-nowrap rounded-md ' +
  'border px-2 font-ui text-2xs font-medium leading-tight ' +
  'transition-colors duration-150 focus-ring disabled:opacity-60'

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
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Downloading update${version ? ` ${version}` : ''}`}
        title={`Downloading update${version ? ` ${version}` : ''} — ${percent}%`}
        className={cn(PILL, 'cursor-default border-info-edge bg-info text-info-fg')}
      >
        <Download size={11} aria-hidden="true" />
        <span className="tabular-nums">{percent}%</span>
        <span
          aria-hidden="true"
          className="h-[3px] w-11 overflow-hidden rounded-sm bg-info-edge"
        >
          {/* Width is the live value — inherently dynamic, so it stays inline. */}
          <span
            className="block h-full bg-current transition-[width] duration-200"
            style={{ width: `${percent}%` }}
          />
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
        type="button"
        title={`Version ${version || 'update'} downloaded — restart to apply`}
        className={cn(PILL, 'border-success-edge bg-success text-success-fg')}
      >
        <RefreshCw size={11} aria-hidden="true" />
        <span>Restart to update</span>
      </button>
    )
  }

  // ── Error: click to retry ──
  if (status === 'error') {
    return (
      <button
        onClick={() => check()}
        type="button"
        title={error ? `${error} — click to retry` : 'Update check failed — click to retry'}
        className={cn(PILL, 'border-danger-edge bg-danger text-danger-fg')}
      >
        <AlertTriangle size={11} aria-hidden="true" />
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
      type="button"
      title={canInstallInApp
        ? `Version ${version} is available — click to download`
        : `Version ${version} is available — opens the download page`}
      className={cn(PILL, 'border-transparent bg-accent font-semibold text-accent-fg hover:bg-accent-hover')}
    >
      {canInstallInApp
        ? <Download size={11} aria-hidden="true" />
        : <ExternalLink size={11} aria-hidden="true" />}
      <span>Update{version ? ` to ${version}` : ''}</span>
    </button>
  )
}
