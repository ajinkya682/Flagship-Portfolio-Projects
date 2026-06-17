'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Users, CheckCircle2, AlertCircle, RefreshCw, Briefcase, ChevronRight, FileText } from 'lucide-react'

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
  pipelineHealthBreakdown: any[]
  crossMatches: CrossMatch[]
  totalCandidates: number
  totalHired: number
  totalOffersAccepted: number
  avgAiScore: number
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
              <div className="w-[32px] h-[32px] bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[8px] flex items-center justify-center shadow-md">
                <Sparkles size={16} className="text-white" />
              </div>
              <h1 className="text-[28px] font-display font-bold text-neutral-900 tracking-tight">AI Brain & Analytics</h1>
            </div>
            <p className="text-[14px] text-neutral-500">Weekly pipeline insights and cross-job candidate matching.</p>
          </div>
          
          <button 
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-[8px] h-[40px] px-[16px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-[13px] rounded-[10px] shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Generating...' : 'Refresh Insights'}
          </button>
        </div>

        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            
            {/* Left Col: High Level Stats & AI Summary */}
            <div className="lg:col-span-2 flex flex-col gap-[24px]">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <Users size={16} />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Candidates</span>
                  </div>
                  <span className="text-[28px] font-display font-bold text-neutral-900">{data.totalCandidates}</span>
                </div>
                
                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Hired</span>
                  </div>
                  <span className="text-[28px] font-display font-bold text-neutral-900">{data.totalHired}</span>
                </div>

                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <TrendingUp size={16} className="text-blue-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Pipeline Health</span>
                  </div>
                  <div className="flex items-end gap-[4px]">
                    <span className="text-[28px] font-display font-bold text-neutral-900">{Math.round(data.pipelineHealth)}</span>
                    <span className="text-[14px] text-neutral-400 font-medium mb-[4px]">/ 100</span>
                  </div>
                </div>

                <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] text-neutral-500">
                    <Sparkles size={16} className="text-purple-500" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">Avg AI Score</span>
                  </div>
                  <span className="text-[28px] font-display font-bold text-neutral-900">{data.avgAiScore}</span>
                </div>
              </div>

              {/* AI Written Summary */}
              <div className="bg-gradient-to-br from-white to-purple-50/30 p-[24px] md:p-[32px] rounded-[24px] border border-purple-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gradient-to-bl from-purple-200/40 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center gap-[12px] mb-[20px]">
                  <div className="px-[12px] py-[4px] bg-purple-100 text-purple-700 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-[6px]">
                    <Sparkles size={12} /> AI Executive Summary
                  </div>
                  <span className="text-[12px] text-neutral-400 font-medium">Generated {new Date(data.generatedAt).toLocaleDateString()}</span>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none prose-p:text-neutral-700 prose-p:leading-relaxed prose-strong:text-purple-900 prose-strong:font-bold">
                  {data.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Cross Job Matches */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-display font-bold text-neutral-900">AI Cross-Job Matches</h2>
                <span className="w-[28px] h-[28px] rounded-full bg-blue-100 text-blue-700 font-bold text-[13px] flex items-center justify-center">
                  {data.crossMatches.length}
                </span>
              </div>
              
              <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="p-[16px] bg-neutral-50/80 border-b border-neutral-100">
                  <p className="text-[13px] text-neutral-600 leading-snug">
                    These stalled or rejected candidates have a <strong className="text-neutral-900">90+ AI Match Score</strong> for other open roles.
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px]">
                  {data.crossMatches.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <AlertCircle size={24} className="text-neutral-300 mb-[8px]" />
                      <p className="text-[13px] font-medium text-neutral-500">No cross-matches found this week.</p>
                    </div>
                  ) : (
                    data.crossMatches.map((match, i) => (
                      <div key={i} className="p-[16px] bg-white border border-neutral-200 rounded-[12px] hover:border-blue-300 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-[12px]">
                          <div>
                            <h3 className="font-bold text-[15px] text-neutral-900 group-hover:text-blue-600 transition-colors">
                              {match.candidateName}
                            </h3>
                            <p className="text-[12px] text-neutral-500 flex items-center gap-[4px] mt-[2px]">
                              Originally applied to <Briefcase size={12} className="text-neutral-400" /> {match.originalJobTitle}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[16px] font-display font-bold text-emerald-600">{match.matchScore}%</span>
                            <span className="text-[10px] font-semibold text-emerald-600/70 uppercase">Match</span>
                          </div>
                        </div>
                        
                        <div className="p-[12px] bg-blue-50/50 rounded-[8px] mb-[12px]">
                          <p className="text-[12px] font-semibold text-blue-900 mb-[4px] flex items-center gap-[4px]">
                            <Sparkles size={12} /> Recommended for:
                          </p>
                          <p className="text-[14px] font-bold text-blue-700">{match.matchedJobTitle}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-[6px] mb-[12px]">
                          {match.matchedSkills.map(skill => (
                            <span key={skill} className="px-[8px] py-[2px] bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <button className="w-full flex items-center justify-center gap-[6px] py-[8px] border border-neutral-200 rounded-[8px] text-[12px] font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
                          <FileText size={14} /> Review Candidate <ChevronRight size={14} className="text-neutral-400" />
                        </button>
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
