'use client'

/**
 * HeroInlineCTA — Section 2.1 "Inline CTA Pill (Hero signature element)"
 *
 * Desktop/Tablet (sm+): Glass-morphism pill embedded inline in the H1 headline.
 * Mobile (<640px):      Full-width primary large button dropped below headline.
 *
 * Spec:
 *   display: inline-flex | gap: 8px | padding: 10px 20px
 *   bg: rgba(37,99,235,0.92) | backdrop-blur: 12px
 *   border: 1px solid rgba(255,255,255,0.25) | border-radius: 9999px
 *   color: white | font: Inter 15px weight 600 | shadow-glass
 *   hover: scale(1.04) + shadow-accent + bg rgba(37,99,235,1) / 120ms
 *   active: scale(0.98)
 */

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeroInlineCTAProps {
  /** Button label — defaults to spec copy */
  label?: string
  onClick?: () => void
  href?: string
  className?: string
}

export default function HeroInlineCTA({
  label = 'Start Free Trial',
  onClick,
  href,
  className,
}: HeroInlineCTAProps) {
  const sharedProps = {
    onClick,
    'aria-label': `${label} — free 14-day trial, no credit card required`,
  }

  const Tag = href ? 'a' : 'button'
  const tagProps = href ? { href } : { type: 'button' as const }

  return (
    <>
      {/* ── Desktop / Tablet: inline glass pill ──────────────────────────── */}
      <Tag
        {...tagProps}
        {...sharedProps}
        className={cn(
          // Only visible at sm+
          'hidden sm:inline-flex',
          // Layout
          'items-center gap-2',
          'px-5 py-[10px]',
          // Glass appearance
          'bg-[rgba(37,99,235,0.92)] backdrop-blur-md',
          'border border-[rgba(255,255,255,0.25)]',
          'rounded-full',
          // Typography
          'text-white font-body font-semibold text-[15px] leading-none',
          // Shadow
          'shadow-glass',
          // Inline alignment (lives inside h1 text)
          'align-middle',
          // Interaction
          'cursor-pointer select-none',
          // Transitions — 120ms ease-out
          'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
          // Hover: scale + opaque bg + accent glow
          'hover:bg-[rgba(37,99,235,1)] hover:scale-[1.04] hover:shadow-accent',
          // Active: slight squish
          'active:scale-[0.98]',
          // Focus ring (brand shadow)
          'focus-visible:outline-none focus-visible:shadow-brand',
          className
        )}
      >
        {label}
        <ArrowUpRight size={14} aria-hidden="true" />
      </Tag>

      {/* ── Mobile (<640px): full-width primary large button ─────────────── */}
      <Tag
        {...tagProps}
        {...sharedProps}
        className={cn(
          // Only visible below sm
          'sm:hidden',
          'w-full inline-flex items-center justify-center gap-2',
          // Size: large primary
          'h-12 px-6 rounded-sm',
          // Colors: primary-500
          'bg-primary-500 text-white font-body font-semibold text-[15px]',
          'shadow-xs',
          // Transitions
          'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
          'hover:bg-primary-400 hover:-translate-y-px hover:shadow-md',
          'active:bg-primary-600 active:translate-y-0',
          'focus-visible:outline-none focus-visible:shadow-brand',
          'cursor-pointer select-none',
        )}
      >
        {label}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Tag>
    </>
  )
}
