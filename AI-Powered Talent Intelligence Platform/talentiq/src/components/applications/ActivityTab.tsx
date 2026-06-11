import { Application } from '@/types/domain.types'
import { Sparkles, Calendar, ArrowRightLeft, FileText, Gift, UserPlus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ActivityTabProps {
  application: Application
}

// Mock activity feed
const mockActivities = [
  { id: '1', type: 'offer', text: 'Offer sent to candidate', actor: 'Sarah Recruiter', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', type: 'stage_moved', text: 'Moved to Offer stage', actor: 'Sarah Recruiter', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', type: 'interview', text: 'Interview completed: Technical Screen', actor: 'Alex Manager', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '4', type: 'note', text: 'Added a note', actor: 'Sarah Recruiter', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '5', type: 'ai_scored', text: 'AI generated match score: 92/100', actor: 'TalentIQ System', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '6', type: 'submitted', text: 'Application submitted', actor: 'Candidate', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
]

export default function ActivityTab({ application }: ActivityTabProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Gift size={16} className="text-emerald-600" />
      case 'stage_moved': return <ArrowRightLeft size={16} className="text-primary-600" />
      case 'interview': return <Calendar size={16} className="text-purple-600" />
      case 'note': return <FileText size={16} className="text-amber-600" />
      case 'ai_scored': return <Sparkles size={16} className="text-accent-600" />
      case 'submitted': return <UserPlus size={16} className="text-blue-600" />
      default: return <div className="w-[8px] h-[8px] rounded-full bg-neutral-400" />
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case 'offer': return 'bg-emerald-100'
      case 'stage_moved': return 'bg-primary-100'
      case 'interview': return 'bg-purple-100'
      case 'note': return 'bg-amber-100'
      case 'ai_scored': return 'bg-accent-100'
      case 'submitted': return 'bg-blue-100'
      default: return 'bg-neutral-100'
    }
  }

  return (
    <div className="p-[32px] max-w-[800px]">
      <div className="relative border-l border-neutral-200 ml-[16px] flex flex-col gap-[32px]">
        {mockActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-[20px] relative">
            <div className={`absolute -left-[16px] w-[32px] h-[32px] rounded-full border-4 border-white flex items-center justify-center ${getIconBg(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            
            <div className="flex flex-col ml-[28px] bg-white border border-[#E5E7EB] rounded-lg p-[16px] shadow-sm w-full">
              <div className="flex justify-between items-start gap-[16px]">
                <p className="font-body text-[14px] text-neutral-800 leading-snug">
                  <span className="font-semibold text-neutral-900">{activity.actor}</span> {activity.text.toLowerCase()}
                </p>
                <span className="font-body text-[12px] text-neutral-400 shrink-0 whitespace-nowrap">
                  {formatDate(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
