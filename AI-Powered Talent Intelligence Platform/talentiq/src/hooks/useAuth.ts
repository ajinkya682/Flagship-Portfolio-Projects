import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'
import { User } from '@/types/domain.types'
import { LoginCredentials, RegisterData } from '@/types/auth.types'

export function useAuth() {
  const { user, isLoading, setUser, clearUser, updatePlan } = useAuthStore()
  const isAuthenticated = user !== null

  const login = async (credentials: LoginCredentials): Promise<User> => {
    // In a real app, this calls api.post
    // const response = await api.post('/auth/login', credentials)
    // For MVP, we simulate a successful login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'user_123',
          email: credentials.email,
          name: 'Demo User',
          role: 'admin',
          company: {
            id: 'comp_123',
            name: 'Acme Corp',
            logo: undefined,
            industry: 'Tech',
            size: '50-200',
            timezone: 'UTC',
            currency: 'USD',
            careerPageUrl: '',
            subdomain: 'acme'
          },
          avatar: undefined,
          plan: 'growth',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        }
        localStorage.setItem('talentiq_token', 'mock_jwt_token')
        setUser(mockUser)
        resolve(mockUser)
      }, 800)
    })
  }

  const register = async (credentials: RegisterData): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'user_new',
          email: credentials.email,
          name: credentials.name,
          role: 'admin',
          company: {
            id: 'comp_new',
            name: 'Acme Corp',
            logo: undefined,
            industry: 'Tech',
            size: '50-200',
            timezone: 'UTC',
            currency: 'USD',
            careerPageUrl: '',
            subdomain: 'acme'
          },
          avatar: undefined,
          plan: 'starter',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        }
        localStorage.setItem('talentiq_token', 'mock_jwt_token')
        setUser(mockUser)
        resolve(mockUser)
      }, 800)
    })
  }

  const logout = () => {
    localStorage.removeItem('talentiq_token')
    clearUser()
    window.location.href = '/login'
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
