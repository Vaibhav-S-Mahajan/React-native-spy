// src/renderer/hooks/useFocusTrap.js
// Dialog focus management, extracted from IssuesModal (which was the only modal
// doing this correctly) so every modal and drawer gets the same behaviour:
//
//   - focus moves into the dialog on open
//   - Tab / Shift+Tab cycle within it instead of escaping to the page behind
//   - Escape closes
//   - focus returns to whatever opened it on close
//
// The return target is passed in explicitly rather than read from
// document.activeElement at mount: clicking a button does not necessarily focus
// it, so capturing would sometimes restore focus to <body>.

import { useEffect } from 'react'

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * @param {Object} opts
 * @param {React.RefObject} opts.containerRef  element that owns the trap
 * @param {Function}        opts.onClose       called on Escape
 * @param {React.RefObject} [opts.returnFocusRef] element to refocus on unmount
 * @param {React.RefObject} [opts.initialFocusRef] element to focus on mount
 * @param {boolean}         [opts.active=true] disable to suspend the trap
 */
export function useFocusTrap({
  containerRef,
  onClose,
  returnFocusRef,
  initialFocusRef,
  active = true,
}) {
  // Focus in, then restore on the way out.
  useEffect(() => {
    if (!active) return undefined
    const restore = returnFocusRef?.current || document.activeElement

    const target = initialFocusRef?.current
      || containerRef.current?.querySelector(FOCUSABLE)
      || containerRef.current
    target?.focus?.()

    return () => {
      if (restore && typeof restore.focus === 'function') restore.focus()
    }
    // Refs are stable; re-running on .current would fight the restore.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // Escape to dismiss, Tab to cycle.
  useEffect(() => {
    if (!active) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return

      const root = containerRef.current
      if (!root) return
      const items = root.querySelectorAll(FOCUSABLE)
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onClose])
}

export default useFocusTrap
