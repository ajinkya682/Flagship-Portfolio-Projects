'use client'

/**
 * TalentIQ Button Component Library
 * Section 2.1 — BUTTON COMPONENTS (complete spec implementation)
 *
 * Exports:
 *   Button       — Primary | Secondary | Ghost | Accent/AI | Destructive
 *   IconButton   — 36×36 square icon-only button (light + dark variants)
 *   PillButton   — Tag/chip button (default | primary | accent) with optional X
 *   buttonVariants — CVA variant helper (for external composition)
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Internal: Loading Spinner
// 20px Loader2 (Lucide) with Tailwind spin animation.
// ─────────────────────────────────────────────────────────────────────────────
const Spinner = ({ size = 20 }: { size?: number }) => (
  <Loader2
    size={size}
    className="animate-spin"
    aria-hidden="true"
  />
)

// ─────────────────────────────────────────────────────────────────────────────
// CVA — Button base + variant + size definitions
//
// Base:
//  - font-family: Inter (font-body)
//  - border-radius: --radius-sm = 6px (rounded-sm)
//  - transition: 120ms cubic-bezier(0,0,0.2,1)
//  - focus ring: --shadow-brand on :focus-visible (NO outline:none replacement gap)
//  - disabled: cursor-not-allowed + pointer-events-none (prevents stale hover styles)
//
// Every variant maps precisely to the spec's color tokens.
// ─────────────────────────────────────────────────────────────────────────────
const buttonVariants = cva(
  // Base — shared across ALL button variants
  [
    // Layout
    'relative inline-flex items-center justify-center gap-2',
    // Typography
    'font-body font-semibold leading-none whitespace-nowrap',
    // Shape
    'rounded-sm',
    // Interaction
    'select-none cursor-pointer',
    // Transition (120ms --ease-out per spec)
    'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    // Focus ring — shadow-brand on ALL buttons (spec: "No outline:none without replacement")
    'focus-visible:outline-none focus-visible:shadow-brand',
    // Disabled — cursor + lock out hover effects
    'disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      // ─── Visual Variant ─────────────────────────────────────────────────
      variant: {
        /**
         * PRIMARY — Most important action. One per view group.
         * bg: primary-500 (#2563EB) | text: white | shadow-xs
         * hover: primary-400 + translateY(-1px) + shadow-md
         * active: primary-600 + translateY(0) + shadow-inner
         * disabled: neutral-200 bg / neutral-400 text
         */
        primary: [
          'bg-primary-500 text-white shadow-xs',
          'hover:bg-primary-400 hover:-translate-y-px hover:shadow-md',
          'active:bg-primary-600 active:translate-y-0 active:shadow-inner',
          'disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:translate-y-0',
        ].join(' '),

        /**
         * SECONDARY — Supplementary action alongside primary.
         * bg: white | text: neutral-900 | border: 1px solid neutral-200
         * hover: neutral-50 bg + neutral-300 border + translateY(-1px)
         * active: neutral-100 bg
         * disabled: all neutral-300
         */
        secondary: [
          'bg-white text-neutral-900 border border-neutral-200',
          'hover:bg-neutral-50 hover:border-neutral-300 hover:-translate-y-px',
          'active:bg-neutral-100 active:translate-y-0',
          'disabled:bg-white disabled:text-neutral-300 disabled:border-neutral-200',
        ].join(' '),

        /**
         * GHOST — Cancel, secondary context, confirmation dialogs.
         * bg: transparent | text: neutral-700 | no border | font-medium (500)
         * hover: neutral-100 bg
         * active: neutral-200 bg
         */
        ghost: [
          'bg-transparent text-neutral-700 font-medium border-none shadow-none',
          'hover:bg-neutral-100',
          'active:bg-neutral-200',
          'disabled:text-neutral-300',
        ].join(' '),

        /**
         * ACCENT / AI — Exclusively for AI-triggered actions.
         * Valid: Generate Description, Score Candidates, Check Bias,
         *        Generate Interview Questions, Rescore, Analyze Resume.
         * ALWAYS renders Sparkles icon left (auto-injected, see Button render).
         * bg: accent-500 (#10B981) | text: white
         * hover: accent-600 + shadow-accent + translateY(-1px)
         * active: accent-700
         * focus: 3px rgba(16,185,129,0.25) ring
         * disabled: neutral-200/neutral-400
         */
        accent: [
          'bg-accent-500 text-white shadow-xs',
          'hover:bg-accent-600 hover:-translate-y-px hover:shadow-accent',
          'active:bg-accent-700 active:translate-y-0',
          // Override focus ring — accent ring instead of brand ring
          'focus-visible:shadow-[0_0_0_3px_rgba(16,185,129,0.25)]',
          'disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:translate-y-0',
        ].join(' '),

        /**
         * DESTRUCTIVE — Confirmation dialogs ONLY.
         * bg: #FEF2F2 | text: #DC2626 | border: 1px solid #FECACA
         * hover: #FEE2E2 bg / #FCA5A5 border
         * focus: 3px rgba(220,38,38,0.15) ring
         */
        destructive: [
          'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-semibold',
          'hover:bg-[#FEE2E2] hover:border-[#FCA5A5]',
          // Override focus ring — red ring
          'focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]',
          'disabled:opacity-50',
        ].join(' '),
      },

      // ─── Size Variant ────────────────────────────────────────────────────
      size: {
        /**
         * compact: h=36px / px=16px / text=13px (weight 600)
         * Use for: tight areas, inline actions, table row actions
         */
        compact: 'h-9 px-4 text-[13px]',

        /**
         * default: h=40px / px=20px / text=14px (weight 600)
         * Standard size for most page actions.
         */
        default: 'h-10 px-5 text-[14px]',

        /**
         * large: h=48px / px=24px / text=15px (weight 600)
         * Hero CTAs, modal primary actions, onboarding.
         */
        large: 'h-12 px-6 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show spinner and lock width. Automatically sets disabled + aria-busy. */
  loading?: boolean
  /** Icon rendered left of label. Accent buttons auto-inject Sparkles if omitted. */
  iconLeft?: React.ReactNode
  /** Icon rendered right of label. Use ArrowRight for CTA buttons. */
  iconRight?: React.ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// Button Component
// ─────────────────────────────────────────────────────────────────────────────
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      loading = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    /**
     * Accent buttons ALWAYS have Sparkles icon left (spec: "ALWAYS present").
     * Auto-inject if no iconLeft is provided. Respects explicit override.
     */
    const resolvedIconLeft =
      iconLeft ?? (variant === 'accent' ? (
        <Sparkles size={16} aria-hidden="true" />
      ) : undefined)

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {/*
         * Loading Spinner Overlay
         * Absolutely positioned over the full button area.
         * Appears when loading=true, spinner color inherits currentColor.
         */}
        {loading && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <Spinner size={20} />
          </span>
        )}

        {/*
         * Button Content
         * Goes invisible (opacity-0) when loading — width is preserved
         * because the content still occupies layout space (spec: "width locked").
         */}
        <span
          className={cn(
            'inline-flex items-center gap-2',
            loading && 'opacity-0 pointer-events-none select-none'
          )}
          aria-hidden={loading || undefined}
        >
          {resolvedIconLeft && (
            <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4" aria-hidden="true">
              {resolvedIconLeft}
            </span>
          )}

          {children && (
            <span>{children}</span>
          )}

          {iconRight && (
            <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4" aria-hidden="true">
              {iconRight}
            </span>
          )}
        </span>
      </button>
    )
  }
)
Button.displayName = 'Button'

