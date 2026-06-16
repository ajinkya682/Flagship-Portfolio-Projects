'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function PortalLogin() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portalToken: code })
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        router.push('/portal/dashboard')
      } else {
        setError(data.error || 'Invalid access code. Please check and try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px]">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] shadow-xl shadow-neutral-200/50 border border-neutral-100 p-[40px] flex flex-col items-center">
        <div className="w-[48px] h-[48px] bg-neutral-900 rounded-[12px] flex items-center justify-center mb-[24px]">
          <Sparkles className="text-white" size={24} />
        </div>
        
        <h1 className="font-display text-[24px] font-bold text-neutral-900 text-center leading-tight mb-[8px]">
          Candidate Portal
        </h1>
        <p className="font-body text-[14px] text-neutral-500 text-center mb-[32px]">
          Enter your access code to track your application status and messages.
        </p>

        {error && (
          <div className="w-full mb-[24px] p-[12px] bg-red-50 border border-red-100 rounded-[8px] flex items-start gap-[8px] text-red-600 font-body text-[13px]">
            <AlertCircle size={16} className="mt-[2px] shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-[16px]">
          <div>
            <label className="font-body text-[12px] font-semibold text-neutral-700 uppercase tracking-wider mb-[8px] block">
              Access Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. X7K9P2M"
              className="w-full h-[52px] px-[16px] border border-neutral-200 rounded-[12px] text-center text-[20px] font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] mt-[8px] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isLoading ? 'Verifying...' : 'Access Portal'} {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}
