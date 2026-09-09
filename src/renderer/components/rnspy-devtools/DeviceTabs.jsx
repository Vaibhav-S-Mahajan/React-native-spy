// src/renderer/components/rnspy-devtools/DeviceTabs.jsx
// One tab per connected (or previously connected) device.
//
// Two fixes beyond the restyle:
//   - each tab was a clickable <div>; it is now a real <button>, so it is
//     keyboard reachable and announced correctly
//   - the close button's hover-reveal used .device-tab-row/.device-tab-btn rules
//     in theme.css; it now uses Tailwind's group-hover, so the behaviour lives
//     with the markup. It is also revealed on focus-within, otherwise the button
//     was invisible to keyboard users even while focused.

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

import { Button, Modal, ModalBody, ModalFooter } from '../ui'
import cn from '../ui/cn'

export default function DeviceTabs({ devices, activeKey, onSelect, onClose }) {
  const [pendingClose, setPendingClose] = useState(null)
  if (!devices.length) return null

  const pendingDevice = devices.find((d) => d.key === pendingClose)
  const pendingLabel = pendingDevice?.name || pendingDevice?.key || 'this device'

  const confirmClose = () => {
    if (pendingClose != null) onClose(pendingClose)
    setPendingClose(null)
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Connected devices"
        className="flex h-devicebar shrink-0 items-stretch overflow-x-auto overflow-y-hidden border-b border-default bg-sidebar"
      >
        {devices.map((d) => {
          const active = d.key === activeKey
          const label = d.name || d.key
          return (
            <div
              key={d.key}
              className={cn(
                'group relative flex min-w-[120px] max-w-[280px] shrink-0 items-center gap-2',
                'border-r border-subtle border-b-2 pl-3 pr-2',
                'transition-colors duration-150',
                active ? 'border-b-accent bg-panel' : 'border-b-transparent hover:bg-card',
              )}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(d.key)}
                title={d.platform ? `${label} · ${d.platform}` : label}
                className="flex min-w-0 flex-1 items-center gap-2 self-stretch bg-transparent text-left focus-ring"
              >
                {/* Online indicator. The glow makes "live" readable at a glance
                    without adding a second colour to the row. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-[7px] w-[7px] shrink-0 rounded-full transition-all duration-300',
                    d.online ? 'bg-success-fg shadow-[0_0_4px_var(--status-success-text)]' : 'bg-faint',
                  )}
                />
                <span className="sr-only">{d.online ? 'Online' : 'Offline'}</span>

                <span
                  className={cn(
                    'cell-truncate flex-1 font-ui text-sm leading-tight',
                    active ? 'font-semibold text-fg' : 'font-medium text-muted',
                  )}
                >
                  {label}
                </span>
              </button>

              <span
                title={`${d.networkRequests.length} captured requests`}
                className={cn(
                  'shrink-0 rounded-sm border border-subtle bg-card px-1.5 py-px font-mono text-[10px] tabular-nums leading-tight',
                  active ? 'text-muted' : 'text-faint',
                )}
              >
                {d.networkRequests.length}
              </span>

              {/* Revealed on hover OR keyboard focus within the tab. */}
              <button
                type="button"
                onClick={() => setPendingClose(d.key)}
                aria-label={`Close ${label}`}
                title="Close"
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm border border-transparent bg-transparent text-faint opacity-0 transition-opacity duration-100 hover:border-default hover:bg-card hover:text-fg focus-ring group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>

      {pendingClose != null && (
        <Modal size="sm" onClose={() => setPendingClose(null)} labelledBy="close-device-title">
          <ModalBody className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warn text-warn-fg"
              >
                <AlertTriangle size={16} />
              </span>
              <h2 id="close-device-title" className="font-ui text-base font-semibold text-fg">
                Close {pendingLabel}?
              </h2>
            </div>
            <p className="font-ui text-sm text-faint leading-normal">
              All captured data for this device — network requests, WebSocket frames,
              console logs and server logs — will be lost. This cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" size="lg" onClick={() => setPendingClose(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="lg" onClick={confirmClose}>
              Close device
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}
