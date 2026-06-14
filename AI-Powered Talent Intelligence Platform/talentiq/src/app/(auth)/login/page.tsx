'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Zap, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { DEMO_USERS } from '@/mock-data/users'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const DEMO_ACCOUNTS = DEMO_USERS.slice(0, 3) // Sarah (Admin), Alex (HM), Jordan (Recruiter)

const ROLE_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  admin:            { label: 'Admin',          bg: 'bg-purple-100', text: 'text-purple-700' },
  'hiring-manager': { label: 'Hiring Manager', bg: 'bg-amber-100',  text: 'text-amber-700'  },
  recruiter:        { label: 'Recruiter',      bg: 'bg-blue-100',   text: 'text-blue-700'   },
  viewer:           { label: 'Viewer',         bg: 'bg-neutral-100',text: 'text-neutral-600' },
}

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: DEMO_ACCOUNTS[0].email, password: 'demo123' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await login(data)
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async (demoUser: typeof DEMO_ACCOUNTS[0]) => {
    setActiveDemoId(demoUser.id)
    setValue('email', demoUser.email)
    setValue('password', 'demo123')
    setIsSubmitting(true)
    try {
      await login({ email: demoUser.email, password: 'demo123' })
      window.location.href = '/dashboard'
    } catch {
      setIsSubmitting(false)
      setActiveDemoId(null)
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

      {/* Demo Accounts Section */}
      <div className="mb-[20px] rounded-[14px] border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-600/5 border-b border-blue-200/40">
          <Zap size={13} className="text-blue-600" />
          <p className="font-body text-[12px] font-bold text-blue-700 uppercase tracking-wide">
            Try Demo — One click login
          </p>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {DEMO_ACCOUNTS.map(account => {
            const badge = ROLE_BADGE[account.role]
            const isActive = activeDemoId === account.id
            return (
              <button
                key={account.id}
                onClick={() => handleDemoLogin(account)}
                disabled={isSubmitting}
                className={`flex items-center gap-3 w-full p-2.5 rounded-[10px] border transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 shadow-md'
                    : 'bg-white border-neutral-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm'
                } disabled:opacity-60`}
              >
                <img
                  src={account.avatar}
                  alt={account.name}
                  className="w-9 h-9 rounded-[8px] object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-[13px] font-semibold leading-tight truncate ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                    {account.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : `${badge.bg} ${badge.text}`}`}>
                      {badge.label}
                    </span>
                    <span className={`text-[11px] truncate ${isActive ? 'text-blue-100' : 'text-neutral-400'}`}>
                      {account.email}
                    </span>
                  </div>
                </div>
                {isActive
                  ? <LoadingSpinner size="sm" className="text-white shrink-0" />
                  : <div className="w-5 h-5 rounded-full border-2 border-neutral-200 shrink-0" />
                }
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-[16px] mb-[20px]">
        <div className="flex-1 h-[1px] bg-neutral-100" />
        <span className="font-body text-[12px] text-neutral-400 uppercase tracking-wider font-semibold">Or sign in manually</span>
        <div className="flex-1 h-[1px] bg-neutral-100" />
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
