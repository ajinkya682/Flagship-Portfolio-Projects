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
  fetchUser: () => Promise<void>
  demoRole: any | null
  switchRole: (user: any) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null, // Start logged out
  isLoading: false,
  demoRole: null,

  switchRole: (user: any) => set({ demoRole: user }),

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  updatePlan: (plan) =>
    set((state) => ({
      user: state.user ? { ...state.user, plan } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        // Map api user structure to our local domain user structure
        const appUser: User = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=random`,
          role: data.user.role,
          company: data.user.company || {
            id: data.user.companyId,
            name: 'My Company',
            logo: '',
            industry: 'Software',
            size: '1-10',
            timezone: 'UTC',
            currency: 'USD',
            careerPageUrl: '',
            subdomain: '',
            slug: '',
          },
          plan: data.user.company?.billing?.plan || 'starter',
          createdAt: data.user.createdAt || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        set({ user: appUser });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Failed to fetch user session from API", error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  }
}));
