import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'
import { User } from '@/types/domain.types'
import { LoginCredentials, RegisterData } from '@/types/auth.types'
import { setToken, clearToken } from '@/lib/auth'

export function useAuth() {
  const { user, isLoading, setUser, clearUser, updatePlan } = useAuthStore()
  const isAuthenticated = user !== null

  const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials)
    const { access_token, user: loggedInUser } = response.data
    setToken(access_token)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (credentials: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', credentials)
    const { access_token, user: newUser } = response.data
    setToken(access_token)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    clearToken()
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
