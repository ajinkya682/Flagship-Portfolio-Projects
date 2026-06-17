'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const emailValue = watch('email')

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      
      if (!res.ok) {
        setErrorMsg(result.error || 'Failed to request password reset')
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
      <div className="flex flex-col w-full items-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-[64px] h-[64px] bg-green-50 rounded-2xl flex items-center justify-center mb-[24px] border border-green-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/10" />
          <MailCheck className="w-[32px] h-[32px] text-green-500 relative z-10" />
        </div>
        
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Check your email
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[12px] leading-relaxed max-w-[320px]">
          We sent a password reset link to <br/>
          <strong className="text-neutral-900 font-semibold">{emailValue}</strong>
        </p>
        
        <div className="mt-[32px] w-full flex flex-col gap-[16px]">
          <Link
            href="/login"
            className="w-full h-[44px] flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors"
          >
            Back to login
          </Link>
          
          <p className="font-body text-[13px] text-neutral-500">
            Didn&apos;t receive the email?{' '}
            <button 
              onClick={() => setSuccess(false)}
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Click to resend
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="mb-[32px]">
        <div className="w-[48px] h-[48px] bg-primary-50 rounded-xl flex items-center justify-center mb-[24px] border border-primary-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-500/10" />
          <KeyRound className="w-[24px] h-[24px] text-primary-600 relative z-10" />
        </div>
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Forgot password?
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Email address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="name@company.com"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Reset password'}
        </button>
      </form>

      <div className="mt-[32px] flex justify-center">
        <Link 
          href="/login" 
          className="group flex items-center gap-2 font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
