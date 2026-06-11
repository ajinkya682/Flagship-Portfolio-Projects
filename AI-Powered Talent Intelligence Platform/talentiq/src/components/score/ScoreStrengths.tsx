interface ScoreStrengthsProps {
  strengths: string[]
}

export default function ScoreStrengths({ strengths }: ScoreStrengthsProps) {
  if (!strengths || strengths.length === 0) return null

  return (
    <div className="flex flex-wrap gap-[6px]">
      {strengths.map((str, i) => (
        <span 
          key={i} 
          className="bg-accent-100 text-accent-700 rounded-full font-body text-[10px] px-[10px] py-[3px] font-medium"
        >
          {str}
        </span>
      ))}
    </div>
  )
}
