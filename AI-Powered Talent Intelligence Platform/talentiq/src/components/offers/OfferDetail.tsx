'use client'

import { useState } from 'react'
import OfferStatusBadge from './OfferStatusBadge'
import OfferForm from './OfferForm'
import OfferLetterPreview from './OfferLetterPreview'
import { Send, FileSignature, XCircle, CheckCircle } from 'lucide-react'

export default function OfferDetail() {
  const [status, setStatus] = useState<'draft' | 'sent' | 'accepted' | 'declined' | 'expired'>('draft')

  return (
    <div className="flex flex-col lg:flex-row gap-[24px] max-w-[1200px] mx-auto w-full items-start font-body">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-[24px] w-full min-w-0">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[24px]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-display text-[24px] font-bold text-neutral-900">Offer for Senior Software Engineer</h1>
            <span className="text-[15px] text-neutral-600">Candidate: <span className="font-semibold text-neutral-900">Jennifer Park</span></span>
          </div>
          <OfferStatusBadge status={status} />
        </div>

        {status === 'draft' ? (
          <OfferForm />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[24px]">
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-[24px]">Offer Details (Read-only)</h3>
            <div className="grid grid-cols-2 gap-[24px] mb-[32px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Base Salary</span>
                <span className="text-[15px] font-medium text-neutral-900">$165,000 USD</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Equity</span>
                <span className="text-[15px] font-medium text-neutral-900">10,000 ISOs</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[24px]">
          <h3 className="text-[16px] font-semibold text-neutral-900 mb-[24px]">Offer Letter Preview</h3>
          <OfferLetterPreview />
        </div>
      </div>

      {/* Sidebar Actions */}
      <div className="w-full lg:w-[320px] shrink-0 sticky top-[88px] bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[20px] flex flex-col gap-[16px]">
        
        {status === 'draft' && (
          <button 
            onClick={() => setStatus('sent')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium text-[14px] py-[10px] rounded-md transition-colors shadow-sm flex items-center justify-center gap-[8px]"
          >
            <Send size={16} /> Send Offer
          </button>
        )}

        {status === 'sent' && (
          <>
            <button 
              onClick={() => setStatus('accepted')}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium text-[14px] py-[10px] rounded-md transition-colors shadow-sm flex items-center justify-center gap-[8px]"
            >
              <CheckCircle size={16} /> Mark as Accepted
            </button>
            <button 
              onClick={() => setStatus('declined')}
              className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium text-[14px] py-[10px] rounded-md transition-colors flex items-center justify-center gap-[8px]"
            >
              <XCircle size={16} /> Mark as Declined
            </button>
            <div className="h-[1px] bg-neutral-100 w-full my-[4px]" />
            <button 
              onClick={() => setStatus('draft')}
              className="w-full bg-transparent hover:bg-red-50 text-[#DC2626] font-medium text-[14px] py-[10px] rounded-md transition-colors flex items-center justify-center gap-[8px]"
            >
              Retract Offer
            </button>
          </>
        )}

        {status === 'accepted' && (
          <div className="p-[16px] bg-accent-50 rounded-md border border-accent-100 flex items-start gap-[12px]">
            <CheckCircle size={20} className="text-accent-600 shrink-0 mt-[2px]" />
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] font-semibold text-accent-900">Offer Accepted</span>
              <span className="text-[13px] text-accent-700">The candidate has successfully signed the offer letter.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
