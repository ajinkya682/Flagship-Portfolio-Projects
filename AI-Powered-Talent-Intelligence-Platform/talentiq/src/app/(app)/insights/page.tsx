'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight,
  BrainCircuit, GitMerge, Users, ArrowUpRight, Target, Briefcase, Mail
} from 'lucide-react'
import Link from 'next/link'

interface Insight {
  id: string
  category: string
  type: 'warning' | 'success' | 'info'
  title: string
  description: string
  actionText: string
}

interface CrossMatch {
  candidateId: string
  candidateName: string
  candidateAvatar?: string
  candidateEmail?: string
  jobId: string
  jobTitle: string
  matchScore: number
  matchedSkills: string[]
}

const TYPE_STYLES: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
  warning: { bg: 'bg-amber-50/50', text: 'text-amber-700', iconBg: 'bg-amber-100', border: 'border-amber-200/50' },
  success: { bg: 'bg-emerald-50/50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', border: 'border-emerald-200/50' },
  info: { bg: 'bg-blue-50/50', text: 'text-blue-700', iconBg: 'bg-blue-100', border: 'border-blue-200/50' },
}

export default function InsightsPage() {
  const [filter, setFilter] = useState('All')
  const [insights, setInsights] = useState<Insight[]>([])
  const [crossMatches, setCrossMatches] = useState<CrossMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/insights')
      .then(res => res.json())
      .then(data => {
        if (data.insights) setInsights(data.insights)
        if (data.crossJobRecommendations) setCrossMatches(data.crossJobRecommendations)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-[#FAFAFA] min-h-[calc(100vh-60px)]">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#312E81] px-[16px] md:px-[32px] py-[32px] md:py-[48px] overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[60px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 max-w-[1100px] mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-[24px]">
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
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white/10 flex items-center justify-center relative overflow-hidden">
              {loading ? (
                <div className="w-full h-full border-2 border-transparent border-t-purple-400 rounded-[10px] animate-spin" />
              ) : (
                <BrainCircuit size={20} className="text-purple-300 relative z-10" />
              )}
            </div>
            <div>
              <p className="font-body text-[11px] text-white/60 uppercase tracking-wider font-semibold">Model Status</p>
              <p className="font-body text-[14px] font-bold text-white flex items-center gap-[6px]">
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse" />
                {loading ? 'Analyzing Data...' : 'Continuously Learning'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-[16px] md:p-[32px] relative z-20 -mt-[20px]">
        <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-[24px]">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-[8px]">
            {['All', 'Pipeline Health', 'Market Intelligence', 'Sourcing Opportunity', 'Candidate Alert'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-[34px] px-[14px] rounded-full text-[12px] font-semibold transition-all shadow-sm \${
                  filter === f 
                    ? 'bg-white text-indigo-700 border-indigo-200 border shadow-indigo-100/50' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-[16px] border border-neutral-200 p-[20px] h-[200px] flex flex-col animate-pulse">
                  <div className="flex justify-between mb-[16px]">
                    <div className="w-[80px] h-[20px] bg-neutral-100 rounded-full" />
                    <div className="w-[16px] h-[16px] bg-neutral-100 rounded-full" />
                  </div>
                  <div className="flex gap-[12px] mb-[12px]">
                    <div className="w-[36px] h-[36px] bg-neutral-100 rounded-[10px]" />
                    <div className="h-[20px] w-1/2 bg-neutral-100 rounded-[4px] mt-[8px]" />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[24px]">
                    <div className="h-[12px] w-full bg-neutral-100 rounded-[4px]" />
                    <div className="h-[12px] w-5/6 bg-neutral-100 rounded-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {insights.filter(i => filter === 'All' || i.category === filter).map(insight => {
                  const style = TYPE_STYLES[insight.type]
                  let Icon = Lightbulb
                  if (insight.category === 'Pipeline Health') Icon = GitMerge
                  if (insight.category === 'Sourcing Opportunity') Icon = Target
                  if (insight.category === 'Market Intelligence') Icon = TrendingUp
                  if (insight.category === 'Candidate Alert') Icon = Users

                  return (
                    <div key={insight.id} className={`bg-white rounded-[16px] border \${style.border} shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group relative`}>
                      <div className={`h-[3px] w-full \${
                        insight.type === 'warning' ? 'bg-amber-400' : 
                        insight.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                      }`} />
                      
                      <div className="p-[20px] flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-[16px]">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-[8px] py-[3px] rounded-full \${style.bg} \${style.text}`}>
                            {insight.category}
                          </span>
                          {insight.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                          {insight.type === 'info' && <Lightbulb size={16} className="text-blue-500" />}
                          {insight.type === 'success' && <Target size={16} className="text-emerald-500" />}
                        </div>

                        <div className="flex items-start gap-[12px] mb-[12px]">
                          <div className={`w-[36px] h-[36px] rounded-[10px] \${style.iconBg} flex items-center justify-center shrink-0 mt-[2px]`}>
                            <Icon size={18} className={style.text} />
                          </div>
                          <h3 className="font-display text-[16px] font-bold text-neutral-900 leading-tight">
                            {insight.title}
                          </h3>
                        </div>

                        <p className="font-body text-[13px] text-neutral-600 leading-relaxed mb-[24px] flex-1">
                          {insight.description}
                        </p>

                        <Link href={insight.category === 'Candidate Alert' ? '/pipeline' : '/analytics'} className={`self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[8px] text-[12px] font-semibold transition-colors bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200`}>
                          {insight.actionText} <ArrowRight size={14} className="group-hover:translate-x-[2px] transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cross Job Recommendations Engine */}
              <div className="mt-[16px] flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-display font-bold text-neutral-900 flex items-center gap-[8px]">
                    <BrainCircuit size={20} className="text-indigo-600" />
                    AI Sourcing Recommendations
                  </h2>
                  <p className="text-[13px] text-neutral-500 mt-[4px]">
                    The AI constantly scans your entire candidate database to find matches for new open roles.
                  </p>
                </div>
                <span className="px-[12px] py-[4px] bg-indigo-50 text-indigo-700 text-[12px] font-bold rounded-full border border-indigo-100">
                  {crossMatches.length} Matches Found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {crossMatches.length === 0 ? (
                  <div className="col-span-full p-[40px] bg-white border border-neutral-200 rounded-[16px] flex flex-col items-center justify-center text-center">
                    <div className="w-[48px] h-[48px] bg-neutral-50 rounded-full flex items-center justify-center mb-[12px]">
                      <Users size={20} className="text-neutral-400" />
                    </div>
                    <p className="text-[14px] font-bold text-neutral-700">No active recommendations</p>
                    <p className="text-[13px] text-neutral-500 max-w-[300px] mt-[4px]">
                      Check back later. The AI continuously evaluates new candidates against your open roles.
                    </p>
                  </div>
                ) : (
                  crossMatches.map((match, i) => (
                    <div key={i} className="bg-white p-[20px] rounded-[16px] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="flex justify-between items-start mb-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[40px] h-[40px] bg-indigo-50 rounded-full flex items-center justify-center overflow-hidden border border-indigo-100">
                            {match.candidateAvatar ? (
                              <img src={match.candidateAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[14px] font-bold text-indigo-700">{match.candidateName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-[14px] text-neutral-900 truncate max-w-[120px]">{match.candidateName}</h3>
                            <p className="text-[11px] text-neutral-500 flex items-center gap-[4px] mt-[2px] truncate max-w-[120px]">
                              {match.candidateEmail ? <><Mail size={10} /> {match.candidateEmail}</> : 'Candidate Profile'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[18px] font-display font-bold text-emerald-600 leading-none">{match.matchScore}%</span>
                          <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest mt-[2px]">Match</span>
                        </div>
                      </div>

                      <div className="p-[12px] bg-indigo-50/50 border border-indigo-100/50 rounded-[10px] mb-[16px]">
                        <p className="text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider mb-[4px] flex items-center gap-[4px]">
                          <Briefcase size={10} /> Recommended For
                        </p>
                        <p className="text-[13px] font-bold text-indigo-700 leading-snug">{match.jobTitle}</p>
                      </div>

                      <div className="flex flex-wrap gap-[6px] mb-[16px] flex-1">
                        {match.matchedSkills.map(skill => (
                          <span key={skill} className="px-[8px] py-[3px] bg-neutral-100 text-neutral-600 rounded-[6px] text-[11px] font-medium border border-neutral-200">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <Link href={`/jobs/${match.jobId}`} className="mt-auto w-full flex items-center justify-center gap-[6px] h-[36px] bg-indigo-600 text-white rounded-[8px] text-[12px] font-bold hover:bg-indigo-700 transition-colors">
                        <Target size={14} /> View Open Role
                      </Link>
                    </div>
                  ))
                )}
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
                <Link href="/analytics" className="h-[40px] px-[16px] bg-indigo-600 hover:bg-indigo-700 text-white font-body text-[13px] font-semibold rounded-[10px] shadow-sm transition-colors shrink-0 flex items-center justify-center gap-[6px]">
                  View Full Report <ArrowUpRight size={14} />
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
