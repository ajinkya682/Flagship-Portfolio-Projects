'use client'

/**
 * TalentIQ Specialty Input Components — Section 2.2
 *
 * FileUploadZone:
 *   border: 2px dashed neutral-200 | radius-lg | bg: neutral-50 | p: 40px 32px
 *   States: idle | drag-over | uploaded | error
 *   Content: UploadCloud 32px / title 14px w600 / subtitle 12px neutral-500
 *   Drag-over: dashed primary-400 border / primary-50 bg / primary-500 icons
 *   Uploaded: white bg / File icon + filename + size + red X
 *   Error: dashed red border + error message below
 *
 * PasswordStrengthMeter:
 *   3-segment bar (Weak/Fair/Strong) — 4px height / radius-full
 *   Weak: 1 red | Fair: 2 amber | Strong: 3 accent-500
 *   Transitions: 200ms ease-out
 *
 * DateRangePicker:
 *   Two-month floating panel (shadow-lg / radius-xl)
 *   32×32 date cells
 *   Selected range: accent-50 fill | Start/end: accent-500 bg white text radius-full
 *   Today: bold primary-500 text | Hover: neutral-100 radius-full
 *
 * ScoreRangeSlider (dual handle):
 *   Track: 4px / neutral-200 bg / radius-full
 *   Filled range: primary-500 bg
 *   Handle: 18px circle / white / shadow-md / 2px primary-500 border
 *   Handle hover: scale(1.2) / shadow-lg / 120ms
 *   Tooltip: value above handle on drag
 */

import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  File,
  UploadCloud,
  X,
} from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// FileUploadZone
// ─────────────────────────────────────────────────────────────────────────────
export interface UploadedFile {
  name: string
  size: number
  file?: File
}

export interface FileUploadZoneProps {
  onFileSelect?: (file: File) => void
  onRemove?: () => void
  uploadedFile?: UploadedFile | null
  accept?: string
  maxSizeMB?: number
  error?: string
  disabled?: boolean
  title?: string
  subtitle?: string
  className?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadZone({
  onFileSelect,
  onRemove,
  uploadedFile,
  accept = '.pdf',
  maxSizeMB = 10,
  error,
  disabled,
  title = 'Drag your resume here',
  subtitle = 'or click to browse — PDF up to 10MB',
  className,
}: FileUploadZoneProps) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = React.useState<string | null>(null)

