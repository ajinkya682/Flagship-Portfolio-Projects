'use client'

import { Sparkles } from 'lucide-react'
import InsightCard, { InsightCardProps } from './InsightCard'

interface AIInsightsPanelProps {
  insights: InsightCardProps[]
}

export default function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  if (!insights || insights.length === 0) return null

  return (
    <div className="bg-[#ECFDF5] border-l-[3px] border-accent-500 rounded-lg p-[20px] md:p-[24px] flex flex-col gap-[16px]">
      
      <div className="flex items-center gap-[8px]">
        <Sparkles 
          size={16} 
          className="text-accent-600 animate-pulse"
          style={{ animationDelay: '1500ms', animationFillMode: 'forwards' }}
        />
        <h4 className="font-body text-[15px] font-semibold text-neutral-900">
          AI Pipeline Insights
        </h4>
        <div className="bg-accent-100 text-accent-700 text-[10px] font-bold px-[8px] py-[2px] rounded-full">
          {insights.length}
        </div>
        
        <button className="ml-auto font-body text-[13px] text-neutral-500 hover:text-neutral-700 font-medium transition-colors">
          Dismiss all
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-[16px]">
        {insights.map((insight, index) => (
          <div key={index} className="flex-1">
            <InsightCard {...insight} />
          </div>
        ))}
      </div>
      
    </div>
  )
}
