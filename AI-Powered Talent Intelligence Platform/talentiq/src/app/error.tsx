'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px] text-center">
      <AlertCircle className="w-[48px] h-[48px] text-red-500" />
      
      <h2 className="font-display text-[24px] md:text-[32px] font-bold text-neutral-900 mt-[24px]">
        Something went wrong on our end
      </h2>
      
      <p className="font-body text-[14px] md:text-[16px] text-neutral-600 mt-[12px] max-w-[440px] leading-relaxed">
        Our engineering team has been notified. Please try again or return to the dashboard.
      </p>

      <div className="mt-[24px] bg-white border border-neutral-200 rounded-lg py-[12px] px-[16px] font-mono text-[13px] text-neutral-500">
        Error ID: {error.digest || error.message || 'unknown_error'}
      </div>

      <div className="flex gap-[12px] mt-[32px]">
        <Link
          href="/"
          className="h-[44px] px-[24px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
        >
          Return Home
        </Link>
        <button
          onClick={() => reset()}
          className="h-[44px] px-[24px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold rounded-lg flex items-center justify-center transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
