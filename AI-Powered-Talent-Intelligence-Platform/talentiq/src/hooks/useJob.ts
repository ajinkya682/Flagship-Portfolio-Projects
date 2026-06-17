import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Job } from '@/types/domain.types'

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      return api.get<Job>(`/jobs/${id}`)
    },
    enabled: !!id,
  })
}
