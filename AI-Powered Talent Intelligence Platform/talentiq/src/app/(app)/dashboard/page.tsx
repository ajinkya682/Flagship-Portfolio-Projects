import WelcomeGreeting from '@/components/dashboard/WelcomeGreeting'
import StatCard from '@/components/dashboard/StatCard'
import KanbanOverview from '@/components/dashboard/KanbanOverview'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'
import { Briefcase, Users, GitMerge, FileText } from 'lucide-react'

// --- Mock Data ---
const sparklineData = [12, 14, 18, 15, 22, 28, 35, 42, 47]

const activityItems: { id: string, text: string, timestamp: string, type: 'ai' | 'manual' }[] = [
  { id: '1', text: 'AI screened 14 applications for Senior Engineer', timestamp: '2h ago', type: 'ai' },
  { id: '2', text: 'Marcus Rodriguez moved to Interview stage', timestamp: '4h ago', type: 'manual' },
  { id: '3', text: 'New job posting: Product Manager', timestamp: '1d ago', type: 'manual' },
  { id: '4', text: 'AI identified 3 strong matches for Data Scientist', timestamp: '1d ago', type: 'ai' },
]

const aiInsights = [
  {
    type: 'warning' as const,
    title: 'Candidates stalled in Screening',
    description: '3 candidates have been in Screening for 5+ days.',
    actionLabel: 'Review candidates',
    actionHref: '/pipeline?stage=screening'
  },
  {
    type: 'info' as const,
    title: 'High drop-off rate',
    description: 'Senior Engineer role has a 45% drop-off at screening.',
    actionLabel: 'View analysis',
    actionHref: '/analytics'
  },
  {
    type: 'success' as const,
    title: 'Top matches found',
    description: '2 new candidates scored 85+ and are unread.',
    actionLabel: 'View matches',
    actionHref: '/candidates?score=85'
  }
]

const pipelineStages = [
  {
    name: 'Screening',
    count: 24,
    color: '#3B82F6',
    recentCandidates: [
      { id: 'c1', name: 'Jennifer Park', score: 92 },
      { id: 'c2', name: 'David Chen', score: 88 },
      { id: 'c3', name: 'Sarah Kim', score: 65 },
    ]
  },
  {
    name: 'Interview',
    count: 12,
    color: '#8B5CF6',
    recentCandidates: [
      { id: 'c4', name: 'Marcus Rodriguez', score: 95 },
      { id: 'c5', name: 'Alex Torres', score: 82 },
    ]
  },
  {
    name: 'Offer',
    count: 3,
    color: '#10B981',
    recentCandidates: [
      { id: 'c6', name: 'Michael Wong', score: 96 },
    ]
  }
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[24px] max-w-[1400px] mx-auto w-full">
      <WelcomeGreeting />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        <StatCard 
          icon={Briefcase}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
          value={12}
          label="Open Roles"
          delta="+3"
          deltaPositive={true}
          period="vs last month"
        />
        <StatCard 
          icon={Users}
          iconBg="#F0FDF4"
          iconColor="#10B981"
          value={47}
          label="Applications This Week"
          delta="+23%"
          deltaPositive={true}
          period="vs last week"
          sparklineData={sparklineData}
        />
        <StatCard 
          icon={GitMerge}
          iconBg="#F5F3FF"
          iconColor="#8B5CF6"
          value={79}
          label="Average AI Score"
          delta="+4"
          deltaPositive={true}
          period="vs last week"
        />
        <StatCard 
          icon={FileText}
          iconBg="#FFFBEB"
          iconColor="#F59E0B"
          value={3}
          label="Offers Pending"
          delta="2 expiring in 48h"
          deltaPositive={false}
        />
      </div>

      {/* Main Panels Row */}
      <div className="flex flex-col lg:flex-row gap-[24px]">
        <div className="flex-grow lg:w-2/3">
          <KanbanOverview stages={pipelineStages} />
        </div>
        <div className="lg:w-1/3 min-w-[320px]">
          <ActivityFeed items={activityItems} />
        </div>
      </div>

      {/* AI Insights Full Width */}
      <div className="w-full">
        <AIInsightsPanel insights={aiInsights} />
      </div>

      {/* Placeholder for table */}
      <div className="bg-white rounded-lg shadow-sm p-[20px] flex flex-col mt-[8px]">
        <h4 className="font-body text-[15px] font-semibold text-neutral-900 mb-[16px]">
          Recent Applications
        </h4>
        <div className="border border-neutral-100 rounded-md p-[32px] flex items-center justify-center text-neutral-400 font-body text-[13px] bg-neutral-50/50">
          Applications table will render here in a full implementation.
        </div>
      </div>

    </div>
  )
}
