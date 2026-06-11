import type { User } from './domain.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  companyName: string
  email: string
  password: string
}

export interface AuthToken {
  token: string
  expiresAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
