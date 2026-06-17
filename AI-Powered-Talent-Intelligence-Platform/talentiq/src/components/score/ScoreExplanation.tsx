import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface ScoreExplanationProps {
  reasons: {
    text: string
    positive: boolean
  }[]
}

export default function ScoreExplanation({ reasons }: ScoreExplanationProps) {
  if (!reasons || reasons.length === 0) return null

  return (
    <div className="flex flex-col">
      <h4 className="font-body text-[13px] font-semibold text-neutral-700 mb-[8px]">
        Why this score?
      </h4>
      <div className="flex flex-col gap-[8px]">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-[8px]">
            {reason.positive ? (
              <ThumbsUp size={14} className="text-[#10B981] mt-[2px] shrink-0" />
            ) : (
              <ThumbsDown size={14} className="text-[#EF4444] mt-[2px] shrink-0" />
            )}
            <span className="font-body text-[13px] text-neutral-700 leading-snug">
              {reason.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
