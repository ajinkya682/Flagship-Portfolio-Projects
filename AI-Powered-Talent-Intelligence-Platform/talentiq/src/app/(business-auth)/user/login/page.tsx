'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Hexagon, Building2, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Access token is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>


export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <LoadingSpinner size="md" className="text-blue-600" />
      </div>
    )
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await login(data)
      window.location.href = '/dashboard'
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to sign in'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex flex-col w-full items-center">
      {/* Top Icon */}
      <div className="relative mb-6">
        <Hexagon className="w-16 h-16 text-blue-600 fill-blue-600" />
        <Building2 className="w-7 h-7 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="text-center mb-[28px] w-full">
        <h1 className="font-display text-[26px] font-bold text-neutral-900 leading-tight">
          Business Owner Portal
        </h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[8px]">
          Manage your pipeline, jobs, and settings.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] w-full">
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-body text-[13px] font-semibold text-neutral-900">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full h-[48px] pl-[40px] pr-[12px] bg-white border border-neutral-200 rounded-lg text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>
          {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password / Access Token Field */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <label className="font-body text-[13px] font-semibold text-neutral-900">Access Token</label>
            <Link href="/forgot-password" className="font-body text-[13px] font-medium text-blue-600 hover:text-blue-700">
              Forgot token?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="e.g. X7K9P2M"
              className="w-full h-[48px] pl-[40px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-[12px] text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-[8px] w-full h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Log In
            </>
          )}
        </button>
      </form>
    </div>
  )
}
