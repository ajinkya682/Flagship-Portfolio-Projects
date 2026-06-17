'use client'

import { useState } from 'react'
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight,
  BrainCircuit, GitMerge, Users, ArrowUpRight, Target
} from 'lucide-react'
import Link from 'next/link'

// ─── Mock Data ───────────────────────────────────────────────────
const INSIGHTS = [
  {
    id: 'in_1',
    category: 'Pipeline Health',
    type: 'warning',
    title: 'High Drop-off at Technical Assessment',
    description: 'The "Senior Software Engineer" role is experiencing a 65% drop-off rate during the technical assessment stage, which is 25% higher than platform average. The AI suggests the current assessment may be too time-consuming.',
    actionText: 'Review Assessment',
    icon: GitMerge,
  },
  {
    id: 'in_2',
    category: 'Sourcing Opportunity',
    type: 'success',
    title: 'Untapped Talent Pool Discovered',
    description: 'Based on your recent hires for "Data Scientist", candidates with backgrounds in Physics and Computational Biology are performing exceptionally well. Consider expanding your sourcing criteria.',
    actionText: 'Update Sourcing Strategy',
    icon: Target,
  },
  {
    id: 'in_3',
    category: 'Market Intelligence',
    type: 'info',
    title: 'Salary Expectations Rising',
    description: 'Average requested compensation for "Product Manager" in New York has increased by 12% over the last 60 days. Your current posted range ($130k-$170k) is falling below the 50th percentile.',
    actionText: 'View Market Data',
    icon: TrendingUp,
  },
  {
    id: 'in_4',
    category: 'Candidate Alert',
    type: 'warning',
    title: '3 Top-Tier Candidates Stalled',
    description: 'Three candidates with AI Match Scores over 90 have been waiting in the "Screening" stage for more than 5 days. High risk of candidate drop-off.',
    actionText: 'Review Candidates',
    icon: Users,
  },
]

const TYPE_STYLES: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
  warning: { bg: 'bg-amber-50/50', text: 'text-amber-700', iconBg: 'bg-amber-100', border: 'border-amber-200/50' },
  success: { bg: 'bg-emerald-50/50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', border: 'border-emerald-200/50' },
  info: { bg: 'bg-blue-50/50', text: 'text-blue-700', iconBg: 'bg-blue-100', border: 'border-blue-200/50' },
}

export default function InsightsPage() {
  const [filter, setFilter] = useState('All')

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-[#FAFAFA] min-h-[calc(100vh-60px)]">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#312E81] px-[16px] md:px-[32px] py-[32px] md:py-[48px] overflow-hidden shrink-0">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[60px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 max-w-[1000px] mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-[24px]">
          <div>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                <Sparkles size={12} className="text-purple-300" /> TalentIQ Intelligence
              </span>
            </div>
            <h1 className="font-display text-[32px] md:text-[40px] font-bold text-white tracking-tight leading-tight mb-[8px]">
              AI Insights
            </h1>
            <p className="font-body text-[15px] text-white/70 max-w-[500px]">
              Predictive analytics and actionable recommendations generated from your pipeline data, market trends, and historical hiring patterns.
            </p>
          </div>

          <div className="flex items-center gap-[12px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[12px] p-[16px]">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white/10 flex items-center justify-center">
              <BrainCircuit size={20} className="text-purple-300" />
            </div>
            <div>
              <p className="font-body text-[11px] text-white/60 uppercase tracking-wider font-semibold">Model Status</p>
              <p className="font-body text-[14px] font-bold text-white flex items-center gap-[6px]">
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse" />
                Continuously Learning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-[16px] md:p-[32px] relative z-20 -mt-[20px]">
        <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-[24px]">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-[8px]">
            {['All', 'Pipeline Health', 'Market Intelligence', 'Sourcing Opportunity', 'Candidate Alert'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-[34px] px-[14px] rounded-full text-[12px] font-semibold transition-all shadow-sm ${
                  filter === f 
                    ? 'bg-white text-indigo-700 border-indigo-200 border shadow-indigo-100/50' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {INSIGHTS.filter(i => filter === 'All' || i.category === filter).map(insight => {
              const style = TYPE_STYLES[insight.type]
              const Icon = insight.icon

              return (
                <div key={insight.id} className={`bg-white rounded-[16px] border ${style.border} shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group relative`}>
                  {/* Subtle top gradient line */}
                  <div className={`h-[3px] w-full ${
                    insight.type === 'warning' ? 'bg-amber-400' : 
                    insight.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                  
                  <div className="p-[20px] flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-[16px]">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-[8px] py-[3px] rounded-full ${style.bg} ${style.text}`}>
                        {insight.category}
                      </span>
                      {insight.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                      {insight.type === 'info' && <Lightbulb size={16} className="text-blue-500" />}
                      {insight.type === 'success' && <Target size={16} className="text-emerald-500" />}
                    </div>

                    <div className="flex items-start gap-[12px] mb-[12px]">
                      <div className={`w-[36px] h-[36px] rounded-[10px] ${style.iconBg} flex items-center justify-center shrink-0 mt-[2px]`}>
                        <Icon size={18} className={style.text} />
                      </div>
                      <h3 className="font-display text-[16px] font-bold text-neutral-900 leading-tight">
                        {insight.title}
                      </h3>
                    </div>

                    <p className="font-body text-[13px] text-neutral-600 leading-relaxed mb-[24px] flex-1">
                      {insight.description}
                    </p>

                    <button className={`self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[8px] text-[12px] font-semibold transition-colors bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200`}>
                      {insight.actionText} <ArrowRight size={14} className="group-hover:translate-x-[2px] transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Weekly Summary Card */}
          <div className="mt-[16px] bg-gradient-to-r from-indigo-50 to-purple-50 rounded-[16px] border border-indigo-100 shadow-sm p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-[20px]">
            <div>
              <h3 className="font-display text-[18px] font-bold text-indigo-900 flex items-center gap-[8px]">
                <Sparkles size={18} className="text-purple-600" /> Weekly AI Summary Generated
              </h3>
              <p className="font-body text-[13px] text-indigo-700/80 mt-[6px] max-w-[600px]">
                Your automated weekly report detailing sourcing efficiency, pipeline velocity, and diversity metrics is ready to view.
              </p>
            </div>
            <button className="h-[40px] px-[16px] bg-indigo-600 hover:bg-indigo-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm transition-colors shrink-0 flex items-center gap-[6px]">
              View Full Report <ArrowUpRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
