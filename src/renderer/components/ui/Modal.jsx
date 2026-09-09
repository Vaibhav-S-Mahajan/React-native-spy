// src/renderer/components/ui/Modal.jsx
// Accessible dialog shell. Generalises what IssuesModal already did correctly
// (portal, role="dialog", focus trap, focus restore, Escape) so the other four
// modals stop reimplementing it — three of them were missing the trap entirely.
//
// Composition: <Modal><ModalHeader/><ModalBody/><ModalFooter/></Modal>. The body
// owns the scroll so the header and footer stay pinned.

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import useFocusTrap from '../../hooks/useFocusTrap'
import IconButton from './IconButton'
import cn from './cn'

const WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  onClose,
  returnFocusRef,
  initialFocusRef,
  size = 'md',
  labelledBy,
  className,
  children,
}) {
  const cardRef = useRef(null)

  useFocusTrap({ containerRef: cardRef, onClose, returnFocusRef, initialFocusRef })

  return createPortal(
    <div
      // Click-outside to dismiss. The card stops propagation, so only genuine
      // scrim clicks close it.
      onClick={onClose}
      className="fixed inset-0 z-[1250] flex items-center justify-center bg-overlay p-6"
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex max-h-full w-full min-h-0 flex-col overflow-hidden rounded-lg ' +
          'border border-default bg-card shadow-lg',
          WIDTHS[size] || WIDTHS.md,
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function ModalHeader({ title, description, onClose, id, className, children }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-start gap-3 border-b border-subtle bg-panel-alt px-4 py-3',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h2
            id={id}
            className="truncate font-ui text-sm font-semibold text-fg leading-tight"
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-0.5 font-ui text-xs text-faint leading-tight">{description}</p>
        )}
      </div>
      {children}
      {onClose && (
        <IconButton label="Close" size="sm" onClick={onClose}>
          <X size={14} />
        </IconButton>
      )}
    </div>
  )
}

export function ModalBody({ className, children }) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', className)}>
      {children}
    </div>
  )
}

export function ModalFooter({ className, children }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-2 border-t border-subtle bg-panel-alt px-4 py-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
