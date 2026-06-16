'use client'

import { Application } from '@/types/domain.types'
import { ScoreRing } from '@/components/score/ScoreRing'
import SubscoreBar from '@/components/score/SubscoreBar'
import ScoreExplanation from '@/components/score/ScoreExplanation'
import ScoreStrengths from '@/components/score/ScoreStrengths'
import ScoreGaps from '@/components/score/ScoreGaps'
import ScoreComparison from '@/components/score/ScoreComparison'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
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

  // Live AI score state — starts from what was saved in DB
  const [liveAiScore, setLiveAiScore] = useState<typeof aiScoreObj | null>(null)
  const [isRescoring, setIsRescoring] = useState(false)
  const [rescoreError, setRescoreError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSparkling(true)
      setTimeout(() => setSparkling(false), 600)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Type narrow for AI Score object vs number
  const aiScoreObj = typeof application.aiScore === 'object' ? application.aiScore : {
    score: typeof application.aiScore === 'number' ? application.aiScore : 0,
    skillsMatch: 0,
    experienceMatch: 0,
    educationMatch: 0,
    keywordsMatch: 0,
    strengths: [] as string[],
    gaps: [] as string[],
    reasons: [] as Array<{ text: string; positive: boolean }>,
    applicationId: application.id,
    scoredAt: application.appliedAt
  }

  // Use live rescored result if available
  const displayScore = liveAiScore ?? aiScoreObj
  const score = displayScore.score

  // ── Rescore handler ──────────────────────────────────────────────────
  const handleRescore = async () => {
    const resumeUrl = application.candidate?.resumeUrl
    if (!resumeUrl) {
      setRescoreError('No resume found for this candidate. Cannot rescore.')
      return
    }

    setIsRescoring(true)
    setRescoreError(null)

    try {
      // 1. Call the score endpoint
      const scoreRes = await fetch('/api/candidates/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeUrl,
          job: application.job,
        }),
      })

      if (!scoreRes.ok) {
        const err = await scoreRes.json()
        throw new Error(err.error || 'AI scoring failed')
      }

      const scored = await scoreRes.json()

      // 2. Persist the updated score to the application in DB
      const patchRes = await fetch(`/api/applications/${application.id}/rescore`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiScore: {
            score: scored.aiScore,
            skillsMatch: scored.skillsMatch,
            experienceMatch: scored.experienceMatch,
            educationMatch: scored.educationMatch,
            keywordsMatch: scored.keywordsMatch,
            strengths: scored.strengths,
            gaps: scored.gaps,
            reasons: scored.reasons,
          },
          extractedSkills: scored.extractedSkills,
          extractedCompanies: scored.extractedCompanies,
          extractedEducation: scored.extractedEducation,
        }),
      })

      if (!patchRes.ok) {
        console.warn('Score updated locally but failed to persist:', await patchRes.text())
      }

      // 3. Update local state to show fresh scores immediately
      setLiveAiScore({
        score: scored.aiScore ?? 0,
        skillsMatch: scored.skillsMatch ?? 0,
        experienceMatch: scored.experienceMatch ?? 0,
        educationMatch: scored.educationMatch ?? 0,
        keywordsMatch: scored.keywordsMatch ?? 0,
        strengths: scored.strengths ?? [],
        gaps: scored.gaps ?? [],
        reasons: scored.reasons ?? [],
        applicationId: application.id,
        scoredAt: new Date().toISOString(),
      })
    } catch (err: any) {
      setRescoreError(err.message || 'Failed to rescore. Please try again.')
    } finally {
      setIsRescoring(false)
    }
  }

  if (score === 0 && !liveAiScore) {
    return (
      <div className="flex flex-col items-center justify-center p-[64px] text-center">
        <Sparkles size={48} className={`text-neutral-300 mb-[16px] ${sparkling ? 'animate-twinkle text-accent-500' : ''}`} />
        <h3 className="font-body text-[16px] font-semibold text-neutral-900">Not Scored Yet</h3>
        <p className="font-body text-[14px] text-neutral-500 mt-[8px]">This application has not been processed by TalentIQ.</p>
        
        {rescoreError && (
          <p className="mt-[12px] font-body text-[13px] text-red-500 bg-red-50 px-[16px] py-[8px] rounded-lg border border-red-200">
            {rescoreError}
          </p>
        )}

        <button
          onClick={handleRescore}
          disabled={isRescoring}
          className="mt-[24px] flex items-center gap-[8px] bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white px-[16px] py-[8px] rounded-md font-medium text-[14px] transition-colors"
        >
          {isRescoring ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isRescoring ? 'Analyzing Resume...' : 'Run AI Assessment'}
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
            {liveAiScore && (
              <span className="mt-[4px] inline-flex items-center gap-[4px] font-body text-[11px] text-emerald-600 font-medium">
                <Sparkles size={11} /> Freshly analyzed
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[16px] max-w-[400px]">
          <SubscoreBar label="Skills Match" value={displayScore.skillsMatch} />
          <SubscoreBar label="Experience Match" value={displayScore.experienceMatch} />
          <SubscoreBar label="Education Match" value={displayScore.educationMatch} />
          <SubscoreBar label="Keywords Match" value={displayScore.keywordsMatch} />
        </div>

        <div className="pt-[24px] border-t border-neutral-100">
          <ScoreExplanation reasons={displayScore.reasons} />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-[360px] flex flex-col gap-[24px] shrink-0">
        
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-[20px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <h4 className="font-body text-[13px] font-semibold text-neutral-900">Strengths</h4>
            <ScoreStrengths strengths={displayScore.strengths} />
          </div>
          
          <div className="h-[1px] bg-neutral-100 w-full" />
          
          <div className="flex flex-col gap-[8px]">
            <h4 className="font-body text-[13px] font-semibold text-neutral-900">Potential Gaps</h4>
            <ScoreGaps gaps={displayScore.gaps} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-[20px]">
          <h4 className="font-body text-[13px] font-semibold text-neutral-900 mb-[16px]">Score Distribution</h4>
          <ScoreComparison candidateScore={score} allScores={[45, 55, 60, 65, 70, 72, 75, 78, 80, 82, 85, 88, 90, 95]} />
        </div>

        {/* Rescore Button */}
        {rescoreError && (
          <p className="font-body text-[12px] text-red-500 bg-red-50 px-[12px] py-[8px] rounded-lg border border-red-200">
            {rescoreError}
          </p>
        )}

        <div className="flex gap-[12px]">
          <button
            onClick={handleRescore}
            disabled={isRescoring || !application.candidate?.resumeUrl}
            title={!application.candidate?.resumeUrl ? 'No resume available to rescore' : 'Re-run AI analysis on this resume'}
            className="flex-1 flex items-center justify-center gap-[8px] bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200 disabled:opacity-50 disabled:cursor-not-allowed px-[16px] py-[10px] rounded-md font-body text-[14px] font-medium transition-colors"
          >
            {isRescoring ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isRescoring ? 'Analyzing...' : 'Rescore'}
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
