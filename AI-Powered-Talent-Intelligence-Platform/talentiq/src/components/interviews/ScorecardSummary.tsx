import { Scorecard } from '@/types/domain.types'
import { Star } from 'lucide-react'

interface ScorecardSummaryProps {
  scorecard: Scorecard
}

export default function ScorecardSummary({ scorecard }: ScorecardSummaryProps) {
  const getRatingBadgeClass = (rating: string) => {
    switch (rating) {
      case 'strong-yes': return 'bg-accent-100 text-accent-700'
      case 'yes': return 'bg-primary-100 text-primary-700'
      case 'no': return 'bg-amber-100 text-amber-700'
      case 'strong-no': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getRatingLabel = (rating: string) => {
    return rating.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className="flex flex-col gap-[24px] font-body">
      
      <div className="flex items-center justify-between p-[16px] bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[13px] font-semibold text-neutral-500 uppercase tracking-wider">Overall Rating</span>
          <span className={`w-fit px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider ${getRatingBadgeClass(scorecard.overallRating)}`}>
            {getRatingLabel(scorecard.overallRating)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <h4 className="text-[14px] font-semibold text-neutral-900">Overall Notes</h4>
        <p className="text-[14px] text-neutral-700 leading-relaxed bg-white p-[16px] rounded-md border border-neutral-200">
          {scorecard.notes}
        </p>
      </div>

      <div className="flex flex-col gap-[16px]">
        <h4 className="text-[14px] font-semibold text-neutral-900">Criteria Ratings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {scorecard.criteria.map((c, i) => (
            <div key={i} className="flex flex-col gap-[8px] p-[16px] border border-neutral-200 rounded-md bg-white">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-medium text-neutral-900">{c.name}</span>
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={14} 
                      className={star <= c.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"} 
                    />
                  ))}
                </div>
              </div>
              {c.comment && (
                <p className="text-[13px] text-neutral-600 mt-[4px] italic">{c.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
