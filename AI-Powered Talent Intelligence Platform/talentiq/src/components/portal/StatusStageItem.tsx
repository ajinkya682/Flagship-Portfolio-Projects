import { Check } from 'lucide-react'

interface StatusStageItemProps {
  label: string
  status: 'completed' | 'current' | 'upcoming'
  isLast?: boolean
}

export default function StatusStageItem({ label, status, isLast = false }: StatusStageItemProps) {
  return (
    <div className="flex-1 relative">
      {/* Connector line (Desktop) */}
      {!isLast && (
        <div 
          className={`hidden md:block absolute top-[12px] left-[50%] w-full h-[2px] ${
            status === 'completed' ? 'bg-accent-500' : 'bg-neutral-200'
          }`}
        />
      )}
      
      {/* Connector line (Mobile vertical) */}
      {!isLast && (
        <div 
          className={`block md:hidden absolute left-[12px] top-[24px] w-[2px] h-[32px] ${
            status === 'completed' ? 'bg-accent-500' : 'bg-neutral-200'
          }`}
        />
      )}

      <div className="flex flex-row md:flex-col items-center md:justify-center gap-[12px] md:gap-[8px] relative z-10 mb-[24px] md:mb-0">
        <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 border-2 ${
          status === 'completed' ? 'bg-accent-500 border-accent-500 text-white' :
          status === 'current' ? 'bg-white border-accent-500' :
          'bg-white border-neutral-300'
        }`}>
          {status === 'completed' && <Check size={12} strokeWidth={3} />}
          {status === 'current' && <div className="w-[8px] h-[8px] bg-accent-500 rounded-full" />}
        </div>
        
        <span className={`font-body text-[13px] md:text-center ${
          status === 'upcoming' ? 'text-neutral-400 font-medium' : 'text-neutral-900 font-semibold'
        }`}>
          {label}
        </span>
      </div>
    </div>
  )
}
