import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Job } from '@/types/domain.types'
import { PaginatedResponse } from '@/types/api.types'

export function useJobs(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const queryParams = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return api.get<PaginatedResponse<Job>>(`/jobs${queryParams}`)
    },
  })
}
