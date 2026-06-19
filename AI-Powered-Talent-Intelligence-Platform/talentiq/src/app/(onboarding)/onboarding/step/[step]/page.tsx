'use client'

import { useRouter } from 'next/navigation'
import Step1CompanySetup from '@/components/onboarding/Step1CompanySetup'
import Step2InviteTeam from '@/components/onboarding/Step2InviteTeam'
import Step3CreateJob from '@/components/onboarding/Step3CreateJob'
import Step4AIScoring from '@/components/onboarding/Step4AIScoring'
import Step5Complete from '@/components/onboarding/Step5Complete'

export default function OnboardingStepPage({ params }: { params: { step: string } }) {
  const router = useRouter()
  const stepNum = parseInt(params.step, 10)

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 5) {
    router.push('/onboarding/step/1')
    return null
  }

  const handleNext = () => {
    if (stepNum < 5) {
      router.push(`/onboarding/step/${stepNum + 1}`)
    }
  }

  const handleBack = () => {
    if (stepNum > 1) {
      router.push(`/onboarding/step/${stepNum - 1}`)
    }
  }

  // Progress Bar Width
  const progress = (stepNum / 5) * 100

  return (
    <div>
      {/* Progress Bar under header */}
      <div className="fixed top-[60px] left-0 right-0 h-[3px] bg-neutral-100 z-40">
        <div 
          className="h-full bg-primary-500 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-[8px] text-[13px] font-semibold text-primary-600 uppercase tracking-wider">
        Step {stepNum} of 5
      </div>

      <div className={`mx-auto w-full ${stepNum === 4 ? 'max-w-[1200px]' : 'max-w-[640px]'}`}>
        {stepNum === 1 && <Step1CompanySetup onNext={handleNext} />}
        {stepNum === 2 && <Step2InviteTeam onNext={handleNext} onBack={handleBack} />}
        {stepNum === 3 && <Step3CreateJob onNext={handleNext} onBack={handleBack} />}
        {stepNum === 4 && <Step4AIScoring onNext={handleNext} onBack={handleBack} />}
        {stepNum === 5 && <Step5Complete />}
      </div>
    </div>
  )
}
