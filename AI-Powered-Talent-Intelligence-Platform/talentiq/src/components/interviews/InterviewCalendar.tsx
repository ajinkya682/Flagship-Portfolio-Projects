'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import InterviewEvent from './InterviewEvent'
import { Interview } from '@/types/domain.types'

const localizer = momentLocalizer(moment)

interface InterviewCalendarProps {
  events: Interview[]
  onSelectSlot: (slotInfo: any) => void
  onSelectEvent: (event: Interview) => void
}

export default function InterviewCalendar({ events, onSelectSlot, onSelectEvent }: InterviewCalendarProps) {
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())

  // Map our Interview domain type to the react-big-calendar Event format
  const calendarEvents = events.map(int => {
    const start = new Date(int.scheduledAt)
    const end = new Date(start.getTime() + (int.duration || 60) * 60000)
    
    return {
      id: int.id,
      title: `${int.candidate?.name || 'Candidate'} - ${int.job?.title || 'Role'}`,
      start,
      end,
      resource: int
    }
  })

  // Custom event wrapper to use our styled InterviewEvent component
  const components = {
    event: (props: any) => {
      const interview = props.event.resource as Interview
      return (
        <InterviewEvent 
          title={props.title} 
          status={interview.status as any} 
        />
      )
    },
    toolbar: (props: any) => {
      return (
        <div className="flex items-center justify-between mb-[16px] font-body">
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={() => props.onNavigate('TODAY')}
              className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-[12px] py-[6px] rounded-md text-[13px] font-medium transition-colors"
            >
              Today
            </button>
            <div className="flex rounded-md overflow-hidden border border-neutral-200">
              <button 
                onClick={() => props.onNavigate('PREV')}
                className="bg-white hover:bg-neutral-50 text-neutral-700 px-[12px] py-[6px] text-[13px] font-medium transition-colors border-r border-neutral-200"
              >
                Back
              </button>
              <button 
                onClick={() => props.onNavigate('NEXT')}
                className="bg-white hover:bg-neutral-50 text-neutral-700 px-[12px] py-[6px] text-[13px] font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <span className="text-[16px] font-bold text-neutral-900">{props.label}</span>

          <div className="flex rounded-md overflow-hidden border border-neutral-200">
            {(['month', 'week', 'day'] as View[]).map(v => (
              <button 
                key={v}
                onClick={() => props.onView(v)}
                className={`px-[16px] py-[6px] text-[13px] font-medium capitalize transition-colors ${
                  props.view === v 
                    ? 'bg-neutral-100 text-neutral-900 shadow-inner' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-600 border-l border-neutral-200 first:border-l-0'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-[800px] bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[24px]">
      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif; }
        .rbc-header { padding: 8px 0; font-weight: 600; font-size: 13px; color: #4B5563; text-transform: uppercase; border-bottom: 1px solid #E5E7EB !important; }
        .rbc-time-header.rbc-overflowing { border-right: none; }
        .rbc-time-view { border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; }
        .rbc-timeslot-group { border-bottom: 1px solid #F3F4F6; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #F3F4F6; }
        .rbc-time-content { border-top: 1px solid #E5E7EB; }
        .rbc-time-content > * + * > * { border-left: 1px solid #F3F4F6; }
        .rbc-event { background: transparent !important; padding: 0 !important; border: none !important; }
        .rbc-today { background-color: #F8FAFC; }
      `}</style>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={(e) => onSelectEvent(e.resource)}
        components={components}
        step={30}
        timeslots={2}
        min={new Date(0, 0, 0, 8, 0, 0)} // 8am
        max={new Date(0, 0, 0, 20, 0, 0)} // 8pm
      />
    </div>
  )
}
