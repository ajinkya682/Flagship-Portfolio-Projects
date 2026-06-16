import axios from 'axios'
import { getToken, clearToken } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response

      if (status === 401) {
        clearToken()
        // Do not redirect if we are already on the login page or making a login request
        if (typeof window !== 'undefined' && window.location.pathname !== '/login' && !error.config?.url?.includes('/auth/login')) {
          // Clear the HTTP-only cookies before redirecting to avoid loops with middleware
          fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
            window.location.href = '/login'
          })
          // Return an unresolved promise to prevent further execution in the current component
          return new Promise(() => {})
        }
      }

      if (status === 422) {
        const validationErrors = data?.errors as Record<string, string[]> | undefined
        if (validationErrors) {
          const messages = Object.entries(validationErrors)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join(' | ')
          if (error.message !== undefined) {
            // Attach formatted validation message to the error object
            ;(error as { validationMessage?: string }).validationMessage = messages
          }
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
