'use client'

/**
 * /test-buttons — Visual regression test page for Section 2.1 Button Components
 *
 * Shows every button variant × size × state:
 *   default | hover (live) | focus (live) | active (live) | disabled | loading
 *
 * Route: http://localhost:3000/test-buttons
 */

import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  Check,
  Copy,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { Button, IconButton, PillButton } from '@/components/ui/button'
import { HeroInlineCTA } from '@/components/marketing/HeroInlineCTA'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
  dark = false,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <section
      className={`rounded-2xl p-8 ${
        dark ? 'bg-primary-900' : 'bg-white border border-neutral-200'
      }`}
    >
      <div className="mb-6">
        <h2
          className={`font-display font-bold text-h2 ${
            dark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`font-body text-body-sm mt-1 ${
              dark ? 'text-white/60' : 'text-neutral-500'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap py-3 border-b border-neutral-100 last:border-0">
      <span className="font-body text-body-xs text-neutral-400 uppercase tracking-wider w-24 shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-3 flex-wrap">{children}</div>
    </div>
  )
}

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-[10px] text-neutral-400 uppercase tracking-wider">
      {children}
    </span>
  )
}

// ─── Interactive Loading Demo ─────────────────────────────────────────────────

function LoadingDemo({
  variant,
  label,
}: {
  variant: 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive'
  label: string
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setDone(false)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    }, 2000)
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant={variant}
        loading={loading}
        iconRight={done ? <Check size={16} /> : undefined}
        onClick={handleClick}
      >
        {done ? 'Done!' : label}
      </Button>
      <StateLabel>{loading ? 'loading…' : done ? 'success' : 'click to demo'}</StateLabel>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonTestPage() {
  const [pillTags, setPillTags] = useState(['React', 'TypeScript', 'Node.js', 'AWS'])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="bg-primary-950 text-white px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-3 py-1 mb-4">
            <Sparkles size={12} className="text-accent-400" aria-hidden="true" />
            <span className="font-body text-body-xs text-accent-300 font-semibold uppercase tracking-wider">
              Section 2.1
            </span>
          </div>
          <h1 className="font-display font-bold text-display-lg text-white leading-tight">
            Button Component Test
          </h1>
          <p className="font-body text-body-lg text-white/60 mt-3 max-w-2xl">
            All variants · All sizes · Every state — hover, focus, active, disabled, loading.
            Interact with each element live to verify spec compliance.
          </p>
          <div className="flex items-center gap-6 mt-6 text-body-sm text-white/40 font-body">
            <span>5 variants</span>
            <span>·</span>
            <span>3 sizes</span>
            <span>·</span>
            <span>6 states per variant</span>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-8">

        {/* ── 1. PRIMARY BUTTON ──────────────────────────────────────────── */}
        <Section
          title="Primary Button"
          subtitle="Most important action. One per view group. bg: primary-500 → hover: primary-400"
        >
          <Row label="Compact">
            <Button variant="primary" size="compact">Save Changes</Button>
            <Button variant="primary" size="compact" iconLeft={<Plus size={14} />}>Create Job</Button>
            <Button variant="primary" size="compact" iconRight={<ArrowRight size={14} />}>Continue</Button>
            <Button variant="primary" size="compact" disabled>Disabled</Button>
            <Button variant="primary" size="compact" loading>Loading</Button>
          </Row>

          <Row label="Default">
            <Button variant="primary">Save Changes</Button>
            <Button variant="primary" iconLeft={<Plus size={16} />}>Create Job</Button>
            <Button variant="primary" iconRight={<ArrowRight size={16} />}>Start Free Trial</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
          </Row>

          <Row label="Large">
            <Button variant="primary" size="large">Get Started</Button>
            <Button variant="primary" size="large" iconLeft={<Plus size={16} />}>Create First Job</Button>
            <Button variant="primary" size="large" iconRight={<ArrowRight size={16} />}>Start Free Trial</Button>
            <Button variant="primary" size="large" disabled>Disabled</Button>
            <Button variant="primary" size="large" loading>Publishing…</Button>
          </Row>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="font-body text-body-xs text-neutral-500 mb-3">
              Interactive Loading States — click to trigger 2-second loader:
            </p>
            <div className="flex gap-6 flex-wrap">
              <LoadingDemo variant="primary" label="Publish Job" />
              <LoadingDemo variant="primary" label="Save Draft" />
            </div>
          </div>
        </Section>

        {/* ── 2. SECONDARY BUTTON ────────────────────────────────────────── */}
        <Section
          title="Secondary Button"
          subtitle="Supplementary action. bg: white | border: neutral-200 → hover: neutral-50 bg + neutral-300 border"
        >
          <Row label="Compact">
            <Button variant="secondary" size="compact">Edit Job</Button>
            <Button variant="secondary" size="compact" iconLeft={<Copy size={14} />}>Duplicate</Button>
            <Button variant="secondary" size="compact" disabled>Disabled</Button>
          </Row>

          <Row label="Default">
            <Button variant="secondary">Edit Job</Button>
            <Button variant="secondary" iconLeft={<Copy size={16} />}>Duplicate</Button>
            <Button variant="secondary" iconRight={<ArrowRight size={16} />}>View Analytics</Button>
            <Button variant="secondary" disabled>Disabled</Button>
            <Button variant="secondary" loading>Loading</Button>
          </Row>

          <Row label="Large">
            <Button variant="secondary" size="large">View Invoices</Button>
            <Button variant="secondary" size="large" iconLeft={<Settings size={16} />}>Manage Plan</Button>
            <Button variant="secondary" size="large" disabled>Disabled</Button>
          </Row>
        </Section>

        {/* ── 3. GHOST BUTTON ────────────────────────────────────────────── */}
        <Section
          title="Ghost Button"
          subtitle="Cancel, secondary context, confirmation dialogs. bg: transparent | font-weight: 500"
        >
          <Row label="Compact">
            <Button variant="ghost" size="compact">Cancel</Button>
            <Button variant="ghost" size="compact">I'll do this later</Button>
            <Button variant="ghost" size="compact" disabled>Disabled</Button>
          </Row>

          <Row label="Default">
            <Button variant="ghost">Cancel</Button>
            <Button variant="ghost">Skip for now</Button>
            <Button variant="ghost" iconLeft={<ArrowRight size={16} />}>View All</Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </Row>

          <Row label="Large">
            <Button variant="ghost" size="large">Cancel</Button>
            <Button variant="ghost" size="large">Invite teammates first</Button>
            <Button variant="ghost" size="large" disabled>Disabled</Button>
          </Row>
        </Section>

        {/* ── 4. ACCENT / AI BUTTON ──────────────────────────────────────── */}
        <Section
          title="Accent / AI Button"
          subtitle="Exclusively for AI-triggered actions. Always renders Sparkles icon (auto-injected). bg: accent-500"
        >
          <Row label="Compact">
            <Button variant="accent" size="compact">Generate</Button>
            <Button variant="accent" size="compact">Check for Bias</Button>
            <Button variant="accent" size="compact" disabled>Disabled</Button>
            <Button variant="accent" size="compact" loading>Analyzing…</Button>
          </Row>

          <Row label="Default">
            <Button variant="accent">Generate Description</Button>
            <Button variant="accent">Score Candidates</Button>
            <Button variant="accent">Check for Bias</Button>
            <Button variant="accent" disabled>Disabled</Button>
            <Button variant="accent" loading>Scoring…</Button>
          </Row>

          <Row label="Large">
            <Button variant="accent" size="large">Analyze Resume</Button>
            <Button variant="accent" size="large">Generate Interview Questions</Button>
            <Button variant="accent" size="large" disabled>Disabled</Button>
            <Button variant="accent" size="large" loading>Generating…</Button>
          </Row>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="font-body text-body-xs text-neutral-500 mb-3">
              Interactive — click to see loading state with AI message:
            </p>
            <div className="flex gap-6 flex-wrap">
              <LoadingDemo variant="accent" label="Generate Description" />
              <LoadingDemo variant="accent" label="Score Candidates" />
              <LoadingDemo variant="accent" label="Check for Bias" />
            </div>
          </div>
        </Section>

        {/* ── 5. DESTRUCTIVE BUTTON ──────────────────────────────────────── */}
        <Section
          title="Destructive Button"
          subtitle="Confirmation dialogs ONLY. Never primary page action. bg: #FEF2F2 | text: #DC2626 | border: #FECACA"
        >
          <Row label="Compact">
            <Button variant="destructive" size="compact">Delete</Button>
            <Button variant="destructive" size="compact" iconLeft={<Trash2 size={14} />}>Remove</Button>
            <Button variant="destructive" size="compact" disabled>Disabled</Button>
          </Row>

          <Row label="Default">
            <Button variant="destructive">Delete Job</Button>
            <Button variant="destructive" iconLeft={<Trash2 size={16} />}>Remove Candidate</Button>
            <Button variant="destructive" disabled>Disabled</Button>
          </Row>

          <Row label="Large">
            <Button variant="destructive" size="large">Close Role Permanently</Button>
            <Button variant="destructive" size="large" disabled>Disabled</Button>
          </Row>
        </Section>

        {/* ── 6. ICON BUTTON ─────────────────────────────────────────────── */}
        <Section
          title="Icon Button"
          subtitle="36×36 square. Icon only. Requires aria-label. Light variant (neutral-500 → neutral-100 hover) + Dark variant."
        >
          <Row label="Light">
            <IconButton icon={<Settings />} aria-label="Settings" />
            <IconButton icon={<Bell />} aria-label="Notifications" />
            <IconButton icon={<Copy />} aria-label="Copy" />
            <IconButton icon={<Trash2 />} aria-label="Delete" />
            <IconButton icon={<MoreHorizontal />} aria-label="More options" />
            <IconButton icon={<Plus />} aria-label="Add" />
            <IconButton icon={<X />} aria-label="Close" />
            <IconButton icon={<Briefcase />} aria-label="Jobs" disabled />
          </Row>

          <Row label="Dark bg">
            <div className="bg-primary-900 rounded-lg p-3 flex items-center gap-2">
              <IconButton dark icon={<Settings />} aria-label="Settings" />
              <IconButton dark icon={<Bell />} aria-label="Notifications" />
              <IconButton dark icon={<Copy />} aria-label="Copy" />
              <IconButton dark icon={<X />} aria-label="Close" />
              <IconButton dark icon={<MoreHorizontal />} aria-label="More options" />
            </div>
          </Row>
        </Section>

        {/* ── 7. PILL / TAG BUTTON ───────────────────────────────────────── */}
        <Section
          title="Pill / Tag Button"
          subtitle="h=28px | radius-full | font 12px weight 500. Three variants + optional X remove."
        >
          <Row label="Default">
            <PillButton variant="default" label="React" />
            <PillButton variant="default" label="TypeScript" />
            <PillButton variant="default" label="Senior" />
            <PillButton variant="default" label="Remote" />
          </Row>

          <Row label="Primary">
            <PillButton variant="primary" label="Screening" />
            <PillButton variant="primary" label="Interview" />
            <PillButton variant="primary" label="Offer" />
          </Row>

          <Row label="Accent">
            <PillButton variant="accent" label="AI Scored" />
            <PillButton variant="accent" label="Strong Match" />
            <PillButton variant="accent" label="Bias-Free" />
          </Row>

          <Row label="With X">
            {pillTags.map((tag) => (
              <PillButton
                key={tag}
                variant="primary"
                label={tag}
                onRemove={() => setPillTags((prev) => prev.filter((t) => t !== tag))}
              />
            ))}
            {pillTags.length === 0 && (
              <button
                onClick={() => setPillTags(['React', 'TypeScript', 'Node.js', 'AWS'])}
                className="font-body text-body-xs text-primary-500 hover:underline"
              >
                Reset tags
              </button>
            )}
          </Row>

          <Row label="Disabled">
            <PillButton variant="default" label="Cannot Remove" disabled />
            <PillButton variant="accent" label="Locked" disabled />
          </Row>
        </Section>

        {/* ── 8. HERO INLINE CTA ─────────────────────────────────────────── */}
        <Section
          title="Hero Inline CTA Pill"
          subtitle="Glass-morphism pill embedded in H1 headline on desktop. Degrades to full-width primary on mobile (resize to <640px to see)."
        >
          {/* Simulated dark hero context */}
          <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 rounded-xl p-10 mb-6">
            {/* Mesh gradient overlay simulation */}
            <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    'radial-gradient(ellipse at 15% 40%, rgba(37,99,235,0.5) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(16,185,129,0.4) 0%, transparent 50%)',
                }}
              />
            </div>

            <div className="relative">
              <p className="font-body text-body-xs text-accent-400 uppercase tracking-widest mb-4 font-semibold">
                Hero Headline Context
              </p>
              <h1 className="font-display font-extrabold text-display-xl text-white leading-tight tracking-[-2px]">
                Hire the Best.
                <span className="flex flex-wrap items-center gap-3 mt-1">
                  <span>
                    Before Your{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Competition
                    </span>
                  </span>
                  <HeroInlineCTA />
                </span>
              </h1>
            </div>
          </div>

          {/* Light context */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8">
            <p className="font-body text-body-xs text-neutral-400 uppercase tracking-widest mb-4 font-semibold">
              Light Background Context
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <HeroInlineCTA label="Start Free Trial" />
              <HeroInlineCTA label="Book a Demo" />
              <HeroInlineCTA label="Get Started Free" />
            </div>
            <p className="font-body text-body-xs text-neutral-400 mt-4">
              ↑ On mobile (&lt;640px), these render as full-width primary buttons — resize browser to verify.
            </p>
          </div>
        </Section>

        {/* ── 9. COMPOSITION EXAMPLES ────────────────────────────────────── */}
        <Section
          title="Composition Examples"
          subtitle="Real UI patterns — how buttons pair in context."
        >
          {/* Modal footer pattern */}
          <div className="mb-6">
            <p className="font-body text-body-xs text-neutral-400 uppercase tracking-wider mb-3">Modal Footer</p>
            <div className="flex justify-end gap-3 bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Confirm</Button>
            </div>
          </div>

          {/* Destructive confirmation */}
          <div className="mb-6">
            <p className="font-body text-body-xs text-neutral-400 uppercase tracking-wider mb-3">Destructive Confirmation</p>
            <div className="flex justify-end gap-3 bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <Button variant="ghost">Fix Issues First</Button>
              <Button variant="destructive">Publish Anyway</Button>
            </div>
          </div>

          {/* Job description step with AI */}
          <div className="mb-6">
            <p className="font-body text-body-xs text-neutral-400 uppercase tracking-wider mb-3">Job Description Step — AI Generate</p>
            <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <div className="flex gap-2">
                <Button variant="ghost" size="compact">← Back</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="accent" size="compact">Generate Description</Button>
                <Button variant="primary" size="compact" iconRight={<ArrowRight size={14} />}>Next: Requirements</Button>
              </div>
            </div>
          </div>

          {/* App header actions */}
          <div>
            <p className="font-body text-body-xs text-neutral-400 uppercase tracking-wider mb-3">App Header — Job Detail</p>
            <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <span className="font-display font-semibold text-h4 text-neutral-900">Senior Engineer</span>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="compact">Analytics</Button>
                <Button variant="secondary" size="compact">Edit Job</Button>
                <Button variant="primary" size="compact">+ Add Candidate</Button>
                <IconButton icon={<MoreHorizontal />} aria-label="More options" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── State Reference Guide ──────────────────────────────────────── */}
        <div className="bg-primary-950 rounded-2xl p-8 text-white">
          <h2 className="font-display font-bold text-h2 mb-2">State Reference</h2>
          <p className="font-body text-body-sm text-white/60 mb-6">
            Interaction guide — how to verify each state live on this page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { state: 'Hover', how: 'Mouse over any button', color: 'accent' },
              { state: 'Active', how: 'Click and hold without releasing', color: 'primary' },
              { state: 'Focus', how: 'Tab key to navigate to any button', color: 'accent' },
              { state: 'Disabled', how: 'Labelled "Disabled" — pointer-events blocked', color: 'neutral' },
              { state: 'Loading', how: 'Click the loading demos in Primary & Accent sections', color: 'accent' },
              { state: 'Focus Ring', how: 'Tab → see shadow-brand ring (3px primary-500/18%)', color: 'primary' },
            ].map(({ state, how }) => (
              <div key={state} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="font-body font-semibold text-body-sm text-white">{state}</p>
                <p className="font-body text-body-xs text-white/50 mt-1">{how}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="border-t border-neutral-200 mt-4 py-8 px-8 text-center">
        <p className="font-body text-body-xs text-neutral-400">
          TalentIQ — Button Component Test · Section 2.1 ·{' '}
          <span className="text-primary-500">All variants implemented</span>
        </p>
      </div>
    </div>
  )
}
