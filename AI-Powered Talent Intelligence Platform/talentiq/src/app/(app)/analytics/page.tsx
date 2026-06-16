'use client'

import { useState } from 'react'
import {
  BarChart2, TrendingUp, Users, Clock, CheckCircle2,
  Calendar, ChevronDown, Download
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { useCandidatesStore } from '@/store/candidates.store'

const teamData = [
  { name: 'Alex Manager', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', interviews: 15, avgRating: 4.8, avgTime: '2.1d' },
  { name: 'Sarah Recruiter', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', interviews: 24, avgRating: 4.5, avgTime: '1.2d' },
  { name: 'Jordan Lee', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', interviews: 12, avgRating: 4.2, avgTime: '3.4d' },
]

export default function AnalyticsPage() {
  const { offers, interviews } = useDomainStore()
  const { candidates } = useCandidatesStore()
  const [period, setPeriod] = useState('30d')

  const totalApplications = candidates.length
  const totalOffers = offers.length
  const acceptedOffers = offers.filter(o => o.status === 'accepted').length
  const offerAcceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0
  const avgAiScore = candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.aiScore, 0) / candidates.length) : 0
  const interviewsConducted = interviews.filter(i => i.status === 'completed').length

  const metrics = [
    { label: 'Total Applications', value: totalApplications.toString(), trend: '+12%', positive: true },
    { label: 'Time to Hire', value: '18 days', trend: '-2 days', positive: true },
    { label: 'Offer Acceptance Rate', value: `${offerAcceptanceRate}%`, trend: '+5%', positive: true },
    { label: 'Screening Pass Rate', value: '32%', trend: '-4%', positive: false },
    { label: 'Avg AI Score', value: avgAiScore.toString(), trend: '+2', positive: true },
    { label: 'Interviews Conducted', value: interviewsConducted.toString(), trend: '+14%', positive: true },
  ]

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
  const stageCounts = stages.map((stage, i) => {
    let count = 0
    for (let j = i; j < stages.length; j++) {
      count += candidates.filter(c => c.stage === stages[j] || (stages[j] === 'Interview' && c.stage === 'Assessment')).length
    }
    return count
  })

  const pipelineData = stages.map((stage, i) => {
    const count = stageCounts[i]
    const prevCount = i > 0 ? stageCounts[i - 1] : Math.max(1, count)
    const dropoff = i > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0
    return {
      stage,
      count: count,
      dropoff: `${dropoff}%`
    }
  })

  // Calculate sources
  const sourceMap: Record<string, number> = {}
  candidates.forEach(c => {
    sourceMap[c.source] = (sourceMap[c.source] || 0) + 1
  })
  
  const colors = ['#0077B5', '#10B981', '#6366F1', '#F59E0B', '#94A3B8']
  const sourceData = Object.entries(sourceMap).map(([source, count], i) => ({
    source,
    value: Math.round((count / Math.max(1, candidates.length)) * 100),
    color: colors[i % colors.length]
  })).sort((a, b) => b.value - a.value)

  // Generate conic gradient for the donut chart
  let currentPct = 0
  const conicGradientStops = sourceData.map(s => {
    const start = currentPct
    currentPct += s.value
    return `${s.color} ${start}% ${currentPct}%`
  }).join(', ')

  return (
    <div className="flex flex-col max-w-[1280px] mx-auto w-full gap-[24px]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Analytics</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Gain insights into your hiring funnel and team performance.</p>
        </div>
        <div className="flex items-center gap-[12px] shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-[38px] bg-white border border-neutral-200 text-neutral-700 text-[13px] font-semibold rounded-[10px] px-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
          <button className="h-[38px] px-[14px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] transition-colors shadow-sm flex items-center gap-[6px]">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="w-full mt-[40px] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[40px] flex flex-col items-center justify-center text-center max-w-[500px]">
            <div className="w-[48px] h-[48px] bg-primary-50 rounded-full flex items-center justify-center mb-[16px]">
              <BarChart2 size={24} className="text-primary-600" />
            </div>
            <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[8px]">Not enough data for Analytics</h3>
            <p className="font-body text-[13px] text-neutral-500 mb-[20px]">
              We need candidate and job data to generate meaningful AI insights. As your team adds candidates and conducts interviews, this dashboard will populate with funnel conversions and performance metrics.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {metrics.map(m => (
              <div key={m.label} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px] hover:shadow-md transition-shadow">
                <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[8px]">{m.label}</p>
                <div className="flex items-end justify-between">
                  <p className="font-display text-[28px] font-bold text-neutral-900 leading-none tracking-tight">{m.value}</p>
                  <div className={`flex items-center gap-[2px] px-[6px] py-[2px] rounded-full text-[11px] font-semibold ${m.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {m.positive ? <TrendingUp size={11} /> : <TrendingUp size={11} className="rotate-180" />}
                    {m.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">

            {/* Funnel */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <h2 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px]">Conversion Funnel</h2>
              <div className="flex flex-col gap-[16px]">
                {pipelineData.map((stage, i) => {
                  const max = pipelineData[0].count || 1
                  const pct = (stage.count / max) * 100
                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex justify-between mb-[6px]">
                        <span className="font-body text-[13px] font-semibold text-neutral-700">{stage.stage}</span>
                        <div className="text-right">
                          <span className="font-body text-[13px] font-bold text-neutral-900">{stage.count}</span>
                          {i > 0 && <span className="text-[11px] text-neutral-400 ml-[8px]">({stage.dropoff} drop)</span>}
                        </div>
                      </div>
                      <div className="h-[24px] bg-neutral-100 rounded-[6px] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[6px]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sources */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <h2 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px]">Top Sources</h2>
              <div className="flex items-center justify-center py-[20px]">
                {/* Mock Donut Chart using conic-gradient */}
                <div className="relative w-[160px] h-[160px] rounded-full"
                  style={{
                    background: `conic-gradient(${conicGradientStops || '#E2E8F0 0% 100%'})`
                  }}
                >
                  <div className="absolute inset-[24px] bg-white rounded-full flex flex-col items-center justify-center">
                    <p className="font-display text-[24px] font-bold text-neutral-900">{totalApplications}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Total</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-[12px] mt-[10px]">
                {sourceData.map(s => (
                  <div key={s.source} className="flex items-center gap-[6px]">
                    <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-body text-[12px] text-neutral-600">{s.source}</span>
                    <span className="font-body text-[12px] font-bold text-neutral-900">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden mb-[40px]">
            <div className="px-[24px] py-[20px] border-b border-neutral-50">
              <h2 className="font-display text-[16px] font-bold text-neutral-900">Team Performance</h2>
              <p className="font-body text-[12px] text-neutral-500 mt-[2px]">Activity and efficiency by team member</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100">
                    <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Team Member</th>
                    <th className="text-center px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Interviews</th>
                    <th className="text-center px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Avg Rating</th>
                    <th className="text-center px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Time to Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map((t, i) => (
                    <tr key={i} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors">
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <img src={t.avatar} alt={t.name} className="w-[36px] h-[36px] rounded-[10px] object-cover bg-neutral-100" />
                          <span className="font-body text-[13px] font-bold text-neutral-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px] text-center">
                        <span className="font-display text-[16px] font-bold text-neutral-900">{t.interviews}</span>
                      </td>
                      <td className="px-[24px] py-[16px] text-center">
                        <div className="inline-flex items-center gap-[4px] px-[8px] py-[3px] bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold border border-emerald-100">
                          ★ {t.avgRating}
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px] text-center">
                        <span className={`font-body text-[13px] font-bold ${parseFloat(t.avgTime) < 2 ? 'text-emerald-600' : parseFloat(t.avgTime) < 3 ? 'text-amber-600' : 'text-red-500'}`}>
                          {t.avgTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
