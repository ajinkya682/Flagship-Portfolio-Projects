import { useAuth } from './useAuth'
import { User } from '@/types/domain.types'

export function useCurrentUser(): { user: User | null; isLoaded: boolean } {
  const { user, isLoading } = useAuth()

  return {
    user,
    isLoaded: !isLoading,
  }
}
