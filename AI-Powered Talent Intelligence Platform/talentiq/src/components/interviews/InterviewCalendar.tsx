"use client"

import * as React from "react"
import { Calendar, dateFnsLocalizer, EventProps } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { enUS } from "date-fns/locale/en-US"
import { Plus, ChevronLeft, ChevronRight, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScheduleModal } from "./ScheduleModal"
import { cn } from "@/lib/utils"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface InterviewEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: "scheduled" | "completed" | "cancelled"
  candidate: string
  role: string
  interviewers: string[]
}

const events: InterviewEvent[] = [
  {
    id: "e1",
    title: "David Kim - Technical",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    status: "scheduled",
    candidate: "David Kim",
    role: "Senior React Engineer",
    interviewers: ["Sarah Chen", "Alex Kumar"]
  },
  {
    id: "e2",
    title: "Jessica Chen - Design",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    status: "completed",
    candidate: "Jessica Chen",
    role: "Product Designer",
    interviewers: ["Sarah Chen"]
  },
  {
    id: "e3",
    title: "Mike Johnson - Intro",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: "cancelled",
    candidate: "Mike Johnson",
    role: "Backend Engineer",
    interviewers: ["Alex Kumar"]
  }
]

export function InterviewCalendar() {
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false)
  const [view, setView] = React.useState<"month" | "week" | "day">("week")
  const [date, setDate] = React.useState(new Date())

  // Custom Toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.date.setDate(toolbar.date.getDate() - (view === 'month' ? 30 : view === 'week' ? 7 : 1))
      toolbar.onNavigate('prev')
    }
    const goToNext = () => {
      toolbar.date.setDate(toolbar.date.getDate() + (view === 'month' ? 30 : view === 'week' ? 7 : 1))
      toolbar.onNavigate('next')
    }
    const goToToday = () => {
      toolbar.onNavigate('today')
    }

    return (
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <h4 className="font-display text-[20px] font-bold text-neutral-900 w-[180px]">
            {toolbar.label}
          </h4>
          <div className="flex items-center gap-[8px]">
            <Button variant="secondary" className="h-[32px] px-3" onClick={goToToday}>Today</Button>
            <div className="flex items-center border border-neutral-200 rounded-[var(--radius-md)] overflow-hidden">
              <button onClick={goToBack} className="h-[32px] px-2 hover:bg-neutral-50 border-r border-neutral-200"><ChevronLeft size={16} /></button>
              <button onClick={goToNext} className="h-[32px] px-2 hover:bg-neutral-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-[16px]">
          {/* View Toggles */}
          <div className="flex p-1 bg-neutral-100 rounded-[var(--radius-md)]">
            {["month", "week", "day"].map(v => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={cn(
                  "px-[12px] py-[4px] rounded-[var(--radius-sm)] font-body text-[13px] font-medium capitalize transition-all",
                  view === v ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          
          <Button 
            className="bg-primary-600 text-white hover:bg-primary-700 h-[36px]"
            iconLeft={<Plus size={16} />}
            onClick={() => setIsScheduleOpen(true)}
          >
            Schedule Interview
          </Button>
        </div>
      </div>
    )
  }

  // Custom Event Component
  const EventComponent = ({ event }: EventProps<InterviewEvent>) => {
    let bgClass = "bg-accent-500 text-white border-accent-600"
    if (event.status === "completed") bgClass = "bg-neutral-200 text-neutral-600 border-neutral-300"
    if (event.status === "cancelled") bgClass = "bg-neutral-100 text-neutral-400 border-neutral-200 line-through"

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={`flex items-center h-full w-full px-2 py-0.5 rounded-[2px] border-l-2 font-body text-[11px] font-semibold leading-tight cursor-pointer overflow-hidden ${bgClass}`}>
            {event.title}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-[20px] rounded-[var(--radius-lg)] border border-neutral-200 bg-white shadow-lg z-50">
          <div className="flex flex-col">
            <h4 className="font-display text-[16px] font-bold text-neutral-900">{event.candidate}</h4>
            <span className="font-body text-[13px] text-neutral-500 mb-[16px]">{event.role}</span>
            
            <div className="flex items-center gap-[8px] mb-[12px]">
              <span className="font-body text-[12px] font-medium text-neutral-700 w-[80px]">Time:</span>
              <span className="font-body text-[13px] text-neutral-900">{format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}</span>
            </div>

            <div className="flex items-center gap-[8px] mb-[16px]">
              <span className="font-body text-[12px] font-medium text-neutral-700 w-[80px]">Team:</span>
              <div className="flex -space-x-2">
                {event.interviewers.map((inv, idx) => (
                  <img key={idx} src={`https://i.pravatar.cc/150?u=${inv}`} className="h-[24px] w-[24px] rounded-full border-2 border-white" title={inv} />
                ))}
              </div>
            </div>

            <div className="flex gap-[8px]">
              <Button variant="secondary" className="flex-1 h-[32px] text-[12px]">View Details</Button>
              {event.status === "scheduled" && (
                <Button variant="primary" className="flex-1 h-[32px] text-[12px]" iconLeft={<Video size={14} />}>Join</Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex flex-col h-[800px] w-full rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm">
      {/* react-big-calendar applies styles globally, we use a wrapper class to constrain it */}
      <div className="rbc-custom-wrapper h-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={(newView) => setView(newView as any)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent
          }}
          formats={{
            timeGutterFormat: 'h a',
            eventTimeRangeFormat: () => '' // Hide time in event pill since it wraps weirdly
          }}
        />
      </div>

      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  )
}
