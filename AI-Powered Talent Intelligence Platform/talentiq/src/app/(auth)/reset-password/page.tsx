"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PasswordStrengthMeter } from "@/components/ui/password-strength"

export default function ResetPasswordPage() {
  const [showPassword1, setShowPassword1] = React.useState(false)
  const [showPassword2, setShowPassword2] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 600)
  }

  if (isSuccess) {
    return (
      <div className="flex w-full flex-col text-center items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-500 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="font-display text-[22px] font-semibold text-neutral-900">
          Password reset successfully
        </h3>
        <p className="mt-2 font-body text-[14px] text-neutral-500 leading-relaxed">
          Your password has been changed. You can now use your new password to sign in.
        </p>
        <div className="mt-8 flex w-full">
          <Link href="/login" className="w-full">
            <Button variant="primary" className="w-full h-[44px]">
              Go to login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <h3 className="font-display text-[22px] font-semibold text-neutral-900">
        Set new password
      </h3>
      <p className="mt-1.5 font-body text-[13px] text-neutral-500">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword1 ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              onClick={() => setShowPassword1(!showPassword1)}
            >
              {showPassword1 ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-1">
            <PasswordStrengthMeter password={password} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showPassword2 ? "text" : "password"} 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error}
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <span className="font-body text-[12px] text-red-500">{error}</span>}
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="mt-4 h-[44px] w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Set new password"}
        </Button>
      </form>

    </div>
  )
}
