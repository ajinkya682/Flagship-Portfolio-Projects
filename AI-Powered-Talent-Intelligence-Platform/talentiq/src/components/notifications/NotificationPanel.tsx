import NotificationItem from './NotificationItem'

interface Notification {
  id: string
  type: string
  message: string
  timestamp: string
  unread: boolean
}

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
}

export default function NotificationPanel({ notifications, onMarkAllRead, onMarkRead }: NotificationPanelProps) {
  return (
    <div className="flex flex-col font-body">
      <div className="p-[16px] border-b border-neutral-100 flex items-center justify-between shrink-0">
        <h5 className="text-[14px] font-semibold text-neutral-900">Notifications</h5>
        {notifications.some(n => n.unread) && (
          <button 
            onClick={onMarkAllRead}
            className="text-[12px] font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[352px] flex flex-col">
        {notifications.length === 0 ? (
          <div className="p-[32px] text-center text-[13px] text-neutral-500 italic">
            You're all caught up!
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onMarkRead={onMarkRead} 
            />
          ))
        )}
      </div>
    </div>
  )
}
