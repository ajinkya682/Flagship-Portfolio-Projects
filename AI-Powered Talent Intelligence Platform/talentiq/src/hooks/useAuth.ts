import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
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
    // If you have a backend logout route to clear cookies, call it here.
    // await api.post('/auth/logout')
    
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
    company: {
      id: apiUser.companyId,
      name: apiUser.companyName || 'My Company',
      logo: undefined,
      industry: 'Software',
      size: '1-10',
      timezone: 'UTC',
      currency: 'USD',
      careerPageUrl: '',
      subdomain: '',
      slug: '',
    },
    plan: 'growth',
    createdAt: apiUser.createdAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  }
}
