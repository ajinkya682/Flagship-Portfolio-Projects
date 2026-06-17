import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useInterviews(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['interviews', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      const queryParams = params.toString() ? `?${params.toString()}` : ''
      
      return api.get(`/interviews${queryParams}`)
    },
  })
}
