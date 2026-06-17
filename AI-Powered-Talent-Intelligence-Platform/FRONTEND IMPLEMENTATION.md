TALENTIQ — COMPLETE FRONTEND IMPLEMENTATION SPECIFICATION
AI-Powered Talent Intelligence Platform
Version 3.0 — Ultra Premium Edition
Inspired by NexusSci Reference Design (Fluid Mesh Gradient, Bento Grid, Inline CTA)
===========================================================================

===========================================================================
DESIGN PHILOSOPHY AND REFERENCE ANALYSIS
===========================================================================

The reference image (NexusSci) shows a design language with these distinct
characteristics that we are adapting — not copying — for TalentIQ:

1. FLUID MESH BACKGROUND: Animated blue-to-teal soft gradient waves fill
   the hero, creating a living, intelligent feel that no static color can
   match. The gradient is the personality of the page.

2. BENTO GRID BELOW THE FOLD: A tight asymmetric card grid immediately
   after the hero — a large card left, a stat card center, a testimonial/
   media card right — creates editorial density that communicates richness.

3. INLINE CTA INSIDE THE HEADING: The "Get Started" button is embedded
   inside the headline text, making the CTA feel part of the message rather
   than appended below it. Bold risk, premium payoff.

4. AVATAR CLUSTER IN HEADLINE: Small user avatars float inside the headline
   text, making the product feel alive and community-driven.

5. TIGHT ROUNDED CARDS: The bento cards use radius-2xl, solid fills, and
   high contrast text for at-a-glance reading.

6. MINIMAL NAV: Logo left, three centered links, two actions right.
   No heavy nav. Trust through restraint.

TalentIQ ADAPTATION:

- Swap NexusSci's blue scientific tone for our dual-tone system:
  deep navy (#0A2540) anchoring trust, living emerald (#10B981) for AI.
- The mesh gradient hero stays but shifts from pure blue to navy-to-emerald.
- Bento grid becomes our stat + feature preview cards below the hero.
- Inline CTA becomes "Start Free Trial" embedded in the hero headline.
- Avatar cluster shows real recruiter-persona avatars in the headline.
- Every card corner: Radius-2XL (24px). Bold, readable, modern.

THE ONE AESTHETIC RISK (justified):
The hero heading splits into two lines, with the second line containing an
embedded glass-morphism pill button inline with the text. This makes the
CTA impossible to miss and impossible to forget. On mobile this pill drops
below. The risk: it could look gimmicky. The justification: it positions
TalentIQ as a product confident enough to make its conversion the centerpiece
of its own headline, exactly like the reference design does.

===========================================================================
PART 1 — DESIGN TOKENS (COMPLETE DEFINITION)
===========================================================================

---

## 1.1 COLOR SYSTEM

PRIMARY SCALE (Navy — Trust, Authority, Foundation)

--color-primary-950: #040D1A
--color-primary-900: #0A2540
--color-primary-800: #0D3260
--color-primary-700: #1A4480
--color-primary-600: #1E56A0
--color-primary-500: #2563EB
--color-primary-400: #3B82F6
--color-primary-300: #60A5FA
--color-primary-200: #BFDBFE
--color-primary-100: #DBEAFE
--color-primary-50: #EFF6FF

ACCENT SCALE (Emerald — AI Intelligence, Success, Action)

--color-accent-700: #047857
--color-accent-600: #059669
--color-accent-500: #10B981 <- THE AI COLOR. Used on every AI touchpoint.
--color-accent-400: #34D399
--color-accent-300: #6EE7B7
--color-accent-200: #A7F3D0
--color-accent-100: #D1FAE5
--color-accent-50: #ECFDF5

NEUTRAL SCALE

--color-neutral-950: #0A0A0F
--color-neutral-900: #111827
--color-neutral-800: #1F2937
--color-neutral-700: #374151
--color-neutral-600: #4B5563
--color-neutral-500: #6B7280
--color-neutral-400: #9CA3AF
--color-neutral-300: #D1D5DB
--color-neutral-200: #E5E7EB
--color-neutral-100: #F3F4F6
--color-neutral-50: #F9FAFB
--color-white: #FFFFFF

SEMANTIC

--color-success: #10B981
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #3B82F6

AI SCORE BANDS

--score-high: #10B981 (80-100 — Strong match)
--score-medium: #F59E0B (60-79 — Moderate match)
--score-low: #EF4444 (0-59 — Weak match)

GRADIENT DEFINITIONS

--gradient-hero-mesh:
radial-gradient(ellipse at 15% 40%, rgba(37,99,235,0.18) 0%, transparent 55%),
radial-gradient(ellipse at 85% 15%, rgba(16,185,129,0.14) 0%, transparent 50%),
radial-gradient(ellipse at 55% 85%, rgba(10,37,64,0.10) 0%, transparent 50%),
radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.08) 0%, transparent 70%)

--gradient-cta:
linear-gradient(135deg, #2563EB 0%, #10B981 100%)

--gradient-card-feature:
linear-gradient(135deg, #EFF6FF 0%, #ECFDF5 100%)

--gradient-dark-hero:
linear-gradient(180deg, #0A2540 0%, #040D1A 100%)

--gradient-score-conic:
conic-gradient from emerald (high) through amber (mid) to red (low)

--gradient-glass:
linear-gradient(135deg,
rgba(255,255,255,0.15) 0%,
rgba(255,255,255,0.05) 100%)

BACKGROUND SYSTEM

--bg-page: #F9FAFB
--bg-card: #FFFFFF
--bg-sidebar: #FFFFFF
--bg-dark-hero: #0A2540
--bg-dark-footer: #040D1A
--bg-ai-section: #F0FDF4
--bg-modal-overlay: rgba(4,13,26,0.60)
--bg-glass: rgba(255,255,255,0.12)
--bg-glass-dark: rgba(10,37,64,0.60)

BORDER SYSTEM

--border-default: 1px solid #E5E7EB
--border-subtle: 1px solid #F3F4F6
--border-strong: 1px solid #D1D5DB
--border-primary: 1px solid #2563EB
--border-accent: 1px solid #10B981
--border-glass: 1px solid rgba(255,255,255,0.20)
--border-glass-dark: 1px solid rgba(255,255,255,0.08)

---

## 1.2 TYPOGRAPHY SYSTEM

FONT IMPORTS (add to <head> in \_document.tsx or layout.tsx):

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
  family=Plus+Jakarta+Sans:wght@600;700;800&
  family=Inter:wght@400;500;600&
  family=JetBrains+Mono:wght@400;500&
  display=swap" rel="stylesheet">

CSS FONT FAMILY TOKENS:

--font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace

DISPLAY SCALE (Plus Jakarta Sans — marketing pages only)

--text-display-2xl: 72px / 80px lh / -2.5px ls / weight 800
--text-display-xl: 56px / 64px lh / -2.0px ls / weight 800
--text-display-lg: 48px / 56px lh / -1.5px ls / weight 700

HEADING SCALE (Plus Jakarta Sans)

--text-h1: 36px / 44px lh / -0.75px ls / weight 700
--text-h2: 28px / 36px lh / -0.50px ls / weight 700
--text-h3: 22px / 30px lh / -0.25px ls / weight 600
--text-h4: 18px / 26px lh / 0px ls / weight 600
--text-h5: 15px / 22px lh / 0px ls / weight 600

BODY SCALE (Inter)

--text-body-xl: 20px / 32px lh / weight 400
--text-body-lg: 17px / 28px lh / weight 400
--text-body-md: 15px / 24px lh / weight 400
--text-body-sm: 13px / 20px lh / weight 400
--text-body-xs: 11px / 16px lh / weight 500

SPECIAL STYLES

Overline:
font: Inter
size: 11px
line-height: 16px
letter-spacing: 1.5px
weight: 600
text-transform: uppercase
colors: --color-accent-600 on light / --color-accent-300 on dark

Code/Mono:
font: JetBrains Mono
size: 13px
line-height: 20px
weight: 400

Gradient Text (hero only, max 3 words):
background: var(--gradient-cta)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
background-clip: text

Glass Pill Label (hero inline button):
font: Inter 14px weight 600
background: rgba(37,99,235,0.90) backdrop-blur(12px)
color: white
border: 1px solid rgba(255,255,255,0.25)
border-radius: 9999px
padding: 10px 20px
display: inline-flex
align-items: center
gap: 8px

---

## 1.3 SPACING SYSTEM (4px base)

--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-24: 96px
--space-32: 128px

Rule: Every margin, padding, and gap value MUST be from this scale.
Zero exceptions. If 28px is needed, use 24px or 32px.

---

## 1.4 BORDER RADIUS SYSTEM

--radius-xs: 4px — Status badges, micro chips
--radius-sm: 6px — Inputs, small buttons
--radius-md: 8px — Dropdowns, context menus, small cards
--radius-lg: 12px — Dashboard stat cards, modals
--radius-xl: 16px — Hero cards, pricing cards, side panels
--radius-2xl: 24px — Hero containers, marketing callouts
--radius-3xl: 32px — Full-bleed rounded section containers
--radius-full: 9999px — Avatars, toggles, pills, score rings

---

## 1.5 SHADOW SYSTEM

--shadow-xs: 0 1px 2px rgba(0,0,0,0.04)
--shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)
--shadow-lg: 0 12px 20px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05)
--shadow-xl: 0 24px 32px rgba(0,0,0,0.10), 0 8px 12px rgba(0,0,0,0.05)
--shadow-2xl: 0 40px 60px rgba(0,0,0,0.12), 0 16px 24px rgba(0,0,0,0.06)

--shadow-brand: 0 0 0 3px rgba(37,99,235,0.18)
--shadow-accent: 0 4px 16px rgba(16,185,129,0.28)
--shadow-accent-lg: 0 8px 32px rgba(16,185,129,0.20)
--shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06)
--shadow-glass: 0 8px 32px rgba(10,37,64,0.20),
inset 0 1px 0 rgba(255,255,255,0.20)

Card Hover Lift:
transition: box-shadow 150ms ease-out, transform 150ms ease-out
hover: shadow-md + translateY(-2px)

---

## 1.6 ANIMATION SYSTEM

DURATION TOKENS

--duration-instant: 80ms — Checkbox, focus ring
--duration-fast: 120ms — Button hover, nav hover
--duration-standard: 200ms — Dropdown, modal backdrop
--duration-deliberate: 300ms — Card hover, sidebar collapse
--duration-slow: 400ms — Page section entry
--duration-score: 600ms — Score ring fill
--duration-counter: 1200ms — Stats count-up
--duration-skeleton: 1400ms — Shimmer loop

EASING TOKENS

--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1) — Elements entering
--ease-in: cubic-bezier(0.4, 0.0, 1, 1) — Elements leaving
--ease-inout: cubic-bezier(0.4, 0.0, 0.2, 1) — State changes
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) — Bounce effects
--ease-linear: linear — Spinners, shimmer only

HERO MESH ANIMATION:
@keyframes meshFloat {
0% { transform: scale(1.00) translate(0px, 0px); opacity: 0.12; }
33% { transform: scale(1.04) translate(-8px, 6px); opacity: 0.14; }
66% { transform: scale(0.97) translate(6px, -4px); opacity: 0.10; }
100% { transform: scale(1.00) translate(0px, 0px); opacity: 0.12; }
}
Duration: 18s, infinite, ease-in-out.
Applies to gradient orb layers, staggered 6s between each.

SCROLL ENTRY ANIMATION (marketing pages only):
@keyframes fadeSlideUp {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}
Trigger: IntersectionObserver at 15% visibility threshold.
Duration: 400ms ease-out. Stagger children: 60ms gap.

SCORE RING FILL:
SVG stroke-dashoffset animated from full circumference to score value.
Duration: 600ms --ease-out. Plays once per component mount.

COUNTER COUNT-UP:
Uses requestAnimationFrame, linear progression.
Duration: 1200ms. Start value: 0. End value: stat value.
Triggers once on first viewport entry.

PREFERS-REDUCED-MOTION:
@media (prefers-reduced-motion: reduce) {
All transform animations: disabled (duration: 0ms)
Opacity transitions: 150ms preserved
Infinite animations: paused
Skeleton shimmer: paused
}

HOVER ANIMATIONS REFERENCE:

Button primary: translateY(-1px) + shadow increase / 120ms ease-out
Button accent (AI): translateY(-1px) + shadow-accent glow / 120ms ease-out
Card clickable: translateY(-2px) + shadow-sm → shadow-md / 150ms ease-out
Feature card: translateY(-4px) + shadow-lg / 200ms ease-out
Nav item: background fill / 100ms ease-out
Kanban card hover: cursor grab, no transform
Kanban drag: scale(1.02) + shadow-xl + rotate(0.8deg) / 100ms ease-out
Stat card: translateY(-2px) + shadow-lg / 150ms ease-out
Logo strip item: grayscale(0) + opacity 0.85 / 200ms ease-out
Inline CTA pill: scale(1.04) + shadow-accent / 120ms ease-out

MICRO-INTERACTION REFERENCE:

Toast appear: slide 16px + fade, 200ms ease-out, bottom-right
Toast dismiss: fade out, 150ms ease-in
Modal open: scale 0.97→1.0 + opacity 0→1, 200ms ease-out
Modal backdrop: opacity 0→1, 200ms ease-out
Dropdown open: scale 0.97→1.0 + opacity + translateY(-4px)→0, 150ms ease-out
Notification badge: scale 0→1 spring, once on count increment
Toggle thumb: translateX 150ms ease-in-out
Checkbox check: SVG stroke draw, 80ms linear
Hire stage move: card pulses accent-100 bg, 600ms total
Confetti: canvas-confetti, primary-500 + accent-500 colors
Notification bell: rotate 0→-12→12→-8→8→0deg, 200ms, on new notification
Score ring update: de-fill → re-fill, 300ms between

===========================================================================
PART 2 — COMPONENT LIBRARY (EVERY COMPONENT, EVERY STATE)
===========================================================================

---

## 2.1 BUTTON COMPONENTS

All buttons use font: Inter. Icon gap: 8px. Border radius: --radius-sm (6px).
All transitions: 120ms --ease-out unless noted.
Focus ring on ALL buttons: --shadow-brand. No outline: none without replacement.
Cursor: pointer. cursor: not-allowed on disabled.

--- PRIMARY BUTTON ---

Purpose: Most important action. One per view group.

Sizes:
compact: height 36px / padding 0 16px / font 13px weight 600
default: height 40px / padding 0 20px / font 14px weight 600
large: height 48px / padding 0 24px / font 15px weight 600

Visual:
background: var(--color-primary-500)
color: #FFFFFF
border: none
border-radius: var(--radius-sm)
shadow: var(--shadow-xs)

States:
default: as above
hover: background var(--color-primary-400) / translateY(-1px) / shadow-md
active: background var(--color-primary-600) / translateY(0) / shadow-inner
focus: shadow-brand outline
disabled: background var(--color-neutral-200) / color var(--color-neutral-400)
loading: label hidden / 20px spinner shown / width locked to prevent collapse

Icon variants:
icon-left: 16px icon + 8px gap + label
icon-right: label + 8px gap + 16px ArrowRight icon (for CTAs)

HTML structure:
<button class="btn btn-primary btn-default">
<span class="btn-icon-left">{icon}</span>
<span class="btn-label">Label</span>
<span class="btn-icon-right">{icon}</span>
</button>

CSS class structure:
.btn — base reset, flex, align-center, justify-center, gap
.btn-primary — color, background, border
.btn-default — height, padding, font-size
.btn-compact — height, padding, font-size (compact override)
.btn-large — height, padding, font-size (large override)

DO NOT combine .btn-primary with .btn-secondary etc — one variant class only.

--- SECONDARY BUTTON ---

Visual:
background: #FFFFFF
color: var(--color-neutral-900)
border: var(--border-default)
shadow: none

States:
hover: background var(--color-neutral-50) / border var(--color-neutral-300)
translateY(-1px)
active: background var(--color-neutral-100)
focus: shadow-brand
disabled: all neutral-300 / cursor not-allowed

--- GHOST BUTTON ---

Visual:
background: transparent
color: var(--color-neutral-700)
border: none
font-weight: 500

States:
hover: background var(--color-neutral-100)
active: background var(--color-neutral-200)
focus: shadow-brand

Use for: Cancel, secondary context actions, destructive confirmation dialogs.

--- ACCENT / AI BUTTON ---

Purpose: Exclusively for AI-triggered actions.
Valid uses ONLY: Generate Description, Score Candidates, Check for Bias,
Generate Interview Questions, Rescore, Analyze Resume.
Never use for non-AI actions.

Visual:
background: var(--color-accent-500)
color: #FFFFFF
border: none
left-icon: Sparkles (Lucide) 16px white — ALWAYS present

States:
hover: background var(--color-accent-600) / shadow-accent / translateY(-1px)
active: background var(--color-accent-700)
focus: 0 0 0 3px rgba(16,185,129,0.25)
disabled: background neutral-200 / color neutral-400
loading: spinner replaces label

CSS: .btn-accent — extends .btn

--- DESTRUCTIVE BUTTON ---

Visual:
background: #FEF2F2
color: #DC2626
border: 1px solid #FECACA
font-weight: 600

States:
hover: background #FEE2E2 / border #FCA5A5
focus: 0 0 0 3px rgba(220,38,38,0.15)

Use: Confirmation dialogs only. Never primary page action.

--- ICON BUTTON ---

Size: 36px × 36px (square)
background: transparent
border-radius: var(--radius-sm)
icon: 18px var(--color-neutral-500)

States:
hover: background var(--color-neutral-100)
active: background var(--color-neutral-200)
focus: shadow-brand

Dark variant (on dark bg):
icon: rgba(255,255,255,0.70)
hover: background rgba(255,255,255,0.08)

--- PILL / TAG BUTTON ---

Height: 28px / padding: 0 12px / border-radius: --radius-full
Font: Inter 12px weight 500

Variants:
default: neutral-100 bg / neutral-700 text
primary: primary-50 bg / primary-700 text
accent: accent-100 bg / accent-700 text

With X close button: add 4px gap right + 14px X icon button (icon button sm)

--- INLINE CTA PILL (Hero signature element) ---

