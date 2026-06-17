'use client'

import { Sparkles, User, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItemData {
  id: string
  text: string
  timestamp: string
  type: 'ai' | 'manual'
  actor?: string
  avatar?: string
}

interface ActivityFeedProps {
  items: ActivityItemData[]
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-[20px] pt-[18px] pb-[14px] border-b border-neutral-50 shrink-0">
        <div>
          <h4 className="font-display text-[15px] font-bold text-neutral-900">Recent Activity</h4>
          <p className="font-body text-[12px] text-neutral-500 mt-[2px]">Live pipeline updates</p>
        </div>
        <span className="flex items-center gap-[4px] text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-[8px] py-[3px] rounded-full border border-emerald-200/60">
          <span className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-[16px] py-[12px]">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-neutral-100" />

          <div className="flex flex-col gap-[0px]">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-start gap-[12px] py-[10px] group">
                {/* Icon dot */}
                <div className={cn(
                  'relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm',
                  item.type === 'ai'
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                )}>
                  {item.type === 'ai' ? (
                    <Sparkles size={12} className="text-white" />
                  ) : (
                    <User size={12} className="text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-[4px]">
                  <p className="font-body text-[12px] text-neutral-700 leading-snug">{item.text}</p>
                  <div className="flex items-center gap-[6px] mt-[4px]">
                    {item.type === 'ai' && (
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-[5px] py-[1px] rounded-full">AI</span>
                    )}
                    <span className="text-[11px] text-neutral-400">{item.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-[20px] py-[12px] border-t border-neutral-50">
        <button className="w-full flex items-center justify-center gap-[6px] text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors py-[4px] rounded-[8px] hover:bg-primary-50">
          View all activity <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
