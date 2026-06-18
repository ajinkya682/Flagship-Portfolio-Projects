import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import { useDomainStore } from '@/store/domain.store'
import type { User } from '@/types/domain.types'
import api from '@/lib/api'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  companyName?: string
  companySize?: string
  hearAbout?: string
}

export function useAuth() {
  const { user, setUser, clearUser, updatePlan } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const isAuthenticated = user !== null

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true)
      const { data } = await api.post('/auth/login', credentials)
      
      // The API returns { user, accessToken, refreshToken } and also sets HttpOnly cookies
      const appUser = buildUserFromResponse(data.user)
      setUser(appUser)

      if (appUser.email === 'demo@talentiq.com') {
        useJobsStore.getState().fetchJobs()
        useCandidatesStore.getState().fetchCandidates()
        useDomainStore.getState().loadDemoData()
      } else {
        useJobsStore.getState().clearData()
        useCandidatesStore.getState().clearData()
        useDomainStore.getState().clearData()
      }

      return appUser
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<User> => {
    try {
      setIsLoading(true)
      const { data: responseData } = await api.post('/auth/register', data)
      
      const appUser = buildUserFromResponse(responseData.user)
      setUser(appUser)

      if (appUser.email === 'demo@talentiq.com') {
        useJobsStore.getState().fetchJobs()
        useCandidatesStore.getState().fetchCandidates()
        useDomainStore.getState().loadDemoData()
      } else {
        useJobsStore.getState().clearData()
        useCandidatesStore.getState().clearData()
        useDomainStore.getState().clearData()
      }

      return appUser
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    clearUser()
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.error('Logout API failed:', e)
    }
    
    if (typeof window !== 'undefined') {
      import('@/lib/auth').then(({ clearToken }) => clearToken())
      localStorage.removeItem('talentiq-auth-token')
      localStorage.removeItem('talentiq-auth') // The zustand store key
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
  }
}

// Map the backend user object to the frontend domain user
function buildUserFromResponse(apiUser: any): User {
  return {
    id: apiUser.id || apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    avatar: apiUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=random`,
    role: apiUser.role,
    company: apiUser.company || {
      id: apiUser.companyId,
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
    plan: apiUser.company?.billing?.plan || 'starter',
    createdAt: apiUser.createdAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  }
}