This is the hero's inline CTA embedded inside the headline text.
NOT a standard button — it lives inline in a flex headline container.

Visual:
display: inline-flex
align-items: center
gap: 8px
padding: 10px 20px
background: rgba(37,99,235,0.92)
backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.25)
border-radius: var(--radius-full)
color: #FFFFFF
font: Inter 15px weight 600
shadow: var(--shadow-glass)
vertical-align: middle

Icon right: ArrowUpRight 14px white

States:
hover: scale(1.04) / shadow-accent / background rgba(37,99,235,1) / 120ms
active: scale(0.98)

HTML:

  <h1 class="hero-heading">
    Hire the Best.
    <span class="hero-heading-line2">
      Before Your Competition
      <button class="hero-inline-cta">
        Start Free Trial
        <ArrowUpRightIcon size={14} />
      </button>
    </span>
  </h1>

IMPORTANT: On mobile (below 640px), this button drops below the headline
as a full-width standard Primary large button. The inline version is
desktop/tablet only.

---

## 2.2 INPUT COMPONENTS

All inputs share base:
font: Inter 14px / color: neutral-900 / placeholder: neutral-400
border: var(--border-default) / border-radius: var(--radius-sm)
transition: border-color 120ms, box-shadow 120ms

--- TEXT INPUT ---

Height: 40px / padding: 0 14px / background: white

States:
default: border neutral-200
hover: border neutral-300
focus: border primary-500 / shadow-brand
error: border #EF4444 / shadow: 0 0 0 3px rgba(239,68,68,0.15)
disabled: background neutral-50 / border neutral-200 / color neutral-400
filled: border neutral-300

Label: Inter 13px weight 500 neutral-700 / 6px above input
Helper text: Inter 12px weight 400 neutral-500 / 4px below
Error text: Inter 12px weight 400 #EF4444 / 4px below / with AlertCircle 12px inline

HTML structure:

  <div class="form-field">
    <label class="form-label" for="field-id">Label</label>
    <input class="form-input" id="field-id" type="text" />
    <span class="form-helper">Helper text</span>
    <span class="form-error" aria-live="polite">
      <AlertCircleIcon size={12} /> Error message
    </span>
  </div>

--- SEARCH INPUT ---

Extends text input. Additional:
padding-left: 40px (to clear prepended icon)
Search icon: 16px neutral-400 / absolute left 12px / vertically centered
Clear (X) button: 16px icon button / absolute right 10px
Shows when value is non-empty (opacity 0→1 120ms)

--- PASSWORD INPUT ---

Extends text input. Additional:
Eye / EyeOff icon button 16px / absolute right 12px
Toggles type="password" ↔ type="text"

--- SELECT ---

Appearance: mirrors text input exactly.
ChevronDown 16px neutral-400 / absolute right 12px
ChevronDown rotates 180deg on open (150ms ease-out)

Dropdown panel:
background: white
shadow: var(--shadow-lg)
border-radius: var(--radius-md)
border: var(--border-subtle)
max-height: 240px overflow-y auto
padding: 4px
z-index: 200

Option item:
height: 36px / padding: 0 12px / font: 14px neutral-900
border-radius: --radius-xs (inside list)
hover: neutral-50 bg
selected: primary-50 bg / primary-700 text / Check icon 14px right

Group divider: 1px neutral-100 / 4px vertical margin

--- MULTI-SELECT ---

Pills render inside the input container (input grows vertically).
Pill: primary-100 bg / primary-700 text / 10px font / radius-full / padding 2px 8px
X to remove: 10px icon button on each pill
Max visible: 3 pills → "+N more" overflow chip
Input text: 14px / inline after pills

--- TEXTAREA ---

Min-height: 96px / padding: 12px 14px / resize: vertical
Line-height: 24px / same border & focus as text input

--- RICH TEXT EDITOR (Job Description) ---

Outer container: same border treatment as text input
Focus: border primary-500 / shadow-brand on outer container

Toolbar:
height: 40px
background: neutral-50
border-bottom: var(--border-default)
padding: 0 8px
Buttons: Bold, Italic, BulletList, OrderedList, Link (each 28px icon button)

Content area:
min-height: 240px
padding: 16px
font: Inter 15px neutral-900

--- FILE UPLOAD ZONE ---

border: 2px dashed neutral-200
border-radius: var(--radius-lg)
background: neutral-50
padding: 40px 32px
text-align: center

Content stack:
UploadCloud icon 32px neutral-400
Title: 14px weight 600 neutral-700 "Drag your resume here"
Subtitle: 12px neutral-500 "or click to browse — PDF up to 10MB"

States:
drag-over:
border: 2px dashed primary-400
background: primary-50
icons + text: primary-500

uploaded:
background: white
File icon (20px) + filename (14px weight 500) + size (12px neutral-500)
Red X remove button (icon button) right-aligned

error:
border: 2px dashed #EF4444
error message 12px #EF4444 below zone

--- PASSWORD STRENGTH METER ---

Appears below password input on register page.

