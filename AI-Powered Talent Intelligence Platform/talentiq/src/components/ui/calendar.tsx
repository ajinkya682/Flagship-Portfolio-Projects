"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "font-body text-[14px] font-medium text-neutral-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "flex h-7 w-7 bg-transparent p-0 text-neutral-400 hover:text-neutral-900 items-center justify-center rounded-sm transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-neutral-500 rounded-md w-[32px] font-body text-[12px] font-normal",
        row: "flex w-full mt-2",
        cell: "h-[32px] w-[32px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent-50/50 [&:has([aria-selected])]:bg-accent-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-[32px] w-[32px] p-0 font-body text-[14px] font-normal text-neutral-900 transition-colors hover:bg-neutral-100 hover:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent-500 text-white hover:bg-accent-500 hover:text-white focus:bg-accent-500 focus:text-white",
        day_today: "font-bold text-primary-500",
        day_outside:
          "day-outside text-neutral-400 opacity-50 aria-selected:bg-accent-50/50 aria-selected:text-neutral-500 aria-selected:opacity-30",
        day_disabled: "text-neutral-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent-50 aria-selected:text-neutral-900 aria-selected:hover:bg-accent-50 rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
