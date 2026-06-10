import * as React from "react"
import { Sparkles, AlertTriangle, Info, CheckCircle } from "lucide-react"

export function AIInsightsPanel() {
  const insights = [
    {
      type: "warning",
      title: "3 candidates stuck in Screening (5+ days)",
      description: "Review their profiles or move them to phone screen to maintain momentum.",
      actionLabel: "Review candidates"
    },
    {
      type: "info",
      title: "Senior Engineer: 45% drop-off at screening",
      description: "Consider adjusting the mandatory requirements to widen the funnel.",
      actionLabel: "View funnel analytics"
    },
    {
      type: "success",
      title: "2 candidates scored 85+ are unread",
      description: "New top-tier matches found for the Product Designer role.",
      actionLabel: "View top matches"
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle size={20} className="text-[#F59E0B]" />
      case "info": return <Info size={20} className="text-primary-500" />
      case "success": return <CheckCircle size={20} className="text-accent-500" />
      default: return <Info size={20} />
    }
  }

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border-l-[3px] border-accent-500 bg-accent-50 p-[20px_24px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[8px]">
          <Sparkles size={16} className="text-accent-600 animate-pulse-subtle" />
          <h4 className="font-display text-[16px] font-semibold text-neutral-900">
            AI Pipeline Insights
          </h4>
          <div className="flex h-[20px] items-center rounded-full bg-accent-100 px-[8px] font-body text-[10px] font-bold text-accent-700">
            3 new insights
          </div>
        </div>
        <button className="font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          Dismiss all
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        {insights.map((insight, idx) => (
          <div 
            key={idx}
            className="flex flex-col rounded-[var(--radius-lg)] bg-white p-[16px] shadow-sm transition-transform hover:-translate-y-[2px] hover:shadow-md cursor-pointer"
          >
            {getIcon(insight.type)}
            <span className="mt-[12px] font-display text-[14px] font-semibold text-neutral-900">
              {insight.title}
            </span>
            <span className="mt-[4px] font-body text-[13px] text-neutral-600 leading-snug">
              {insight.description}
            </span>
            <span className="mt-[12px] font-body text-[13px] font-medium text-primary-500">
              {insight.actionLabel} &rarr;
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
