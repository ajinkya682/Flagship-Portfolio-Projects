"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  error?: string
  helperText?: string
  label?: string
  id?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  error,
  helperText,
  label,
  id,
  disabled,
}: DateRangePickerProps) {
  const triggerId = id || React.useId()
  const errorId = `${triggerId}-error`
  const helperId = `${triggerId}-helper`

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={triggerId}
          className="font-body text-[13px] font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-start rounded-sm border bg-white px-[14px] py-2 font-body text-[14px] shadow-sm transition-all duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200",
              error
                ? "border-[#EF4444] text-[#EF4444] focus-visible:border-[#EF4444] focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-neutral-200 text-neutral-900 hover:border-neutral-300 focus-visible:border-primary-500 focus-visible:shadow-brand",
              !date && "text-neutral-400"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[200] rounded-xl shadow-lg border-neutral-200" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {error ? (
        <span
          id={errorId}
          className="flex items-center gap-1 font-body text-[12px] text-[#EF4444]"
          aria-live="polite"
        >
          <AlertCircle size={12} />
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="font-body text-[12px] text-neutral-500">
          {helperText}
        </span>
      ) : null}
    </div>
  )
}
