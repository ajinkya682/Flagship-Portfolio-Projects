'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Hexagon } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px]">
      
      <Link href="/" className="flex items-center gap-2 mb-[32px]">
        <Hexagon className="w-8 h-8 text-primary-600 fill-primary-600" />
        <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
      </Link>

      <div className="w-full max-w-[440px] bg-white p-[32px] md:p-[48px] rounded-[16px] md:rounded-[24px] shadow-sm md:shadow-lg border border-neutral-100/50 text-center">
        {!success ? (
          <>
            <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
              Reset your password
            </h1>
            <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-[32px] flex flex-col gap-[16px] text-left">
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-[32px]">
              <Link href="/login" className="font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-[48px] h-[48px] text-accent-500 mb-[24px]" />
            <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
              Check your email
            </h1>
            <p className="font-body text-[15px] text-neutral-500 mt-[16px] leading-relaxed">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox.
            </p>
            <p className="font-body text-[13px] text-neutral-400 mt-[32px]">
              Didn&apos;t receive it?{' '}
              <button className="font-medium text-primary-500 hover:text-primary-600 underline">
                Resend link
              </button>
            </p>
            <Link
              href="/login"
              className="mt-[40px] w-full h-[44px] flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[15px] font-semibold rounded-lg transition-colors"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
