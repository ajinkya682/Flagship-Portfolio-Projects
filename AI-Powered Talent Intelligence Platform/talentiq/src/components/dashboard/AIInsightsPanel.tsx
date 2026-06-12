'use client'

import { useState } from 'react'
import { Sparkles, X, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface InsightCardProps {
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

interface AIInsightsPanelProps {
  insights: InsightCardProps[]
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    border: 'border-amber-200/60',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    border: 'border-blue-200/60',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
    border: 'border-emerald-200/60',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
}

export default function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const [dismissed, setDismissed] = useState<string[]>([])

  const visible = insights.filter((_, i) => !dismissed.includes(String(i)))
  if (visible.length === 0) return null

  return (
    <div className="relative bg-gradient-to-br from-[#EEF2FF] via-[#F0FDF4] to-[#EFF6FF] rounded-[16px] border border-white shadow-sm overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-20px] right-[-20px] w-[180px] h-[180px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-30px] left-[30%] w-[150px] h-[150px] rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-[10px] px-[20px] pt-[16px] pb-[14px] border-b border-white/60">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <h4 className="font-display text-[14px] font-bold text-neutral-900">AI Pipeline Insights</h4>
          <p className="font-body text-[11px] text-neutral-500">Powered by TalentIQ Intelligence</p>
        </div>
        <div className="ml-auto flex items-center gap-[8px]">
          <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-[8px] py-[2px] rounded-full border border-purple-200">
            {visible.length} new
          </span>
          <button
            onClick={() => setDismissed(insights.map((_, i) => String(i)))}
            className="text-[12px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Dismiss all
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="relative flex flex-col md:flex-row gap-[12px] p-[16px]">
        {insights.map((insight, index) => {
          if (dismissed.includes(String(index))) return null
          const cfg = typeConfig[insight.type]
          const Icon = cfg.icon
          return (
            <div
              key={index}
              className={cn(
                'flex-1 bg-white rounded-[12px] border shadow-sm p-[16px] flex flex-col gap-[10px] hover:shadow-md transition-all',
                cfg.border
              )}
            >
              <div className="flex items-start gap-[10px]">
                <div className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0', cfg.iconBg)}>
                  <Icon size={15} className={cfg.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[13px] font-semibold text-neutral-900 leading-snug">{insight.title}</p>
                  <p className="font-body text-[12px] text-neutral-500 mt-[3px] leading-relaxed">{insight.description}</p>
                </div>
                <button
                  onClick={() => setDismissed(prev => [...prev, String(index)])}
                  className="shrink-0 text-neutral-300 hover:text-neutral-500 transition-colors p-[2px] rounded"
                >
                  <X size={13} />
                </button>
              </div>
              {insight.actionLabel && insight.actionHref && (
                <Link
                  href={insight.actionHref}
                  className={cn(
                    'self-start flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[5px] rounded-[6px] border transition-all hover:shadow-sm',
                    cfg.badge
                  )}
                >
                  {insight.actionLabel} <ArrowRight size={10} />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
