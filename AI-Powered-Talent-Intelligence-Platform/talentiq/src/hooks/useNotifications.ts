// ─── useNotifications — Demo Mode ─────────────────────────────────
// Returns hardcoded mock notifications.
// No API calls or WebSocket connections.

import { useEffect, useState, useCallback } from 'react'
import { useNotificationsStore } from '@/store/notifications.store'

const MOCK_INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'user_1',
    type: 'ai-score' as const,
    message: '5 new AI matches for Senior Software Engineer — avg score 88',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    link: '/applications',
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    type: 'stage-move' as const,
    message: 'Marcus Rodriguez moved to Interview stage',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    link: '/pipeline',
  },
  {
    id: 'notif_3',
    userId: 'user_1',
    type: 'offer' as const,
    message: 'Emily Watson accepted the offer — Senior Product Designer 🎉',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    link: '/offers',
  },
  {
    id: 'notif_4',
    userId: 'user_1',
    type: 'interview' as const,
    message: 'Interview reminder: Jennifer Park — Video call at 10:00 AM today',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    link: '/interviews',
  },
  {
    id: 'notif_5',
    userId: 'user_1',
    type: 'application' as const,
    message: '14 new applications for Staff Engineer — Platform role',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    link: '/jobs/job_2',
  },
]

const SIMULATED_NOTIFICATIONS = [
  { id: 'sim_1', type: 'ai-score' as const, message: 'AI just scored 8 new applications for Frontend Engineer' },
  { id: 'sim_2', type: 'stage-move' as const, message: 'Jordan Martinez advanced to Technical Assessment' },
  { id: 'sim_3', type: 'application' as const, message: '3 new applications received via LinkedIn' },
  { id: 'sim_4', type: 'interview' as const, message: "Don't forget: 3 interviews scheduled for tomorrow" },
]

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    markRead,
    markAllRead,
  } = useNotificationsStore()

  useEffect(() => {
    // Seed initial mock notifications on mount
    if (notifications.length === 0) {
      setNotifications(MOCK_INITIAL_NOTIFICATIONS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Simulate a new notification every 60 seconds for demo realism
  useEffect(() => {
    let simIdx = 0
    const interval = setInterval(() => {
      const sim = SIMULATED_NOTIFICATIONS[simIdx % SIMULATED_NOTIFICATIONS.length]
      addNotification({
        id: `sim_${Date.now()}`,
        userId: 'user_1',
        type: sim.type,
        message: sim.message,
        read: false,
        createdAt: new Date().toISOString(),
        link: undefined,
      })
      simIdx++
    }, 60000) // every 60 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  }
}
