import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types/domain.types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
  clearUser: () => void
  updatePlan: (plan: 'starter' | 'growth' | 'enterprise') => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null, // Start logged out
      isLoading: false,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      updatePlan: (plan) =>
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'talentiq-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
