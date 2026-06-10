"use client"

import * as React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
          Check your email
        </h3>
        <p className="mt-2 font-body text-[14px] text-neutral-500 leading-relaxed">
          We've sent a password reset link to your email address. Please click the link to reset your password.
        </p>
        <div className="mt-8 flex flex-col gap-3 w-full">
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => setIsSuccess(false)}
          >
            Resend email
          </Button>
          <Link href="/login" className="font-body text-[14px] font-medium text-primary-500 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <h3 className="font-display text-[22px] font-semibold text-neutral-900">
        Reset password
      </h3>
      <p className="mt-1.5 font-body text-[13px] text-neutral-500">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="name@company.com" required />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="mt-2 h-[44px] w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-900">
          Back to login
        </Link>
      </div>
    </div>
  )
}
