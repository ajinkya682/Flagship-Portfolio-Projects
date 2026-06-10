"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PasswordStrengthMeter } from "@/components/ui/password-strength"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [step, setStep] = React.useState(1)
  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 600)
  }

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/" // Mock redirect to dashboard
    }, 600)
  }

  return (
    <div className="flex w-full flex-col relative">
      <span className="absolute -top-6 left-0 font-body text-[12px] font-medium text-neutral-500">
        Step {step} of 2
      </span>

      {step === 1 ? (
        <>
          <h3 className="font-display text-[22px] font-semibold text-neutral-900">
            Create your account
          </h3>

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

          <div className="my-5 flex items-center justify-center">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="px-3 font-body text-[12px] text-neutral-400">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Jane Doe" required />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" placeholder="Acme Corp" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="jane@company.com" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-1">
                <PasswordStrengthMeter password={password} />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="mt-2 h-[44px] w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-[12px] text-neutral-500 leading-relaxed">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <span className="font-body text-[14px] text-neutral-600">
              Already have an account?{" "}
            </span>
            <Link href="/login" className="font-body text-[14px] font-medium text-primary-500 hover:underline">
              Sign in
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-display text-[22px] font-semibold text-neutral-900">
            Tell us about your team
          </h3>

          <form onSubmit={handleComplete} className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label>Company size</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>How did you hear about us?</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="referral">Friend / Colleague</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="mt-4 h-[44px] w-full"
              disabled={isLoading}
            >
              {isLoading ? "Setting up..." : "Go to Dashboard"}
            </Button>
            
            <button
              type="button"
              onClick={() => window.location.href = "/"}
              className="mt-1 text-center font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-700"
            >
              Skip for now
            </button>
          </form>
        </>
      )}
    </div>
  )
}
