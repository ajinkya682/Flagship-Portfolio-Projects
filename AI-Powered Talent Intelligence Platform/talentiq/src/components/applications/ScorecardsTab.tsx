"use client"

import * as React from "react"
import { Star, MessageSquare } from "lucide-react"

export function ScorecardsTab() {
  const ratings = [
    { label: "Strong Yes", count: 2, color: "bg-accent-500", percent: 66 },
    { label: "Yes", count: 1, color: "bg-primary-500", percent: 33 },
    { label: "Mixed", count: 0, color: "bg-neutral-300", percent: 0 },
    { label: "No", count: 0, color: "bg-warning-500", percent: 0 },
    { label: "Strong No", count: 0, color: "bg-[#EF4444]", percent: 0 },
  ]

  const scorecards = [
    {
      id: "sc_1",
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=a1",
      date: "Oct 15, 2026",
      rating: "Strong Yes",
      notes: "David was exceptional in the technical screen. His deep understanding of React's rendering lifecycle and Next.js App Router is exactly what we need. Code was clean and he communicated his thought process perfectly.",
      criteria: [
        { name: "Technical Depth", score: 5 },
        { name: "Communication", score: 5 },
        { name: "Problem Solving", score: 4 }
      ]
    },
    {
      id: "sc_2",
      author: "Alex Kumar",
      avatar: "https://i.pravatar.cc/150?u=a2",
      date: "Oct 18, 2026",
      rating: "Yes",
      notes: "Solid system design chops. He mapped out the architecture clearly, though he struggled slightly when we discussed scaling the websocket service. Overall, a very strong candidate.",
      criteria: [
        { name: "System Architecture", score: 4 },
        { name: "Scalability", score: 3 },
        { name: "Communication", score: 4 }
      ]
    }
  ]

  const getRatingColor = (rating: string) => {
    switch(rating) {
      case "Strong Yes": return "bg-accent-100 text-accent-700"
      case "Yes": return "bg-primary-100 text-primary-700"
      case "No": return "bg-warning-100 text-warning-700"
      case "Strong No": return "bg-[#FEF2F2] text-[#EF4444]"
      default: return "bg-neutral-100 text-neutral-700"
    }
  }

  return (
    <div className="flex flex-col animate-fade-slide-up">
      
      {/* Aggregated Ratings */}
      <div className="mb-[32px] flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm">
        <h5 className="font-display text-[16px] font-semibold text-neutral-900 mb-[16px]">
          Aggregated Ratings
        </h5>
        <div className="flex flex-col gap-[12px]">
          {ratings.map((rating, idx) => (
            <div key={idx} className="flex items-center gap-[16px]">
              <span className="w-[80px] font-body text-[13px] font-medium text-neutral-600">
                {rating.label}
              </span>
              <div className="flex-1 h-[12px] bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${rating.color} transition-all duration-500`}
                  style={{ width: `${rating.percent}%` }}
                />
              </div>
              <span className="w-[20px] font-body text-[13px] font-bold text-neutral-900 text-right">
                {rating.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scorecards List */}
      <div className="flex flex-col gap-[16px]">
        {scorecards.map(sc => (
          <div key={sc.id} className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm">
            
            <div className="flex items-start justify-between mb-[16px]">
              <div className="flex items-center gap-[12px]">
                <img src={sc.avatar} alt={sc.author} className="h-[40px] w-[40px] rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-body text-[15px] font-semibold text-neutral-900">{sc.author}</span>
                  <span className="font-body text-[12px] text-neutral-500">{sc.date}</span>
                </div>
              </div>
              <div className={`flex h-[28px] items-center rounded-full px-[12px] font-body text-[13px] font-bold ${getRatingColor(sc.rating)}`}>
                {sc.rating}
              </div>
            </div>

            <p className="font-body text-[14px] leading-relaxed text-neutral-700 mb-[20px]">
              {sc.notes}
            </p>

            <div className="flex flex-col gap-[12px] border-t border-neutral-100 pt-[16px]">
              {sc.criteria.map((crit, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-neutral-600">{crit.name}</span>
                  <div className="flex items-center gap-[2px]">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={star <= crit.score ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-neutral-100 text-neutral-200"} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
