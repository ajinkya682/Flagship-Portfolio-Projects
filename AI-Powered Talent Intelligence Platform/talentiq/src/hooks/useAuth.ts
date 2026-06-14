// ─── useAuth — Demo Mode ───────────────────────────────────────────
// All API calls are replaced with mock implementations.
// No network requests are made. Login immediately succeeds.

import { useAuthStore } from '@/store/auth.store'
import type { User } from '@/types/domain.types'
import { findDemoUser, DEFAULT_USER, DEMO_USERS, type DemoUser } from '@/mock-data/users'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  companyName?: string
}

export function useAuth() {
  const { user, isLoading, setUser, clearUser, updatePlan, switchRole } = useAuthStore()
  const isAuthenticated = user !== null

  /**
   * Demo Login: Matches email to a demo user account.
   * Falls back to default demo user if no match found.
   * No real network request is made.
   */
  const login = async (_credentials: LoginCredentials): Promise<User> => {
    // Simulate a brief loading delay for realism
    await new Promise(r => setTimeout(r, 600))
    
    // Try to find matching demo user by email, default to Sarah Mitchell (admin)
    const demoUser = findDemoUser(_credentials.email) || DEFAULT_USER
    const appUser = buildUserFromDemo(demoUser)
    setUser(appUser)
    return appUser
  }

  /**
   * Demo Register: Instantly creates a demo user account.
   * No real network request is made.
   */
  const register = async (data: RegisterData): Promise<User> => {
    await new Promise(r => setTimeout(r, 800))
    const appUser = buildUserFromDemo({ ...DEFAULT_USER, name: data.name || DEFAULT_USER.name, email: data.email })
    setUser(appUser)
    return appUser
  }

  /**
   * Logout: Clears the store and redirects to login.
   */
  const logout = () => {
    clearUser()
    // Clear session storage to reset demo data
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
      window.location.href = '/login'
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    updatePlan,
    switchRole,
    demoUsers: DEMO_USERS,
  }
}

function buildUserFromDemo(demoUser: Partial<DemoUser> & { email: string; name: string }): User {
  return {
    id: (demoUser as DemoUser).id || 'user_demo',
    name: demoUser.name,
    email: demoUser.email,
    avatar: (demoUser as DemoUser).avatar || 'https://randomuser.me/api/portraits/women/44.jpg',
    role: ((demoUser as DemoUser).role as User['role']) || 'admin',
    company: {
      id: 'co_25',
      name: (demoUser as DemoUser).companyName || 'Acme Corp',
      logo: undefined,
      industry: 'SaaS',
      size: '201-500',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      careerPageUrl: 'https://acmecorp.com/careers',
      subdomain: 'acme',
      slug: 'acme',
    },
    plan: ((demoUser as DemoUser).plan as User['plan']) || 'growth',
    createdAt: '2023-01-15T08:00:00Z',
    lastActiveAt: new Date().toISOString(),
  }
}
