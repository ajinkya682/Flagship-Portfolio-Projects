'use client'

/**
 * TalentIQ Form Field Components — Section 2.2
 *
 * Base shared across ALL inputs (spec):
 *   font: Inter 14px | color: neutral-900 | placeholder: neutral-400
 *   border: 1px solid neutral-200 (border-default) | border-radius: radius-sm (6px)
 *   transition: border-color 120ms, box-shadow 120ms
 *
 * States: default | hover | focus | error | disabled | filled
 *
 * Exports:
 *   FormField      — wrapper: label + input slot + helper/error text
 *   TextInput      — base text input (all states)
 *   SearchInput    — prepended Search icon + animated clear X
 *   PasswordInput  — eye/eyeOff toggle
 *   Textarea       — min-96px, resize: vertical
 *   FormLabel      — 13px weight 500 neutral-700
 *   FormHelper     — 12px neutral-500
 *   FormError      — 12px #EF4444 + AlertCircle icon (aria-live)
 */

import * as React from 'react'
import { AlertCircle, Eye, EyeOff, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Shared base input classes (applied to every input element)
// ─────────────────────────────────────────────────────────────────────────────
export const inputBase = [
  // Layout
  'w-full h-10 px-[14px]',
  // Typography
  'font-body text-[14px] text-neutral-900',
  'placeholder:text-neutral-400',
  // Shape
  'rounded-sm bg-white',
  // Border — default state
  'border border-neutral-200',
  // Transition (spec: 120ms for border-color and box-shadow)
  'transition-[border-color,box-shadow] duration-[120ms] ease-out',
  // Hover
  'hover:border-neutral-300',
  // Focus
  'focus:outline-none focus:border-primary-500 focus:shadow-brand',
  // Disabled
  'disabled:bg-neutral-50 disabled:border-neutral-200 disabled:text-neutral-400',
  'disabled:placeholder:text-neutral-300 disabled:cursor-not-allowed',
].join(' ')

// Error state classes (applied when error prop is truthy)
export const inputError = [
  'border-[#EF4444]',
  'shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
  'focus:border-[#EF4444]',
  'focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
  'hover:border-[#EF4444]',
].join(' ')

// Filled state — border bumps to neutral-300 when value is present
export const inputFilled = 'border-neutral-300'

// ─────────────────────────────────────────────────────────────────────────────
// FormLabel
// Inter 13px weight 500 neutral-700 / 6px above input (mb-1.5)
// ─────────────────────────────────────────────────────────────────────────────
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block font-body text-[13px] font-medium text-neutral-700 mb-[6px]',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-[#EF4444] ml-0.5" aria-hidden="true"> *</span>
      )}
    </label>
  )
)
FormLabel.displayName = 'FormLabel'

// ─────────────────────────────────────────────────────────────────────────────
// FormHelper — Inter 12px weight 400 neutral-500 / 4px below input
// ─────────────────────────────────────────────────────────────────────────────
export const FormHelper = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'block font-body text-[12px] font-normal text-neutral-500 mt-[4px]',
      className
    )}
    {...props}
  />
))
FormHelper.displayName = 'FormHelper'

// ─────────────────────────────────────────────────────────────────────────────
// FormError — Inter 12px weight 400 #EF4444 / 4px below / AlertCircle 12px
// ─────────────────────────────────────────────────────────────────────────────
export const FormError = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    role="alert"
    aria-live="polite"
    className={cn(
      'flex items-center gap-1 font-body text-[12px] font-normal text-[#EF4444] mt-[4px]',
      className
    )}
    {...props}
  >
    <AlertCircle size={12} aria-hidden="true" className="shrink-0" />
    {children}
  </span>
))
FormError.displayName = 'FormError'

