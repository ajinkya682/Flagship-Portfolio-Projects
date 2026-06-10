"use client"

import * as React from "react"
import { InterviewCalendar } from "@/components/interviews/InterviewCalendar"
import { InterviewQueue } from "@/components/interviews/InterviewQueue"

// We need a tiny global override for the react-big-calendar to match our design system
// without writing a massive raw CSS file if we can avoid it.
const rbcStyles = `
  .rbc-custom-wrapper .rbc-toolbar { display: none; } /* We built a custom toolbar */
  .rbc-custom-wrapper .rbc-header { padding: 12px 0; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #525252; border-bottom: 1px solid #E5E5E5; }
  .rbc-custom-wrapper .rbc-month-view { border-radius: var(--radius-md); border: 1px solid #E5E5E5; overflow: hidden; border-top: none; }
  .rbc-custom-wrapper .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #E5E5E5; }
  .rbc-custom-wrapper .rbc-month-row + .rbc-month-row { border-top: 1px solid #E5E5E5; }
  .rbc-custom-wrapper .rbc-date-cell { padding: 4px 8px; font-family: var(--font-body); font-size: 12px; font-weight: 500; color: #737373; }
  .rbc-custom-wrapper .rbc-off-range-bg { background-color: #FAFAFA; }
  .rbc-custom-wrapper .rbc-today { background-color: #EFF6FF; }
  .rbc-custom-wrapper .rbc-event { padding: 0; background: transparent; }
  .rbc-custom-wrapper .rbc-time-view { border: 1px solid #E5E5E5; border-radius: var(--radius-md); overflow: hidden; border-top: none; }
  .rbc-custom-wrapper .rbc-time-header.rbc-overflowing { border-right: none; }
  .rbc-custom-wrapper .rbc-time-content { border-top: 1px solid #E5E5E5; }
  .rbc-custom-wrapper .rbc-timeslot-group { border-bottom: 1px solid #E5E5E5; }
  .rbc-custom-wrapper .rbc-day-slot .rbc-time-slot { border-top: 1px solid #F5F5F5; }
  .rbc-custom-wrapper .rbc-time-gutter .rbc-timeslot-group { font-family: var(--font-body); font-size: 11px; color: #A3A3A3; padding: 0 8px; text-align: right; }
`

export default function InterviewsPage() {
  return (
    <div className="flex flex-col p-[32px] w-full max-w-[1600px] mx-auto animate-fade-in">
      <style dangerouslySetInnerHTML={{ __html: rbcStyles }} />
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900">Interviews</h1>
      </div>

      <div className="grid grid-cols-12 gap-[24px]">
        
        {/* CALENDAR (8 Cols) */}
        <div className="col-span-8 h-full">
          <InterviewCalendar />
        </div>

        {/* QUEUE (4 Cols) */}
        <div className="col-span-4 h-full">
          <InterviewQueue />
        </div>

      </div>
    </div>
  )
}
