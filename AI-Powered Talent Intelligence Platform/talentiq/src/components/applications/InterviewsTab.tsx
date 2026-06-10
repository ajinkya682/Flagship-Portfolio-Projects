"use client"

import * as React from "react"
import { Calendar, Video, FileText, CheckCircle2, Clock } from "lucide-react"

export function InterviewsTab() {
  const interviews = [
    {
      id: "int_1",
      date: "Oct 15, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Technical Screen",
      status: "completed",
      interviewers: [
        { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=a1" }
      ]
    },
    {
      id: "int_2",
      date: "Oct 18, 2026",
      time: "10:00 AM - 11:30 AM",
      type: "System Design",
      status: "upcoming",
      interviewers: [
        { name: "Alex Kumar", avatar: "https://i.pravatar.cc/150?u=a2" },
        { name: "Jessica Smith", avatar: "https://i.pravatar.cc/150?u=a3" }
      ]
    }
  ]

  return (
    <div className="flex flex-col gap-[16px] animate-fade-slide-up">
      {interviews.map(interview => (
        <div key={interview.id} className="flex items-center justify-between rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[20px] shadow-sm transition-all hover:shadow-md">
          
          <div className="flex items-start gap-[24px]">
            {/* Date/Time Block */}
            <div className="flex flex-col gap-[4px] min-w-[160px]">
              <span className="font-display text-[16px] font-bold text-neutral-900">{interview.date}</span>
              <div className="flex items-center text-neutral-500 font-body text-[13px]">
                <Clock size={14} className="mr-1" />
                {interview.time}
              </div>
            </div>

            {/* Type & Status */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[12px]">
                <span className="font-body text-[15px] font-semibold text-neutral-900">{interview.type}</span>
                {interview.status === "completed" ? (
                  <span className="flex items-center gap-[4px] rounded-full bg-[#ECFCCB] px-[8px] py-[2px] font-body text-[11px] font-bold text-[#4D7C0F] uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-[4px] rounded-full bg-warning-100 px-[8px] py-[2px] font-body text-[11px] font-bold text-warning-700 uppercase tracking-wider">
                    <Calendar size={12} /> Upcoming
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-[8px]">
                <span className="font-body text-[13px] text-neutral-500">Interviewers:</span>
                <div className="flex -space-x-2">
                  {interview.interviewers.map((inv, idx) => (
                    <img 
                      key={idx}
                      src={inv.avatar}
                      alt={inv.name}
                      title={inv.name}
                      className="h-[24px] w-[24px] rounded-full border-2 border-white shadow-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {interview.status === "completed" ? (
              <a href="#" className="flex items-center gap-[6px] font-body text-[13px] font-medium text-primary-600 hover:text-primary-700 hover:underline">
                <FileText size={14} /> View Scorecard
              </a>
            ) : (
              <a href="#" className="flex items-center gap-[6px] font-body text-[13px] font-medium text-accent-600 hover:text-accent-700 hover:underline">
                <Video size={14} /> Join Meeting
              </a>
            )}
          </div>

        </div>
      ))}
    </div>
  )
}
