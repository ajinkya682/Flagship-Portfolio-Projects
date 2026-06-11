import { Application, Scorecard } from '@/types/domain.types'
import { EmptyState } from '@/components/shared/EmptyState'
import { FileText, Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ScorecardsTabProps {
  application: Application
}

// Mock scorecards
const mockScorecards: Scorecard[] = [
  {
    id: 'sc_1',
    interviewId: 'int_2',
    interviewer: { id: 'u2', name: 'Sarah Recruiter', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' } as any,
    overallRating: 'yes',
    criteria: [
      { name: 'Technical Skills', rating: 4, comment: 'Strong understanding of React concepts.' },
      { name: 'Communication', rating: 5, comment: 'Very clear and articulate.' }
    ],
    notes: 'I think she would be a great fit for the team. Very collaborative mindset.',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
]

export default function ScorecardsTab({ application }: ScorecardsTabProps) {
  const scorecards = mockScorecards

  if (!scorecards || scorecards.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No scorecards submitted"
        description="Scorecards will appear here after interviews are completed."
      />
    )
  }

  // Aggregation logic
  const ratingCounts = {
    'strong-yes': 0,
    'yes': 0,
    'no': 0,
    'strong-no': 0
  }
  scorecards.forEach(sc => {
    if (sc.overallRating in ratingCounts) {
      ratingCounts[sc.overallRating as keyof typeof ratingCounts]++
    }
  })
  const total = scorecards.length

  const ratingConfig = [
    { key: 'strong-yes', label: 'Strong Yes', color: 'bg-accent-500' },
    { key: 'yes', label: 'Yes', color: 'bg-primary-500' },
    { key: 'no', label: 'No', color: 'bg-amber-500' },
    { key: 'strong-no', label: 'Strong No', color: 'bg-red-500' }
  ]

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
    <div className="p-[24px] flex flex-col gap-[32px]">
      
      {/* Aggregated Rating Bar Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-[24px] flex flex-col gap-[16px]">
        <h3 className="font-display text-[16px] font-semibold text-neutral-900">Overall Ratings</h3>
        <div className="flex flex-col gap-[12px] max-w-[500px]">
          {ratingConfig.map(config => {
            const count = ratingCounts[config.key as keyof typeof ratingCounts]
            const percent = total > 0 ? (count / total) * 100 : 0
            
            return (
              <div key={config.key} className="flex items-center gap-[16px]">
                <span className="w-[80px] font-body text-[13px] text-neutral-600 shrink-0">{config.label}</span>
                <div className="flex-1 h-[8px] bg-neutral-100 rounded-full overflow-hidden flex items-center">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${config.color}`} 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-[20px] font-body text-[13px] font-medium text-neutral-900 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual Scorecards */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="font-display text-[18px] font-semibold text-neutral-900">Submitted Scorecards</h3>
        
        {scorecards.map(scorecard => (
          <div key={scorecard.id} className="bg-white border border-[#E5E7EB] rounded-lg p-[24px] flex flex-col gap-[20px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[14px]">
                  {scorecard.interviewer.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-[15px] font-semibold text-neutral-900">{scorecard.interviewer.name}</span>
                  <span className="font-body text-[12px] text-neutral-500">Submitted {formatDate(scorecard.submittedAt)}</span>
                </div>
              </div>
              
              <span className={`px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider ${getRatingBadgeClass(scorecard.overallRating)}`}>
                {getRatingLabel(scorecard.overallRating)}
              </span>
            </div>

            <div className="flex flex-col gap-[8px]">
              <h4 className="font-body text-[13px] font-semibold text-neutral-700">Overall Notes</h4>
              <p className="font-body text-[14px] text-neutral-700 leading-relaxed bg-neutral-50 p-[16px] rounded-md border border-neutral-100">
                {scorecard.notes}
              </p>
            </div>

            <div className="flex flex-col gap-[16px]">
              <h4 className="font-body text-[13px] font-semibold text-neutral-700">Criteria Ratings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {scorecard.criteria.map((c, i) => (
                  <div key={i} className="flex flex-col gap-[8px] p-[16px] border border-neutral-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-[14px] font-medium text-neutral-900">{c.name}</span>
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
                      <p className="font-body text-[13px] text-neutral-600 mt-[4px] italic">{c.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
