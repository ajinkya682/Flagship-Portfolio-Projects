const TOKEN_KEY = 'talentiq-auth-token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

interface DecodedToken {
  sub: string
  exp: number
  iat: number
  email: string
}

export function decodeToken(token: string): DecodedToken {
  const segment = token.split('.')[1]
  // Pad base64 string to a multiple of 4
  const padded = segment + '=='.slice(0, (4 - (segment.length % 4)) % 4)
  const decoded = atob(padded)
  return JSON.parse(decoded) as DecodedToken
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeToken(token)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

export function getAuthHeader(): { Authorization: string } | Record<string, never> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