// ─────────────────────────────────────────────────────────────────────────────
// FormField — Full wrapper: label slot + input slot + helper/error
//
// HTML spec structure:
//   <div class="form-field">
//     <label class="form-label">Label</label>
//     {input}
//     <span class="form-helper">Helper</span>
//     <span class="form-error" aria-live="polite"><AlertCircle /> Error</span>
//   </div>
// ─────────────────────────────────────────────────────────────────────────────
export interface FormFieldProps {
  label?: string
  htmlFor?: string
  helper?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  helper,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <FormLabel htmlFor={htmlFor} required={required}>
          {label}
        </FormLabel>
      )}
      {children}
      {/* Show helper OR error — error takes priority */}
      {error ? (
        <FormError>{error}</FormError>
      ) : helper ? (
        <FormHelper>{helper}</FormHelper>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TextInput — Base text input, all states
// ─────────────────────────────────────────────────────────────────────────────
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string
  filled?: boolean
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, value, defaultValue, filled, ...props }, ref) => {
    const hasValue = filled || Boolean(value || defaultValue)
    return (
      <input
        ref={ref}
        className={cn(
          inputBase,
          hasValue && inputFilled,
          error && inputError,
          className
        )}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
    )
  }
)
TextInput.displayName = 'TextInput'

// ─────────────────────────────────────────────────────────────────────────────
// SearchInput
// Extends TextInput:
//   padding-left: 40px (clear 16px icon + left gap)
//   Search icon: 16px neutral-400 / absolute left 12px / vertically centered
//   Clear (X): 16px icon / absolute right 10px / opacity 0→1 when value present
// ─────────────────────────────────────────────────────────────────────────────
export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, error, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      (props.defaultValue as string) ?? ''
    )
    const isControlled = value !== undefined
    const currentValue = isControlled ? (value as string) : internalValue
    const hasValue = currentValue.length > 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) setInternalValue('')
      onClear?.()
    }

    return (
      <div className="relative w-full">
        {/* Search icon — left */}
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          className={cn(
            inputBase,
            'pl-[40px]', // clear the search icon
            hasValue && 'pr-[36px]', // clear the X button
            hasValue && inputFilled,
            error && inputError,
            // Remove native search cancel
            '[&::-webkit-search-cancel-button]:hidden',
            className
          )}
          {...props}
        />

        {/* Clear (X) — right, fades in when value present */}
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            'absolute right-[10px] top-1/2 -translate-y-1/2',
            'h-[22px] w-[22px] rounded-xs',
            'flex items-center justify-center',
            'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
            'transition-[opacity,background-color] duration-[120ms]',
            hasValue ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          tabIndex={hasValue ? 0 : -1}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

// ─────────────────────────────────────────────────────────────────────────────
// PasswordInput
// Extends TextInput:
//   Eye / EyeOff icon button 16px / absolute right 12px
//   Toggles type="password" ↔ type="text"
// ─────────────────────────────────────────────────────────────────────────────
export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean | string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, value, defaultValue, ...props }, ref) => {
    const [show, setShow] = React.useState(false)
    const hasValue = Boolean(value || defaultValue)

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            inputBase,
            'pr-[44px]', // clear the toggle button
            hasValue && inputFilled,
            error && inputError,
            className
          )}
          {...props}
        />

        {/* Eye / EyeOff toggle */}
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'h-[28px] w-[28px] rounded-xs',
            'flex items-center justify-center',
            'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
            'transition-colors duration-[120ms]',
            'focus-visible:outline-none focus-visible:shadow-brand'
          )}
        >
          {show
            ? <EyeOff size={16} aria-hidden="true" />
            : <Eye size={16} aria-hidden="true" />
          }
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

// ─────────────────────────────────────────────────────────────────────────────
// Textarea
// min-height: 96px / padding: 12px 14px / resize: vertical
// line-height: 24px / same border & focus as text input
// ─────────────────────────────────────────────────────────────────────────────
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, value, defaultValue, ...props }, ref) => {
    const hasValue = Boolean(value || defaultValue)
    return (
      <textarea
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          // Base — overrides height for textarea
          'w-full px-[14px] py-[12px]',
          'font-body text-[14px] text-neutral-900 leading-6',
          'placeholder:text-neutral-400',
          'rounded-sm bg-white',
          'border border-neutral-200',
          'transition-[border-color,box-shadow] duration-[120ms] ease-out',
          'hover:border-neutral-300',
          'focus:outline-none focus:border-primary-500 focus:shadow-brand',
          'disabled:bg-neutral-50 disabled:border-neutral-200 disabled:text-neutral-400',
          'disabled:cursor-not-allowed',
          // Textarea-specific
          'min-h-[96px] resize-vertical',
          hasValue && inputFilled,
          error && inputError,
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
