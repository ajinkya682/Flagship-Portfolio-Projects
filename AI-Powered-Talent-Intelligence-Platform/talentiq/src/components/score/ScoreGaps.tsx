interface ScoreGapsProps {
  gaps: string[]
}

export default function ScoreGaps({ gaps }: ScoreGapsProps) {
  if (!gaps || gaps.length === 0) return null

  return (
    <div className="flex flex-wrap gap-[6px]">
      {gaps.map((gap, i) => (
        <span 
          key={i} 
          className="bg-amber-100 text-amber-700 rounded-full font-body text-[10px] px-[10px] py-[3px] font-medium"
        >
          {gap}
        </span>
      ))}
    </div>
  )
}
