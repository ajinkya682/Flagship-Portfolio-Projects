import { useEffect } from 'react'
import { useNotificationsStore } from '@/store/notifications.store'
import api from '@/lib/api'
import { subscribeToEvent, unsubscribeFromEvent } from '@/lib/socket'
import { Notification as AppNotification } from '@/types/domain.types'

export function useNotifications() {
  const { notifications, unreadCount, setNotifications, addNotification, markRead, markAllRead } = useNotificationsStore()

  useEffect(() => {
    // Initial fetch
    const fetchNotifications = async () => {
      try {
        const data = await api.get<AppNotification[]>('/notifications')
        if (data && Array.isArray(data)) {
          setNotifications(data)
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error)
      }
    }
    
    fetchNotifications()

    // Subscribe to new notifications
    const handleNewNotification = (newNotification: AppNotification) => {
      addNotification(newNotification)
    }
    subscribeToEvent('notification', handleNewNotification)

    return () => {
      unsubscribeFromEvent('notification', handleNewNotification)
    }
  }, [setNotifications, addNotification])

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  }
}
