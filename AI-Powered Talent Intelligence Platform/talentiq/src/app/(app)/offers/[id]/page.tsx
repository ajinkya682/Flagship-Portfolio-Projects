'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import OfferDetail from '@/components/offers/OfferDetail'

export default function OfferDetailPage() {
  const params = useParams()

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">
      
      <div className="px-[16px] md:px-[32px] py-[16px] border-b border-[#E5E7EB] bg-white shrink-0 flex items-center gap-[12px]">
        <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900 transition-colors p-[4px] rounded-md hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-body text-[14px] text-neutral-500">Back to Dashboard</span>
      </div>

      <div className="p-[16px] md:p-[32px]">
        <OfferDetail />
      </div>

    </div>
  )
}
