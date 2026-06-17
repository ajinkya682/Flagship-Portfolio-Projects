'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Hexagon, Eye, EyeOff } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') || null
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const hasMinLength = password.length >= 8
  const hasNumber = /[0-9]/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    if (!token) {
      setErrorMsg('Invalid or missing reset token. Please request a new password reset.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const result = await res.json()
      
      if (!res.ok) {
        setErrorMsg(result.error || 'Failed to reset password')
        return
      }
      
      setSuccess(true)
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="w-[48px] h-[48px] text-accent-500 mb-[24px]" />
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Password updated
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[16px] leading-relaxed">
          Your password has been changed successfully.
        </p>
        <Link
          href="/login"
          className="mt-[40px] w-full h-[44px] flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors"
        >
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight text-center">
        Set new password
      </h1>
      
      {!token && (
        <div className="mt-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium text-center">
          Missing reset token. Please use the link sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-[32px] flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-[44px] pl-[12px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[12px] top-[12px] text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={12} className={hasMinLength ? "text-accent-500" : "text-neutral-300"} />
              <span className={`text-[12px] ${hasMinLength ? "text-neutral-700" : "text-neutral-500"}`}>8+ characters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={12} className={hasNumber ? "text-accent-500" : "text-neutral-300"} />
              <span className={`text-[12px] ${hasNumber ? "text-neutral-700" : "text-neutral-500"}`}>At least 1 number</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-[12px] text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !hasMinLength || !hasNumber || password !== confirmPassword || !token}
          className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Reset password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px]">
      <Link href="/" className="flex items-center gap-2 mb-[32px]">
        <Hexagon className="w-8 h-8 text-primary-600 fill-primary-600" />
        <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
      </Link>

      <div className="w-full max-w-[440px] bg-white p-[32px] md:p-[48px] rounded-[16px] md:rounded-[24px] shadow-sm md:shadow-lg border border-neutral-100/50">
        <Suspense fallback={<div className="flex justify-center"><LoadingSpinner size="md" className="text-primary-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
