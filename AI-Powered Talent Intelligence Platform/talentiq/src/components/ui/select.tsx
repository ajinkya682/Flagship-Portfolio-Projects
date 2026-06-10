'use client'

/**
 * TalentIQ Select Components — Section 2.2
 *
 * SELECT:
 *   Appearance mirrors text input exactly.
 *   ChevronDown 16px neutral-400 / absolute right 12px
 *   Rotates 180deg on open (150ms ease-out)
 *   Dropdown: shadow-lg / radius-md / border-subtle / max-h 240px / z-200
 *   Option: h=36px / px=12px / 14px neutral-900
 *     hover: neutral-50 bg
 *     selected: primary-50 bg / primary-700 text / Check icon 14px right
 *   Group divider: 1px neutral-100 / 4px vertical margin
 *
 * MULTI-SELECT:
 *   Pills inside the input container (input grows vertically).
 *   Pill: primary-100 bg / primary-700 text / 10px / radius-full / px 2px 8px
 *   X on each pill (10px icon button)
 *   Max visible: 3 pills → "+N more" chip
 *   Input text: 14px inline after pills
 */

import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { inputBase, inputError, inputFilled } from './input'

// ─────────────────────────────────────────────────────────────────────────────
// Select Option type
// ─────────────────────────────────────────────────────────────────────────────
export interface SelectOption {
  value: string
  label: string
  group?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────────────────────
export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  id?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  error,
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const hasValue = Boolean(selected)

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }

  // Group options
  const groups = React.useMemo(() => {
    const map = new Map<string, SelectOption[]>()
    options.forEach((opt) => {
      const g = opt.group ?? '__default__'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(opt)
    })
    return map
  }, [options])

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Trigger — mirrors text input */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className={cn(
          inputBase,
          'flex items-center justify-between text-left cursor-pointer',
          hasValue ? 'text-neutral-900' : 'text-neutral-400',
          hasValue && inputFilled,
          error && inputError,
          disabled && 'cursor-not-allowed'
        )}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-neutral-400 shrink-0 ml-2 transition-transform duration-150 ease-out',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+4px)] z-[200]',
            'bg-white rounded-md border border-neutral-100',
            'shadow-lg p-1',
            'max-h-[240px] overflow-y-auto',
            // Custom thin scrollbar
            '[&::-webkit-scrollbar]:w-1',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full'
          )}
        >
          {Array.from(groups.entries()).map(([group, opts], gi) => (
            <React.Fragment key={group}>
              {/* Group divider (skip for __default__) */}
              {gi > 0 && (
                <div className="my-1 border-t border-neutral-100" role="separator" />
              )}
              {group !== '__default__' && (
                <div className="px-3 py-1 font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {group}
                </div>
              )}
              {opts.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange?.(opt.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between',
                      'h-9 px-3 rounded-xs',
                      'font-body text-[14px] text-left',
                      'transition-colors duration-[80ms]',
                      'focus-visible:outline-none focus-visible:shadow-brand',
                      isSelected
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-900 hover:bg-neutral-50'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className="text-primary-500 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MultiSelect
// Pills inside the input container. Input grows vertically.
//   Pill: primary-100 bg / primary-700 text / 10px / radius-full / px 2px 8px
//   X on each pill (10px icon button)
//   Max visible: 3 → "+N more" chip
//   Input: 14px inline after pills
// ─────────────────────────────────────────────────────────────────────────────
const MULTI_MAX_VISIBLE = 3

export interface MultiSelectProps {
  options: SelectOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  id?: string
  className?: string
}

export function MultiSelect({
  options,
  values = [],
  onChange,
  placeholder = 'Select…',
  disabled,
  error,
  id,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [showAll, setShowAll] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOptions = values
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean) as SelectOption[]

  const filteredOptions = options.filter(
    (o) =>
      !values.includes(o.value) &&
      o.label.toLowerCase().includes(query.toLowerCase())
  )

  const visiblePills = showAll
    ? selectedOptions
    : selectedOptions.slice(0, MULTI_MAX_VISIBLE)
  const overflowCount = selectedOptions.length - MULTI_MAX_VISIBLE

  const toggle = (optValue: string) => {
    if (values.includes(optValue)) {
      onChange?.(values.filter((v) => v !== optValue))
    } else {
      onChange?.([...values, optValue])
    }
  }

  const remove = (optValue: string) => {
    onChange?.(values.filter((v) => v !== optValue))
  }

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Input container — grows vertically as pills are added */}
      <div
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (!disabled) {
            setOpen(true)
            inputRef.current?.focus()
          }
        }}
        className={cn(
          'flex flex-wrap items-center gap-1',
          'min-h-[40px] w-full px-[10px] py-[6px]',
          'rounded-sm bg-white cursor-text',
          'border border-neutral-200',
          'transition-[border-color,box-shadow] duration-[120ms] ease-out',
          'hover:border-neutral-300',
          open && 'border-primary-500 shadow-brand',
          values.length > 0 && !open && 'border-neutral-300',
          error && inputError,
          disabled && 'bg-neutral-50 border-neutral-200 cursor-not-allowed'
        )}
      >
        {/* Selected pills */}
        {visiblePills.map((opt) => (
          <span
            key={opt.value}
            className={cn(
              'inline-flex items-center gap-1',
              'bg-primary-100 text-primary-700',
              'text-[10px] font-medium rounded-full',
              'px-2 py-[2px] leading-none'
            )}
          >
            {opt.label}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(opt.value) }}
                aria-label={`Remove ${opt.label}`}
                className="hover:text-primary-900 transition-colors focus-visible:outline-none"
              >
                <X size={10} aria-hidden="true" />
              </button>
            )}
          </span>
        ))}

        {/* Overflow chip — "+N more" */}
        {!showAll && overflowCount > 0 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowAll(true) }}
            className="inline-flex items-center bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded-full px-2 py-[2px] hover:bg-neutral-200 transition-colors"
          >
            +{overflowCount} more
          </button>
        )}

        {/* Text input — inline after pills */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !query && values.length > 0) {
              remove(values[values.length - 1])
            }
            if (e.key === 'Escape') { setOpen(false); setQuery('') }
          }}
          disabled={disabled}
          placeholder={values.length === 0 ? placeholder : ''}
          className={cn(
            'flex-1 min-w-[120px] border-none outline-none bg-transparent',
            'font-body text-[14px] text-neutral-900',
            'placeholder:text-neutral-400',
            'disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-0 focus:shadow-none'
          )}
          style={{ boxShadow: 'none' }}
          aria-autocomplete="list"
        />
      </div>

      {/* Dropdown */}
      {open && filteredOptions.length > 0 && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+4px)] z-[200]',
            'bg-white rounded-md border border-neutral-100',
            'shadow-lg p-1',
            'max-h-[240px] overflow-y-auto',
            '[&::-webkit-scrollbar]:w-1',
            '[&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full'
          )}
        >
          {filteredOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => toggle(opt.value)}
              className={cn(
                'w-full flex items-center h-9 px-3 rounded-xs text-left',
                'font-body text-[14px] text-neutral-900',
                'transition-colors duration-[80ms]',
                'hover:bg-neutral-50',
                'focus-visible:outline-none focus-visible:shadow-brand'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
