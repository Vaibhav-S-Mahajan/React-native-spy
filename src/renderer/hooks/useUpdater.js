// src/renderer/hooks/useUpdater.js
//
// Thin subscription over the main-process updater. All real state lives in the
// main process (src/main/updater.js); this hook mirrors what gets pushed on the
// `updater:state` channel and exposes the three actions the toolbar needs.

import { useCallback, useEffect, useState } from 'react'

const INITIAL = {
  status: 'idle',
  currentVersion: '',
  version: null,
  releaseNotes: null,
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  error: null,
  canInstallInApp: true,
  manualDownloadUrl: '',
}

export function useUpdater() {
  const updater = typeof window !== 'undefined' ? window.electron?.updater : null
  const [state, setState] = useState(INITIAL)

  useEffect(() => {
    if (!updater) return undefined
    let alive = true

    // Pull once so a late-mounting renderer picks up a check that already ran.
    updater.getState().then((s) => { if (alive && s) setState(s) }).catch(() => {})

    const off = updater.onState((s) => { if (alive) setState(s) })
    return () => { alive = false; off?.() }
  }, [updater])

  const check = useCallback(
    (opts) => updater?.check(opts) ?? Promise.resolve({ ok: false }),
    [updater],
  )
  const download = useCallback(
    () => updater?.download() ?? Promise.resolve({ ok: false }),
    [updater],
  )
  const install = useCallback(
    () => updater?.install() ?? Promise.resolve({ ok: false }),
    [updater],
  )
  const openReleases = useCallback(
    () => updater?.openReleases() ?? Promise.resolve({ ok: false }),
    [updater],
  )

  return { ...state, available: !!updater, check, download, install, openReleases }
}
