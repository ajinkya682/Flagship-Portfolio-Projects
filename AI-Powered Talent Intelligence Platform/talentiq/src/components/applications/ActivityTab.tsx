"use client"

import * as React from "react"
import { Briefcase, ArrowRightLeft, Sparkles, Video, FileText, CheckCircle2 } from "lucide-react"

export function ActivityTab() {
  const activities = [
    {
      id: "act_1",
      type: "note",
      actor: "Alex Kumar",
      action: "left a note",
      timestamp: "Oct 18, 2026 at 4:30 PM",
    },
    {
      id: "act_2",
      type: "interview",
      actor: "System",
      action: "scheduled Technical Screen with Sarah Chen",
      timestamp: "Oct 12, 2026 at 9:00 AM",
    },
    {
      id: "act_3",
      type: "stage",
      actor: "Sarah Chen",
      action: "moved candidate to Phone Screen",
      timestamp: "Oct 11, 2026 at 2:15 PM",
    },
    {
      id: "act_4",
      type: "ai_score",
      actor: "TalentIQ AI",
      action: "scored candidate at 88% Match",
      timestamp: "Oct 10, 2026 at 10:02 AM",
    },
    {
      id: "act_5",
      type: "application",
      actor: "David Kim",
      action: "applied via Website",
      timestamp: "Oct 10, 2026 at 10:00 AM",
    }
  ]

  const getTypeStyles = (type: string) => {
    switch(type) {
      case "application": return { icon: <Briefcase size={14} />, bg: "bg-blue-100 text-blue-600" }
      case "stage": return { icon: <ArrowRightLeft size={14} />, bg: "bg-purple-100 text-purple-600" }
      case "ai_score": return { icon: <Sparkles size={14} />, bg: "bg-accent-100 text-accent-600" }
      case "interview": return { icon: <Video size={14} />, bg: "bg-warning-100 text-warning-600" }
      case "note": return { icon: <FileText size={14} />, bg: "bg-neutral-100 text-neutral-600" }
      case "offer": return { icon: <CheckCircle2 size={14} />, bg: "bg-primary-100 text-primary-600" }
      default: return { icon: <Briefcase size={14} />, bg: "bg-neutral-100 text-neutral-600" }
    }
  }

  return (
    <div className="flex flex-col pl-[16px] animate-fade-slide-up">
      <div className="relative border-l-2 border-neutral-200 ml-[16px] py-[8px] flex flex-col gap-[32px]">
        
        {activities.map(activity => {
          const styles = getTypeStyles(activity.type)
          
          return (
            <div key={activity.id} className="relative flex items-start gap-[24px]">
              {/* Timeline dot/icon */}
              <div className={`absolute -left-[17px] flex h-[32px] w-[32px] items-center justify-center rounded-full border-[4px] border-white ${styles.bg}`}>
                {styles.icon}
              </div>
              
              <div className="ml-[40px] flex flex-col mt-[4px]">
                <div className="flex flex-wrap items-baseline gap-[4px] font-body text-[14px]">
                  <span className="font-semibold text-neutral-900">{activity.actor}</span>
                  <span className="text-neutral-600">{activity.action}</span>
                </div>
                <span className="font-body text-[12px] text-neutral-400 mt-[4px]">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
