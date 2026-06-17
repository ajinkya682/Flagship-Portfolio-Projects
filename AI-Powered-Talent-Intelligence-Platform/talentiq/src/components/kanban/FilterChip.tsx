import { X } from 'lucide-react'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-primary-100 text-primary-700 rounded-full font-body text-[12px] font-medium px-[10px] py-[3px]">
      {label}
      <button 
        onClick={onRemove}
        className="w-[14px] h-[14px] rounded-full hover:bg-primary-200 flex items-center justify-center transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  )
}
