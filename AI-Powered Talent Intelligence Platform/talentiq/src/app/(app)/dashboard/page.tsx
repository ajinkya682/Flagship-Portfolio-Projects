'use client'

import WelcomeGreeting from '@/components/dashboard/WelcomeGreeting'
import StatCard from '@/components/dashboard/StatCard'
import KanbanOverview from '@/components/dashboard/KanbanOverview'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'
import { Briefcase, Users, GitMerge, FileText, Clock, Sparkles, ArrowUpRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'

// ─── Mock Data ───────────────────────────────────────────────────
const sparkline = [18, 22, 19, 28, 34, 40, 36, 44, 51, 58]
const scoreSparkline = [74, 76, 75, 78, 80, 79, 82, 81, 83, 85]

const aiInsights = [
  {
    type: 'warning' as const,
    title: '3 Candidates Stalled in Screening',
    description: 'Jennifer Park, Kevin Liu, and Priya Sharma have been in Screening for 5+ days with no action.',
    actionLabel: 'Review now',
    actionHref: '/applications?stage=Screening',
  },
  {
    type: 'info' as const,
    title: '45% Drop-off at Screening',
    description: 'Senior Engineer role has a high drop-off vs. the 28% platform average. Consider revising your screening criteria.',
    actionLabel: 'View analysis',
    actionHref: '/analytics',
  },
  {
    type: 'success' as const,
    title: '5 New Top Matches Available',
    description: '5 candidates scored 85+ for open roles and have not been reviewed yet. Act fast — top talent moves quickly.',
    actionLabel: 'View matches',
    actionHref: '/applications?score=85',
  },
]

function ScoreChip({ score }: { score: number }) {
  const cls = score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
  return (
    <div className={`flex items-center gap-[3px] px-[7px] py-[2px] rounded-full border text-[11px] font-bold ${cls}`}>
      <Sparkles size={9} />
      {score}
    </div>
  )
}

export default function DashboardPage() {
  const { offers, interviews, messages } = useDomainStore()
  const { jobs } = useJobsStore()
  const { candidates } = useCandidatesStore()

  const pendingOffers = offers.filter(o => o.status === 'sent' || o.status === 'viewed')
  
  const STAGES = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']
  const stageColors: Record<string, { color: string, bgColor: string, textColor: string }> = {
    'Applied': { color: '#94A3B8', bgColor: '#F8FAFC', textColor: '#64748B' },
    'Screening': { color: '#3B82F6', bgColor: '#EFF6FF', textColor: '#2563EB' },
    'Interview': { color: '#8B5CF6', bgColor: '#F5F3FF', textColor: '#7C3AED' },
    'Assessment': { color: '#F59E0B', bgColor: '#FFFBEB', textColor: '#D97706' },
    'Offer': { color: '#10B981', bgColor: '#ECFDF5', textColor: '#059669' },
    'Hired': { color: '#F59E0B', bgColor: '#FFFBEB', textColor: '#D97706' },
  }

  const pipelineStages = STAGES.map(stage => {
    const stageCandidates = candidates.filter(c => c.stage === stage)
    const colors = stageColors[stage] || stageColors['Applied']
    return {
      name: stage,
      count: stageCandidates.length,
      ...colors,
      recentCandidates: stageCandidates.slice(0, 3).map(c => ({
        id: c.id,
        name: c.name,
        score: c.aiScore,
        avatar: c.avatar,
        role: c.role
      }))
    }
  })

  // Mock activity based on actual data counts
  const activityItems = [
    { id: '1', text: `AI screened ${candidates.length} new applications for open roles`, timestamp: '2 min ago', type: 'ai' as const },
    { id: '2', text: `${interviews.length} interviews scheduled across the team`, timestamp: '1h ago', type: 'manual' as const, actor: 'System' },
    { id: '3', text: `${messages.length} recent messages sent to candidates`, timestamp: '2h ago', type: 'manual' as const },
    { id: '4', text: 'AI detected 3 candidates stalled in Screening for 5+ days', timestamp: '3h ago', type: 'ai' as const },
    { id: '5', text: `${pendingOffers.length} offer letters currently pending response`, timestamp: '5h ago', type: 'manual' as const, actor: 'System' },
    { id: '6', text: `${jobs.length} jobs currently open and accepting applications`, timestamp: '1d ago', type: 'manual' as const },
  ]

  const recentApplications = [...candidates].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()).slice(0, 5)

  const avgAiScore = candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + c.aiScore, 0) / candidates.length) : 0

  return (
    <div className="flex flex-col gap-[24px] max-w-[1400px] mx-auto w-full">
      <WelcomeGreeting />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <StatCard
          icon={Briefcase}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
          gradientFrom="#3B82F6"
          gradientTo="#6366F1"
          value={jobs.length}
          label="Open Roles"
          delta="+3"
          deltaPositive
          period="vs last month"
          sparklineData={[8, 9, 9, 10, 10, 11, 11, 12, 12]}
        />
        <StatCard
          icon={Users}
          iconBg="#F0FDF4"
          iconColor="#10B981"
          gradientFrom="#10B981"
          gradientTo="#059669"
          value={candidates.length}
          label="Total Applications"
          delta="+31%"
          deltaPositive
          period="vs last week"
          sparklineData={sparkline}
        />
        <StatCard
          icon={GitMerge}
          iconBg="#F5F3FF"
          iconColor="#8B5CF6"
          gradientFrom="#8B5CF6"
          gradientTo="#6366F1"
          value={avgAiScore}
          label="Average AI Score"
          delta="+6"
          deltaPositive
          period="vs last week"
          sparklineData={scoreSparkline}
        />
        <StatCard
          icon={FileText}
          iconBg="#FFFBEB"
          iconColor="#F59E0B"
          gradientFrom="#F59E0B"
          gradientTo="#EF4444"
          value={pendingOffers.length}
          label="Offers Pending"
          delta="2 expiring in 48h"
          deltaPositive={false}
          sparklineData={[1, 1, 2, 2, 3, 3, 2, 3, 3]}
        />
      </div>

      {/* Main Panels */}
      <div className="flex flex-col lg:flex-row gap-[20px]">
        <div className="flex-grow lg:w-2/3">
          <KanbanOverview stages={pipelineStages} />
        </div>
        <div className="lg:w-1/3 min-w-[300px]">
          <ActivityFeed items={activityItems} />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsightsPanel insights={aiInsights} />

      {/* Recent Applications Table */}
      <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-neutral-50">
          <div>
            <h4 className="font-display text-[15px] font-bold text-neutral-900">Recent Applications</h4>
            <p className="font-body text-[12px] text-neutral-500 mt-[1px]">Latest candidates across all roles</p>
          </div>
          <Link
            href="/applications"
            className="flex items-center gap-[4px] text-[12px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-[10px] py-[5px] rounded-[8px] transition-colors"
          >
            View all <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="text-left px-[20px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Candidate</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Stage</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                <th className="text-center px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">AI Score</th>
                <th className="text-left px-[12px] py-[10px] font-body text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Applied</th>
                <th className="px-[12px] py-[10px]" />
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app, i) => {
                const stageColor = stageColors[app.stage] ? `bg-[${stageColors[app.stage].bgColor}] text-[${stageColors[app.stage].textColor}]` : 'bg-neutral-50 text-neutral-700'
                return (
                <tr
                  key={app.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors group"
                >
                  <td className="px-[20px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[34px] h-[34px] rounded-[8px] overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shrink-0">
                        <img src={app.avatar} alt={app.name} className="w-full h-full object-cover bg-neutral-100" />
                      </div>
                      <Link href={`/applications/${app.id}`} className="font-body text-[13px] font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">{app.name}</Link>
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <span className="font-body text-[12px] text-neutral-600 truncate max-w-[160px] block">{app.role}</span>
                  </td>
                  <td className="px-[12px] py-[12px] hidden md:table-cell">
                    <span className={`font-body text-[11px] font-semibold px-[8px] py-[3px] rounded-full ${stageColor}`}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px] hidden lg:table-cell">
                    <span className="font-body text-[12px] text-neutral-500">{app.source}</span>
                  </td>
                  <td className="px-[12px] py-[12px] text-center">
                    <div className="flex justify-center">
                      <ScoreChip score={app.aiScore} />
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] hidden md:table-cell">
                    <span className="font-body text-[12px] text-neutral-400">{new Date(app.appliedAt).toLocaleDateString('en-US')}</span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <Link
                      href={`/applications/${app.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-[3px] text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View <ExternalLink size={10} />
                    </Link>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
