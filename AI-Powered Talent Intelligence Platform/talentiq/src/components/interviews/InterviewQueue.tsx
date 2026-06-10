"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScorecardModal } from "./ScorecardModal"

export function InterviewQueue() {
  const [isScorecardOpen, setIsScorecardOpen] = React.useState(false)

  const queue = [
    { id: 1, name: "David Kim", role: "Senior Engineer", time: "10:00 AM", date: "Today", completed: true, avatars: ["https://i.pravatar.cc/150?u=a1", "https://i.pravatar.cc/150?u=a2"] },
    { id: 2, name: "Sarah Smith", role: "Product Designer", time: "2:00 PM", date: "Today", completed: false, avatars: ["https://i.pravatar.cc/150?u=a3"] },
    { id: 3, name: "Jessica Chen", role: "Marketing Manager", time: "11:30 AM", date: "Tomorrow", completed: false, avatars: ["https://i.pravatar.cc/150?u=a4", "https://i.pravatar.cc/150?u=a1"] },
    { id: 4, name: "Alex Kumar", role: "DevOps Engineer", time: "3:00 PM", date: "Tomorrow", completed: false, avatars: ["https://i.pravatar.cc/150?u=a2"] },
  ]

  return (
    <div className="flex flex-col h-full rounded-[var(--radius-lg)] border border-neutral-200 bg-white shadow-sm p-[24px]">
      
      <div className="flex items-center gap-[12px] mb-[20px]">
        <h4 className="font-display text-[16px] font-semibold text-neutral-900">Upcoming</h4>
        <div className="flex h-[24px] items-center justify-center rounded-full bg-neutral-100 px-[10px] font-body text-[12px] font-bold text-neutral-700">
          4
        </div>
      </div>

      <div className="flex flex-col gap-[12px] overflow-y-auto custom-scrollbar flex-1 pr-2">
        {queue.map(item => (
          <div key={item.id} className="flex flex-col p-[12px] rounded-[var(--radius-md)] border border-neutral-100 bg-neutral-50 hover:bg-neutral-100 transition-colors">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <img src={`https://i.pravatar.cc/150?u=c${item.id}`} className="h-[32px] w-[32px] rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-body text-[14px] font-semibold text-neutral-900">{item.name}</span>
                  <span className="font-body text-[12px] text-neutral-500">{item.role}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-body text-[12px] font-medium text-neutral-900">{item.time}</span>
                <span className="font-body text-[12px] text-neutral-500">{item.date}</span>
              </div>
            </div>

            <div className="mt-[12px] flex items-center justify-between">
              <div className="flex -space-x-2">
                {item.avatars.map((av, idx) => (
                  <img key={idx} src={av} className="h-[20px] w-[20px] rounded-full border-2 border-white" />
                ))}
              </div>
              
              {item.completed ? (
                <Button 
                  variant="ghost" 
                  className="h-[24px] px-2 text-[11px] font-bold text-accent-600 hover:bg-accent-50 hover:text-accent-700 uppercase tracking-wider"
                  onClick={() => setIsScorecardOpen(true)}
                >
                  Submit Scorecard
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="h-[24px] px-2 text-[11px] font-bold text-neutral-400 hover:text-neutral-600 uppercase tracking-wider disabled"
                >
                  Pending
                </Button>
              )}
            </div>

          </div>
        ))}
      </div>

      <ScorecardModal isOpen={isScorecardOpen} onClose={() => setIsScorecardOpen(false)} />

    </div>
  )
}
