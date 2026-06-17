import { useAuthStore } from '@/store/auth.store'
import { PLAN_LIMITS } from '@/lib/constants'

type PlanType = 'starter' | 'growth' | 'enterprise'
type PlanLevel = 0 | 1 | 2

const PLAN_LEVELS: Record<PlanType, PlanLevel> = {
  starter: 0,
  growth: 1,
  enterprise: 2,
}

export function useRequireCapability(capability: keyof typeof PLAN_LIMITS.growth.features | 'apiAccess' | 'sso' | 'biasDetection' | 'advancedAnalytics') {
  const { user } = useAuthStore()
  const currentPlan: PlanType = user?.plan || 'starter'
  
  // Determine min plan for the feature
  let minimumPlan: PlanType = 'starter'
  
  if (capability === 'apiAccess' || capability === 'sso') {
    minimumPlan = 'enterprise'
  } else if (capability === 'biasDetection' || capability === 'advancedAnalytics') {
    minimumPlan = 'growth'
  }

  const hasCapability = PLAN_LEVELS[currentPlan] >= PLAN_LEVELS[minimumPlan]

  return {
    hasCapability,
    minimumPlan,
  }
}
