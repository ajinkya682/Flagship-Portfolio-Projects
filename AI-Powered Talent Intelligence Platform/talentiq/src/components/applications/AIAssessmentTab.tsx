'use client'

import { Application } from '@/types/domain.types'
import { ScoreRing } from '@/components/score/ScoreRing'
import SubscoreBar from '@/components/score/SubscoreBar'
import ScoreExplanation from '@/components/score/ScoreExplanation'
import ScoreStrengths from '@/components/score/ScoreStrengths'
import ScoreGaps from '@/components/score/ScoreGaps'
import ScoreComparison from '@/components/score/ScoreComparison'
import { Sparkles, RefreshCw } from 'lucide-react'
import { getScoreLabel } from '@/lib/score'
import { useState, useEffect } from 'react'

interface AIAssessmentTabProps {
  application: Application
}

export default function AIAssessmentTab({ application }: AIAssessmentTabProps) {
  const [isOverrideOpen, setIsOverrideOpen] = useState(false)
  const [overrideScore, setOverrideScore] = useState<number | ''>('')
  const [overrideReason, setOverrideReason] = useState('')
  const [sparkling, setSparkling] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSparkling(true)
      setTimeout(() => setSparkling(false), 600)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Type narrow for AI Score object vs number (backend usually resolves this to full object in details, but we'll mock)
  const aiScoreObj = typeof application.aiScore === 'object' ? application.aiScore : {
    score: typeof application.aiScore === 'number' ? application.aiScore : 0,
    skillsMatch: 85,
    experienceMatch: 90,
    educationMatch: 75,
    keywordsMatch: 88,
    strengths: ['React', 'TypeScript', 'System Design'],
    gaps: ['No startup experience'],
    reasons: [
      { text: 'Matches senior level experience requirement', positive: true },
      { text: 'Strong frontend tech stack alignment', positive: true },
      { text: 'Lacks explicit mention of target industry', positive: false }
    ],
    applicationId: application.id,
    scoredAt: application.appliedAt
  }

  const score = aiScoreObj.score

  if (score === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-[64px] text-center">
        <Sparkles size={48} className={`text-neutral-300 mb-[16px] ${sparkling ? 'animate-twinkle text-accent-500' : ''}`} />
        <h3 className="font-body text-[16px] font-semibold text-neutral-900">Not Scored Yet</h3>
        <p className="font-body text-[14px] text-neutral-500 mt-[8px]">This application has not been processed by TalentIQ.</p>
        <button className="mt-[24px] flex items-center gap-[8px] bg-accent-500 hover:bg-accent-600 text-white px-[16px] py-[8px] rounded-md font-medium text-[14px] transition-colors">
          <Sparkles size={16} /> Run AI Assessment
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-[32px] p-[24px]">
      
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-[32px]">
        <div className="flex items-center gap-[24px]">
          <ScoreRing score={score} size="xl" />
          <div className="flex flex-col">
            <h2 className="font-display text-[24px] font-bold text-neutral-900">
              {getScoreLabel(score)} Match
            </h2>
            <p className="font-body text-[14px] text-neutral-500">Based on job requirements</p>
          </div>
        </div>

        <div className="flex flex-col gap-[16px] max-w-[400px]">
          <SubscoreBar label="Skills Match" value={aiScoreObj.skillsMatch} />
          <SubscoreBar label="Experience Match" value={aiScoreObj.experienceMatch} />
          <SubscoreBar label="Education Match" value={aiScoreObj.educationMatch} />
          <SubscoreBar label="Keywords Match" value={aiScoreObj.keywordsMatch} />
        </div>

        <div className="pt-[24px] border-t border-neutral-100">
          <ScoreExplanation reasons={aiScoreObj.reasons} />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-[360px] flex flex-col gap-[24px] shrink-0">
        
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-[20px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <h4 className="font-body text-[13px] font-semibold text-neutral-900">Strengths</h4>
            <ScoreStrengths strengths={aiScoreObj.strengths} />
          </div>
          
          <div className="h-[1px] bg-neutral-100 w-full" />
          
          <div className="flex flex-col gap-[8px]">
            <h4 className="font-body text-[13px] font-semibold text-neutral-900">Potential Gaps</h4>
            <ScoreGaps gaps={aiScoreObj.gaps} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-[20px]">
          <h4 className="font-body text-[13px] font-semibold text-neutral-900 mb-[16px]">Score Distribution</h4>
          <ScoreComparison candidateScore={score} allScores={[45, 55, 60, 65, 70, 72, 75, 78, 80, 82, 85, 88, 90, 95]} />
        </div>

        <div className="flex gap-[12px]">
          <button className="flex-1 flex items-center justify-center gap-[8px] bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200 px-[16px] py-[10px] rounded-md font-body text-[14px] font-medium transition-colors">
            <RefreshCw size={16} /> Rescore
          </button>
        </div>

        <div className="bg-neutral-50 rounded-lg border border-[#E5E7EB] p-[20px] flex flex-col gap-[12px]">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOverrideOpen(!isOverrideOpen)}>
            <h4 className="font-body text-[13px] font-semibold text-neutral-900">Manual Override</h4>
            <span className="text-[12px] text-primary-500 font-medium hover:underline">
              {isOverrideOpen ? 'Cancel' : 'Edit'}
            </span>
          </div>
          
          {isOverrideOpen && (
            <div className="flex flex-col gap-[12px] animate-in fade-in slide-in-from-top-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                placeholder="New Score (0-100)"
                value={overrideScore}
                onChange={(e) => setOverrideScore(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full h-[36px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <textarea 
                placeholder="Reason for override..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full min-h-[80px] rounded-md border border-neutral-200 p-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-y"
              />
              <button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-body text-[13px] font-medium py-[8px] rounded-md transition-colors">
                Apply Override
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
