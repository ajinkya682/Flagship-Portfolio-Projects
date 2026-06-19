'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
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

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <LoadingSpinner size="md" className="text-primary-500" />
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
    <div className="flex flex-col w-full">
      <div className="text-center mb-[28px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Welcome back
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Sign in to your TalentIQ account
        </p>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[16px]">
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] font-body p-[12px] rounded-md border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Work Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="name@company.com"
            className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
          {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-[6px]">
          <div className="flex justify-between items-center">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Password</label>
            <Link href="/forgot-password" className="font-body text-[13px] font-medium text-primary-500 hover:text-primary-600">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-[44px] pl-[12px] pr-[40px] bg-white border border-neutral-200 rounded-lg text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[12px] top-[12px] text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-[12px] text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Sign In'}
        </button>
      </form>

      <p className="font-body text-[14px] text-neutral-500 text-center mt-[24px]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary-500 hover:text-primary-600">
          Sign up for free
        </Link>
      </p>
    </div>
  )
}
