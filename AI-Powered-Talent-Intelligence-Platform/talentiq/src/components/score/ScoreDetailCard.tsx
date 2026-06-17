import { AIScore } from '@/types/domain.types'
import { ScoreRing } from './ScoreRing'
import SubscoreBar from './SubscoreBar'
import ScoreExplanation from './ScoreExplanation'
import ScoreStrengths from './ScoreStrengths'
import ScoreGaps from './ScoreGaps'
import { getScoreColor, getScoreLabel } from '@/lib/score'

interface ScoreDetailCardProps {
  aiScore: AIScore
}

export default function ScoreDetailCard({ aiScore }: ScoreDetailCardProps) {
  if (!aiScore) return null

  const color = getScoreColor(aiScore.score)
  const label = getScoreLabel(aiScore.score)

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-[20px] font-body flex flex-col gap-[24px]">
      
      <div className="flex flex-col items-center justify-center">
        <ScoreRing score={aiScore.score} size="md" />
        <span 
          className="text-[13px] font-semibold mt-[8px]"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-[12px]">
        <SubscoreBar label="Skills Match" value={aiScore.skillsMatch} />
        <SubscoreBar label="Experience Match" value={aiScore.experienceMatch} />
        <SubscoreBar label="Education Match" value={aiScore.educationMatch} />
        <SubscoreBar label="Keywords Match" value={aiScore.keywordsMatch} />
      </div>

      {aiScore.reasons && aiScore.reasons.length > 0 && (
        <ScoreExplanation reasons={aiScore.reasons} />
      )}

      {(aiScore.strengths?.length > 0 || aiScore.gaps?.length > 0) && (
        <div className="h-[1px] w-full bg-neutral-100" />
      )}

      {aiScore.strengths && aiScore.strengths.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <h4 className="font-body text-[13px] font-semibold text-neutral-700">Strengths</h4>
          <ScoreStrengths strengths={aiScore.strengths} />
        </div>
      )}

      {aiScore.gaps && aiScore.gaps.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <h4 className="font-body text-[13px] font-semibold text-neutral-700">Gaps</h4>
          <ScoreGaps gaps={aiScore.gaps} />
        </div>
      )}
      
    </div>
  )
}
