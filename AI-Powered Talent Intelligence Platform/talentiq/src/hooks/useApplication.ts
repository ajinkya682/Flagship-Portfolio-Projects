import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Application } from '@/types/domain.types'

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: async () => {
      return api.get<Application>(`/applications/${id}`)
    },
    enabled: !!id,
  })
}
