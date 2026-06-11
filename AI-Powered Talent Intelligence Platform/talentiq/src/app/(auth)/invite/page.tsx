'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export default function InvitePage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px]">
      <Link href="/" className="flex items-center gap-2 mb-[32px]">
        <Hexagon className="w-8 h-8 text-primary-600 fill-primary-600" />
        <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
      </Link>

      <div className="w-full max-w-[440px] bg-white p-[32px] md:p-[48px] rounded-[16px] md:rounded-[24px] shadow-sm md:shadow-lg border border-neutral-100/50">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight text-center">
          Join Acme Corp on TalentIQ
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px] text-center">
          Jane Doe invited you to join their team.
        </p>

        <form className="mt-[32px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Set Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="h-[44px] px-[12px] bg-white border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
            className="mt-[8px] w-full h-[44px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[15px] font-semibold rounded-lg shadow-sm"
          >
            Accept Invitation
          </button>
        </form>
      </div>
    </div>
  )
}
