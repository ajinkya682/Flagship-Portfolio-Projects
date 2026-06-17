'use client'

import Link from 'next/link'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Sparkles, Users, Calendar, FileText, Plus, ArrowRight } from 'lucide-react'

import { useCandidatesStore } from '@/store/candidates.store'
import { useDomainStore } from '@/store/domain.store'

export default function WelcomeGreeting() {
  const { user } = useCurrentUser()
  const { candidates } = useCandidatesStore()
  const { interviews, offers } = useDomainStore()

  const awaitingReviewCount = candidates.filter(c => c.stage === 'Screening' || c.stage === 'Review').length
  const todaysInterviewsCount = interviews.filter(i => i.date === 'Today').length
  const aiInsightsCount = candidates.filter(c => c.aiScore > 85).length
  const pendingOffersCount = offers.filter(o => o.status === 'draft' || o.status === 'viewed').length

  const quickStats = [
    { label: 'Awaiting Review', value: awaitingReviewCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Users },
    { label: "Today's Interviews", value: todaysInterviewsCount, color: 'text-blue-600', bg: 'bg-blue-50', icon: Calendar },
    { label: 'AI Insights', value: aiInsightsCount, color: 'text-purple-600', bg: 'bg-purple-50', icon: Sparkles },
    { label: 'Pending Offers', value: pendingOffersCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: FileText },
  ]
  const hour = new Date().getHours()

  let greeting = 'Good evening'
  let emoji = '🌙'
  if (hour < 12) {
    greeting = 'Good morning'
    emoji = '☀️'
  } else if (hour < 18) {
    greeting = 'Good afternoon'
    emoji = '👋'
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Sarah'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <p className="font-body text-[13px] text-neutral-500 mb-[4px]">{emoji} {today}</p>
          <h1 className="font-display text-[28px] md:text-[32px] font-bold text-neutral-900 leading-tight tracking-tight">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[6px]">
            Here&apos;s what&apos;s happening with your hiring pipeline today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-[8px] shrink-0">
          <Link
            href="/jobs/new"
            className="flex items-center gap-[6px] h-[38px] px-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-[1px]"
          >
            <Plus size={15} />
            Post a Job
          </Link>
          <Link
            href="/applications"
            className="flex items-center gap-[6px] h-[38px] px-[14px] bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 font-body text-[13px] font-semibold rounded-[10px] transition-all hover:shadow-sm"
          >
            Review Queue
            <ArrowRight size={14} className="text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-[12px] border border-neutral-100 px-[16px] py-[14px] flex items-center gap-[12px] shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer group"
            >
              <div className={`w-[36px] h-[36px] rounded-[10px] ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={stat.color} />
              </div>
              <div>
                <p className={`font-display text-[22px] font-bold leading-none ${stat.color}`}>{stat.value}</p>
                <p className="font-body text-[11px] text-neutral-500 mt-[2px]">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
