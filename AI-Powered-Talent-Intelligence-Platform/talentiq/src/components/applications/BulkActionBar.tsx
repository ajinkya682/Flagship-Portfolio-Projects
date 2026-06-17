import { X } from 'lucide-react'

interface BulkActionBarProps {
  selectedCount: number
  onDeselectAll: () => void
}

export default function BulkActionBar({ selectedCount, onDeselectAll }: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 bg-neutral-900 text-white rounded-lg shadow-xl px-[24px] py-[16px] flex items-center gap-[32px] z-40 animate-in slide-in-from-bottom-8 fade-in font-body">
      
      <div className="flex items-center gap-[16px]">
        <span className="text-[14px] font-semibold">
          {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <button 
          onClick={onDeselectAll}
          className="text-neutral-400 hover:text-white transition-colors p-[4px]"
          aria-label="Deselect all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="w-[1px] h-[24px] bg-neutral-700" />

      <div className="flex items-center gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <select className="h-[32px] rounded-md border border-neutral-700 bg-neutral-800 text-white px-[12px] text-[13px] focus:outline-none focus:border-primary-500">
            <option value="" disabled selected>Move to stage...</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
          </select>
          <button className="bg-white text-neutral-900 hover:bg-neutral-200 px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors">
            Move
          </button>
        </div>

        <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors border border-neutral-700">
          Send Message
        </button>
        
        <button className="text-[#FCA5A5] hover:text-[#FECACA] hover:bg-red-950/30 px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors">
          Reject
        </button>
      </div>
      
    </div>
  )
}