  const handleFile = (file: File) => {
    setSizeError(null)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`File must be under ${maxSizeMB}MB`)
      return
    }
    onFileSelect?.(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const displayError = error || sizeError

  // ── Uploaded state ─────────────────────────────────────────────────────────
  if (uploadedFile) {
    return (
      <div className={cn(className)}>
        <div
          className={cn(
            'flex items-center justify-between',
            'px-4 py-3 rounded-lg border border-neutral-200 bg-white',
            'transition-colors duration-[120ms]'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <File size={20} className="text-primary-500 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-body text-[14px] font-medium text-neutral-900 truncate">
                {uploadedFile.name}
              </p>
              <p className="font-body text-[12px] text-neutral-500">
                {formatBytes(uploadedFile.size)}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${uploadedFile.name}`}
              className={cn(
                'ml-3 shrink-0 h-8 w-8 rounded-sm flex items-center justify-center',
                'text-[#EF4444] hover:bg-[#FEF2F2]',
                'transition-colors duration-[120ms]',
                'focus-visible:outline-none focus-visible:shadow-brand'
              )}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Idle / Drag / Error state ───────────────────────────────────────────────
  return (
    <div className={cn(className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'w-full text-center rounded-lg',
          'px-8 py-10',
          'border-2 border-dashed',
          'transition-all duration-[120ms] ease-out',
          'focus-visible:outline-none focus-visible:shadow-brand',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // States
          dragging
            ? 'border-primary-400 bg-primary-50'
            : displayError
              ? 'border-[#EF4444] bg-white'
              : 'border-neutral-200 bg-neutral-50 hover:border-primary-300 hover:bg-primary-50/40'
        )}
        aria-label="Upload file"
      >
        <UploadCloud
          size={32}
          className={cn(
            'mx-auto mb-3 transition-colors duration-[120ms]',
            dragging ? 'text-primary-500' : 'text-neutral-400'
          )}
          aria-hidden="true"
        />
        <p
          className={cn(
            'font-body text-[14px] font-semibold mb-1',
            dragging ? 'text-primary-600' : 'text-neutral-700'
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'font-body text-[12px]',
            dragging ? 'text-primary-500' : 'text-neutral-500'
          )}
        >
          {subtitle}
        </p>
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Error message */}
      {displayError && (
        <p className="mt-2 font-body text-[12px] text-[#EF4444]" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PasswordStrengthMeter
// 3-segment bar: Weak (1 red) | Fair (2 amber) | Strong (3 accent-500)
// Segment: 4px height / radius-full / 200ms ease-out transition
// ─────────────────────────────────────────────────────────────────────────────
export type PasswordStrength = 'weak' | 'fair' | 'strong' | null

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return null
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  const long = password.length >= 12
  const score =
    [hasLower, hasUpper, hasNumber, hasSymbol, long].filter(Boolean).length
  if (score <= 2) return 'weak'
  if (score <= 3) return 'fair'
  return 'strong'
}

const STRENGTH_CONFIG = {
  weak: {
    segments: 1,
    color: '#EF4444',
    label: 'Weak',
  },
  fair: {
    segments: 2,
    color: '#F59E0B',
    label: 'Fair',
  },
  strong: {
    segments: 3,
    color: '#10B981',
    label: 'Strong',
  },
} as const

export interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password)
  const config = strength ? STRENGTH_CONFIG[strength] : null

  return (
    <div className={cn('mt-2', className)}>
      {/* 3-segment bar */}
      <div className="flex gap-1" role="meter" aria-valuenow={config?.segments ?? 0} aria-valuemin={0} aria-valuemax={3} aria-label={`Password strength: ${config?.label ?? 'none'}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-[4px] rounded-full transition-colors duration-[200ms] ease-out bg-neutral-200"
            style={{
              backgroundColor:
                config && i < config.segments ? config.color : undefined,
            }}
          />
        ))}
      </div>

      {/* Strength label */}
      {config && (
        <p
          className="mt-1 font-body text-[12px] font-medium transition-colors duration-[200ms]"
          style={{ color: config.color }}
        >
          {config.label}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DateRangePicker
// Two-month floating panel / shadow-lg / radius-xl
// 32×32 cells | Selected range: accent-50 | Endpoints: accent-500 radius-full
// Today: bold primary-500 | Hover: neutral-100 radius-full
// ─────────────────────────────────────────────────────────────────────────────
export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function CalendarMonth({
  month,
  range,
  onDayClick,
  hoveredDate,
  onDayHover,
}: {
  month: Date
  range: DateRange
  onDayClick: (d: Date) => void
  hoveredDate: Date | null
  onDayHover: (d: Date | null) => void
}) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const effectiveTo = range.to ?? hoveredDate

  return (
    <div className="w-[224px]">
      {/* Month title */}
      <p className="font-body font-semibold text-[14px] text-neutral-900 text-center mb-3">
        {format(month, 'MMMM yyyy')}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center font-body text-[11px] text-neutral-400 font-medium h-8 flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inCurrentMonth = isSameMonth(day, month)
          const isStart = range.from ? isSameDay(day, range.from) : false
          const isEnd = effectiveTo ? isSameDay(day, effectiveTo) : false
          const inRange =
            range.from && effectiveTo
              ? isAfter(day, range.from) && isBefore(day, effectiveTo)
              : false
          const today = isToday(day)

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
              onMouseLeave={() => onDayHover(null)}
              disabled={!inCurrentMonth}
              className={cn(
                'relative flex items-center justify-center',
                'h-8 w-8 font-body text-[13px]',
                'transition-colors duration-[80ms]',
                'focus-visible:outline-none focus-visible:shadow-brand',
                !inCurrentMonth && 'text-neutral-300 pointer-events-none',
                // Range fill (between endpoints)
                inRange && 'bg-accent-50',
                // Start endpoint — left-rounded
                isStart && 'bg-accent-500 text-white rounded-full z-10',
                // End endpoint — right-rounded
                isEnd && !isStart && 'bg-accent-500 text-white rounded-full z-10',
                // Today styling
                today && !isStart && !isEnd && 'font-bold text-primary-500',
                // Hover (idle days)
                !isStart && !isEnd && !inRange && inCurrentMonth && 'hover:bg-neutral-100 rounded-full'
              )}
              aria-label={format(day, 'MMMM d, yyyy')}
              aria-current={today ? 'date' : undefined}
              aria-pressed={isStart || isEnd}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange>(value ?? { from: null, to: null })
  const [viewMonth, setViewMonth] = React.useState(new Date())
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null)
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from')
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (value) setRange(value)
  }, [value])

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleDayClick = (day: Date) => {
    if (selecting === 'from') {
      const next = { from: day, to: null }
      setRange(next)
      setSelecting('to')
    } else {
      const newFrom = range.from
      if (newFrom && isBefore(day, newFrom)) {
        const next = { from: day, to: newFrom }
        setRange(next)
        onChange?.(next)
      } else {
        const next = { from: newFrom, to: day }
        setRange(next)
        onChange?.(next)
      }
      setSelecting('from')
      setOpen(false)
    }
  }

  const formatDisplay = () => {
    if (!range.from && !range.to) return ''
    if (range.from && !range.to) return format(range.from, 'MMM d, yyyy')
    if (range.from && range.to)
      return `${format(range.from, 'MMM d')} – ${format(range.to, 'MMM d, yyyy')}`
    return ''
  }

  const nextMonth = addMonths(viewMonth, 1)

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'w-full h-10 px-[14px] flex items-center justify-between',
          'font-body text-[14px] rounded-sm bg-white',
          'border border-neutral-200 text-left',
          'transition-[border-color,box-shadow] duration-[120ms] ease-out',
          'hover:border-neutral-300',
          'focus-visible:outline-none focus-visible:border-primary-500 focus-visible:shadow-brand',
          open && 'border-primary-500 shadow-brand',
          formatDisplay() && 'border-neutral-300',
          disabled && 'bg-neutral-50 cursor-not-allowed text-neutral-400'
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={formatDisplay() ? 'text-neutral-900' : 'text-neutral-400'}>
          {formatDisplay() || placeholder}
        </span>
        <ChevronRight
          size={16}
          className={cn(
            'text-neutral-400 shrink-0 transition-transform duration-150',
            open && 'rotate-90'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Floating panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Date range picker"
          className={cn(
            'absolute left-0 top-[calc(100%+6px)] z-[200]',
            'bg-white rounded-xl shadow-lg border border-neutral-100',
            'p-4'
          )}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              aria-label="Previous month"
              className="h-8 w-8 rounded-sm flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:shadow-brand"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span className="sr-only">Navigate months</span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
              className="h-8 w-8 rounded-sm flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:shadow-brand"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Two months side by side */}
          <div className="flex gap-6">
            <CalendarMonth
              month={viewMonth}
              range={range}
              onDayClick={handleDayClick}
              hoveredDate={hoveredDate}
              onDayHover={setHoveredDate}
            />
            <div className="w-px bg-neutral-100" />
            <CalendarMonth
              month={nextMonth}
              range={range}
              onDayClick={handleDayClick}
              hoveredDate={hoveredDate}
              onDayHover={setHoveredDate}
            />
          </div>

          {/* Quick clear */}
          {(range.from || range.to) && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const empty = { from: null, to: null }
                  setRange(empty)
                  onChange?.(empty)
                  setSelecting('from')
                }}
                className="font-body text-[13px] text-neutral-500 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:shadow-brand"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ScoreRangeSlider (Dual Handle)
// Track: 4px / neutral-200 bg / radius-full
// Filled range: primary-500 (between handles)
// Handle: 18px circle / white / shadow-md / 2px primary-500 border
// Handle hover: scale(1.2) / shadow-lg / 120ms
// Tooltip: value above handle on drag
// ─────────────────────────────────────────────────────────────────────────────
export interface ScoreRangeSliderProps {
  min?: number
  max?: number
  value?: [number, number]
  onChange?: (value: [number, number]) => void
  step?: number
  disabled?: boolean
  className?: string
}

export function ScoreRangeSlider({
  min = 0,
  max = 100,
  value = [0, 100],
  onChange,
  step = 1,
  disabled,
  className,
}: ScoreRangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)
  const [dragging, setDragging] = React.useState<'min' | 'max' | null>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => setLocalValue(value), [value])

  const clamp = (v: number) => Math.min(max, Math.max(min, v))

  const getPercent = (v: number) => ((v - min) / (max - min)) * 100

  const getValueFromPosition = (clientX: number) => {
    const track = trackRef.current
    if (!track) return min
    const rect = track.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    const raw = min + ratio * (max - min)
    return clamp(Math.round(raw / step) * step)
  }

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setDragging(handle)

    const onMove = (me: MouseEvent) => {
      const v = getValueFromPosition(me.clientX)
      setLocalValue((prev) => {
        const next: [number, number] =
          handle === 'min'
            ? [Math.min(v, prev[1] - step), prev[1]]
            : [prev[0], Math.max(v, prev[0] + step)]
        onChange?.(next)
        return next
      })
    }

    const onUp = () => {
      setDragging(null)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return
    const v = getValueFromPosition(e.clientX)
    const distMin = Math.abs(v - localValue[0])
    const distMax = Math.abs(v - localValue[1])
    const next: [number, number] =
      distMin <= distMax
        ? [clamp(Math.min(v, localValue[1] - step)), localValue[1]]
        : [localValue[0], clamp(Math.max(v, localValue[0] + step))]
    setLocalValue(next)
    onChange?.(next)
  }

  const minPct = getPercent(localValue[0])
  const maxPct = getPercent(localValue[1])

  return (
    <div className={cn('w-full select-none', disabled && 'opacity-50 pointer-events-none', className)}>
      {/* Score display */}
      <div className="flex justify-between mb-3">
        <span className="font-body text-[13px] font-semibold text-primary-600">
          {localValue[0]}
        </span>
        <span className="font-body text-[12px] text-neutral-400">AI Score Range</span>
        <span className="font-body text-[13px] font-semibold text-primary-600">
          {localValue[1]}
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-[4px] bg-neutral-200 rounded-full cursor-pointer mx-[9px]"
        role="group"
        aria-label="Score range slider"
      >
        {/* Filled range */}
        <div
          className="absolute h-full bg-primary-500 rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Min handle */}
        <Handle
          value={localValue[0]}
          percent={minPct}
          dragging={dragging === 'min'}
          onMouseDown={handleMouseDown('min')}
          aria-label={`Minimum score: ${localValue[0]}`}
          aria-valuenow={localValue[0]}
          aria-valuemin={min}
          aria-valuemax={localValue[1] - step}
        />

        {/* Max handle */}
        <Handle
          value={localValue[1]}
          percent={maxPct}
          dragging={dragging === 'max'}
          onMouseDown={handleMouseDown('max')}
          aria-label={`Maximum score: ${localValue[1]}`}
          aria-valuenow={localValue[1]}
          aria-valuemin={localValue[0] + step}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

function Handle({
  value,
  percent,
  dragging,
  onMouseDown,
  ...aria
}: {
  value: number
  percent: number
  dragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  'aria-label': string
  'aria-valuenow': number
  'aria-valuemin': number
  'aria-valuemax': number
}) {
  const [hovered, setHovered] = React.useState(false)
  const showTooltip = dragging || hovered

  return (
    <div
      className="absolute top-1/2"
      style={{ left: `${percent}%`, transform: 'translate(-50%, -50%)' }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
          'bg-neutral-900 text-white font-body text-[11px] font-semibold',
          'px-2 py-[2px] rounded-xs whitespace-nowrap',
          'pointer-events-none'
        )}>
          {value}
        </div>
      )}

      {/* Handle circle */}
      <button
        type="button"
        role="slider"
        onMouseDown={onMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'w-[18px] h-[18px] rounded-full',
          'bg-white border-2 border-primary-500',
          'shadow-md',
          'transition-all duration-[120ms] ease-out',
          'focus-visible:outline-none focus-visible:shadow-brand',
          'cursor-grab active:cursor-grabbing',
          (hovered || dragging) && 'scale-[1.2] shadow-lg'
        )}
        {...aria}
      />
    </div>
  )
}
