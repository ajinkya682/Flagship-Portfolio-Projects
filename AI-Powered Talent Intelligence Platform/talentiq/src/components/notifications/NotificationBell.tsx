'use client'

import * as Popover from '@radix-ui/react-popover'
import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import NotificationPanel from './NotificationPanel'

// Mock Data
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'offer', message: 'Jennifer Park accepted the Senior Software Engineer offer!', timestamp: new Date(Date.now() - 3600000).toISOString(), unread: true },
  { id: '2', type: 'interview', message: 'Alex Manager submitted a scorecard for David Chen.', timestamp: new Date(Date.now() - 7200000).toISOString(), unread: true },
  { id: '3', type: 'ai_scored', message: 'New candidate scored 95/100 for Product Manager.', timestamp: new Date(Date.now() - 86400000).toISOString(), unread: false },
]

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [isShaking, setIsShaking] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length

  // Simulate new notification shake effect occasionally
  useEffect(() => {
    if (unreadCount > 0) {
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button 
          className="relative w-[36px] h-[36px] flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <div className={isShaking ? 'animate-bell-shake' : ''}>
            <Bell size={20} />
          </div>
          {unreadCount > 0 && (
            <div className="absolute top-[6px] right-[8px] w-[8px] h-[8px] rounded-full bg-accent-500 border-2 border-white" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          align="end" 
          sideOffset={8}
          className="bg-white rounded-xl shadow-xl border border-neutral-100 w-[360px] z-50 overflow-hidden animate-in fade-in zoom-in-95"
        >
          <style>{`
            @keyframes bell-shake {
              0% { transform: rotate(0); }
              20% { transform: rotate(15deg); }
              40% { transform: rotate(-15deg); }
              60% { transform: rotate(10deg); }
              80% { transform: rotate(-10deg); }
              100% { transform: rotate(0); }
            }
            .animate-bell-shake {
              animation: bell-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
          `}</style>
          <NotificationPanel 
            notifications={notifications} 
            onMarkAllRead={handleMarkAllRead} 
            onMarkRead={handleMarkRead} 
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