// ─────────────────────────────────────────────────────────────────────────────
// Icon Button
// 36×36 square. Icon-only. Requires aria-label for accessibility.
//
// light (default): neutral-500 icon / neutral-100 hover bg
// dark variant:    white/70 icon  / white/8 hover bg  (for dark section use)
// ─────────────────────────────────────────────────────────────────────────────
export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon element to render (Lucide or any SVG). */
  icon: React.ReactNode
  /** Use on dark backgrounds (pipeline dark section, testimonials, footer). */
  dark?: boolean
  /** Required for accessibility — screen readers announce this label. */
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, dark = false, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        // Base
        'relative inline-flex items-center justify-center',
        'h-9 w-9 rounded-sm shrink-0',
        'cursor-pointer select-none',
        'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
        'focus-visible:outline-none focus-visible:shadow-brand',
        'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
        // Icon size forced to 18px per spec
        '[&>svg]:w-[18px] [&>svg]:h-[18px]',
        // Light variant (default)
        !dark && [
          'bg-transparent text-neutral-500',
          'hover:bg-neutral-100',
          'active:bg-neutral-200',
        ],
        // Dark variant — for dark backgrounds (spec: rgba values)
        dark && [
          'bg-transparent text-white/70',
          'hover:bg-white/[0.08]',
          'active:bg-white/[0.12]',
        ],
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
)
IconButton.displayName = 'IconButton'

// ─────────────────────────────────────────────────────────────────────────────
// Pill / Tag Button
// H=28px / px=12px / radius-full / font 12px weight 500 Inter
// Three color variants + optional X remove button.
//
// Spec note on X:
//   "add 4px gap right + 14px X icon button (icon button sm)"
// ─────────────────────────────────────────────────────────────────────────────
const pillVariants = cva(
  [
    'inline-flex items-center',
    'h-7 rounded-full',
    'font-body font-medium text-[12px] leading-none',
    'select-none cursor-pointer',
    'transition-colors duration-[120ms] ease-out',
    'focus-visible:outline-none focus-visible:shadow-brand',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        /** default: neutral-100 bg / neutral-700 text */
        default: 'bg-neutral-100 text-neutral-700',
        /** primary: primary-50 bg / primary-700 text */
        primary: 'bg-primary-50 text-primary-700',
        /** accent: accent-100 bg / accent-700 text */
        accent: 'bg-accent-100 text-accent-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillVariants> {
  /** The tag label text. */
  label: string
  /**
   * If provided, renders an X close button (14px icon) after the label.
   * Per spec: "4px gap right + 14px X icon button"
   */
  onRemove?: () => void
  /** aria-label for the remove button */
  removeLabel?: string
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      className,
      variant,
      label,
      onRemove,
      removeLabel,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        pillVariants({ variant }),
        // Horizontal padding adjusts when X button is present
        onRemove ? 'pl-3 pr-1 gap-1' : 'px-3',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span>{label}</span>

      {onRemove && (
        /*
         * X remove button — spec: "14px X icon button (icon button sm)"
         * Stops propagation so the parent pill click doesn't fire.
         */
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={removeLabel ?? `Remove ${label}`}
          disabled={disabled}
          className={cn(
            'ml-1 inline-flex items-center justify-center',
            'w-[18px] h-[18px] rounded-full shrink-0',
            'transition-colors duration-[80ms]',
            'hover:bg-black/10',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current',
            'disabled:pointer-events-none'
          )}
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </button>
  )
)
PillButton.displayName = 'PillButton'

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
export { Button, IconButton, PillButton, buttonVariants, pillVariants }
