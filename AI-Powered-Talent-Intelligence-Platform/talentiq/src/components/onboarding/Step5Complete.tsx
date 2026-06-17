'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ConfettiTrigger } from '@/components/shared/ConfettiTrigger'

export default function Step5Complete() {
  return (
    <div className="bg-white p-[32px] md:p-[64px] rounded-[24px] shadow-sm border border-neutral-100 mt-6 flex flex-col items-center text-center">
      <ConfettiTrigger trigger={true} />
      
      <div className="animate-spring-in">
        <CheckCircle className="w-[64px] h-[64px] text-accent-500" />
      </div>

      <h2 className="font-display text-[32px] font-bold text-neutral-900 mt-[24px] leading-tight">
        You are all set!
      </h2>
      
      <p className="font-body text-[16px] text-neutral-500 mt-[12px] max-w-[340px] leading-relaxed">
        Your workspace is ready. You can now start scoring resumes automatically and building your pipeline.
      </p>

      <Link
        href="/dashboard"
        className="mt-[32px] w-full h-[56px] flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-body text-[16px] font-bold rounded-xl shadow-md transition-all hover:scale-[1.02]"
      >
        Go to Dashboard
      </Link>

      <Link
        href="/settings/team"
        className="mt-[16px] font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-900"
      >
        Invite teammates first
      </Link>
    </div>
  )
}
