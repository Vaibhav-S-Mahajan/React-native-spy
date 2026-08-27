// src/renderer/hooks/useVirtualRows.js
// High-performance virtual scrolling for large lists.
// Uses RAF-throttled scroll, ResizeObserver for viewport changes,
// stable refs to avoid re-render cascades.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const OVERSCAN = 8

/**
 * useVirtualRows — fixed-height row virtualization.
 *
 * @param {Object} opts
 * @param {React.RefObject} opts.scrollRef  — ref to the scroll container
 * @param {number} opts.totalRows           — total number of items
 * @param {number} opts.rowHeight           — fixed height per row (px)
 * @param {boolean} [opts.stickyBottom]     — auto-scroll to bottom on new items
 *
 * @returns {{ startIdx, endIdx, topSpacer, bottomSpacer, totalHeight, onScroll, scrollToBottom }}
 */
export function useVirtualRows({ scrollRef, totalRows, rowHeight, stickyBottom = false }) {
  const [range, setRange] = useState({ startIdx: 0, endIdx: 60 })
  const rafRef = useRef(null)
  const stickRef = useRef(stickyBottom)
  const prevTotalRef = useRef(totalRows)

  const compute = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollTop = el.scrollTop
    const viewportHeight = el.clientHeight
    if (viewportHeight === 0) return

    const rawStart = Math.floor(scrollTop / rowHeight)
    const rawEnd = Math.ceil((scrollTop + viewportHeight) / rowHeight)
    const startIdx = Math.max(0, rawStart - OVERSCAN)
    const endIdx = Math.min(totalRows, rawEnd + OVERSCAN)

    setRange((prev) => {
      if (prev.startIdx === startIdx && prev.endIdx === endIdx) return prev
      return { startIdx, endIdx }
    })
  }, [scrollRef, totalRows, rowHeight])

  const onScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      compute()

      if (stickyBottom) {
        const el = scrollRef.current
        if (el) {
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < rowHeight * 2
        }
      }
    })
  }, [compute, scrollRef, rowHeight, stickyBottom])

  // Recompute on totalRows change
  useLayoutEffect(() => {
    compute()
  }, [totalRows, compute])

  // Sticky-bottom: scroll down when new items arrive
  useEffect(() => {
    if (stickyBottom && stickRef.current && totalRows > prevTotalRef.current) {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
    prevTotalRef.current = totalRows
  }, [totalRows, stickyBottom, scrollRef])

  // ResizeObserver: recompute when viewport resizes
  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    return () => ro.disconnect()
  }, [scrollRef, compute])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const totalHeight = totalRows * rowHeight
  const topSpacer = range.startIdx * rowHeight
  const bottomSpacer = Math.max(0, (totalRows - range.endIdx) * rowHeight)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
      stickRef.current = true
    }
  }, [scrollRef])

  return {
    startIdx: range.startIdx,
    endIdx: range.endIdx,
    topSpacer,
    bottomSpacer,
    totalHeight,
    onScroll,
    scrollToBottom,
  }
}
