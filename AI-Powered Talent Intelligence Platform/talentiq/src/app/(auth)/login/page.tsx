"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Basic mock validation state for demonstration
  const [errors, setErrors] = React.useState<{ email?: string, password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network delay and validation
    setTimeout(() => {
      setIsLoading(false)
      setErrors({ email: "Invalid email or password." }) // Mocking an error state
    }, 1000)
  }

  return (
    <div className="flex w-full flex-col">
      <h3 className="font-display text-[22px] font-semibold text-neutral-900">
        Welcome back
      </h3>
      <p className="mt-1.5 font-body text-[13px] text-neutral-500">
        Sign in to continue to TalentIQ.
      </p>

      {/* Google OAuth Button */}
      <button 
        type="button"
        className="mt-6 flex h-[44px] w-full items-center justify-center gap-[12px] rounded-sm border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-body text-[14px] font-semibold text-neutral-900">
          Continue with Google
        </span>
      </button>

      {/* Divider */}
      <div className="my-5 flex items-center justify-center">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="px-3 font-body text-[12px] text-neutral-400">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@company.com" 
            error={errors.email}
            helperText={errors.email}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              error={errors.password}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className="font-body text-[12px] text-red-500">{errors.password}</span>
          )}
          <Link 
            href="/forgot-password" 
            className="mt-1.5 self-end font-body text-[12px] text-primary-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="mt-1 h-[44px] w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <span className="font-body text-[14px] text-neutral-600">
          Don't have an account?{" "}
        </span>
        <Link href="/register" className="font-body text-[14px] font-medium text-primary-500 hover:underline">
          Start free trial
        </Link>
      </div>
    </div>
  )
}
