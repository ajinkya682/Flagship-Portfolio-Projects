import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export default function PortalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-neutral-100 flex items-center justify-between px-[24px] z-50">
      <div className="flex items-center gap-[12px]">
        <div className="w-[32px] h-[32px] bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-display font-bold text-[14px]">AC</span>
        </div>
        <h4 className="font-display text-[16px] font-bold text-neutral-900">Acme Corp</h4>
      </div>
      
      <div className="flex items-center gap-[8px]">
        <span className="font-body text-[12px] text-neutral-400">Powered by</span>
        <Link href="/" className="flex items-center gap-[4px]">
          <Hexagon className="w-[14px] h-[14px] text-primary-500 fill-primary-500" />
          <span className="font-display text-[13px] font-bold text-neutral-900">TalentIQ</span>
        </Link>
      </div>
    </header>
  )
}
