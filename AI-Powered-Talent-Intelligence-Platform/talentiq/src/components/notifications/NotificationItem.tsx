import { Gift, ArrowRightLeft, Calendar, FileText, Sparkles, UserPlus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    message: string
    timestamp: string
    unread: boolean
  }
  onMarkRead: (id: string) => void
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Gift size={16} className="text-emerald-600" />
      case 'stage_moved': return <ArrowRightLeft size={16} className="text-primary-600" />
      case 'interview': return <Calendar size={16} className="text-purple-600" />
      case 'note': return <FileText size={16} className="text-amber-600" />
      case 'ai_scored': return <Sparkles size={16} className="text-accent-600" />
      case 'application': return <UserPlus size={16} className="text-blue-600" />
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
      case 'application': return 'bg-blue-100'
      default: return 'bg-neutral-100'
    }
  }

  return (
    <div 
      className={`p-[16px] flex gap-[12px] hover:bg-neutral-50 transition-colors cursor-pointer relative ${notification.unread ? 'bg-neutral-50/50' : ''}`}
      onClick={() => { if (notification.unread) onMarkRead(notification.id) }}
    >
      <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 ${getIconBg(notification.type)}`}>
        {getIcon(notification.type)}
      </div>
      
      <div className="flex flex-col gap-[4px] flex-1">
        <p className="font-body text-[14px] text-neutral-900 leading-snug">
          {notification.message}
        </p>
        <span className="font-body text-[12px] text-neutral-400">
          {formatDate(notification.timestamp)}
        </span>
      </div>

      {notification.unread && (
        <div className="w-[6px] h-[6px] rounded-full bg-accent-500 shrink-0 mt-[6px]" />
      )}
    </div>
  )
}
