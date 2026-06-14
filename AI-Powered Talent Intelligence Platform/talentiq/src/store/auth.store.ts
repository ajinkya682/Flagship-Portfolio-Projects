// ─── Auth Store — Demo Mode ────────────────────────────────────────
// Bypasses all real backend auth. Uses mock user data for demo purposes.

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types/domain.types'
import { DEFAULT_USER, type DemoUser } from '@/mock-data/users'

interface AuthStore {
  user: User | null
  demoRole: DemoUser | null
  isLoading: boolean
  setUser: (user: User) => void
  clearUser: () => void
  updatePlan: (plan: 'starter' | 'growth' | 'enterprise') => void
  setLoading: (loading: boolean) => void
  switchRole: (demoUser: DemoUser) => void
}

// Convert DemoUser to the app's User type
function demoUserToAppUser(demoUser: DemoUser): User {
  return {
    id: demoUser.id,
    name: demoUser.name,
    email: demoUser.email,
    avatar: demoUser.avatar,
    role: demoUser.role,
    company: {
      id: 'co_25',
      name: demoUser.companyName,
      logo: undefined,
      industry: 'SaaS',
      size: '201-500',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      careerPageUrl: 'https://acmecorp.com/careers',
      subdomain: 'acme',
      slug: 'acme',
    },
    plan: demoUser.plan,
    createdAt: '2023-01-15T08:00:00Z',
    lastActiveAt: new Date().toISOString(),
  }
}

const DEFAULT_APP_USER = demoUserToAppUser(DEFAULT_USER)

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: DEFAULT_APP_USER, // ← Pre-logged-in for seamless demo
      demoRole: DEFAULT_USER,
      isLoading: false,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null, demoRole: null }),

      updatePlan: (plan) =>
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      switchRole: (demoUser: DemoUser) =>
        set({
          demoRole: demoUser,
          user: demoUserToAppUser(demoUser),
        }),
    }),
    {
      name: 'talentiq-auth-demo',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, demoRole: state.demoRole }),
    },
  ),
)
