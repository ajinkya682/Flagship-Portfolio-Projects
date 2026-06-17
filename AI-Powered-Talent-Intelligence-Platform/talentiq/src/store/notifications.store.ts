import { create } from 'zustand'
import type { Notification } from '@/types/domain.types'

interface NotificationsStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearNotifications: () => void
  setNotifications: (notifications: Notification[]) => void
}

export const useNotificationsStore = create<NotificationsStore>()((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications]
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    }),

  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      )
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
}))
