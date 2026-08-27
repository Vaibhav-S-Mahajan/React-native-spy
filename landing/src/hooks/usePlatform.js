// src/hooks/usePlatform.js
// Detects the visitor's OS so the download button can lead with the right build.
//
// Deliberately conservative: it only distinguishes macOS / Windows / Linux, and
// returns null when it cannot tell. A wrong guess here is worse than no guess,
// because the button label becomes a claim about the visitor's machine.
//
// CPU architecture is not detected. userAgentData.getHighEntropyValues() can
// report it, but it is Chromium-only and Rosetta muddies the answer on macOS,
// so both Apple Silicon and Intel builds are offered explicitly in the menu.

import { useEffect, useState } from 'react'

export const PLATFORMS = {
  mac: {
    id: 'mac',
    label: 'macOS',
    note: 'Apple Silicon & Intel',
    targets: [
      { label: 'macOS · Apple Silicon', ext: '.dmg', arch: 'arm64' },
      { label: 'macOS · Intel', ext: '.dmg', arch: 'x64' }
    ]
  },
  windows: {
    id: 'windows',
    label: 'Windows',
    note: '64-bit installer',
    targets: [{ label: 'Windows · Installer', ext: '.exe', arch: 'x64' }]
  },
  linux: {
    id: 'linux',
    label: 'Linux',
    note: 'AppImage, 64-bit',
    targets: [{ label: 'Linux · AppImage', ext: '.AppImage', arch: 'x64' }]
  }
}

export function usePlatform() {
  // Starts null so the first render is platform-neutral. This avoids a flash of
  // the wrong OS name, and is also what a crawler or a non-JS visitor sees.
  const [platform, setPlatform] = useState(null)

  useEffect(() => {
    setPlatform(detect())
  }, [])

  return platform
}

function detect() {
  if (typeof navigator === 'undefined') return null

  // userAgentData is the non-deprecated path where it exists.
  const hinted = navigator.userAgentData?.platform
  const raw = hinted || navigator.platform || navigator.userAgent || ''
  const s = raw.toLowerCase()

  // Order matters: check Android before Linux, since Android UAs contain both
  // and neither desktop build applies.
  if (s.includes('android')) return null
  if (s.includes('mac') || s.includes('darwin')) return PLATFORMS.mac
  if (s.includes('win')) return PLATFORMS.windows
  if (s.includes('linux') || s.includes('x11')) return PLATFORMS.linux

  return null
}
