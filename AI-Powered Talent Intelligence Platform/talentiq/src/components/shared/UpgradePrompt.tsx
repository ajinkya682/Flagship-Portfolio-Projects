import Link from 'next/link'
import { Lock } from 'lucide-react'

interface UpgradePromptProps {
  featureName: string
  requiredPlan: string
  description: string
}

export function UpgradePrompt({ featureName, requiredPlan, description }: UpgradePromptProps) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg py-[16px] px-[20px] flex items-center gap-[16px]">
      <Lock size={20} className="text-primary-500 shrink-0" />
      
      <div className="flex-grow">
        <h4 className="font-body text-[14px] font-semibold text-primary-900">
          {featureName}
        </h4>
        <p className="font-body text-[13px] text-primary-700 mt-[4px]">
          {description}
        </p>
      </div>
      
      <Link
        href="/settings/billing"
        className="shrink-0 h-[32px] px-[12px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center"
      >
        Upgrade to {requiredPlan}
      </Link>
    </div>
  )
}
