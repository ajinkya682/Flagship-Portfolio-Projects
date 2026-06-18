'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Users, CheckCircle2, AlertCircle, RefreshCw, Briefcase, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CrossMatch {
  candidateId: string
  candidateName: string
  originalJobId: string
  originalJobTitle: string
  matchedJobId: string
  matchedJobTitle: string
  matchScore: number
  matchedSkills: string[]
}

interface AnalyticsData {
  weekOf: string
  generatedAt: string
  content: string
  pipelineHealth: number
  pipelineHealthBreakdown: {
    stage: string;
    avgDaysInStage: number;
    conversionRate: number;
  }[]
  crossMatches: CrossMatch[]
  totalCandidates: number
  totalHired: number
  totalOffersAccepted: number
  avgAiScore: number
}

// Gauge Component for AI Score
const AiScoreGauge = ({ score }: { score: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = 'text-red-500';
  let bgClass = 'text-red-100';
  if (score >= 70) {
    colorClass = 'text-emerald-500';
    bgClass = 'text-emerald-100';
  } else if (score >= 50) {
    colorClass = 'text-amber-500';
    bgClass = 'text-amber-100';
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-[80px] h-[80px] transform -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className={bgClass} />
        <circle
          cx="40" cy="40" r={radius}
          stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-bold text-[22px] text-neutral-900 leading-none">{score}</span>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async (force = false) => {
    try {
      if (force) setRefreshing(true)
      const res = await fetch(`/api/analytics/summary${force ? '?force=true' : ''}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
          <p className="text-neutral-500 font-body text-[14px]">Loading AI insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-[24px] md:p-[32px] font-body bg-neutral-50/30">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px] mb-[32px]">
          <div>
            <div className="flex items-center gap-[8px] mb-[4px]">
              <div className="w-[32px] h-[32px] bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[8px] flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                <Sparkles size={16} className="text-white relative z-10" />
              </div>
              <h1 className="text-[28px] font-display font-bold text-neutral-900 tracking-tight">AI Brain & Analytics</h1>
            </div>
            <p className="text-[14px] text-neutral-500">Weekly pipeline insights and cross-job candidate matching.</p>
          </div>
          
          <div className="flex items-center gap-[12px]">
            {data && (
              <span className="text-[12px] text-neutral-400 font-medium">
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </span>
            )}
            <button 
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="flex items-center gap-[8px] h-[40px] px-[16px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-[13px] rounded-[10px] shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Generating...' : 'Refresh Insights'}
            </button>
          </div>
        </div>

        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            
            {/* Left Col: High Level Stats & AI Summary */}
            <div className="lg:col-span-2 flex flex-col gap-[24px]">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col justify-between gap-[16px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <Users size={16} />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Candidates</span>
                  </div>
                  <span className="text-[32px] font-display font-bold text-neutral-900 leading-none">{data.totalCandidates}</span>
                </div>
                
                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col justify-between gap-[16px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Hired</span>
                  </div>
                  <span className="text-[32px] font-display font-bold text-neutral-900 leading-none">{data.totalHired}</span>
                </div>

                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col justify-between gap-[16px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <TrendingUp size={16} className="text-blue-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Health</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-[6px] overflow-hidden mb-[2px]">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `\${Math.max(5, data.pipelineHealth)}%` }} 
                    />
                  </div>
                  <div className="flex items-end gap-[4px]">
                    <span className="text-[24px] font-display font-bold text-neutral-900 leading-none">{Math.round(data.pipelineHealth)}</span>
                    <span className="text-[12px] text-neutral-400 font-medium mb-[2px]">/100</span>
                  </div>
                </div>

                <div className="bg-white p-[16px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-[8px]">Avg AI Score</span>
                  <AiScoreGauge score={data.avgAiScore} />
                </div>
              </div>

              {/* Pipeline Stage Funnel */}
              <div className="bg-white p-[24px] rounded-[16px] border border-neutral-100 shadow-sm">
                <h3 className="font-display text-[15px] font-bold text-neutral-900 mb-[20px]">Pipeline Funnel</h3>
                <div className="flex flex-col gap-[12px]">
                  {data.pipelineHealthBreakdown.length > 0 ? data.pipelineHealthBreakdown.map((stage, idx) => {
                    // For UI purposes, we'll just mock the visual funnel width since the backend breakdown might not be perfectly sorted
                    // In a real app we'd compute max value and size accordingly. We'll use conversionRate as width proxy here for visual
                    const width = Math.max(10, 100 - (idx * 15));
                    return (
                      <div key={stage.stage} className="flex items-center gap-[16px]">
                        <div className="w-[100px] text-[13px] font-medium text-neutral-600 truncate">{stage.stage}</div>
                        <div className="flex-1 h-[24px] bg-neutral-50 rounded-r-md relative group cursor-default">
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-blue-100 border border-blue-200 rounded-r-md transition-all group-hover:bg-blue-200"
                            style={{ width: `\${width}%` }}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-[12px]">
                            <span className="text-[11px] font-semibold text-neutral-400">{stage.conversionRate}% Conv.</span>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                    <p className="text-[13px] text-neutral-500 italic">No pipeline data available this week.</p>
                  )}
                </div>
              </div>

              {/* AI Written Summary */}
              <div className="bg-gradient-to-br from-white to-purple-50/50 p-[24px] md:p-[32px] rounded-[24px] border border-purple-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-200/40 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center gap-[12px] mb-[24px]">
                  <div className="px-[14px] py-[6px] bg-purple-100 text-purple-700 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-[6px] shadow-sm">
                    <Sparkles size={14} /> AI Executive Summary
                  </div>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none text-neutral-700
                  prose-p:leading-relaxed 
                  prose-strong:text-purple-900 prose-strong:font-bold
                  prose-ul:my-4 prose-li:my-1
                  prose-headings:text-purple-900 prose-headings:font-display prose-headings:font-bold
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Right Col: Cross Job Matches */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-display font-bold text-neutral-900">AI Cross-Job Matches</h2>
                <span className="px-[10px] py-[2px] rounded-full bg-blue-100 text-blue-700 font-bold text-[12px]">
                  {data.crossMatches.length} Matches
                </span>
              </div>
              
              <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
                <div className="p-[16px] bg-neutral-50/80 border-b border-neutral-100">
                  <p className="text-[13px] text-neutral-600 leading-snug">
                    These candidates have a <strong className="text-neutral-900">75%+ AI Match Score</strong> for other open roles.
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[16px]">
                  {data.crossMatches.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <AlertCircle size={32} className="text-neutral-300 mb-[12px]" />
                      <p className="text-[14px] font-medium text-neutral-500 mb-[4px]">No high-confidence matches</p>
                      <p className="text-[12px] text-neutral-400">The AI didn't find any candidates matching other open roles this week.</p>
                    </div>
                  ) : (
                    data.crossMatches.map((match, i) => (
                      <div key={i} className="p-[16px] bg-white border border-neutral-200 rounded-[14px] shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-[16px]">
                          <div className="flex gap-[12px]">
                            <div className="w-[36px] h-[36px] bg-neutral-100 rounded-full flex items-center justify-center text-[14px] font-bold text-neutral-600 uppercase border border-neutral-200 shrink-0">
                              {match.candidateName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-[15px] text-neutral-900 group-hover:text-blue-600 transition-colors">
                                {match.candidateName}
                              </h3>
                              <p className="text-[11px] text-neutral-500 flex items-center gap-[4px] mt-[2px] leading-tight">
                                Orig: <Briefcase size={10} className="text-neutral-400" /> {match.originalJobTitle}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[18px] font-display font-bold text-emerald-600 leading-none">{match.matchScore}%</span>
                            <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest mt-[2px]">Match</span>
                          </div>
                        </div>
                        
                        <div className="p-[12px] bg-blue-50/50 border border-blue-100/50 rounded-[10px] mb-[16px]">
                          <p className="text-[11px] font-bold text-blue-900/60 uppercase tracking-wider mb-[4px] flex items-center gap-[4px]">
                            <Sparkles size={10} /> Suggested Role
                          </p>
                          <p className="text-[14px] font-bold text-blue-700 leading-snug">{match.matchedJobTitle}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-[6px] mb-[16px]">
                          {match.matchedSkills.map(skill => (
                            <span key={skill} className="px-[8px] py-[3px] bg-neutral-100 text-neutral-600 rounded-[6px] text-[11px] font-medium border border-neutral-200">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <Link href={`/jobs/\${match.matchedJobId}`} className="mt-auto w-full flex items-center justify-center gap-[6px] py-[10px] bg-white border border-neutral-200 rounded-[8px] text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 transition-colors">
                          <FileText size={14} /> View Open Role <ChevronRight size={14} className="text-neutral-400 opacity-50" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-[64px]">
            <p className="text-neutral-500">Failed to load analytics data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
