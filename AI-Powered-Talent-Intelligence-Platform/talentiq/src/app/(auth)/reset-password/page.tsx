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
      <div className="mb-[32px] text-center flex flex-col items-center">
        <div className="w-[48px] h-[48px] bg-primary-50 rounded-xl flex items-center justify-center mb-[24px] border border-primary-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-500/10" />
          <KeyRound className="w-[24px] h-[24px] text-primary-600 relative z-10" />
        </div>
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Set new password
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Please enter your new password below.
        </p>
      </div>
      
      {!token && (
        <div className="mt-2 mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium text-center">
          Missing reset token. Please use the link sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[44px] pl-[12px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
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
              <CheckCircle size={12} className={hasMinLength ? "text-green-500" : "text-neutral-300"} />
              <span className={`text-[12px] font-medium ${hasMinLength ? "text-neutral-700" : "text-neutral-500"}`}>8+ characters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={12} className={hasNumber ? "text-green-500" : "text-neutral-300"} />
              <span className={`text-[12px] font-medium ${hasNumber ? "text-neutral-700" : "text-neutral-500"}`}>At least 1 number</span>
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
            placeholder="••••••••"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-[12px] text-red-500 mt-1 font-medium">Passwords do not match</p>
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
          className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Reset password'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner size="md" className="text-primary-500" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
