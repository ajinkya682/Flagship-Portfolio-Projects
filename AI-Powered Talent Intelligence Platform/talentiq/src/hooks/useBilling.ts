import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface UsageData {
  aiScoresUsed: number
  aiScoresLimit: number
  jobsUsed: number
  jobsLimit: number
  seatsUsed: number
  seatsLimit: number
}

interface BillingInfo {
  plan: string
  usage: UsageData
  invoices: any[]
}

export function useBilling() {
  return useQuery({
    queryKey: ['billing', 'current'],
    queryFn: async () => {
      return api.get<BillingInfo>('/billing/current')
    },
  })
}
