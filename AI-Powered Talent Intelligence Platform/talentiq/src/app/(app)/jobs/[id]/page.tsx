'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Briefcase, Clock, Sparkles, Settings, BarChart2,
  GitMerge, Users, TrendingUp, CheckCircle, ExternalLink, Zap,
} from 'lucide-react'
import JobStatusBadge from '@/components/jobs/JobStatusBadge'
import { useDomainStore } from '@/store/domain.store'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Briefcase },
  { id: 'pipeline', label: 'Pipeline', icon: GitMerge },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-[3px] px-[7px] py-[2px] rounded-full border text-[11px] font-bold"
      style={{ borderColor: color + '40', backgroundColor: color + '15', color }}>
      <Sparkles size={9} />{score}
    </div>
  )
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id as string
  const [activeTab, setActiveTab] = useState('overview')

  const { jobs, candidates, updateJob } = useDomainStore()
  
  const job = jobs.find(j => j.id === jobId)
  const jobCandidates = candidates.filter(c => c.jobId === jobId)

  const [editedStatus, setEditedStatus] = useState(job?.status || 'published')

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <Link href="/jobs" className="text-blue-600 underline">Back to Jobs</Link>
      </div>
    )
  }

  const daysOpen = Math.floor((Date.now() - new Date(job.postedAt || new Date()).getTime()) / (1000 * 3600 * 24))

  const STAGES = [
    { name: 'Applied', color: '#94A3B8' },
    { name: 'Screening', color: '#3B82F6' },
    { name: 'Interview', color: '#8B5CF6' },
    { name: 'Assessment', color: '#F59E0B' },
    { name: 'Offer', color: '#10B981' }
  ]
  const pipeline = STAGES.map(stage => ({
    name: stage.name,
    count: jobCandidates.filter(c => c.stage === stage.name).length,
    color: stage.color
  }))
  const totalPipeline = jobCandidates.length

  const applicantCount = jobCandidates.length
  const scoredCandidates = jobCandidates.filter(c => c.aiScore > 0)
  const avgScore = scoredCandidates.length > 0 ? Math.round(scoredCandidates.reduce((acc, c) => acc + c.aiScore, 0) / scoredCandidates.length) : '-'
  
  const topCandidates = [...jobCandidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, 5)

  const requirements = job.requirements || [
    '3+ years of relevant experience',
    'Excellent communication skills',
    'Ability to work independently'
  ]
  const skills = job.skills || ['Communication', 'Teamwork', 'Problem Solving']
  const hiringTeam = job.hiringTeam || [
    { name: 'Alex Manager', role: 'Hiring Manager', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Sarah Recruiter', role: 'Recruiter', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' }
  ]

  const handleSaveSettings = () => {
    updateJob(job.id, { status: editedStatus as any })
    // Optional: show a toast here
  }

  return (
    <div className="flex flex-col max-w-[1280px] mx-auto w-full gap-[20px]">
      {/* Back */}
      <Link href="/jobs" className="flex items-center gap-[6px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit group">
        <ArrowLeft size={14} className="group-hover:-translate-x-[2px] transition-transform" />
        Back to Jobs
      </Link>

      {/* Hero Header */}
      <div className="bg-white rounded-[18px] border border-neutral-100 shadow-sm overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-[4px] bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-[24px]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
            <div className="flex-1">
              <div className="flex items-center gap-[10px] mb-[8px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Briefcase size={18} className="text-white" />
                </div>
                <JobStatusBadge status={job.status} />
              </div>
              <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">{job.title}</h1>

              <div className="flex flex-wrap gap-[12px] mt-[10px]">
                {[
                  { icon: Briefcase, text: job.department },
                  { icon: MapPin, text: job.location },
                  { icon: Clock, text: job.type },
                  { icon: Zap, text: `$${(job.salaryMin / 1000).toFixed(0)}K – $${(job.salaryMax / 1000).toFixed(0)}K` },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className="flex items-center gap-[5px] text-[13px] text-neutral-500">
                      <Icon size={13} className="text-neutral-400" />{item.text}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-[8px] shrink-0">
              <Link
                href={`/pipeline`}
                className="flex items-center gap-[6px] h-[38px] px-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-md shadow-blue-500/20 transition-all"
              >
                <GitMerge size={14} /> Full Pipeline
              </Link>
              <button onClick={() => setActiveTab('settings')} className="h-[38px] px-[14px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] transition-all">
                Edit Job
              </button>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-[12px] mt-[20px] pt-[20px] border-t border-neutral-50">
            {[
              { label: 'Applicants', value: applicantCount, icon: Users, color: 'text-blue-600' },
              { label: 'Days Open', value: daysOpen, icon: Clock, color: 'text-neutral-600' },
              { label: 'Avg AI Score', value: avgScore, icon: Sparkles, color: 'text-purple-600' },
              { label: 'In Interviews', value: jobCandidates.filter(c => c.stage === 'Interview').length, icon: GitMerge, color: 'text-indigo-600' },
              { label: 'Offers Sent', value: jobCandidates.filter(c => c.stage === 'Offer').length, icon: CheckCircle, color: 'text-emerald-600' },
            ].map(m => {
              const Icon = m.icon
              return (
                <div key={m.label} className="text-center">
                  <div className={`flex items-center justify-center gap-[4px] font-display text-[22px] font-bold ${m.color}`}>
                    <Icon size={15} />{m.value}
                  </div>
                  <p className="font-body text-[11px] text-neutral-400 mt-[2px]">{m.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 bg-white rounded-t-[14px] px-[20px] shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-[6px] font-body text-[13px] font-semibold px-[16px] py-[14px] border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200'
              }`}
            >
              <Icon size={14} />{tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
          <div className="lg:col-span-2 flex flex-col gap-[20px]">
            {/* Description */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <h2 className="font-display text-[16px] font-bold text-neutral-900 mb-[12px]">Job Description</h2>
              <p className="font-body text-[14px] text-neutral-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <h2 className="font-display text-[16px] font-bold text-neutral-900 mb-[12px]">Requirements</h2>
              <ul className="flex flex-col gap-[10px]">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-[10px]">
                    <div className="w-[18px] h-[18px] rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-[1px]">
                      <CheckCircle size={10} className="text-blue-600" />
                    </div>
                    <span className="font-body text-[13px] text-neutral-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <h2 className="font-display text-[16px] font-bold text-neutral-900 mb-[12px]">Required Skills</h2>
              <div className="flex flex-wrap gap-[8px]">
                {skills.map(skill => (
                  <span key={skill} className="px-[10px] py-[4px] bg-blue-50 border border-blue-200/60 text-blue-700 rounded-full text-[12px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Candidates */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
              <div className="flex items-center justify-between mb-[16px]">
                <h2 className="font-display text-[16px] font-bold text-neutral-900">Top AI Matches</h2>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-[8px] py-[3px] rounded-full flex items-center gap-[4px]">
                  <Sparkles size={10} /> AI Ranked
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                {topCandidates.length === 0 ? (
                  <p className="text-[13px] text-neutral-400">No applicants yet.</p>
                ) : topCandidates.map((c, i) => (
                  <Link key={c.id} href={`/applications/${c.id}`} className="flex items-center gap-[12px] p-[12px] rounded-[10px] border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all group">
                    <span className="font-display text-[14px] font-bold text-neutral-300 w-[16px] shrink-0">#{i + 1}</span>
                    <img src={c.avatar} alt={c.name} className="w-[32px] h-[32px] rounded-[8px] object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">{c.name}</p>
                      <p className="font-body text-[11px] text-neutral-400">{c.stage} · via {c.source}</p>
                    </div>
                    <ScoreRing score={c.aiScore} />
                    <ExternalLink size={12} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-[16px]">
            {/* Pipeline summary */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[14px]">Pipeline Summary</h3>
              <div className="flex flex-col gap-[10px]">
                {pipeline.map(stage => {
                  const pct = totalPipeline > 0 ? (stage.count / totalPipeline) * 100 : 0
                  return (
                    <div key={stage.name}>
                      <div className="flex justify-between mb-[4px]">
                        <span className="font-body text-[12px] text-neutral-600">{stage.name}</span>
                        <span className="font-body text-[12px] font-bold" style={{ color: stage.color }}>{stage.count}</span>
                      </div>
                      <div className="h-[5px] bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hiring Team */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[14px]">Hiring Team</h3>
              <div className="flex flex-col gap-[10px]">
                {hiringTeam.map(member => (
                  <div key={member.name} className="flex items-center gap-[10px]">
                    <img src={member.avatar} alt={member.name} className="w-[32px] h-[32px] rounded-full object-cover" />
                    <div>
                      <p className="font-body text-[12px] font-semibold text-neutral-900">{member.name}</p>
                      <p className="font-body text-[10px] text-neutral-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring Weights */}
            <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-display text-[14px] font-bold text-neutral-900 mb-[14px] flex items-center gap-[6px]">
                <Sparkles size={14} className="text-purple-500" /> AI Scoring Weights
              </h3>
              {[{ label: 'Skills Match', pct: 50, color: '#3B82F6' }, { label: 'Experience', pct: 30, color: '#8B5CF6' }, { label: 'Education', pct: 20, color: '#10B981' }].map(w => (
                <div key={w.label} className="mb-[10px]">
                  <div className="flex justify-between mb-[4px]">
                    <span className="font-body text-[12px] text-neutral-600">{w.label}</span>
                    <span className="font-body text-[12px] font-bold text-neutral-700">{w.pct}%</span>
                  </div>
                  <div className="h-[6px] bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${w.pct}%`, backgroundColor: w.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
          {/* Mini visual pipeline */}
          <div className="flex items-center gap-[0px] mb-[24px] overflow-x-auto">
            {pipeline.map((stage, i) => (
              <div key={stage.name} className="flex items-center">
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className="w-[48px] h-[48px] rounded-full border-[3px] flex items-center justify-center font-display text-[16px] font-bold" style={{ borderColor: stage.color, color: stage.color }}>
                    {stage.count}
                  </div>
                  <p className="font-body text-[11px] text-neutral-500 mt-[6px] font-semibold">{stage.name}</p>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="flex-1 h-[2px] min-w-[30px] bg-gradient-to-r from-neutral-200 to-neutral-100 mx-[4px] mb-[20px]" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href={`/pipeline`} className="flex items-center gap-[6px] h-[40px] px-[20px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-md">
              <GitMerge size={15} /> Open Full Kanban Board
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
          <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[16px]">Role Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px] mb-[24px]">
            {[
              { label: 'Applications / Week', value: '8.2', trend: '+12%' },
              { label: 'Time in Stage (avg)', value: '3.4d', trend: '-8%' },
              { label: 'Screening Pass Rate', value: '54%', trend: '+5%' },
              { label: 'Offer Acceptance', value: '100%', trend: '=' },
            ].map(m => (
              <div key={m.label} className="bg-neutral-50 rounded-[10px] p-[14px]">
                <p className="font-display text-[22px] font-bold text-neutral-900">{m.value}</p>
                <p className="font-body text-[11px] text-neutral-400 mt-[2px]">{m.label}</p>
                <p className="font-body text-[11px] text-emerald-600 font-semibold mt-[4px] flex items-center gap-[3px]">
                  <TrendingUp size={10} />{m.trend}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-[10px] p-[16px] flex items-center gap-[10px]">
            <BarChart2 size={20} className="text-blue-500" />
            <p className="font-body text-[13px] text-blue-700">Full analytics with funnel charts, source breakdown, and time-to-hire trends are available on the <Link href="/analytics" className="font-semibold underline">Analytics page</Link>.</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
          <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px]">Job Settings</h3>
          <div className="flex flex-col gap-[20px] max-w-[520px]">
            <div className="flex flex-col gap-[6px]">
              <label className="font-body text-[13px] font-semibold text-neutral-700">Status</label>
              <select 
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="h-[42px] rounded-[10px] border border-neutral-200 px-[12px] font-body text-[14px] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="published">Active — accepting applications</option>
                <option value="paused">Paused — temporarily not accepting</option>
                <option value="closed">Closed — no longer hiring</option>
                <option value="draft">Draft — not published</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-[20px] border-t border-neutral-100">
              <button onClick={handleSaveSettings} className="h-[40px] px-[20px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
