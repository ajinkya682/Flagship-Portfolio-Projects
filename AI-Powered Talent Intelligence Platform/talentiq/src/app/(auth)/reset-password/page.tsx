'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Hexagon, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const hasMinLength = password.length >= 8
  const hasNumber = /[0-9]/.test(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    setIsSubmitting(true)
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

      <div className="w-full max-w-[440px] bg-white p-[32px] md:p-[48px] rounded-[16px] md:rounded-[24px] shadow-sm md:shadow-lg border border-neutral-100/50">
        {!success ? (
          <>
            <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight text-center">
              Set new password
            </h1>
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

              <button
                type="submit"
                disabled={isSubmitting || !hasMinLength || !hasNumber || password !== confirmPassword}
                className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm disabled:opacity-70"
              >
                Reset password
              </button>
            </form>
          </>
        ) : (
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
        )}
      </div>
    </div>
  )
}
