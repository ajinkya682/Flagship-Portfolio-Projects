'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useRouter } from 'next/navigation'

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[0-9]/, 'Password must contain at least one number'),
})

const step2Schema = z.object({
  companySize: z.string().min(1, 'Please select your company size'),
  hearAbout: z.string().min(1, 'Please select an option'),
})

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Step 1 Form
  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
  })
  
  // Step 2 Form
  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
  })

  // Watch password for strength meter
  const passwordValue = form1.watch('password', '')
  const hasMinLength = passwordValue.length >= 8
  const hasNumber = /[0-9]/.test(passwordValue)

  const onStep1Submit = () => {
    setStep(2)
  }

  const onStep2Submit = async (data: z.infer<typeof step2Schema>) => {
    setIsSubmitting(true)
    try {
      const step1Data = form1.getValues()
      await registerUser({
        name: step1Data.name,
        companyName: step1Data.companyName,
        email: step1Data.email,
        password: step1Data.password,
      })
      router.push('/onboarding/step/1')
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="text-center mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          {step === 1 ? 'Create your account' : 'Just a few more details'}
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          {step === 1 ? 'Start your 14-day free trial. No credit card required.' : 'Help us customize your experience.'}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Full Name</label>
            <input
              {...form1.register('name')}
              type="text"
              placeholder="Jane Doe"
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {form1.formState.errors.name && <p className="text-[12px] text-red-500 mt-1">{form1.formState.errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Company Name</label>
            <input
              {...form1.register('companyName')}
              type="text"
              placeholder="Acme Corp"
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {form1.formState.errors.companyName && <p className="text-[12px] text-red-500 mt-1">{form1.formState.errors.companyName.message}</p>}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Work Email</label>
            <input
              {...form1.register('email')}
              type="email"
              placeholder="jane@acme.com"
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {form1.formState.errors.email && <p className="text-[12px] text-red-500 mt-1">{form1.formState.errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Password</label>
            <div className="relative">
              <input
                {...form1.register('password')}
                type={showPassword ? 'text' : 'password'}
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
            {/* Password Strength */}
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
            {form1.formState.errors.password && <p className="text-[12px] text-red-500 mt-1">{form1.formState.errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="mt-[16px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors"
          >
            Continue
          </button>

          <p className="font-body text-[12px] text-neutral-500 text-center mt-[8px]">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>

          <p className="font-body text-[14px] text-neutral-500 text-center mt-[24px]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-500 hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Company Size</label>
            <div className="grid grid-cols-2 gap-[12px]">
              {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(size => (
                <label key={size} className={`flex items-center justify-center h-[44px] border rounded-lg cursor-pointer transition-colors ${form2.watch('companySize') === size ? 'bg-primary-50 border-primary-500 text-primary-700 font-semibold' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}>
                  <input type="radio" value={size} {...form2.register('companySize')} className="hidden" />
                  <span className="text-[14px]">{size}</span>
                </label>
              ))}
            </div>
            {form2.formState.errors.companySize && <p className="text-[12px] text-red-500 mt-1">{form2.formState.errors.companySize.message}</p>}
          </div>

          <div className="flex flex-col gap-[6px] mt-4">
            <label className="font-body text-[13px] font-semibold text-neutral-700">How did you hear about us?</label>
            <select
              {...form2.register('hearAbout')}
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            >
              <option value="">Select an option</option>
              <option value="search">Search Engine (Google)</option>
              <option value="social">Social Media (LinkedIn, Twitter)</option>
              <option value="friend">Friend or Colleague</option>
              <option value="blog">Blog or Article</option>
              <option value="other">Other</option>
            </select>
            {form2.formState.errors.hearAbout && <p className="text-[12px] text-red-500 mt-1">{form2.formState.errors.hearAbout.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-[16px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Complete Registration'}
          </button>
        </form>
      )}

    </div>
  )
}
