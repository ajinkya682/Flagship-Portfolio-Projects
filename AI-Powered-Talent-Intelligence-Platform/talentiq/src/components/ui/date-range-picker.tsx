"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DateRangePicker() {
  return (
    <Button 
      variant="secondary" 
      className="h-[36px] bg-white px-3 font-body text-[13px] text-neutral-600 font-medium border-neutral-200"
    >
      <CalendarIcon size={14} className="mr-2 text-neutral-400" />
      Last 30 Days
      <ChevronDown size={14} className="ml-2 text-neutral-400" />
    </Button>
  )
}
