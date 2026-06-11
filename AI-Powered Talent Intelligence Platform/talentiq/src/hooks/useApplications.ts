import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Application } from '@/types/domain.types'
import { PaginatedResponse } from '@/types/api.types'

interface ApplicationFilters {
  jobId?: string
  stage?: string
  minScore?: number
  maxScore?: number
  source?: string
  search?: string
  page?: number
  perPage?: number
}

export function useApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      const queryParams = params.toString() ? `?${params.toString()}` : ''
      return api.get<PaginatedResponse<Application>>(`/applications${queryParams}`)
    },
  })
}
