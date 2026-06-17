'use client'

import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

interface ScoreComparisonProps {
  candidateScore: number
  allScores: number[]
}

export default function ScoreComparison({ candidateScore, allScores }: ScoreComparisonProps) {
  // Sort scores to create distribution
  const sortedScores = [...allScores, candidateScore].sort((a, b) => a - b)
  const candidateIndex = sortedScores.lastIndexOf(candidateScore)
  
  // Calculate percentile
  const totalCount = sortedScores.length
  const itemsBelow = candidateIndex
  const percentile = Math.round((itemsBelow / Math.max(1, totalCount - 1)) * 100)
  const topPercent = Math.max(1, 100 - percentile)

  // Bin the data for rendering
  const BIN_COUNT = 20
  const binSize = 100 / BIN_COUNT
  
  const bins = Array.from({ length: BIN_COUNT }, (_, i) => {
    const min = i * binSize
    const max = (i + 1) * binSize
    const count = sortedScores.filter(s => s >= min && (i === BIN_COUNT - 1 ? s <= max : s < max)).length
    const isCandidateBin = candidateScore >= min && (i === BIN_COUNT - 1 ? candidateScore <= max : candidateScore < max)
    
    return { name: `${min}-${max}`, count, isCandidateBin }
  })

  return (
    <div className="w-full flex flex-col items-center">
      <div className="font-body text-[13px] font-semibold text-neutral-700 mb-[4px]">
        Top {topPercent}%
      </div>
      <div className="w-full h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {bins.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isCandidateBin ? '#3B82F6' : '#BFDBFE'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