3-segment horizontal bar (Weak / Fair / Strong):
Segment: 4px height / radius-full
Weak: 1 segment red (#EF4444)
Fair: 2 segments warning (#F59E0B)
Strong: 3 segments accent-500

Label: "Weak" / "Fair" / "Strong" Inter 12px weight 500 matching color
Transition: segment fills 200ms ease-out

--- DATE RANGE PICKER ---

Two-month calendar view in a floating panel (shadow-lg, radius-xl)
Date cells: 32px × 32px
Selected range: accent-50 background fill between start and end dates
Start/end date cells: accent-500 bg, white text, radius-full
Today: bold weight, primary-500 text
Hover: neutral-100 bg, radius-full

--- SCORE RANGE SLIDER (Dual Handle) ---

Track: 4px height / neutral-200 bg / radius-full
Filled range: primary-500 bg (between the two handles)
Handle: 18px circle / white bg / shadow-md / border 2px primary-500
Handle hover: scale(1.2) / shadow-lg / 120ms ease-out
Thumb tooltip: shows current value above handle on drag

---

## 2.3 CARD COMPONENTS

--- BASE CARD ---

background: white
border: var(--border-default)
border-radius: var(--radius-lg)
shadow: var(--shadow-sm)
padding: 24px

Hover (clickable cards):
shadow: var(--shadow-md)
transform: translateY(-2px)
transition: 150ms ease-out
cursor: pointer

--- PREMIUM STAT CARD (Dashboard) ---

background: white
border-radius: var(--radius-xl)
shadow: var(--shadow-sm)
padding: 24px

Layout (top to bottom):

Row 1 — Icon + Value:
LEFT: Icon container
width: 40px, height: 40px
border-radius: radius-full
background: primary-50 OR accent-50 (alternates by card type)
icon: 20px primary-500 OR accent-500
RIGHT (right-aligned):
Value: Plus Jakarta Sans 28px weight 700 neutral-900
Label: Inter 13px weight 500 neutral-500 / 2px below value

Row 2 — Delta:
margin-top: 12px
ArrowUpRight (positive) OR ArrowDownRight (negative) icon 12px
Delta value: Inter 12px weight 600
positive: #10B981
negative: #EF4444
Period label: Inter 12px neutral-400 / "vs last week" etc

Row 3 — Sparkline (optional, bottom edge):
height: 56px / full card width (no padding)
Line: primary-300 OR accent-300 / no axis labels
Area fill: matching color at 8% opacity under the line

Hover: translateY(-2px) / shadow-md / 150ms ease-out

--- KANBAN CANDIDATE CARD ---

background: white
border-radius: var(--radius-md)
border: var(--border-default)
shadow: var(--shadow-sm)
padding: 14px 16px
position: relative

Left accent bar:
width: 3px / height: 100% / position absolute left 0 top 0 bottom 0
border-radius: 3px 0 0 3px
color: matches AI score band (#10B981 / #F59E0B / #EF4444)

Layout rows:
Row 1: candidate name (15px weight 600 neutral-900) / AI score badge (right)
Row 2: job role (13px neutral-500) / source pill (right)
Row 3: days-in-stage label (11px neutral-400) / recruiter avatar 20px (right)

AI Score Badge (inline, row 1 right):
32px × 32px circle
SVG ring stroke: score color band
Ring background: score color at 8% opacity
Center text: score number 10px weight 700 matching score color
On hover: tooltip "AI Score: 84/100 — Strong skill match"

States:
default: as above
hover: shadow-md / cursor: grab
dragging: scale(1.02) / shadow-xl / rotate(0.8deg) / cursor: grabbing
selected: primary-50 background / primary-500 border 1px

Right-click / three-dot:
Context menu with: View Profile, Move Stage, Schedule Interview,
Send Message, Add Note, Reject (destructive)

--- BENTO GRID CARD (Marketing/Hero Below Fold — reference image style) ---

Used in the section immediately below the hero (matching reference image grid).

Card A — Feature Card (large, left):
background: var(--color-primary-500)
border-radius: var(--radius-2xl)
padding: 40px
color: white
shadow: var(--shadow-xl)

Content:
Icon: AI/sparkles 48px white at top
Headline: "AI-powered platform for faster, fairer hiring." 20px weight 700 white
Subtext: 14px white 70%
"Learn More" secondary pill button bottom: white bg / primary-500 text
width: 160px / height: 44px / radius-full

Card B — Stat Card (center):
background: var(--color-neutral-50)
border: var(--border-default)
border-radius: var(--radius-2xl)
padding: 32px 24px
shadow: var(--shadow-sm)

Large stat number: Plus Jakarta Sans 56px weight 800 neutral-900
Sub-label: 16px neutral-600 / "Faster time-to-hire" etc
Small description: 13px neutral-500 / "Research at your fingertips" style

Card C — Social Proof Card (right):
background: var(--color-neutral-900)
border-radius: var(--radius-2xl)
padding: 32px
shadow: var(--shadow-xl)
overflow: hidden

Accent overlay: radial gradient accent-500 at 12% opacity top-right
Content:
Play button circle (48px / white / shadow-lg) absolute top-right for future video
Quote: 16px white italic max 220px
Author: white weight 600 14px
Role: white 70% 12px
"See reviews from our users" — white 80% 14px bottom

Bento grid layout:
display: grid
grid-template-columns: 1.4fr 1fr 1fr
gap: 16px
max-width: 1100px
margin-top: 48px

Mobile: stack all three vertically, full width.
Tablet: Card A full width top, Card B + C 50/50 below.

--- FEATURE CARD (Marketing Features Section) ---

background: var(--gradient-card-feature)
border: 1px solid rgba(37,99,235,0.10)
border-radius: var(--radius-xl)
padding: 32px

Icon container:
48px × 48px / radius-lg
background: linear-gradient(135deg, primary-50 0%, accent-50 100%)
icon: 24px primary-500 OR accent-500

Title: Plus Jakarta Sans 18px weight 600 neutral-900 / 16px below icon
Description: Inter 15px neutral-600 / 8px below title

Hover: translateY(-4px) / shadow-lg / 200ms ease-out

--- PRICING CARD ---

Standard:
background: white / border: border-default / border-radius: radius-xl
shadow: shadow-sm / padding: 32px

Header section:
Overline: plan name / 11px uppercase neutral-500
Price: Plus Jakarta Sans 36px weight 800 neutral-900
Period: Inter 15px neutral-500 inline " /month"
Sub-line: 14px neutral-600 / 8px below price

Divider: 1px neutral-100 / 16px vertical margin

Feature list:
Items: CheckCircle icon 14px accent-500 + 13px neutral-700 / 10px gap
Row gap: 12px

CTA: full-width primary button / margin-top 24px

Featured (Growth) — HIGHLIGHTED CARD:
background: var(--color-primary-900) #0A2540
border: none / shadow: shadow-xl
transform: scale(1.04)
padding: 36px

"Most Popular" badge:
absolute: top -12px right 20px
background: accent-500 / white text 10px weight 600
padding: 6px 14px / radius-full

All text: white (primary text) / white 70% (secondary)
Feature list check icons: accent-400
CTA: white bg / primary-500 text (inverted primary button)

--- AI SCORE DETAIL CARD ---

background: white / border: border-default / border-radius: radius-lg
padding: 20px

Score ring (SVG):
72px × 72px diameter
Outer ring: neutral-100 (track) / 8px stroke width
Inner ring: score color band / 8px stroke width / stroke-dasharray animated
Center: score number 16px weight 700 matching score color
Below: "Strong Match" label 12px accent-700 (or matching band label)
Margin below ring: 12px

Subscores (4 rows):
Label: 13px neutral-700 left
Percent: 13px weight 600 neutral-700 right
Bar track: neutral-100 / 6px height / radius-full / below text row
Bar fill: matching color band / animated width on mount 800ms ease-out

"Why this score" section:
Header: "Why this score" 13px weight 600 neutral-700
Items: 13px neutral-700 each
Positive: ThumbsUp 14px accent-500 inline
Negative: ThumbsDown 14px #EF4444 inline

Strengths pills row: accent-100 bg / accent-700 text / radius-full / 10px font
Gaps pills row: amber-100 bg / amber-700 text / radius-full / 10px font

--- TESTIMONIAL CARD ---

background: white / border-radius: radius-xl / padding: 32px
shadow: shadow-sm

Stars row: 5 × star icon 14px #FBBF24 / gap 2px
Quote: Inter 17px neutral-900 italic / max-width 340px / 12px below stars
Quote marks: decorative " character 32px primary-200 weight 800 above quote

Author row (below quote, 16px margin):
Avatar: 44px × 44px / radius-full / shadow-xs
Name: 14px weight 600 neutral-900
Title + company: 12px neutral-500

Metric callout (bottom): accent-500 14px weight 700 / 16px top margin
"Cut time-to-hire by 62%" style — always a specific number.

--- GLASS CARD (for dark section overlays) ---

background: var(--bg-glass)
backdrop-filter: blur(12px)
border: var(--border-glass)
border-radius: var(--radius-xl)
shadow: var(--shadow-glass)
color: white

---

## 2.4 NAVIGATION COMPONENTS

--- MARKETING TOP NAVIGATION ---

Height: 64px
Position: sticky top 0 / z-index 100
Transition: all 200ms ease-out (background, shadow, border on scroll)

State AT TOP (0px scroll):
background: rgba(255,255,255,0.92) backdrop-blur(0px)
border-bottom: none
shadow: none

State SCROLLED (60px+):
background: rgba(255,255,255,0.90) backdrop-blur(12px)
border-bottom: var(--border-subtle)
shadow: var(--shadow-xs)

Inner layout (max-width 1200px, centered):
Left: Logo (wordmark + AI spark icon) / 28px height / color version
Center: Nav links - Features - Solutions - Pricing - Customers
Right: - "Log in" — Ghost compact button - "Start Free Trial" — Primary compact button with ArrowRight icon

Nav links:
font: Inter 14px weight 500 neutral-700
hover: color neutral-900 / 120ms ease-out
Active link: neutral-900 / relative after: 2px bottom border primary-500

Dropdown trigger links:
ChevronDown 12px inline after label
rotates 180deg on open

Dropdown panel:
background: white / shadow: shadow-lg / border-radius: radius-lg / padding: 8px
border: var(--border-subtle)
min-width: 220px
Each item: 40px height / icon 18px + title 14px weight 500 + subtitle 12px neutral-500
Row hover: neutral-50 bg / radius-md

Mobile (below 768px):
Logo left / Hamburger right (28px icon button)
Center links: hidden

Mobile Drawer:
Right side drawer / width 280px / height 100vh
background: white / shadow: shadow-xl
Slides from right: translateX(100%→0) 250ms ease-out
Backdrop: rgba overlay
All links as full-width rows 56px height
Footer: auth buttons stacked
Close X button: top-right 16px from edges

--- APP SIDEBAR ---

Width (expanded): 260px
Width (collapsed): 64px (icons only)
Height: 100vh sticky top 0
background: white
border-right: var(--border-default)
transition: width 300ms --ease-inout

Collapse/expand toggle button:
Position: absolute right -12px top 72px
Size: 24px × 24px circle
background: white / shadow: shadow-md / radius-full
ChevronLeft icon 12px / rotates 180deg when collapsed
On click: toggle sidebar width

TOP SECTION (padding: 20px 16px):
Company logo circle: 28px / radius-full
Company name: 14px weight 600 neutral-900 / hides when collapsed
Plan badge: pill / accent-100 bg / accent-700 text / 10px weight 600 / hides when collapsed
ChevronDown 14px: workspace switcher (multi-tenant)

NAVIGATION GROUPS (padding-top: 8px):

Section labels:
font: Inter 10px uppercase weight 700 neutral-400
padding: 20px 12px 6px
hidden when sidebar collapsed

Nav item structure:
height: 40px
padding: 0 12px
border-radius: radius-md
display: flex / align-items: center
gap: 10px
cursor: pointer
transition: all 100ms ease-out

Icon: 18px Lucide icon
Label: Inter 13px weight 500
Badge (optional): absolute top-right of icon / 16px circle / primary-500 bg / white text 9px

States:
default: neutral-600 text / neutral-500 icon / transparent bg
hover: neutral-900 text / neutral-700 icon / neutral-50 bg
active: primary-700 text / primary-500 icon / primary-50 bg + 2px solid primary-500 left bar (absolute left 0)

Collapsed state:
Only icon shown (centered)
Tooltip on hover: label in neutral-900 bg / white text / radius-md

NAVIGATION ITEMS (Recruiter role):

MAIN GROUP:
LayoutDashboard — Dashboard
Briefcase — Jobs
Users — Candidates
GitMerge — Pipeline

RECRUITING GROUP:
Calendar — Interviews
FileText — Offers
MessageSquare — Messages

INSIGHTS GROUP:
BarChart2 — Analytics
Lightbulb — AI Insights

SETTINGS (bottom):
Settings — Settings

BOTTOM SECTION (padding: 16px, border-top: var(--border-subtle)):
User avatar: 32px / radius-full
User name: 13px weight 500 neutral-900 (hidden collapsed)
Email: 11px neutral-500 (hidden collapsed)
Settings icon button: absolute right

--- APP HEADER (top bar) ---

Height: 60px
background: white
border-bottom: var(--border-default)
padding: 0 32px
display: flex / align-items: center / justify-content: space-between

LEFT — Breadcrumb:
Back arrow (if nested) → Parent name (13px neutral-500) → "/" divider → Page title
Page title: Plus Jakarta Sans 17px weight 600 neutral-900

RIGHT cluster (gap: 8px):
Search input: 280px width / 36px height / compact style
Notification bell: icon button / badge dot (8px accent-500 circle) when unread
User avatar: 32px radius-full / dropdown on click

User dropdown panel:
shadow-lg / radius-lg / border: border-subtle / padding: 8px
Header: email address 12px neutral-500 / padding 12px
Divider
Items: Profile Settings, Account Settings, Billing (14px neutral-900)
Divider
Sign out: 14px #DC2626

--- MOBILE BOTTOM TAB BAR ---

Height: 64px
background: white
border-top: var(--border-default)
shadow: 0 -4px 12px rgba(0,0,0,0.06)
Position: fixed bottom 0 / z-index 100

5 tabs: Home, Jobs, Pipeline, Interviews, More
Each tab: flex-col / icon 20px + label 10px weight 600 / padding 10px

States:
active: primary-500 icon / primary-600 label
inactive: neutral-400 icon / neutral-400 label

---

## 2.5 TABLE COMPONENT

Container: background white / border: border-default / border-radius: radius-lg
overflow: hidden

Header row:
background: neutral-50
height: 44px / padding: 0 16px
font: Inter 11px uppercase weight 700 neutral-500
border-bottom: var(--border-default)

Body row:
background: white
height: 56px / padding: 0 16px
font: Inter 14px neutral-900
border-bottom: 1px solid neutral-100
transition: background 80ms

States:
hover: neutral-50 bg / cursor pointer (if clickable)
selected: primary-50 bg / 3px primary-500 left border

Sortable column header:
ChevronUp/Down 12px neutral-300 appears on hover
Active sort: neutral-900 text + solid direction arrow

Checkbox column: 44px width / centered / 16px checkbox

Row action buttons: icon buttons in a flex row (right-aligned, gap 4px)
Show on row hover (opacity 0→1 120ms)

Pagination row:
padding: 16px / border-top: var(--border-subtle)
display: flex / align-items: center / justify-content: space-between

Left: "Showing X-Y of Z results" 13px neutral-500
Center: page numbers (14px neutral-700, active: primary-500 weight 600)
Right: items-per-page select (compact / 120px width)

Prev/Next: secondary compact buttons

Empty state (inside tbody):
padding: 64px 24px
text-align: center
Icon: 40px neutral-300
Title: 15px weight 600 neutral-700
Description: 13px neutral-500
CTA (optional): primary button / margin-top 16px

Skeleton loading (5 rows):
Each row same height as real row
Each cell: skeleton block (width varies by column) with shimmer

---

## 2.6 MODAL COMPONENT

Backdrop:
background: var(--bg-modal-overlay)
backdrop-filter: blur(6px)
position: fixed inset 0 / z-index 300
animation: opacity 0→1 200ms ease-out

Container:
background: white / shadow: shadow-xl / border-radius: radius-xl
position: fixed / top 50% left 50% / transform: translate(-50%, -50%)
z-index 301
animation: scale 0.97→1.0 + opacity 0→1 / 200ms ease-out

Size variants:
sm: width 400px
md: width 560px
lg: width 720px
xl: width 920px
full: width 95vw / max-height 95vh / overflow-y auto

Header: padding 24px 24px 0
Title: Plus Jakarta Sans 18px weight 600 neutral-900
Subtitle (optional): 14px neutral-500 / 4px below title
Close button (X icon button): absolute top 16px right 16px

Body: padding 24px

Footer: padding 0 24px 24px
display: flex / justify-content: flex-end / gap: 12px
Ghost "Cancel" left / Primary "Confirm" right

Accessibility:
role="dialog"
aria-modal="true"
aria-labelledby pointing to modal title
Focus trap: Tab cycles only within modal
ESC: always closes
Backdrop click: closes non-confirmation modals
On open: focus first interactive element
On close: return focus to trigger

---

## 2.7 TOAST NOTIFICATIONS

Position: fixed bottom-right / 24px from edges
Width: 360px
z-index: 400

Visual:
background: white
border-radius: radius-lg
shadow: shadow-lg
border-left: 4px solid (type color)
padding: 16px

Content:
Icon row: 18px semantic icon (type color) left / X close button (icon button) right
Title: Inter 13px weight 600 neutral-900 (8px left of icon)
Description: Inter 13px neutral-600 / 2px below title

Type colors:
success: border #10B981 / icon CheckCircle accent-500
error: border #EF4444 / icon AlertCircle #EF4444
warning: border #F59E0B / icon AlertTriangle #F59E0B
info: border #3B82F6 / icon Info #3B82F6

Auto-dismiss:
success: 4000ms
info: 5000ms
warning: 6000ms
error: manual dismiss only

Stack behavior:
Max 3 visible / 8px gap between
New toast enters from bottom / old toasts shift up
Overflow toasts: queue until others dismiss

Animation:
Enter: translateX(16px)→0 + opacity 0→1 / 200ms ease-out
Exit: opacity 1→0 / 150ms ease-in

Accessibility:
success/info: role="status"
error/warning: role="alert"

---

## 2.8 AI PROCESSING STATES

--- AI PROCESSING INDICATOR ---

Three dots (Sparkles color = accent-500):
Each dot: 6px circle / gap: 4px
Animation: scale pulse 1.0→1.4→1.0 / 400ms ease-in-out infinite
Stagger: 120ms between dots

Loading message (below dots):
Inter 13px neutral-500 italic
Specific messages (NOT "Loading..."):
"Analyzing resume skills... usually 5 seconds"
"Scoring against job requirements..."
"Generating your description... about 20 seconds"
"Checking for bias patterns..."
"Generating interview questions..."

--- SKELETON SHIMMER ---

Base color: neutral-100
Shimmer gradient:
linear-gradient(90deg,
#F3F4F6 0%,
#E5E7EB 40%,
#E5E7EB 60%,
#F3F4F6 100%)
background-size: 200% 100%
Animation: @keyframes shimmer / background-position 200%→-200% / 1400ms linear infinite

Skeleton components:
skeleton-text: height 14px / radius-sm / various widths (80%, 60%, 90%)
skeleton-heading: height 22px / radius-sm / 70% width
skeleton-avatar: circle / same size as real avatar
skeleton-badge: 28px height / 80px width / radius-full
skeleton-card: same dimensions as real card / padding 24px
skeleton-ring: 72px circle / radius-full

---

## 2.9 SCORE RING SVG COMPONENT

<svg viewBox="0 0 80 80" width="80" height="80">
  <!-- Track ring -->
  <circle
    cx="40" cy="40" r="32"
    fill="none"
    stroke="var(--color-neutral-100)"
    stroke-width="8"
  />
  <!-- Score ring -->
  <circle
    cx="40" cy="40" r="32"
    fill="none"
    stroke="[score-color]"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="[circumference]"
    stroke-dashoffset="[computed-from-score]"
    transform="rotate(-90 40 40)"
    style="transition: stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1)"
  />
  <!-- Center label -->
  <text x="40" y="44"
    text-anchor="middle"
    font-family="Inter" font-size="16" font-weight="700"
    fill="[score-color]">[score]</text>
</svg>

Circumference: 2 × π × 32 = 201.06
Dashoffset formula: circumference × (1 - score/100)

Animate on mount: dashoffset starts at full circumference, transitions to computed value.
Color logic:
score >= 80: --score-high (#10B981)
score >= 60: --score-medium (#F59E0B)
score < 60: --score-low (#EF4444)

Sizes:
sm: 32px (Kanban card badge)
md: 72px (Application side panel)
lg: 80px (Application detail page)
xl: 100px (AI demo section on marketing page)

---

## 2.10 BIAS WARNING PANEL

Container:
background: #FFFBEB
border: 1px solid #F59E0B
border-radius: radius-lg
padding: 16px
margin-top: 16px

Header row:
AlertTriangle icon 18px #F59E0B
"Bias check flagged [N] issues" Inter 14px weight 600 neutral-900
margin-left 8px from icon

Each flag item (gap 12px, margin-top 12px):
Flagged phrase: Inter 13px weight 600 in quotes / neutral-900
Category badge: 10px pill / warning-100 bg / warning-700 text
Suggestion: Inter 13px neutral-600 / 4px below phrase

Action row (margin-top 16px, gap 8px):
"Fix All" primary button compact
"Ignore and continue" ghost button compact

Severity colors:
low: border #10B981 / bg #F0FDF4
medium: border #F59E0B / bg #FFFBEB
high: border #EF4444 / bg #FEF2F2

===========================================================================
PART 3 — FILE AND FOLDER STRUCTURE
===========================================================================

This is the COMPLETE file structure for the Next.js 14 App Router frontend.
Every file is listed. No file is omitted.

/
├── public/
│ ├── fonts/ (if self-hosting — otherwise Google Fonts)
│ ├── images/
│ │ ├── logo.svg (TalentIQ wordmark)
│ │ ├── logo-white.svg (white version for dark backgrounds)
│ │ ├── logo-icon.svg (spark icon only)
│ │ ├── hero-product.png (hero screenshot — kanban view)
│ │ ├── og-image.png (1200×630 Open Graph image)
│ │ └── avatars/ (persona avatars for hero cluster)
│ │ ├── recruiter-1.jpg
│ │ ├── recruiter-2.jpg
│ │ └── recruiter-3.jpg
│ └── favicon.ico
│
├── src/
│ ├── app/
│ │ ├── layout.tsx (root layout — fonts, providers, metadata)
│ │ ├── globals.css (CSS custom properties, base resets)
│ │ │
│ │ ├── (marketing)/ (route group — marketing pages)
│ │ │ ├── layout.tsx (marketing shell — header + footer only)
│ │ │ ├── page.tsx (home page — / )
│ │ │ ├── pricing/
│ │ │ │ └── page.tsx
│ │ │ ├── features/
│ │ │ │ └── page.tsx
│ │ │ ├── customers/
│ │ │ │ └── page.tsx
│ │ │ └── solutions/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (auth)/ (route group — auth pages, no sidebar)
│ │ │ ├── layout.tsx (split-screen auth layout)
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx
│ │ │ ├── reset-password/
│ │ │ │ └── page.tsx
│ │ │ └── invite/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (app)/ (route group — authenticated app)
│ │ │ ├── layout.tsx (app shell — sidebar + header)
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ ├── jobs/
│ │ │ │ ├── page.tsx (job list)
│ │ │ │ ├── new/
│ │ │ │ │ └── page.tsx (job creation wizard)
│ │ │ │ └── [id]/
│ │ │ │ ├── page.tsx (job detail)
│ │ │ │ ├── pipeline/
│ │ │ │ │ └── page.tsx (kanban board)
│ │ │ │ └── analytics/
│ │ │ │ └── page.tsx
│ │ │ ├── applications/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx (application detail)
│ │ │ ├── interviews/
│ │ │ │ ├── page.tsx (interview calendar)
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx
│ │ │ ├── offers/
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx
│ │ │ ├── analytics/
│ │ │ │ └── page.tsx
│ │ │ └── settings/
│ │ │ ├── page.tsx (general settings)
│ │ │ ├── users/
│ │ │ │ └── page.tsx
│ │ │ ├── pipeline/
│ │ │ │ └── page.tsx
│ │ │ ├── billing/
│ │ │ │ └── page.tsx
│ │ │ ├── integrations/
│ │ │ │ └── page.tsx
│ │ │ ├── templates/
│ │ │ │ └── page.tsx
│ │ │ ├── security/
│ │ │ │ └── page.tsx
│ │ │ └── api/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (onboarding)/ (route group — onboarding wizard)
│ │ │ ├── layout.tsx (full-screen white + progress)
│ │ │ └── onboarding/
│ │ │ ├── page.tsx (redirects to step/1)
│ │ │ └── step/
│ │ │ └── [step]/
│ │ │ └── page.tsx
│ │ │
│ │ └── (portal)/ (route group — candidate portal)
│ │ ├── layout.tsx (minimal layout)
│ │ ├── apply/
│ │ │ └── [jobId]/
│ │ │ └── page.tsx
│ │ └── status/
│ │ └── page.tsx
│ │
│ ├── components/
│ │ │
│ │ ├── ui/ (shadcn/ui primitives — DO NOT modify structure)
│ │ │ ├── button.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── select.tsx
│ │ │ ├── textarea.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── card.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── toast.tsx
│ │ │ ├── toaster.tsx
│ │ │ ├── tooltip.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── slider.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── checkbox.tsx
│ │ │ ├── progress.tsx
│ │ │ ├── skeleton.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── scroll-area.tsx
│ │ │ ├── accordion.tsx
│ │ │ ├── calendar.tsx
│ │ │ ├── command.tsx
│ │ │ └── sheet.tsx
│ │ │
│ │ ├── layout/ (structural layout components)
│ │ │ ├── AppShell.tsx (sidebar + header wrapper)
│ │ │ ├── Sidebar.tsx (full sidebar implementation)
│ │ │ ├── SidebarItem.tsx (individual nav item)
│ │ │ ├── AppHeader.tsx (top bar)
│ │ │ ├── Breadcrumb.tsx
│ │ │ ├── MarketingNav.tsx (marketing top nav)
│ │ │ ├── Footer.tsx (marketing footer)
│ │ │ ├── MobileBottomNav.tsx
│ │ │ ├── MobileDrawer.tsx
│ │ │ └── PageContainer.tsx (max-width + padding wrapper)
│ │ │
│ │ ├── marketing/ (marketing page sections)
│ │ │ ├── HeroSection.tsx
│ │ │ ├── HeroInlineCTA.tsx (the inline pill CTA in headline)
│ │ │ ├── HeroAvatarCluster.tsx
│ │ │ ├── HeroProductMockup.tsx
│ │ │ ├── HeroFloatingBadge.tsx
│ │ │ ├── HeroMeshBackground.tsx (animated gradient)
│ │ │ ├── BentoGrid.tsx (3-card bento below hero)
│ │ │ ├── BentoFeatureCard.tsx
│ │ │ ├── BentoStatCard.tsx
│ │ │ ├── BentoSocialCard.tsx
│ │ │ ├── LogoStrip.tsx
│ │ │ ├── StatsStrip.tsx
│ │ │ ├── StatCounter.tsx (animated count-up)
│ │ │ ├── AIExplainerSection.tsx
│ │ │ ├── AIScoreDemo.tsx (animated demo card)
│ │ │ ├── FeaturesShowcase.tsx
│ │ │ ├── FeatureCard.tsx
│ │ │ ├── PipelineExplainerSection.tsx
│ │ │ ├── PipelineStepDiagram.tsx
│ │ │ ├── PersonasSection.tsx
│ │ │ ├── PersonaCard.tsx
│ │ │ ├── IntegrationsSection.tsx
│ │ │ ├── IntegrationGrid.tsx
│ │ │ ├── PricingSection.tsx
│ │ │ ├── PricingCard.tsx
│ │ │ ├── PricingToggle.tsx (monthly/annual toggle)
│ │ │ ├── TestimonialsSection.tsx
│ │ │ ├── TestimonialCard.tsx
│ │ │ ├── FAQSection.tsx
│ │ │ ├── FAQItem.tsx
│ │ │ ├── FinalCTASection.tsx
│ │ │ └── SectionWrapper.tsx (scroll animation wrapper)
│ │ │
│ │ ├── dashboard/ (dashboard-specific components)
│ │ │ ├── StatCard.tsx
│ │ │ ├── SparklineChart.tsx
│ │ │ ├── KanbanOverview.tsx
│ │ │ ├── ActivityFeed.tsx
│ │ │ ├── ActivityItem.tsx
│ │ │ ├── AIInsightsPanel.tsx
│ │ │ ├── InsightCard.tsx
│ │ │ └── WelcomeGreeting.tsx (time-aware)
│ │ │
│ │ ├── kanban/ (kanban board components)
│ │ │ ├── KanbanBoard.tsx
│ │ │ ├── KanbanColumn.tsx
│ │ │ ├── KanbanCard.tsx
│ │ │ ├── KanbanCardSkeleton.tsx
│ │ │ ├── KanbanDragOverlay.tsx
│ │ │ ├── ApplicationSidePanel.tsx
│ │ │ ├── FilterBar.tsx
│ │ │ ├── FilterChip.tsx
│ │ │ └── ScoreRangeSlider.tsx
│ │ │
│ │ ├── applications/ (application management)
│ │ │ ├── ApplicationTable.tsx
│ │ │ ├── ApplicationRow.tsx
│ │ │ ├── ApplicationDetail.tsx
│ │ │ ├── ApplicationHeader.tsx
│ │ │ ├── ApplicationTabs.tsx
│ │ │ ├── ResumeTab.tsx
│ │ │ ├── AIAssessmentTab.tsx
│ │ │ ├── InterviewsTab.tsx
│ │ │ ├── ScorecardsTab.tsx
│ │ │ ├── NotesTab.tsx
│ │ │ ├── ActivityTab.tsx
│ │ │ ├── ActionSidebar.tsx
│ │ │ ├── BulkActionBar.tsx
│ │ │ └── RejectModal.tsx
│ │ │
│ │ ├── score/ (AI scoring components)
│ │ │ ├── ScoreRing.tsx
│ │ │ ├── ScoreDetailCard.tsx
│ │ │ ├── SubscoreBar.tsx
│ │ │ ├── ScoreExplanation.tsx
│ │ │ ├── ScoreStrengths.tsx
│ │ │ ├── ScoreGaps.tsx
│ │ │ └── ScoreComparison.tsx (vs other candidates bar chart)
│ │ │
│ │ ├── jobs/ (job management)
│ │ │ ├── JobList.tsx
│ │ │ ├── JobCard.tsx
│ │ │ ├── JobStatusBadge.tsx
│ │ │ ├── JobCreationWizard.tsx
│ │ │ ├── JobWizardProgress.tsx
│ │ │ ├── JobBasicInfoStep.tsx
│ │ │ ├── JobDescriptionStep.tsx
│ │ │ ├── JobRequirementsStep.tsx
│ │ │ ├── JobFormBuilderStep.tsx
│ │ │ ├── JobReviewStep.tsx
│ │ │ ├── BiasWarningPanel.tsx
│ │ │ ├── AIDescriptionModal.tsx
│ │ │ ├── AIDescriptionLoading.tsx
│ │ │ ├── FormFieldBuilder.tsx
│ │ │ ├── FormFieldRow.tsx
│ │ │ └── ScoringRubric.tsx
│ │ │
│ │ ├── interviews/ (interview management)
│ │ │ ├── InterviewCalendar.tsx
│ │ │ ├── InterviewEvent.tsx
│ │ │ ├── InterviewQueue.tsx
│ │ │ ├── ScheduleModal.tsx
│ │ │ ├── InterviewKitSelector.tsx
│ │ │ ├── InterviewerPicker.tsx
│ │ │ ├── QuestionSetPreview.tsx
│ │ │ ├── ScorecardForm.tsx
│ │ │ ├── ScorecardSummary.tsx
│ │ │ └── ScorecardModal.tsx
│ │ │
│ │ ├── offers/ (offer management)
│ │ │ ├── OfferDetail.tsx
│ │ │ ├── OfferForm.tsx
│ │ │ ├── OfferStatusBadge.tsx
│ │ │ └── OfferLetterPreview.tsx
│ │ │
│ │ ├── analytics/ (analytics charts and tables)
│ │ │ ├── AnalyticsHeader.tsx
│ │ │ ├── MetricsRow.tsx
│ │ │ ├── PipelineFunnelChart.tsx
│ │ │ ├── TimeToHireChart.tsx
│ │ │ ├── SourceQualityChart.tsx
│ │ │ ├── SourceVolumeDonut.tsx
│ │ │ ├── TeamPerformanceTable.tsx
│ │ │ ├── JobPerformanceTable.tsx
│ │ │ ├── DateRangePicker.tsx
│ │ │ └── ChartCard.tsx (wrapper with title + period label)
│ │ │
│ │ ├── notifications/
│ │ │ ├── NotificationBell.tsx
│ │ │ ├── NotificationPanel.tsx
│ │ │ └── NotificationItem.tsx
│ │ │
│ │ ├── billing/
│ │ │ ├── PlanCard.tsx
│ │ │ ├── UsageBar.tsx
│ │ │ ├── InvoiceTable.tsx
│ │ │ └── UpgradeModal.tsx
│ │ │
│ │ ├── settings/
│ │ │ ├── SettingsNav.tsx
│ │ │ ├── SettingSection.tsx (titled section wrapper)
│ │ │ ├── InviteUserModal.tsx
│ │ │ ├── UserRow.tsx
│ │ │ ├── StageList.tsx (dnd-kit sortable)
│ │ │ ├── StageRow.tsx
│ │ │ └── APIKeyDisplay.tsx (blurred until reveal)
│ │ │
│ │ ├── onboarding/
│ │ │ ├── OnboardingLayout.tsx
│ │ │ ├── OnboardingProgress.tsx
│ │ │ ├── Step1CompanySetup.tsx
│ │ │ ├── Step2InviteTeam.tsx
│ │ │ ├── Step3CreateJob.tsx
│ │ │ ├── Step4AIScoring.tsx (the aha moment)
│ │ │ ├── Step5Complete.tsx (confetti + CTA)
│ │ │ └── AIScoreReveal.tsx (animated reveal on step 4)
│ │ │
│ │ ├── portal/ (candidate portal)
│ │ │ ├── PortalHeader.tsx
│ │ │ ├── ApplicationForm.tsx
│ │ │ ├── ApplicationStatusTimeline.tsx
│ │ │ └── StatusStageItem.tsx
│ │ │
│ │ └── shared/ (shared utility components)
│ │ ├── AIProcessingIndicator.tsx
│ │ ├── EmptyState.tsx
│ │ ├── LoadingSpinner.tsx
│ │ ├── PageHeader.tsx
│ │ ├── SectionHeader.tsx (overline + h2 + body)
│ │ ├── AvatarStack.tsx (overlapping avatars)
│ │ ├── SourceBadge.tsx
│ │ ├── StageBadge.tsx
│ │ ├── ConfettiTrigger.tsx (canvas-confetti wrapper)
│ │ ├── GradientText.tsx (reusable gradient text span)
│ │ ├── ScrollEntry.tsx (IntersectionObserver animation)
│ │ ├── SkeletonBlock.tsx (configurable shimmer block)
│ │ ├── ErrorBoundary.tsx
│ │ ├── ErrorState.tsx
│ │ └── UpgradePrompt.tsx
│ │
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useCurrentUser.ts
│ │ ├── useRequireCapability.ts
│ │ ├── useSocket.ts
│ │ ├── useJobs.ts
│ │ ├── useJob.ts
│ │ ├── useApplications.ts
│ │ ├── useApplication.ts
│ │ ├── useInterviews.ts
│ │ ├── useAnalytics.ts
│ │ ├── useNotifications.ts
│ │ ├── useBilling.ts
│ │ ├── useDebounce.ts
│ │ ├── useIntersectionObserver.ts (scroll animations)
│ │ ├── useCountUp.ts (stat counter animation)
│ │ ├── useLocalStorage.ts
│ │ └── useMediaQuery.ts
│ │
│ ├── store/
│ │ ├── auth.store.ts (Zustand — current user, company, permissions)
│ │ ├── ui.store.ts (Zustand — sidebar, modals, global loading)
│ │ └── notifications.store.ts (Zustand — unread count, list)
│ │
│ ├── lib/
│ │ ├── api.ts (Axios instance with interceptors)
│ │ ├── socket.ts (Socket.io client singleton)
│ │ ├── queryClient.ts (TanStack Query client config)
│ │ ├── auth.ts (token storage, refresh logic)
│ │ ├── utils.ts (cn(), formatDate, formatRelative, etc)
│ │ ├── score.ts (score color, label, ring math utils)
│ │ ├── confetti.ts (canvas-confetti config)
│ │ └── constants.ts (plan limits, stage types, etc)
│ │
│ ├── types/
│ │ ├── api.types.ts (API response types)
│ │ ├── domain.types.ts (User, Job, Application, etc)
│ │ ├── auth.types.ts
│ │ └── analytics.types.ts
│ │
│ └── styles/
│ ├── globals.css (also in app/ — tokens, resets)
│ ├── components.css (shared component styles if not Tailwind)
│ └── animations.css (keyframe definitions)
│
├── tailwind.config.ts (extends tokens into Tailwind)
├── next.config.ts
├── tsconfig.json
├── .env.local (gitignored)
├── .env.example
└── package.json

===========================================================================
PART 4 — PAGE SPECIFICATIONS (EVERY PAGE, EVERY SECTION)
===========================================================================

---

## PAGE 1: MARKETING HOME PAGE (/)

FILE: src/app/(marketing)/page.tsx
LAYOUT FILE: src/app/(marketing)/layout.tsx

PURPOSE:
Convert visitors to 14-day free trial signups. Primary visitor: Head of Talent
at a Series A/B startup, frustrated with Greenhouse or Lever. Must communicate
AI differentiation and trust in under 8 seconds. Business goal: maximize trial
starts, secondary goal: demo bookings.

LAYOUT:
Desktop: full width / max content 1200px centered / 80px horizontal padding
Tablet: 40px padding / most two-column sections collapse to single
Mobile: 20px padding / all single column
Background: var(--bg-page) = #F9FAFB

PAGE STRUCTURE (top to bottom):

1. MarketingNav
2. Hero Section
3. Bento Grid (NEW — reference-image inspired)
4. Logo Strip
5. Stats Strip
6. AI Explainer Section
7. Features Showcase
8. Pipeline Explainer (dark section)
9. Personas Section
10. Integrations
11. Pricing
12. Testimonials
13. FAQ
14. Final CTA
15. Footer

--- SECTION 1: MARKETINGNAV ---

Component: src/components/layout/MarketingNav.tsx

Height: 64px / sticky top 0 / z-index 100

At scroll 0: white bg / no shadow / no border
After 60px: rgba(255,255,255,0.90) + backdrop-blur(12px) + shadow-xs + border-bottom border-subtle

Inner: max-width 1200px / mx-auto / px-[80px] desktop
Layout: flex / justify-between / align-items center

LEFT:
TalentIQ logo: SVG wordmark / 28px height
Color: neutral-900 word + primary-500 "IQ" suffix

CENTER:
Nav links: Features / Solutions / Pricing / Customers
Font: Inter 14px weight 500 neutral-700
Hover: neutral-900 / 120ms
"Solutions" has dropdown trigger (ChevronDown 12px)

RIGHT:
"Log in" Ghost compact button
"Start Free Trial" Primary compact button + ArrowRight icon
Gap: 8px

Mobile: Logo + Hamburger only / Drawer opens from right

Accessibility:
Skip to main content link (visually hidden, shown on first Tab)
All nav items: visible focus ring
Dropdown: aria-expanded, aria-haspopup

--- SECTION 2: HERO SECTION ---

Component: src/components/marketing/HeroSection.tsx

Background: var(--bg-page) with animated mesh gradient overlay

MESH BACKGROUND LAYER:
Component: HeroMeshBackground.tsx
Position: absolute inset 0 / overflow hidden / pointer-events none
Layer 1: radial-gradient ellipse 30% 60% at 15% 40% / primary-400 at 15% opacity
Layer 2: radial-gradient ellipse 40% 50% at 85% 15% / accent-500 at 12% opacity
Layer 3: radial-gradient ellipse 35% 40% at 55% 85% / primary-300 at 8% opacity
Each layer animated independently with meshFloat keyframe (18s, staggered 6s)
prefers-reduced-motion: animation paused

Layout:
Desktop: two columns 55/45 / min-height 680px / pt-[96px] pb-[80px]
Tablet: two columns 60/40 / pt-[64px]
Mobile: single column / pt-[48px] / image below text

LEFT COLUMN (55%):
Stack gap: space between items

1. AI Badge Pill:
   Component: inline JSX
   height: 28px / radius-full
   background: accent-100 / border: 1px solid accent-200
   padding: 0 12px / gap: 6px
   Sparkles icon 12px accent-600
   Text: "AI-Powered Talent Intelligence" Inter 12px weight 600 accent-700
   shadow: shadow-accent-lg at 30% opacity

2. H1 Headline (THE SIGNATURE ELEMENT):
   Component: HeroSection.tsx (inline JSX + HeroInlineCTA.tsx)

   Line 1: "Hire the Best."
   Font: Plus Jakarta Sans 56px weight 800 neutral-950
   Display: block

   Line 2 (flex row, align-items center, flex-wrap wrap, gap 12px):
   "Before Your Competition"
   Font: Plus Jakarta Sans 56px weight 800
   "Competition" uses gradient text (primary-500→accent-500)
   [HeroInlineCTA button inline here on desktop]

   Mobile: button drops below both lines as full-width primary large button

   Letter-spacing: -2px / line-height: 64px
   Margin-top: 16px

3. Subheading:
   Inter 20px weight 400 neutral-600
   max-width: 520px
   margin-top: 20px
   Text: "Stop losing great candidates to outdated filters. TalentIQ scores
   every applicant with explainable AI — so your team makes faster, fairer
   decisions."

4. Avatar Cluster + Social Proof Line:
   Component: HeroAvatarCluster.tsx
   margin-top: 24px
   display: flex / align-items: center / gap: 12px

   Avatars: 3 overlapping circles (each 36px, border 2px white, radius-full)
   Each shifts -10px left (overlap effect): AvatarStack.tsx
   "+2K recruiters" Inter 13px weight 600 neutral-700 inline right

   Small stars row: 4 × star 14px #FBBF24 + "4.9/5" 12px neutral-500

5. Trust signals row:
   display: flex / gap: 24px / margin-top: 16px / flex-wrap: wrap
   Items (icon 12px neutral-400 + text Inter 12px neutral-500):
   - CreditCard "No credit card"
   - Shield "SOC 2 Type II"
   - Zap "Setup in 30 min"

RIGHT COLUMN (45%):
Component: HeroProductMockup.tsx + HeroFloatingBadge.tsx

Product mockup:
Browser chrome header: 3 color dots + URL bar shape / neutral-100 bg / 36px height
Radius: radius-2xl (24px) / shadow: shadow-2xl
Transform: rotate(1.5deg) on desktop / none on mobile
Scale: 1.0 desktop / 0.9 tablet
border: var(--border-default)
Image: /public/images/hero-product.png
Width: 100% of column / aspect-ratio preserved

Floating Score Badge (HeroFloatingBadge.tsx):
Position: absolute / left -24px / vertically centered 40%
background: white / shadow: shadow-lg / radius: radius-lg
padding: 12px 16px
border: var(--border-default)

    Left: 40px score ring (sm size) — score 91 / emerald
    Right:
      "AI Score: 91/100" 13px weight 700 accent-500
      "Strong Match" 11px neutral-500

    Animation: translateY(-4px→0) oscillation / 3s ease-in-out infinite
    prefers-reduced-motion: static

LOAD ANIMATIONS (stagger, each 400ms ease-out, translateY 20px→0, opacity 0→1):
AI badge: delay 0ms
H1 line 1: delay 80ms
H1 line 2: delay 140ms
Subheading: delay 220ms
Avatar cluster: delay 280ms
Trust signals: delay 340ms
Right mockup: delay 100ms
Floating badge: delay 300ms

--- SECTION 3: BENTO GRID ---

Component: src/components/marketing/BentoGrid.tsx
(Directly inspired by reference image card grid below hero)

Position: immediately below hero / no section break / flows naturally
Background: var(--bg-page) / padding-bottom: 80px

Grid container:
max-width: 1100px / mx-auto / px-[80px] desktop
display: grid
grid-template-columns: 1.4fr 1fr 1fr
gap: 16px

Card A (BentoFeatureCard.tsx):
background: var(--color-primary-500)
border-radius: var(--radius-2xl)
padding: 40px
color: white
overflow: hidden
position: relative

Decorative element: large circle 200px at bottom-right, radius-full,
rgba(255,255,255,0.05), overflow hidden

Content:
Small badge: white bg / primary-500 text / "AI-Powered" / radius-full / 10px weight 600
Sparkles icon 28px white / margin-top 20px
Headline: 20px weight 700 white / mt-16px / max-width 220px
"AI-powered platform for groundbreaking hiring."
Body: 14px white 70% / mt-8px
"Learn More" button: white bg / primary-500 text / radius-full / height 44px / mt-24px + Plus icon 14px on right

Card B (BentoStatCard.tsx):
background: var(--color-neutral-50)
border: var(--border-default)
border-radius: var(--radius-2xl)
padding: 32px 24px

Large stat: Plus Jakarta Sans 64px weight 800 neutral-900 / animate count-up
Sub label: 17px weight 500 neutral-700 / mt-4px
"Faster time-to-hire" etc
Description: 13px neutral-500 / mt-8px
"Hiring at your fingertips"

Play button (for future demo video): 48px circle / primary-500 bg / white play icon 20px
position: absolute / top 24px right 24px / shadow: shadow-md

Card C (BentoSocialCard.tsx):
background: var(--color-neutral-900)
border-radius: var(--radius-2xl)
padding: 32px
overflow: hidden

Radial accent: 150px circle / accent-500 at 15% opacity / position top-right absolute

Content:
Quote text: 16px white italic / max-width 200px
"Our time-to-hire dropped by 60% in the first month."
Author: 14px white weight 600 / mt-12px
Role: 12px white 70%
"See reviews from our users" 14px white 80% / mt-24px / underline decoration

Mobile: all three stack vertically full width
Tablet: Card A full width / Card B + C in 1fr 1fr grid below

--- SECTION 4: LOGO STRIP ---

Component: src/components/marketing/LogoStrip.tsx
Background: neutral-50 / padding: 40px 0
Border-top: var(--border-subtle) / Border-bottom: var(--border-subtle)

Overline text: "TRUSTED BY FAST-GROWING TEAMS" centered
11px uppercase weight 600 neutral-400 / mb-24px

Logo row:
8 company logos / max-width 120px each / height 32px
gap: 48px / justify-content: center / flex-wrap wrap
filter: grayscale(100%) / opacity: 0.40
hover (individual): grayscale(0%) / opacity 0.80 / 200ms ease-out

Mobile: marquee auto-scroll animation
Two copies of logos concatenated / 28s linear infinite scroll left
overflow: hidden / mask-image: linear-gradient fade at edges

--- SECTION 5: STATS STRIP ---

Component: src/components/marketing/StatsStrip.tsx
Background: white / padding: 80px 0
Max-width: 1200px centered

4 stat blocks in a row / thin 1px neutral-100 vertical dividers between

Each block (StatCounter.tsx):
Value: Plus Jakarta Sans 52px weight 800
time/speed stats: primary-500 color
accuracy/cost stats: accent-500 color
Animate: count-up from 0 on viewport entry / 1200ms linear (useCountUp hook)
Label: Inter 17px neutral-700 / mt-8px
Sub-label: Inter 12px neutral-500 / mt-4px

Stats:
"50%" — "Faster time-to-hire" — "Average across customers"
"70%" — "Less time screening" — "With AI pre-scoring"
"91%" — "AI score accuracy" — "Versus actual hire decisions"
"$24K" — "Saved per mis-hire" — "Fully loaded cost reduction"

Responsive:
Tablet: 2×2 grid / horizontal rules replace vertical dividers
Mobile: single column centered / horizontal rules between

--- SECTION 6: AI EXPLAINER SECTION ---

Component: src/components/marketing/AIExplainerSection.tsx
Background: accent-50 (#ECFDF5) / padding: 96px 0

Subtle radial accent overlay: accent-500 at 8% opacity, centered top-right

Layout: desktop two columns 50/50 / max-width 1200px
Left: text stack / Right: animated demo card

LEFT COLUMN:
Overline: "EXPLAINABLE AI" accent-600
H2: "A score that shows its work."
Body-LG: 17px neutral-700 / mt-16px / max-width 460px
"Every candidate gets plain-English reasons behind their score.
Hiring managers trust the data because they understand it."

Feature list (3 items, mt-28px, gap 16px):
CheckCircle 16px accent-500 + Inter 15px neutral-800
"Scores against your actual job requirements, not generic keywords"
"Flags skill gaps and surface-level strengths separately"
"Bias-aware scoring identifies inconsistencies automatically"

Primary button "See how scoring works" + ArrowRight / mt-32px

RIGHT COLUMN:
Component: AIScoreDemo.tsx
background: white / shadow: shadow-lg / radius: radius-xl / padding: 24px
max-width: 480px

Demo card content (animates in stagger on scroll entry):
Candidate: "Alex Chen" 15px weight 600 + "Senior Software Engineer" 13px neutral-500

    Score ring 80px: score 91 / animated on entry / margin: 16px 0

    Match label: "Strong match for this role" 13px weight 600 accent-700

    Subscores (4 bars, mt-16px):
      Skills Match 95% / Experience 88% / Education 72% / Keywords 90%
      Each: label 12px neutral-700 left + percent 12px weight 600 right
      Bar: 6px height / accent-500 fill / neutral-100 track / animate width 800ms

    "Why this score" section mt-16px:
      Header: 12px weight 600 neutral-700
      5 bullets (12px neutral-700):
        ThumbsUp accent-500: "5+ years React matches senior req."
        ThumbsUp accent-500: "Open source contributions show initiative"
        ThumbsUp accent-500: "AWS certified relevant to infra work"
        ThumbsDown red-500: "No TypeScript listed explicitly"
        ThumbsDown red-500: "Leadership experience not demonstrated"

    Pills row mt-12px (strengths): React, Node.js, AWS — accent-100/accent-700
    Pills row mt-8px (gaps): TypeScript, Leadership — amber-100/amber-700

--- SECTION 7: FEATURES SHOWCASE ---

Component: src/components/marketing/FeaturesShowcase.tsx
Background: white / padding: 96px 0

Centered header (max-width 700px, mx-auto):
Overline: "RECRUITER WORKFLOW" neutral-500
H2: "Your entire pipeline, one view."
Body-XL: 20px neutral-600 / mt-16px

Large product screenshot (mt-48px):
Image: full width up to 1100px / radius: radius-xl / shadow: shadow-xl
border: var(--border-default)
Shows: Kanban board with 5 stages / AI score rings on cards

3-column feature tiles below screenshot (mt-40px, gap 32px):
Each tile:
Icon container: 40px × 40px / radius-lg / gradient bg
Title: 16px weight 600 neutral-900 / mt-12px
Description: 14px neutral-600 / mt-6px

Tile 1: Layers icon primary-500 / primary-50 bg
"Visual pipeline management"
"Drag candidates between stages. Everyone sees it happen live."

Tile 2: Sparkles icon accent-500 / accent-50 bg
"AI scoring on every application"
"Ranked and explained the moment they apply."

Tile 3: Filter icon primary-500 / primary-50 bg
"Smart filtering"
"Sort by score, source, or stage. Bulk actions included."

--- SECTION 8: PIPELINE EXPLAINER (DARK) ---

Component: src/components/marketing/PipelineExplainerSection.tsx
Background: var(--color-primary-900) #0A2540 / padding: 96px 0
Position: relative overflow hidden

Decorative mesh: same gradient system at 6% opacity on dark background

Centered header (max-width 800px):
Overline: "HOW THE AI WORKS" accent-300
H2: white "From resume to ranked candidate in 90 seconds."
Body-LG: white 70% / centered / max-width 520px / mt-16px
"The moment a candidate applies, our AI pipeline parses, scores,
and explains — automatically."

5-Step horizontal flow diagram (mt-56px):
Component: PipelineStepDiagram.tsx
display: flex / justify-content: center / gap: 0 / align-items: flex-start

Each step:
width: 160px / text-align: center

    Circle: 56px / rgba(255,255,255,0.08) bg / radius-full / border: border-glass-dark
    Icon: 24px inside circle
      Steps 1,2,4,5: white 70%
      Step 3 (AI): accent-400

    Step number: overline 10px uppercase white 40% / above circle content
    Title: 14px weight 600 white / mt-8px
    Description: 12px white 55% / mt-4px

    Steps:
      1. CloudUpload — "Resume Uploaded" — "PDF received instantly"
      2. FileText — "Text Extracted" — "Structure parsed"
      3. Sparkles (accent-400) — "AI Scored" — "Rated against requirements"
      4. TrendingUp — "Pipeline Updated" — "Stage assigned auto"
      5. Bell — "Team Notified" — "Recruiter pinged"

Dashed connector between steps:
1px dashed rgba(255,255,255,0.18) / absolutely positioned between circles
Center: ChevronRight 10px white 25%
Animation: opacity pulse 0.3→0.8→0.3 / accent-500 color / 1.5s infinite

Two stat callouts (mt-40px, gap 24px, justify-center):
Each: rgba(255,255,255,0.07) bg / radius-lg / padding 20px 28px
border: border-glass-dark
Stat: Plus Jakarta Sans 26px weight 700 white
Label: 14px white 65% / ml-12px

"2–8 seconds per resume"
"99.2% parse accuracy"

Animation: each step slides in from left with 80ms stagger on scroll entry

Mobile: 5-step horizontal → vertical list
Vertical line replaces horizontal dashed line
Each step: flex-row, circle left, text right

--- SECTION 9: PERSONAS SECTION ---

Component: src/components/marketing/PersonasSection.tsx
Background: neutral-50 / padding: 96px 0

Centered header (max-width 600px):
Overline: "BUILT FOR EVERY STAKEHOLDER"
H2: "One platform, every perspective."

4-card grid (mt-48px, gap 24px, max-width 1100px):
display: grid / grid-template-columns: repeat(4, 1fr) desktop
Tablet: 2×2 / Mobile: 1 column

Each PersonaCard.tsx:
background: white / radius: radius-xl / shadow: shadow-sm / padding: 32px
hover: translateY(-4px) + shadow-lg / 200ms ease-out

Icon container: 40px circle / radius-full / primary-50 or accent-50 bg
Icon: 20px primary-500 or accent-500

Title: 17px weight 600 neutral-900 / mt-16px
Pain (italic): 13px neutral-500 / mt-8px ("Before TalentIQ: ...")
Solution: 13px neutral-700 / mt-8px
Divider: 1px neutral-100 / my-16px

3 feature bullets:
CheckCircle 14px accent-500 + 12px neutral-700 / gap 8px / row-gap 8px

Personas:
Recruiters: Users icon primary / "Drowning in 400 resumes per role."
Hiring Managers: UserCheck icon accent / "Guessing which candidates matter."
HR Leaders: BarChart icon primary / "No visibility until it's too late."
Candidates: Star icon accent / "Applying blind, hearing nothing."

--- SECTION 10: INTEGRATIONS ---

Component: src/components/marketing/IntegrationsSection.tsx
Background: white / padding: 80px 0

Centered header (max-width 600px):
Overline: "WORKS WITH YOUR STACK"
H2: "Connects to every tool you already use."

Integration grid (mt-40px, max-width 1000px):
display: grid / grid-template-columns: repeat(6, 1fr) desktop
Tablet: 4 columns / Mobile: 3 columns
gap: 16px

Each cell:
background: white / border: var(--border-default) / radius: radius-lg
shadow: var(--shadow-xs) / height: 80px
display: flex / flex-direction: column / align-items: center / justify-content: center
gap: 8px

Logo: 32px height / grayscale(60%)
Name: 11px neutral-500

hover: shadow-md + border-strong + grayscale(0%) / 150ms

"View all 40+ integrations" Ghost button / mt-24px / mx-auto / block

Integrations to show: Slack, Google Workspace, Microsoft Teams, Greenhouse,
LinkedIn, Indeed, Calendly, Zoom, DocuSign, Workday, Zapier, BambooHR

--- SECTION 11: PRICING SECTION ---

Component: src/components/marketing/PricingSection.tsx
Background: neutral-50 / padding: 96px 0

Centered header:
Overline: "TRANSPARENT PRICING"
H2: "Simple plans that scale with you."
Body-XL: neutral-600 / mt-16px

Annual/Monthly toggle (mt-32px):
Component: PricingToggle.tsx
display: flex / gap: 4px / bg: neutral-100 / padding: 4px / radius: radius-full
Width: fit-content / mx-auto

"Monthly" pill / "Annual" pill
Active pill: white bg / neutral-900 text / shadow-xs / radius-full
Inactive: transparent / neutral-500 text
"Save 20%" badge on Annual: accent-500 bg / white text 10px / radius-full / ml-6px

Pricing cards grid (mt-48px, max-width 1040px):
display: grid / grid-template-columns: 1fr 1fr 1fr / gap: 24px
Growth card: scale(1.04) / z-index above siblings

Three pricing cards as defined in Section 2.3.

Plans:
Starter $99/mo: 3 jobs, 5 seats, 200 AI scores, basic analytics
Growth $299/mo (FEATURED): 15 jobs, 20 seats, 1K AI scores, full AI, Slack, Calendar
Enterprise $999+/mo: unlimited everything, API, SSO, audit logs, SLA

Trust row (mt-32px, gap 24px):
Shield icon + "SOC 2 Type II"
Globe icon + "GDPR Compliant"
X icon + "Cancel anytime"
Each: 12px neutral-500 / icon 14px neutral-400

Mobile: cards stack vertically / Growth card no scale transform

--- SECTION 12: TESTIMONIALS ---

Component: src/components/marketing/TestimonialsSection.tsx
Background: var(--color-primary-900) / padding: 96px 0

Centered header:
Overline: "CUSTOMER STORIES" / accent-300
H2: white "Teams that ship faster with TalentIQ."

3-card grid (mt-48px, max-width 1100px):
display: grid / grid-template-columns: repeat(3, 1fr) / gap: 24px

Each TestimonialCard.tsx as defined in Section 2.3.

Carousel controls (mt-32px):
Prev / Next icon buttons (dark variant — white icons)
Dots: 8px circles neutral-500 / active: accent-500 / gap 8px
Centered below cards

Mobile: single card visible / swipe between

--- SECTION 13: FAQ ---

Component: src/components/marketing/FAQSection.tsx
Background: white / padding: 80px 0

Layout: two columns 50/50 desktop / max-width 900px mx-auto
Mobile: single column

Left (sticky top 88px):
Overline: "FAQ"
H2: "Frequently asked questions"
Body-MD: 15px neutral-600 / mt-16px
"Can't find your answer?"
"Chat with us" link (primary-500) / mt-12px

Right accordion (8 items):
Each FAQItem.tsx:
border-bottom: 1px neutral-100
padding: 20px 0

    Question row: H5 14px weight 600 neutral-900 left / ChevronDown 16px neutral-400 right
    Answer: Inter 15px neutral-700 / margin-top 12px / pb-4px
    ChevronDown rotates 180deg when open / 200ms ease-out
    Answer slides open/close / 200ms ease-out

Questions:
"How does the AI scoring actually work?"
"Is TalentIQ compliant with GDPR and CCPA?"
"Can I use TalentIQ with my existing ATS?"
"How accurate is the bias detection?"
"What happens when my AI score quota runs out?"
"Do candidates know their application was AI-scored?"
"How long does the free trial last?"
"Can I cancel at any time?"

--- SECTION 14: FINAL CTA ---

Component: src/components/marketing/FinalCTASection.tsx
margin: 64px auto / max-width: 900px / padding: 0 80px desktop

Container:
background: var(--gradient-cta) (primary-500 → accent-500)
border-radius: var(--radius-2xl)
padding: 80px
text-align: center
position: relative / overflow: hidden

Decorative: 300px circle rgba(255,255,255,0.06) / absolute bottom-right

H2: "Ready to transform your hiring?" / white / 800 weight
Body-XL: "Join 500+ companies making faster, fairer decisions." / white 85% / mt-16px

CTA button (mt-32px):
white bg / primary-500 text / large size / "Start Free Trial" + ArrowRight icon
hover: scale(1.02) / shadow-lg

Trust row (mt-20px, gap 24px):
white icons + white 70% text
"No credit card" / "Cancel anytime" / "Setup in 30 min"
Inter 12px

--- SECTION 15: FOOTER ---

Component: src/components/layout/Footer.tsx
Background: var(--bg-dark-footer) #040D1A / padding: 72px 0 40px

4-column grid (max-width 1200px):
gap: 48px desktop / 32px tablet

Column 1:
Logo: white version / 28px height
Tagline: 14px white 55% / mt-12px
Social row (mt-20px, gap 12px):
Twitter, LinkedIn, GitHub — 20px icon buttons / neutral-400 default / white hover

Columns 2-4 (link groups):
Group title: overline 11px uppercase white 35%
Links: 14px white 55% / hover: white 100% + 120ms / mt-8px per link / mt-16px per group

Groups:
Product: Features, Pipeline, AI Scoring, Integrations, Pricing
Company: About, Blog, Careers, Press, Contact
Legal: Privacy, Terms, GDPR, Security, Cookies

Bottom bar (mt-48px, border-top: 1px rgba(255,255,255,0.07), pt-24px):
display: flex / justify-content: space-between / align-items: center
Copyright: Inter 13px white 35%
Legal links: Inter 13px white 35% / right side

---

## PAGE 2: AUTHENTICATION PAGES

FILE: src/app/(auth)/layout.tsx

LAYOUT:
Desktop: two-column split / left 50% brand panel / right 50% form
Tablet: single column / brand becomes top strip (200px height)
Mobile: full-screen form / compact logo top

LEFT BRAND PANEL:
background: var(--color-primary-900)
height: 100vh / sticky
padding: 40px

TOP: TalentIQ logo white / 24px height
CENTER (vertically centered stack):
Decorative quote (italic white Inter 22px / max-width 380px / weight 300)
"We went from 'gut feel' to data-driven hiring in two weeks."
Author row: avatar 44px + name 14px white weight 600 + title 13px white 65%
BOTTOM:
3 stat blocks horizontal
Each: Plus Jakarta Sans 24px white weight 700 + 13px white 55%
"50% faster" / "91% accuracy" / "500+ teams"

Decorative mesh: subtle gradient overlay top-right / 8% opacity

RIGHT FORM PANEL:
background: neutral-50
display: flex / align-items center / justify-content center
min-height: 100vh

White form card:
background: white / shadow: shadow-lg / radius: radius-xl
padding: 48px / max-width: 400px / width: 100%

--- LOGIN PAGE ---

FILE: src/app/(auth)/login/page.tsx

Form card content:
H3: "Welcome back" Plus Jakarta Sans 22px weight 600
Body-SM: "Sign in to continue to TalentIQ." neutral-500 / mt-6px

Google OAuth button (mt-24px):
height 44px / white bg / border: border-default / full width / radius-sm
gap: 12px / Google logo 18px SVG / "Continue with Google" Inter 14px weight 600 neutral-900
hover: neutral-50 bg

Divider (mt-20px mb-20px):
horizontal rule + "or continue with email" Inter 12px neutral-400 center

Email input (full width, label above)
Password input with eye toggle (full width, label above)
Forgot password link: "Forgot password?" Inter 12px primary-500 / right-aligned / mt-6px

Sign In button: primary / full width / height 44px / mt-20px

Sign up link (mt-16px, text-center):
Inter 14px neutral-600 "Don't have an account?" +
"Start free trial" primary-500 link

Error states:
Email / password inputs: error border + error text
Toast for network/server errors
Loading: button spinner, disabled

--- REGISTER PAGE ---

FILE: src/app/(auth)/register/page.tsx

Step indicator: "Step 1 of 2" Inter 12px neutral-500 / top of form

Step 1:
H3: "Create your account"
Google OAuth button (same as login)
Divider
Full name (full width)
Company name (full width)
Work email (full width)
Password (full width) + strength meter below
"Create Account" primary full-width / mt-24px
Terms note: 12px neutral-500 centered / "By signing up you agree to our
Terms of Service and Privacy Policy" — both linked

Step 2 (after email verify):
H3: "Tell us about your team"
Company size select
How did you hear about us select
"Go to Dashboard" primary full-width
"Skip for now" ghost link below

--- FORGOT/RESET PASSWORD ---

FILE: src/app/(auth)/forgot-password/page.tsx
FILE: src/app/(auth)/reset-password/page.tsx

No split screen — centered card only
Background: neutral-50
Card: white / shadow-lg / radius-xl / max-width 400px / padding 48px

Forgot: Email + "Send reset link" primary + back-to-login ghost
Reset: New password + Confirm password + strength meter + "Set new password"
Success: CheckCircle 48px accent-500 + "Check your email" H3 + description + resend link

---

## PAGE 3: ONBOARDING FLOW

FILE: src/app/(onboarding)/onboarding/step/[step]/page.tsx
LAYOUT: src/app/(onboarding)/layout.tsx

Full screen white background.
Max content width: 640px centered.

LAYOUT CHROME:
Header (60px):
TalentIQ logo left / "Step X of 5" right / "Exit setup" ghost link far right

Progress bar (3px height):
position: fixed / top: 60px / left 0 right 0
background: neutral-100 / fill: primary-500
Fill width animates: (step / 5) × 100% / 400ms ease-out on step change

Step labels (desktop only, below progress bar):
"Company" / "Team" / "First Job" / "AI Demo" / "Done"
Active: primary-500 weight 600 / completed: accent-500 weight 600 / inactive: neutral-400

STEP 1 — Company Setup:
H3: "Tell us about your company"
Fields: Company name / Logo upload (compact 80px zone) / Industry select /
Company size select / Timezone select
"Continue" primary full-width / "Cancel" ghost left

STEP 2 — Invite Team:
H3: "Bring your team in"
Body: 15px neutral-600 "Hiring is a team sport."

Invite rows: email input (2/3 width) + role select (1/3 width)
"Add another" ghost + Plus icon
"Continue" primary / "I'll do this later" ghost link below

STEP 3 — Create First Job:
H3: "Create your first job listing"
Fields: Job title / Department select / Location / Employment type
Description textarea + "Generate with AI" accent button above it
Skills multi-select below
"Continue" primary

STEP 4 — AI Scoring Demo (THE AHA MOMENT):
H3: "See AI scoring in action"
Body: "Upload any resume and watch TalentIQ score it live."

Upload zone: 160px height compact version
"Or use a sample resume" link below zone

After upload (2s simulated delay):
AI processing indicator (3 dots + "Analyzing resume... 5 seconds")
Then AIScoreReveal.tsx animated in:
Card: white / shadow-lg / radius-xl / padding 24px
background pulses accent-100 for 800ms then returns white
Score ring animates fill / explanation bullets appear 100ms stagger
Strengths pills pop in with spring animation

"Explore Your Pipeline" primary large

STEP 5 — Complete:
ConfettiTrigger: fires on mount / primary-500 + accent-500 colors

Large CheckCircle 64px accent-500 / scale-in spring animation
H2: "You're all set." Plus Jakarta Sans 36px weight 800
Body-LG: "Your pipeline is ready for your first candidates." / neutral-600

"Go to Dashboard" primary large button
"Invite teammates first" ghost link below

---

## PAGE 4: RECRUITER DASHBOARD

FILE: src/app/(app)/dashboard/page.tsx

PURPOSE: What needs attention right now? Pipeline health + urgent actions.

LAYOUT: App shell (sidebar + header) + content area
Content: padding 32px horizontal, 28px vertical / max-width 1400px
12-column grid, 20px gutters

CONTENT STRUCTURE (top to bottom):

1. PAGE HEADER ROW:
   Left: WelcomeGreeting.tsx
   "Good morning, Sarah." Inter 14px neutral-500 italic
   "Dashboard" Plus Jakarta Sans 36px weight 700 neutral-900
   Today's date: Inter 14px neutral-500
   Right:
   "Create Job" primary button + Plus icon

2. STATS ROW (4 cards, each 3 cols):
   StatCard.tsx × 4

   Card 1 — Open Roles:
   Icon: Briefcase / primary-50 bg / primary-500 icon
   Value: count / primary-500
   Label: "Open Roles"
   Delta: vs last month

   Card 2 — Applications This Week:
   Icon: UserPlus / accent-50 bg / accent-500 icon
   Value: count / neutral-900
   Label: "Applications"
   Sparkline at bottom: accent-300 line

   Card 3 — Average AI Score:
   Icon: Sparkles / primary-50 bg / primary-500 icon
   Value: number/100
   Color: score band color
   Label: "Avg AI Score"
   Delta: vs last week

   Card 4 — Offers Pending:
   Icon: FileText / warning bg if expiring / warning icon
   Value: count
   Label: "Offers Pending"
   Sub: "2 expiring in 48h" in warning color if relevant

3. KANBAN OVERVIEW (8 cols) + ACTIVITY FEED (4 cols):

   KANBAN OVERVIEW (KanbanOverview.tsx):
   H4: "Pipeline Overview" / "View Full Pipeline" primary-500 link right

   Stage pills row (horizontal scroll):
   Each pill: 28px height / radius-full
   Default stages: primary-50 bg / primary-700 text
   Active/recent: accent-50 bg / accent-700 text
   Count badge: circle right side of pill

   Mini candidate strip (horizontal scroll, mt-16px):
   3-4 compact cards: 48px height / avatar 24px + name + score badge
   "View All" link at end

   "View Full Kanban Board" primary button / mt-16px

   ACTIVITY FEED (ActivityFeed.tsx):
   H4: "Recent Activity"

   Timeline list, each ActivityItem.tsx:
   height: 40px
   Left: 6px circle (accent-500 for AI / primary-500 for manual)
   Vertical 1px dashed neutral-200 connector
   Content: action text 13px neutral-900 + timestamp 11px neutral-400
   Hover: neutral-50 bg / radius-md

   Sample items:
   "Maria Torres applied to Senior Engineer" — "2 min ago"
   "AI scored David Kim 91/100" — "4 min ago"
   "Interview scheduled for Sarah Lee" — "1 hour ago"

   "View all activity" ghost link / mt-16px / primary-500 12px

4. AI INSIGHTS PANEL (12 cols):
   Component: AIInsightsPanel.tsx

   Container:
   background: accent-50 / border-left: 3px solid accent-500
   border-radius: radius-lg / padding: 20px 24px

   Header:
   Sparkles icon 16px accent-600 (subtle twinkle animation on load)
   "AI Pipeline Insights" H4 inline / gap 8px
   "3 new insights" badge: accent-100 bg / accent-700 text / radius-full / 10px
   "Dismiss all" ghost link right

   3 InsightCard.tsx in a row (gap 16px):
   Each: white bg / radius-lg / padding 16px / shadow-xs

   Type icons (20px):
   warning: AlertTriangle / amber-500
   info: Info / primary-500
   success: CheckCircle / accent-500

   Title: 14px weight 600 neutral-900
   Description: 13px neutral-600 / mt-4px
   Action link: 13px primary-500 / mt-8px

   Sample:
   "3 candidates stuck in Screening (5+ days)" — warning
   "Senior Engineer: 45% drop-off at screening" — info
   "2 candidates scored 85+ are unread" — success

   Mobile: 3 cards stack vertically

5. RECENT APPLICATIONS TABLE (12 cols):
   H4: "Recent Applications" + "View All" ghost link right

   ApplicationTable.tsx (standard table component)
   Columns: Candidate, Role, AI Score (badge), Stage, Applied, Source, Actions
   Actions: Eye (view) + ArrowRight (move stage) + Calendar (schedule)
   10 rows / compact pagination

---

## PAGE 5: KANBAN PIPELINE BOARD

FILE: src/app/(app)/jobs/[id]/pipeline/page.tsx

PURPOSE: Primary recruiter workspace. Manage candidate movement.

LAYOUT: Full content area / no max-width constraint on board

HEADER AREA:
Left:
"← Jobs" Back link (13px neutral-500) + "/" + Job title H1 + Status badge
Right:
Applicant count (13px neutral-500)
"Edit Job" Secondary compact
"Analytics" Ghost compact
"Close Role" Ghost destructive compact

FILTER ROW (padding: 16px 32px, border-bottom: border-default):
FilterBar.tsx
Row: gap 12px flex-wrap

Source dropdown (compact, 140px)
Score range slider (dual handle, 200px, ScoreRangeSlider.tsx)
Stage multi-select (compact, 180px)
Date range picker (compact)
Search input (240px)
| divider
"Clear filters" ghost button (appears only when filters are active)

Active filter chips row (below, mt-8px):
FilterChip.tsx: label + X / primary-100 bg / primary-700 text / radius-full / 12px

BOARD AREA:
background: neutral-100
height: calc(100vh - 192px) (full height minus header + filter)
overflow-x: auto / overflow-y: hidden
padding: 20px
display: flex / gap: 16px

KanbanBoard.tsx using @dnd-kit/core and @dnd-kit/sortable

Each KanbanColumn.tsx:
width: 280px / flex-shrink: 0
display: flex / flex-direction: column
height: 100%

    Column header (44px):
      background: white / border-radius: radius-md / padding: 0 12px
      border-bottom: none
      Stage left accent: 3px solid (stage color) at left of header text

      Stage name H5 weight 600 / Count badge right (neutral-50 bg / count)
      Three-dot icon button right (stage settings)

      Stage colors:
        Screening: primary-500
        Phone Screen: info (#3B82F6)
        Interview: warning (#F59E0B)
        Assessment: #8B5CF6 (purple)
        Offer: accent-500
        Hired: accent-600

    Column body (flex-grow: 1, overflow-y: auto, padding: 8px, gap: 8px):
      KanbanCard.tsx for each application (as defined in Section 2.3)
      Custom thin scrollbar: 4px / neutral-200 track / neutral-400 thumb

    Column footer:
      "+ Add Candidate" ghost micro button (12px / neutral-400 / centered)

KanbanDragOverlay.tsx:
Shows dragged card at scale(1.02) + shadow-xl + rotate(0.8deg)

APPLICATION SIDE PANEL (ApplicationSidePanel.tsx):
Opens when card clicked
Right drawer: 480px / slides from right / translateX(100%→0) 200ms ease-out
background: white / shadow: shadow-xl / z-index 50

Header: Candidate name H3 + X close + "Open Full Profile" link
border-bottom: border-default

Tabs: Overview / Resume / AI Score / Interviews / Notes
Active tab: 2px primary-500 bottom border / Inter 14px weight 500 primary-700
Inactive: neutral-500

AI Score tab (default open on first open):
Full ScoreDetailCard.tsx as defined

Footer (fixed bottom of panel):
Move Stage select (compact, 180px) + "Move" primary compact
"Schedule Interview" primary full-width / mt-8px
"Reject" ghost destructive / mt-4px

---

## PAGE 6: JOB CREATION WIZARD

FILE: src/app/(app)/jobs/new/page.tsx

PURPOSE: Create and publish jobs with AI assistance.

LAYOUT:
Single column max-width 800px centered / top-padding 32px
Header: breadcrumb / wizard progress below

WIZARD PROGRESS BAR (JobWizardProgress.tsx):
Horizontal steps row (mt-24px mb-32px)
5 steps: Basic Info / Description / Requirements / Application Form / Review

Each step connector:
Completed: accent-500 line + check icon circle / accent-500
Active: primary-500 number circle + label primary-500 weight 600
Inactive: neutral-300 number circle + neutral-400 label

STEP 1 — BASIC INFO:
Section title H4: "Job basics"

Job title (full width)
Department + Location (two columns, gap 16px)
Employment Type + Remote Type (two columns)
Salary Min + Max + Currency (three columns)

Footer: "Cancel" ghost left / "Next: Description" primary + ArrowRight right

STEP 2 — DESCRIPTION:
Section title H4: "Job description"

AI Generate button row (mb-12px):
"Generate with AI" accent button + Sparkles icon / right-aligned
On click: opens AIDescriptionModal.tsx

AIDescriptionModal.tsx (MD size):
H3: "Generate job description"
Brief description textarea
Seniority level select
Key skills multi-select
"Generate Description" accent button full-width

    Loading state: AIProcessingLoading.tsx
      AI processing dots + "Generating your description... about 20 seconds."
      Progress bar: width animates 0→85% over 18s / 100% on complete

    Result state: generated text in read-only rich text preview
    "Use this description" primary / "Regenerate" secondary

Rich text editor (full width, min-height 320px)

BiasWarningPanel.tsx (appears below editor on description focus-out):
Animated slide-down from above / opacity 0→1 / 200ms

Footer: "Back" ghost / "Next: Requirements" primary + ArrowRight

STEP 3 — REQUIREMENTS:
Section title H4: "What you're looking for"

Skills (multi-select tag input)
Years of experience (select)
Education requirement (select)
Nice-to-have skills (multi-select)

Scoring rubric (collapsed by default):
"Advanced: Customize AI scoring weights" — toggle row (ChevronDown rotates)
When expanded: ScoringRubric.tsx
3 sliders: Skills weight / Experience weight / Education weight
Total must equal 100% — live validation, error if ≠ 100
Constraint error: "Weights must add up to 100% (currently 85%)" red text

Footer: "Back" ghost / "Next: Application Form" primary

STEP 4 — APPLICATION FORM BUILDER:
Section title H4: "Customize your application"
Description: "Default fields are required and cannot be removed."

Locked fields section:
4 rows: First Name, Last Name, Email, Resume
Each: lock icon neutral-300 + field name + "Required" badge
background: neutral-50 / opacity: 0.70

Divider: "Custom fields" overline

FormFieldBuilder.tsx (dnd-kit sortable list):
FormFieldRow.tsx for each custom field:
GripVertical 16px neutral-300 drag handle
Field label (editable inline text)
Type badge (Text / Select / File / Yes/No)
Delete icon button right

    "Add Field" ghost button + Plus icon (below list)

    Field type selector modal (SM):
      Grid 3×2 of type options
      Each: icon 24px + label / radius-lg / border-default
      Selected: primary-50 bg / primary-500 border

Footer: "Back" ghost / "Next: Review" primary

STEP 5 — REVIEW:
Section title H4: "Review and publish"
Sub: "Everything looks good? Publish when you're ready."

4 summary cards (gap 16px):
Each: white bg / border-default / radius-lg / padding 20px
Header: section name H5 + "Edit" ghost link right
Content: key field values displayed

Public URL card:
"Job URL" label + read-only input with URL
Copy button icon right

Action row (mt-32px):
"Save as Draft" ghost / left
"Publish Job" primary large / right

Bias flags confirmation modal (if bias detected on publish):
MD modal / Warning icon primary
"Publish with flagged content?" H3
Flags listed (amber warning cards)
"Fix Issues First" primary / "Publish Anyway" destructive ghost right

---

## PAGE 7: APPLICATION DETAIL

FILE: src/app/(app)/applications/[id]/page.tsx

PURPOSE: Deep-dive single candidate — full history, AI, interviews.

LAYOUT:
Two columns: main 8 cols + action sidebar 4 cols (sticky)
Content padding: 32px / max-width 1400px

MAIN CONTENT (8 cols):

Header:
Candidate name: Plus Jakarta Sans 28px weight 700 neutral-900
Stage badge + Applied date + Source badge / mt-8px (flex row, gap 8px)
Contact row: mail icon + email link / phone (if avail.) / LinkedIn icon link
All: Inter 14px neutral-600 / gap 16px

Tabs (mt-24px):
Profile / AI Assessment / Resume / Interviews / Scorecards / Offer / Notes / Activity
Tab bar: border-bottom 1px neutral-200
Active: 2px primary-500 bottom / primary-700 14px weight 500
Inactive: neutral-500 14px weight 500
Hover: neutral-700 / 120ms

AI ASSESSMENT TAB (default active):
Layout: two columns 50% / 50%

Left:
Score ring 80px (ScoreRing.tsx)
"Strong match for Senior Engineer" H4 neutral-900 / mt-12px
4 subscores with bars (SubscoreBar.tsx × 4)

    "Why this score" section (ScoreExplanation.tsx):
      8 bullet items with ThumbsUp/Down icons

Right:
ScoreStrengths.tsx + ScoreGaps.tsx pill rows
ScoreComparison.tsx:
"vs 23 other candidates in this role"
Horizontal bar chart: candidate's position relative to others
This candidate's bar highlighted in primary-500

    "Rescore with AI" accent button (Sparkles icon) / mt-24px
    "Rescore" confirmation: "This will re-analyze against the latest job requirements."

    Manual override card (neutral-50 bg / radius-lg / padding 16px / mt-16px):
      "Add manual score adjustment" ghost button
      When open: number input (0-100) + reason textarea + "Save Override" primary

RESUME TAB:
PDF viewer: 80% of main column / min-height 600px / border-default / radius-lg
Skeleton while loading (shimmers full height)
Right panel (20%): extracted entities highlighted
Skills: green-100 bg / green-700 text / radius-sm
Companies: blue-100 bg / blue-700 text
Education: purple-100 bg / purple-700 text

INTERVIEWS TAB:
Interview cards list (gap 16px):
Each: white bg / border / radius-lg / padding 20px
Date + time (H4) / Interviewers avatars / type badge / status badge
"View Scorecard" link if completed / "Join Meeting" link if upcoming

SCORECARDS TAB:
Aggregated rating bar chart at top:
5 rating options / bar length = count / label right
Strong Yes: accent-500 / Yes: primary-500 / No: warning / Strong No: error
Divider
Per scorecard cards: avatar + overall rating badge + notes + criterion stars

NOTES TAB:
New note (top):
Textarea 96px min / "Post Note" primary compact / cancel ghost
Note list (newest first):
Each: avatar 32px + name 13px weight 600 + timestamp 11px neutral-400
Content: 14px neutral-700 / background: white / border / radius-md / padding 12px

ACTIVITY TAB:
Full timeline / newest first
Each event: icon (type-colored) + actor name + action text + timestamp
Event types have distinct icons: Application, Stage Move, AI Score, Interview, Note, Offer

ACTION SIDEBAR (4 cols, sticky top 88px):
ActionSidebar.tsx
background: neutral-50 / border: border-default / radius: radius-lg / padding: 20px

MOVE STAGE section:
Label: "Current stage" 12px weight 600 neutral-700
Select: current stage shown / all stages as options
"Move" primary compact below / 8px gap

SCHEDULE INTERVIEW section (mt-20px):
"Schedule Interview" primary full-width

MESSAGE section (mt-12px):
"Send Message" secondary full-width

REJECT section (mt-12px):
"Reject Candidate" destructive full-width
Click: modal with rejection reason select + note

TAGS section (mt-20px, border-top pt-20px):
H5 "Tags" / mt-0
Multi-select tag input
Existing tags shown as pills

ASSIGNED TO section (mt-16px):
H5 "Assigned to"
Recruiter row: avatar 28px + name 13px weight 500
"Change" ghost link 12px

QUICK STATS (mt-16px, border-top pt-16px):
3 stats:
"Days in stage" / "Total in pipeline" / "Last activity"
Each: value 16px weight 600 neutral-900 + label 12px neutral-500

---

## PAGE 8: ANALYTICS DASHBOARD

FILE: src/app/(app)/analytics/page.tsx

PURPOSE: Pipeline health visibility for leaders.

LAYOUT: Full content / 32px padding / 12-col grid

PAGE HEADER:
H1 "Analytics" left
Right cluster: DateRangePicker.tsx + "Export CSV" ghost + CSV icon

SECTION 1 — KEY METRICS (4 stat cards, 3 cols each):
Total Applications / Time-to-Hire (avg days) / Offer Acceptance % / Pipeline Conversion %
Same StatCard.tsx component

SECTION 2 — PIPELINE FUNNEL + STAGE TABLE:
ChartCard.tsx (8 cols):
H4 "Conversion Funnel" + period label right
PipelineFunnelChart.tsx (Recharts FunnelChart or custom SVG bars)
Each stage bar: width = conversion % / color deepens per stage
Labels: stage name left + count + conversion arrow

Stage breakdown table (4 cols):
CompactTable: Stage / Count / Avg Days / Conversion %
Rows: 40px height / 13px text
Sortable headers

SECTION 3 — TIME TO HIRE TREND (12 cols):
ChartCard.tsx full width
TimeToHireChart.tsx (Recharts LineChart)
X axis: 12 weeks / Y axis: days
Line 1 current: primary-500 / stroke-width 2px
Line 2 previous: neutral-300 / dashed / stroke-width 1.5px
Tooltip: white bg / shadow-md / radius-sm / both values with colored dots
Grid lines: neutral-100
Dot on data points: 4px circle / matching line color

SECTION 4 — SOURCE QUALITY (two charts, 6 cols each):
SourceQualityChart.tsx: bar chart / sources X / conversion rate Y
Bars colored by performance band (green/amber/red)
SourceVolumeDonut.tsx: donut chart / volume by source
Center: total number Plus Jakarta Sans 24px / legend right with percents

SECTION 5 — TEAM PERFORMANCE (12 cols):
TeamPerformanceTable.tsx
Recruiter / Reviewed / Avg Response / Interviews / Offers / Hire Rate
Sortable / sticky first column on mobile horizontal scroll

SECTION 6 — JOB PERFORMANCE (12 cols):
JobPerformanceTable.tsx
Job Title / Applications / Avg Score / Conv. Rate / Days Open / Status badge

All ChartCard wrappers: white bg / shadow-sm / radius-lg / padding 24px
Title: H4 neutral-900 / period: Inter 13px neutral-500 right-aligned in header row

---

## PAGE 9: INTERVIEW SCHEDULING

FILE: src/app/(app)/interviews/page.tsx

PURPOSE: Schedule, manage, and track all interviews.

LAYOUT: Two columns / Calendar 8 cols + Queue 4 cols / 32px padding

LEFT — CALENDAR (InterviewCalendar.tsx):
Using react-big-calendar or equivalent
Header row: Month title + Prev/Next arrows + Month/Week/Day pill toggle
"Schedule Interview" primary button right of header

Calendar grid:
Month view: standard 7-col grid
Event pills: 24px height / radius-xs / padding 0 8px / 12px text
Scheduled: accent-500 bg / white text
Completed: neutral-200 bg / neutral-600 text
Cancelled: strikethrough / neutral-300

    Event click popover:
      shadow-lg / radius-lg / padding 16px / border-default
      Candidate name + role + interviewer avatars + time + "View Details" link

Week/Day view: time grid / hourly rows / event blocks

SCHEDULING MODAL (ScheduleModal.tsx, LG 720px):
H3: "Schedule an interview"

Application search: searchable Command/Combobox (full width)
Date picker: inline calendar widget / compact
Time: hour select + minute select + AM/PM toggle
Duration: select (30, 45, 60, 90 min)
Location type: 3 radio cards side-by-side
Video / Phone / Onsite
Each: icon + label / radio selection / primary-50 bg when selected
Meeting link: text input (auto-populated if calendar connected)
Interviewers: InterviewerPicker.tsx (avatar multi-select with role chips)
Interview Kit: select dropdown + "Generate with AI" accent button

AI generation loading: AIProcessingIndicator.tsx
Preview: QuestionSetPreview.tsx (scrollable list of questions by category)

Email preview accordion (collapsed default):
"Preview invite email" toggle / ChevronDown
Email preview card: neutral-50 bg / mock email layout

Footer: "Schedule Interview" primary full-width

RIGHT — INTERVIEW QUEUE (InterviewQueue.tsx, 4 cols):
H4 "Upcoming" + count badge

List of next 10 interviews, each item (56px height):
Avatar 32px + Name 14px weight 600 + Role 12px neutral-500
Date/time 12px neutral-500 right-aligned
Interviewer avatar stack (20px each)
"Submit Scorecard" accent ghost button (shows for completed interviews)

SCORECARD MODAL (ScorecardModal.tsx, LG):
H3: "Interview scorecard"
Candidate + interview date + interviewer shown at top

Per-criterion rows (4-6 criteria):
Criterion name 14px weight 600 neutral-900
5-star rating (interactive)
Comment textarea 48px min-height
Row: radius-sm / border / padding 16px

Overall rating: 4 buttons in a row (full width split)
"Strong Yes" / "Yes" / "No" / "Strong No"
Active: primary-500 bg / white text
Inactive: secondary button style

Notes textarea: 96px min / "Additional notes..."
"Submit Scorecard" primary full-width / mt-24px

---

## PAGE 10: CANDIDATE PORTAL

FILE: src/app/(portal)/apply/[jobId]/page.tsx
FILE: src/app/(portal)/status/page.tsx

PURPOSE: Professional application experience for candidates.

LAYOUT: Minimal / white background / no sidebar / simple top bar

PORTAL HEADER (PortalHeader.tsx):
Height: 60px / white bg / border-bottom / padding 0 24px
Company logo 36px + Company name H4 neutral-900 left
Powered by TalentIQ" 11px neutral-400 right (can be disabled on Enterprise)

APPLICATION FORM PAGE:
Max-width: 680px / mx-auto / padding: 40px 24px

Job summary card (neutral-50 bg / radius-lg / padding 20px / mb-32px):
Job title H3 / Department badge / Location badge / Remote badge / Salary range
Posted date 12px neutral-500 / border: border-default

Form fields (single column, gap 20px):
All configured fields rendered dynamically
Label style: as defined in input components
Resume upload zone

GDPR notice (12px neutral-500, mt-16px, mb-24px):
"Your data will be processed in accordance with our Privacy Policy"
Privacy policy link primary-500

"Submit Application" primary full-width large / height 52px

Submission success:
CheckCircle 48px accent-500 / scale-in animation
"Application submitted" H3
"We'll keep you updated at your@email.com" Body-MD
Application ID: "Application ID: TIQ-2024-00847" JetBrains Mono 13px neutral-500

APPLICATION STATUS PAGE:
Max-width: 700px / mx-auto / padding: 40px 24px

Greeting: "Hello, Alex" Plus Jakarta Sans 24px weight 700 / mt-0
Role: "Applied for Senior Software Engineer at Acme Corp" 15px neutral-600

Status timeline (ApplicationStatusTimeline.tsx):
Horizontal on desktop / vertical on mobile
5 stages: Applied → Screening → Interview → Offer → Hired

    Each StatusStageItem.tsx:
      Circle 32px:
        Completed: accent-500 / CheckCircle icon white inside
        Current: primary-500 / pulsing ring animation (opacity 0.3→0→0.3)
        Future: neutral-200

      Connector line (between circles):
        Completed: accent-500 solid
        Future: neutral-200 dashed

      Label below circle: 12px
        Completed: accent-600 weight 600
        Current: primary-600 weight 600
        Future: neutral-400

Current stage card (mt-32px):
white bg / radius-lg / shadow-sm / padding 20px / border-default
Stage name H4 neutral-900
Description: 14px neutral-600 / mt-8px
"Last updated: 2 days ago" 12px neutral-400 / mt-12px

"Questions?" ghost button + Mail icon / mt-24px / full-width

---

## PAGE 11: SETTINGS

FILE: src/app/(app)/settings/page.tsx (and sub-pages)

PURPOSE: Company configuration, team, billing.

LAYOUT: Two columns / SettingsNav 200px left + content area right
Desktop: side-by-side / Mobile: stacked (nav collapses to horizontal tabs)

SETTINGS NAV (SettingsNav.tsx):
H5 "Settings" 13px weight 600 neutral-500 uppercase / mb-12px

Nav items:
height 36px / padding 8px 12px / radius-md
Inter 14px weight 500

    States:
      default: neutral-700 / transparent bg
      hover: neutral-900 / neutral-50 bg
      active: primary-700 / primary-50 bg / 2px left accent bar

    Items:
      Building2 — General
      Users — Team Members
      GitMerge — Pipeline Stages
      Mail — Email Templates
      Puzzle — Integrations
      CreditCard — Billing
      Shield — Security
      Code2 — API Access

GENERAL SETTINGS:
SettingSection.tsx × 3:

Section 1: "Company Profile"
Company name (text)
Logo upload (compact zone)
Industry (select)
Size (select)
Timezone (select)
Currency (select)

Section 2: "Career Page"
Career page URL: neutral-50 bg / read-only input showing URL
Copy button right
Custom subdomain: prefix label "talentiq.com/" + subdomain input + ".com" suffix

"Save Changes" primary / mt-24px

TEAM MEMBERS:
H3 "Team Members" + "Invite Member" primary button right

UserRow.tsx in a table:
Columns: Avatar + Name + Email / Role badge / Status badge / Joined / Actions
Actions: "Edit Role" ghost + "Deactivate" ghost destructive

InviteUserModal.tsx (SM 400px):
Email input / Role select / "Send Invitation" primary

Pending invitations section (if any):
Compact list: email + sent date + "Resend" link + "Cancel" link

PIPELINE STAGES:
H3 "Pipeline Stages"
Warning text: "Changes affect all active pipelines." / amber-700 / 13px

StageList.tsx (dnd-kit sortable):
Each StageRow.tsx:
GripVertical drag handle / Stage name input (editable) / Type badge / Delete button
Default stages: delete disabled (tooltip: "Default stage cannot be removed")

"Add Stage" ghost + Plus icon / mt-16px
"Save Changes" primary / mt-24px

BILLING:
PlanCard.tsx (current plan summary):
Plan name H4 + Price H2 + "per month" / Renewal date
Features list: 3 key features with check icons

Usage section (mt-24px):
UsageBar.tsx × 3:
Label left (e.g. "AI Scores Used") / count/limit right
bar: 8px height / radius-full / neutral-100 track
Fill: primary-500 default / warning 80%+ / error 100%
"Upgrade for more" link if at/near limit

Action buttons row (mt-24px, gap 12px):
"Manage Plan" primary (opens Stripe Customer Portal)
"View Invoices" secondary

Invoice table (mt-32px):
Date / Amount / Status badge / "Download PDF" link
10 most recent invoices

===========================================================================
PART 5 — RESPONSIVE SPECIFICATIONS
===========================================================================

--- MOBILE (0-767px) ---

All pages:
Sidebar: HIDDEN. Replaced by MobileBottomNav.tsx (64px fixed bottom)
Header: Logo centered + Hamburger right
Content padding: 16px horizontal

Home page:
Hero: single column / text first / mockup below (no rotation / no floating badge)
H1: 36px weight 800 / "Competition" still gradient
Inline CTA pill: drops below headline as full-width primary large button
Avatar cluster: centered
Bento grid: vertical stack
Stats strip: single column centered
All two-column sections: single column
Pricing cards: vertical stack (Growth card no scale transform)
Logo strip: marquee auto-scroll

Dashboard:
Stats row: 2×2 grid (2 per row)
Kanban overview: horizontal pill scroll + compact card strip
Activity feed: below kanban overview
AI insights: cards stack vertically

Kanban board:
NO dnd-kit drag-and-drop on touch
Board renders as vertical list of stages (accordion-style)
Each stage: collapsible section / stage name header
Cards inside: full width list
Move button on each card: "Move Stage" small button opens bottom sheet select

Tables:
First column sticky / horizontal scroll
Secondary columns hide: source, recruiter, last activity
Or toggle to card view: each row becomes a compact card

Modals:
Bottom sheet instead of centered modal
border-radius: 24px top-left top-right / 0 bottom
max-height: 90vh / overflow-y: auto
Slides up from bottom: translateY(100%→0) 250ms ease-out

Forms:
Single column always
Input height: 48px (touch target)
Button height: 52px

Analytics charts:
Stack vertically / height: 220px each
Funnel chart: horizontal bars
Table columns: hide tertiary columns

--- TABLET (768-1023px) ---

Sidebar: icon-only 64px default. Tap overlays 260px sidebar.
Dashboard: 2×2 stat grid / kanban + activity side by side maintained
Hero: two columns at 60/40 (maintained)
Bento grid: Card A full width / B+C 50/50
Pricing: vertical stack
All 4-col grids: 2×2
Analytics: 2-col chart grid
Tables: hide secondary columns

Application detail: single column (sidebar moves to bottom tabs)
Settings: nav becomes horizontal tab row at top

--- DESKTOP (1280-1535px) ---

All layouts as specified per page. Full sidebar (260px).

--- ULTRA-WIDE (1536px+) ---

Max content: 1400px app / 1200px marketing
Extra horizontal whitespace auto-added via mx-auto
Stats row: can show 5-6 cards on ultra-wide
Hero: increase padding to 128px top
Typography stays same — line lengths get bounded by max-width

===========================================================================
PART 6 — EMPTY, LOADING, AND ERROR STATES
===========================================================================

--- EMPTY STATES ---

All EmptyState.tsx takes: icon, title, description, ctaLabel, ctaAction

Jobs list (no jobs):
Briefcase 40px neutral-300 / "No jobs posted yet" / "Post your first job to start
finding great candidates." / "Create First Job" primary

Kanban column (no candidates):
No illustration — just dashed-border placeholder card (80px height, 8px rounded)
"+ Add Candidate" 12px neutral-400 ghost centered

Applications (no results, filters active):
UserX 40px neutral-300 / "No applications match your filters"
"Try adjusting your filters" / "Clear All Filters" ghost

Applications (no results, no filters):
Users 40px neutral-300 / "No applications yet"
"Share your job listing to start receiving applications."
"Copy Job Link" secondary button

Notifications (all read):
Bell 40px neutral-300 / "You're all caught up" / "Check back later for updates."

Analytics (insufficient data):
BarChart2 40px neutral-300 / "Not enough data yet"
"Analytics populate after 10+ applications." / neutral

AI Insights (no insights):
Sparkles 32px neutral-300 / "No insights right now"
"We'll surface patterns as your pipeline grows."

Interview queue (no upcoming):
Calendar 32px neutral-300 / "No interviews scheduled"
"Schedule Interview" primary ghost

--- LOADING STATES ---

Skeleton shimmer on ALL async content. Never show raw empty state before first load.

StatCard skeleton: same card dimensions / skeleton blocks for value + label
ApplicationTable skeleton: 5 rows × column widths matching real data
KanbanColumn skeleton: 2 skeleton cards per column / column header real
AIScoreCard skeleton: pulsing circle + skeleton bars + skeleton text rows
DashboardPage skeleton: entire layout skeleton (header + 4 stats + two panels)
SidePanel skeleton: header skeleton + tab skeleton + full content skeleton
Chart skeleton: skeleton block same height as chart area
Analytics page: all 6 chart cards skeleton simultaneously

Form submit loading:
Button: spinner replaces label / width locked / disabled
Other fields: not disabled (user can still read them)

Page navigation loading:
Thin 3px progress bar at very top of viewport
primary-500 fill / fills from 0→85% over 400ms / completes on response
(NProgress style)

--- ERROR STATES ---

Form validation:
Field: error border + error text + AlertCircle 12px inline
Form-level: error toast

API load failure (in page sections):
AlertTriangle 28px warning / "Couldn't load [resource]" H5
Error details 13px neutral-500
"Try again" secondary button (retries the query)

404 page:
"404" Display-2XL primary-500 weight 800 centered
"Page not found" H2 neutral-900 below
14px neutral-600 description
"Back to Dashboard" primary

500 page:
AlertCircle 48px error / "Something went wrong on our end" H2
"Our team has been notified and is working on it."
Error ID: JetBrains Mono 13px neutral-500
"Return Home" primary + "Contact Support" secondary

Network offline:
Persistent toast (bottom-center, not bottom-right)
background: neutral-900 / white text
WifiOff 16px + "You're offline. Changes will sync when reconnected."
No auto-dismiss (manual or auto on reconnect)

===========================================================================
PART 7 — ACCESSIBILITY REQUIREMENTS
===========================================================================

WCAG 2.1 AA minimum. AA where possible.

CONTRAST:
All body text on backgrounds: 4.5:1 minimum verified
Primary-500 on white: verified 4.5:1+
Accent-500 on white: verified 4.5:1+
All placeholder text: neutral-400 on white = 3.1:1 (meets AA for UI components)
Score ring colors on white bg checked
White text on primary-500 bg: verified

COLOR BLINDNESS:
Color is NEVER the only differentiator.
AI score: color + icon + text label always present
Status badges: color + text label always
Error states: color + icon + text message
Score bands: verified distinguishable in deuteranopia simulation

KEYBOARD NAVIGATION:
All interactive elements: Tab-focusable in DOM order
Custom components (Kanban, custom selects): keyboard equivalents
Kanban keyboard mode: Space = grab card / Arrow keys = move / Enter = drop / Escape = cancel
Modal: focus trap while open / ESC closes / returns focus to trigger
Dropdown: arrow keys navigate / Enter selects / ESC closes
Score range slider: Left/Right arrows / Home/End

FOCUS RINGS:
ALL elements: visible focus ring using --shadow-brand
Custom CSS: outline: none is NEVER used without providing --shadow-brand replacement
High contrast mode: outline: 2px solid currentColor as fallback

SCREEN READERS:
All icon-only buttons: aria-label attribute
All form inputs: associated label via htmlFor or aria-labelledby
Error messages: aria-live="polite"
Modal: role="dialog" / aria-modal="true" / aria-labelledby title id
Status updates (AI processing): aria-live="polite"
Toast success/info: role="status" / Toast error/warning: role="alert"
Kanban columns: aria-label="[Stage Name] — [count] candidates"
Score ring: aria-label="AI Score: [score] out of 100 — [label]"
Loading spinner: aria-label="Loading" + aria-busy="true" on container

SKIP LINKS:
First focusable element on all pages: "Skip to main content"
Visually hidden until focused
On focus: shows as primary-500 bg / white text / padding 8px 16px / top-left

REDUCED MOTION:
@media (prefers-reduced-motion: reduce) {
_ { animation-duration: 0ms !important; transition-duration: 0ms !important; }
.skeleton-shimmer { animation: none; }
.mesh-gradient { animation: none; }
.hero-float { animation: none; }
.score-ring { transition: none; stroke-dashoffset: final-value; }
.counter { /_ skip animation, show final value \*/ }
}
Exceptions: opacity-only transitions preserved at 150ms max for usability

===========================================================================
PART 8 — PREMIUM UX MICRO-COPY GUIDELINES
===========================================================================

Button labels: Action verbs only.
"Create Job" not "New Job"
"Schedule Interview" not "Add Interview"
"Generate with AI" not "AI Generate"
"Rescore" not "Recalculate"
"Publish Job" not "Submit"
"Move to Interview" not "Update Stage"

Placeholders: Specific, contextual, example-driven.
Job title: "e.g. Senior Software Engineer"
Email: "your@company.com"
Skills: "React, TypeScript, Node.js..."
Company name: "Acme Corp"
NOT: "Enter text here" / "Type something"

Error messages: Specific and fixable.
"Enter a valid work email, like name@company.com"
"Password needs 8+ characters, one number, and one symbol"
"Job title can't be blank"
NOT: "Invalid input" / "Error" / "Please try again"

Success messages: Confirm outcome, not action.
"Job published — candidates can now find and apply"
"Interview scheduled — invites sent to 3 attendees"
"Offer sent — Alex has 5 days to respond"
NOT: "Saved successfully" / "Done" / "Completed"

Loading messages: Specific to the AI operation.
"Analyzing resume skills... usually 5 seconds."
"Scoring against your job requirements..."
"Checking for gender-coded language..."
"Writing your description... about 20 seconds."
"Generating interview questions for a senior role..."
NOT: "Loading..." / "Please wait..." / "Processing..."

Empty states: Encouraging, action-oriented.
"Your pipeline is waiting for its first candidate."
"No jobs yet — create your first in under 2 minutes."
"All caught up — you're on top of everything."
NOT: "No data found" / "Empty" / "Nothing here"

Upgrade prompts: Feature-first, not price-first.
"Bias detection is a Growth feature — see what flagged language looks like"
"[Upgrade button] Try Growth free for 14 days"
NOT: "This feature requires an upgrade" / "Buy now"

===========================================================================
PART 9 — DELIGHT AND PREMIUM DETAILS
===========================================================================

CONFETTI:
canvas-confetti library
Triggers: first job published / first offer accepted / each hiring milestone
Config: colors [#2563EB, #10B981, #FFFFFF] / particleCount 80 / spread 60
Origin: above the trigger button position

SCORE RING ANIMATION:
Every single score ring fills on component mount.
Never shows a static pre-filled ring (would feel dead).
If score updates: ring de-fills in 150ms then re-fills to new score in 600ms.
All score rings on a page animate simultaneously on page load (not staggered).

AI INSIGHTS SPARKLES:
The Sparkles icon in the AI Insights Panel header plays a one-time twinkle
on page load (after 1.5s delay): scale 1.0→1.3→1.0 + opacity oscillation.
Duration: 600ms. Plays once. Not on hover.

HIRE MOVE CELEBRATION:
When a candidate is moved to "Hired" stage on Kanban:

1. Card background pulses from white → accent-100 → white (600ms total).
2. The "Hired" stage column count badge animates with spring scale (--ease-spring).
3. Tiny confetti burst from the card position (canvas-confetti 30 particles).

DASHBOARD GREETING:
WelcomeGreeting.tsx reads current hour:
0-11: "Good morning, [first name]."
12-17: "Good afternoon, [first name]."
18-23: "Good evening, [first name]."
Displayed in italic Inter 14px neutral-500 above the H1 page title.

REAL-TIME COLLABORATION INDICATORS:
When teammate moves a Kanban card visible to current user:

1. Their avatar (24px circle) briefly overlays the card.
2. Tooltip: "Moved by [name]"
3. Avatar: translateY(0→-8px) 200ms then fade out.
4. Card: brief primary-50 background flash (200ms).

TYPING INDICATOR IN NOTES:
If teammate is typing a note on same application:
Their avatar (20px) + animated 3-dot indicator at bottom of notes list.
"[Name] is typing..." Inter 12px neutral-400 italic.

STAGE TRANSITION ANIMATION:
Kanban card moves between columns with smooth animation following drag path.
On drop: slight bounce at landing position (spring easing).
Column it left: list collapses smoothly (height transition 200ms).
Column it enters: list expands smoothly.

NOTIFICATION BELL SHAKE:
On new notification arriving via WebSocket:
Bell icon: rotate 0→-12→12→-8→8→0deg keyframe / 200ms total / plays once.
Badge counter: spring scale-in when count increments.

KANBAN DRAG SHADOWS:
When card is being dragged across columns, column receiving the card highlights:
background shifts from neutral-100 to accent-50 (100ms ease-out) as drag hovers over.
Drops back to neutral-100 immediately on card release.

AI DESCRIPTION GENERATION SUCCESS:
The rich text editor textarea animates: border briefly glows with shadow-accent.
Then content fills in as a typing animation (text appears progressively, 30ms per character delay up to 2000ms total for very long text, then instant fill).

ONBOARDING AHA MOMENT (STEP 4):
After AI score reveal:

1. Card entrance: translateY(16px)→0 + opacity 0→1 / 300ms ease-out
2. Score ring fills: 600ms
3. Card background: pulses accent-50 → white / 1200ms total
4. Explanation bullets: appear 100ms stagger
5. Strengths pills: pop in with spring easing 50ms stagger
6. Gaps pills: same
   This sequence is the core "this is why I pay for this" moment.

===========================================================================
PART 10 — PACKAGE.JSON DEPENDENCIES
===========================================================================

PRODUCTION DEPENDENCIES:

next: ^14.2.0
react: ^18.3.0
react-dom: ^18.3.0
typescript: ^5.4.0

UI FRAMEWORK:
@radix-ui/react-accordion: ^1.1.2
@radix-ui/react-avatar: ^1.0.4
@radix-ui/react-checkbox: ^1.0.4
@radix-ui/react-dialog: ^1.0.5
@radix-ui/react-dropdown-menu: ^2.0.6
@radix-ui/react-label: ^2.0.2
@radix-ui/react-popover: ^1.0.7
@radix-ui/react-progress: ^1.0.3
@radix-ui/react-select: ^2.0.0
@radix-ui/react-separator: ^1.0.3
@radix-ui/react-sheet: ^1.0.0 (via shadcn)
@radix-ui/react-slider: ^1.1.2
@radix-ui/react-switch: ^1.0.3
@radix-ui/react-tabs: ^1.0.4
@radix-ui/react-tooltip: ^1.0.7
class-variance-authority: ^0.7.0
clsx: ^2.1.1
lucide-react: ^0.383.0
tailwind-merge: ^2.3.0
tailwindcss: ^3.4.0
tailwindcss-animate: ^1.0.7

STATE AND DATA:
@tanstack/react-query: ^5.45.0
@tanstack/react-virtual: ^3.8.0
zustand: ^4.5.2
axios: ^1.7.2

FORMS AND VALIDATION:
react-hook-form: ^7.52.0
@hookform/resolvers: ^3.6.0
zod: ^3.23.8

DRAG AND DROP:
@dnd-kit/core: ^6.1.0
@dnd-kit/sortable: ^8.0.0
@dnd-kit/utilities: ^3.2.2

CHARTS AND VISUALIZATION:
recharts: ^2.12.7

REAL-TIME:
socket.io-client: ^4.7.5

DATES AND CALENDAR:
date-fns: ^3.6.0
react-big-calendar: ^1.14.0

ANIMATIONS AND EFFECTS:
canvas-confetti: ^1.9.3
@types/canvas-confetti: ^1.6.4

RICH TEXT:
@tiptap/react: ^2.4.0
@tiptap/starter-kit: ^2.4.0
@tiptap/extension-link: ^2.4.0

UTILITIES:
dompurify: ^3.1.5
@types/dompurify: ^3.0.5

FONTS (via next/font or Google):
next/font/google (Plus Jakarta Sans, Inter, JetBrains Mono)

DEV DEPENDENCIES:
eslint: ^8.57.0
eslint-config-next: ^14.2.0
prettier: ^3.3.0
prettier-plugin-tailwindcss: ^0.6.5
@types/node: ^20.14.0
@types/react: ^18.3.0
@types/react-dom: ^18.3.0
postcss: ^8.4.39
autoprefixer: ^10.4.19

===========================================================================
PART 11 — TAILWIND CONFIG (COMPLETE TOKEN MAPPING)
===========================================================================

tailwind.config.ts:

import type { Config } from 'tailwindcss'

const config: Config = {
darkMode: ['class'],
content: [
'./src/pages/**/*.{ts,tsx}',
'./src/components/**/*.{ts,tsx}',
'./src/app/**/*.{ts,tsx}',
],
theme: {
extend: {
colors: {
primary: {
50: '#EFF6FF',
100: '#DBEAFE',
200: '#BFDBFE',
300: '#60A5FA',
400: '#3B82F6',
500: '#2563EB',
600: '#1E56A0',
700: '#1A4480',
800: '#0D3260',
900: '#0A2540',
950: '#040D1A',
},
accent: {
50: '#ECFDF5',
100: '#D1FAE5',
200: '#A7F3D0',
300: '#6EE7B7',
400: '#34D399',
500: '#10B981',
600: '#059669',
700: '#047857',
},
},
fontFamily: {
display: ['Plus Jakarta Sans', 'sans-serif'],
body: ['Inter', 'sans-serif'],
mono: ['JetBrains Mono', 'monospace'],
},
fontSize: {
'display-2xl': ['72px', { lineHeight: '80px', letterSpacing: '-2.5px' }],
'display-xl': ['56px', { lineHeight: '64px', letterSpacing: '-2px' }],
'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-1.5px' }],
'h1': ['36px', { lineHeight: '44px', letterSpacing: '-0.75px' }],
'h2': ['28px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
'h3': ['22px', { lineHeight: '30px', letterSpacing: '-0.25px' }],
'h4': ['18px', { lineHeight: '26px' }],
'h5': ['15px', { lineHeight: '22px' }],
'body-xl': ['20px', { lineHeight: '32px' }],
'body-lg': ['17px', { lineHeight: '28px' }],
'body-md': ['15px', { lineHeight: '24px' }],
'body-sm': ['13px', { lineHeight: '20px' }],
'body-xs': ['11px', { lineHeight: '16px' }],
},
spacing: {
'1': '4px',
'2': '8px',
'3': '12px',
'4': '16px',
'5': '20px',
'6': '24px',
'8': '32px',
'10': '40px',
'12': '48px',
'16': '64px',
'24': '96px',
'32': '128px',
},
borderRadius: {
'xs': '4px',
'sm': '6px',
'md': '8px',
'lg': '12px',
'xl': '16px',
'2xl': '24px',
'3xl': '32px',
'full': '9999px',
},
boxShadow: {
'xs': '0 1px 2px rgba(0,0,0,0.04)',
'sm': '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
'md': '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
'lg': '0 12px 20px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05)',
'xl': '0 24px 32px rgba(0,0,0,0.10), 0 8px 12px rgba(0,0,0,0.05)',
'2xl': '0 40px 60px rgba(0,0,0,0.12), 0 16px 24px rgba(0,0,0,0.06)',
'brand': '0 0 0 3px rgba(37,99,235,0.18)',
'accent': '0 4px 16px rgba(16,185,129,0.28)',
'accent-lg': '0 8px 32px rgba(16,185,129,0.20)',
'glass': '0 8px 32px rgba(10,37,64,0.20), inset 0 1px 0 rgba(255,255,255,0.20)',
'inner': 'inset 0 2px 4px rgba(0,0,0,0.06)',
},
animation: {
'fade-slide-up': 'fadeSlideUp 400ms cubic-bezier(0.0,0.0,0.2,1) forwards',
'mesh-float': 'meshFloat 18s ease-in-out infinite',
'shimmer': 'shimmer 1400ms linear infinite',
'score-fill': 'scoreFill 600ms cubic-bezier(0.4,0.0,0.2,1) forwards',
'spring-in': 'springIn 400ms cubic-bezier(0.34,1.56,0.64,1) forwards',
'float': 'float 3s ease-in-out infinite',
'dot-pulse': 'dotPulse 400ms ease-in-out infinite',
'bell-shake': 'bellShake 200ms ease-in-out',
'twinkle': 'twinkle 600ms ease-in-out',
},
keyframes: {
fadeSlideUp: {
'from': { opacity: '0', transform: 'translateY(20px)' },
'to': { opacity: '1', transform: 'translateY(0)' },
},
meshFloat: {
'0%': { transform: 'scale(1.00) translate(0px, 0px)', opacity: '0.12' },
'33%': { transform: 'scale(1.04) translate(-8px, 6px)', opacity: '0.14' },
'66%': { transform: 'scale(0.97) translate(6px, -4px)', opacity: '0.10' },
'100%': { transform: 'scale(1.00) translate(0px, 0px)', opacity: '0.12' },
},
shimmer: {
'from': { backgroundPosition: '200% 0' },
'to': { backgroundPosition: '-200% 0' },
},
scoreFill: {
'from': { strokeDashoffset: '201' },
'to': { strokeDashoffset: 'var(--target-offset)' },
},
springIn: {
'from': { opacity: '0', transform: 'scale(0.8)' },
'to': { opacity: '1', transform: 'scale(1)' },
},
float: {
'0%, 100%': { transform: 'translateY(0px)' },
'50%': { transform: 'translateY(-6px)' },
},
dotPulse: {
'0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
'50%': { transform: 'scale(1.4)', opacity: '1' },
},
bellShake: {
'0%': { transform: 'rotate(0deg)' },
'20%': { transform: 'rotate(-12deg)' },
'40%': { transform: 'rotate(12deg)' },
'60%': { transform: 'rotate(-8deg)' },
'80%': { transform: 'rotate(8deg)' },
'100%': { transform: 'rotate(0deg)' },
},
twinkle: {
'0%, 100%': { transform: 'scale(1)', opacity: '1' },
'50%': { transform: 'scale(1.3)', opacity: '0.6' },
},
},
transitionTimingFunction: {
'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
'ease-out-custom': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
},
},
},
plugins: [
require('tailwindcss-animate'),
],
}

export default config

===========================================================================
PART 12 — globals.css (CRITICAL BASE STYLES)
===========================================================================

/_ ============================================================
globals.css — TalentIQ Design System Base
============================================================ _/

@tailwind base;
@tailwind components;
@tailwind utilities;

/_ Google Fonts import _/
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

@layer base {
:root {
/_ Color primitives as CSS vars _/
--color-primary-50: #EFF6FF;
--color-primary-500: #2563EB;
--color-primary-900: #0A2540;
--color-primary-950: #040D1A;
--color-accent-500: #10B981;
--color-accent-600: #059669;
--color-neutral-50: #F9FAFB;
--color-neutral-200: #E5E7EB;
--color-neutral-900: #111827;
--color-white: #FFFFFF;

    /* Gradients */
    --gradient-cta: linear-gradient(135deg, #2563EB 0%, #10B981 100%);
    --gradient-hero-mesh:
      radial-gradient(ellipse at 15% 40%, rgba(37,99,235,0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 15%, rgba(16,185,129,0.14) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 85%, rgba(10,37,64,0.10) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.08) 0%, transparent 70%);

    /* Shadows */
    --shadow-brand: 0 0 0 3px rgba(37,99,235,0.18);
    --shadow-accent: 0 4px 16px rgba(16,185,129,0.28);

    /* Fonts */
    --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
    --font-body:    'Inter', -apple-system, sans-serif;
    --font-mono:    'JetBrains Mono', monospace;

}

- {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  }

html {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}

body {
font-family: var(--font-body);
background-color: #F9FAFB;
color: #111827;
line-height: 1.5;
}

/_ Gradient text utility _/
.gradient-text {
background: var(--gradient-cta);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
}

/_ Focus ring — applied to ALL interactive elements _/
:focus-visible {
outline: none;
box-shadow: var(--shadow-brand);
border-radius: 4px;
}

/_ Custom scrollbar (thin) _/
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
background: #D1D5DB;
border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

/_ Skeleton shimmer base _/
.skeleton {
background: linear-gradient(90deg,
#F3F4F6 0%, #E5E7EB 40%, #E5E7EB 60%, #F3F4F6 100%);
background-size: 200% 100%;
animation: shimmer 1400ms linear infinite;
border-radius: 6px;
}

/_ Reduced motion _/
@media (prefers-reduced-motion: reduce) {
_, _::before, \*::after {
animation-duration: 0.01ms !important;
animation-iteration-count: 1 !important;
transition-duration: 0.01ms !important;
}
.skeleton { animation: none; background: #E5E7EB; }
}
}

===========================================================================
PART 13 — PERFORMANCE STANDARDS
===========================================================================

LCP (Largest Contentful Paint): under 2.5s on 4G mobile
TTI (Time to Interactive): under 3.5s desktop
CLS (Cumulative Layout Shift): under 0.1
FID (First Input Delay): under 100ms

IMAGE OPTIMIZATION:
All marketing images: next/image / WebP / priority={true} on hero image
Product screenshots: lazy loaded / sizes prop for responsive
Avatars: served at 2× (80px for 40px display) / WebP
Public logo images: SVG always

FONT OPTIMIZATION:
next/font/google with display: 'swap'
Subset: latin only
Preconnect hint in <head>
Variable font if available (Plus Jakarta Sans has variable)

CODE SPLITTING:
Analytics charts (Recharts): dynamic(() => import(...), { ssr: false })
PDF viewer: dynamic import on tab click
Kanban board: dynamic import on route load
Canvas-confetti: dynamic import on trigger only

SKELETON SCREENS:
EVERY async component shows skeleton immediately on mount (not a spinner)
Skeleton structure matches real content layout exactly
No layout shift between skeleton and real content

OPTIMISTIC UPDATES:
Kanban stage moves: update UI before API confirms / revert on error
Note creation: optimistic add to list / revert on error
Stage badge counts: optimistic increment/decrement on moves

BUNDLE:
Target: initial JS bundle under 150KB gzipped
Per-route code splitting via Next.js automatic chunking
No barrel imports that pull entire libraries (import { X } from 'lucide-react', not \*)

===========================================================================
END OF SPECIFICATION
===========================================================================

This document is the complete frontend implementation specification for
TalentIQ — AI-Powered Talent Intelligence Platform.

Every design token, color value, typography size, spacing value, component
variant and state, page layout, section specification, animation keyframe,
micro-interaction, responsive behavior, empty state, loading state, error
state, accessibility requirement, file location, package dependency, and
configuration value is specified in this document.

This document was designed with direct reference to the NexusSci reference
image provided — analyzing and adapting:

- The animated mesh gradient hero background
- The bento grid layout below the fold
- The inline CTA embedded in the headline (signature element)
- The avatar cluster in the headline
- The tight rounded card aesthetic (radius-2xl)
- The restrained dark footer
- The minimal navigation with focus on conversion

Into TalentIQ's dual-tone navy/emerald AI talent platform visual language.

A frontend developer can implement every page from this document alone.
A Figma designer can produce all screens from this document alone.
An AI builder (v0, Lovable, Bolt, Cursor) can generate production-ready
pages from this document without additional clarification.

Version: 3.0 Ultra Premium
Last updated: June 2026
