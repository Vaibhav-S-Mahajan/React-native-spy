// src/renderer/components/ui/Input.jsx
// Text input + a SearchInput variant for the filter bars every panel has.
// Data-bearing inputs use font-mono (URLs, keys, values); the search field is
// font-ui because it holds a query, not data.

import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import cn from './cn'

const BASE =
  'h-control-md min-w-0 rounded-md border border-default bg-input px-2 ' +
  'font-mono text-xs text-fg leading-tight ' +
  'placeholder:text-faint transition-colors duration-150 ' +
  'hover:border-strong focus:border-accent focus-ring ' +
  'disabled:pointer-events-none disabled:opacity-40'

export const Input = forwardRef(function Input({ className, invalid, ...rest }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(BASE, invalid && 'border-danger-edge', className)}
      {...rest}
    />
  )
})

/**
 * Borderless search field for panel toolbars: the toolbar's own bottom border
 * already separates it, so a second box would just add noise.
 */
export const SearchInput = forwardRef(function SearchInput(
  { className, wrapperClassName, count, ...rest },
  ref,
) {
  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-2', wrapperClassName)}>
      <Search size={14} className="shrink-0 text-faint" aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        className={cn(
          'h-control-lg min-w-0 flex-1 border-none bg-transparent p-0 ' +
          'font-ui text-xs text-fg leading-tight placeholder:text-faint ' +
          'focus:outline-none',
          className,
        )}
        {...rest}
      />
      {count != null && (
        <span className="shrink-0 font-mono text-2xs text-faint tabular-nums">{count}</span>
      )}
    </div>
  )
})

export default Input
