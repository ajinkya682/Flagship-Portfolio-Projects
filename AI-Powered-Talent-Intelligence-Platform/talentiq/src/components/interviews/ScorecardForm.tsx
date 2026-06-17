'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface Criterion {
  name: string
  rating: number
  comment: string
}

export default function ScorecardForm() {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: 'Technical Skills', rating: 0, comment: '' },
    { name: 'Problem Solving', rating: 0, comment: '' },
    { name: 'Communication', rating: 0, comment: '' },
    { name: 'Culture Fit', rating: 0, comment: '' }
  ])

  const updateCriterion = (index: number, updates: Partial<Criterion>) => {
    const newCriteria = [...criteria]
    newCriteria[index] = { ...newCriteria[index], ...updates }
    setCriteria(newCriteria)
  }

  return (
    <div className="flex flex-col gap-[20px] font-body">
      {criteria.map((criterion, i) => (
        <div key={i} className="border border-neutral-200 rounded-sm p-[16px] flex flex-col gap-[12px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px]">
            <span className="text-[14px] font-semibold text-neutral-900">{criterion.name}</span>
            <div className="flex gap-[4px]">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => updateCriterion(i, { rating: star })}
                  className="p-[2px] hover:scale-110 transition-transform"
                >
                  <Star 
                    size={24} 
                    className={star <= criterion.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-300 hover:text-amber-200"} 
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea 
            placeholder="Add comments for this criterion..."
            value={criterion.comment}
            onChange={(e) => updateCriterion(i, { comment: e.target.value })}
            className="w-full min-h-[48px] rounded-md border border-neutral-200 p-[12px] text-[13px] focus:outline-none focus:border-primary-500 resize-y bg-neutral-50"
          />
        </div>
      ))}
    </div>
  )
}
