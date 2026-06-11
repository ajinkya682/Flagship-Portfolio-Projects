interface UsageBarProps {
  label: string
  current: number
  limit: number
}

export default function UsageBar({ label, current, limit }: UsageBarProps) {
  const percent = Math.min((current / limit) * 100, 100)
  
  const getFillColor = () => {
    if (percent >= 100) return 'bg-red-500'
    if (percent >= 80) return 'bg-amber-500'
    return 'bg-primary-500'
  }

  return (
    <div className="flex flex-col gap-[8px] font-body w-full">
      <div className="flex justify-between items-center text-[13px]">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className="text-neutral-500">
          <span className="font-semibold text-neutral-900">{current.toLocaleString()}</span> / {limit.toLocaleString()}
        </span>
      </div>
      
      <div className="h-[8px] w-full bg-neutral-100 rounded-full overflow-hidden flex">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${getFillColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent >= 80 && (
        <div className="flex justify-between items-center mt-[4px]">
          <span className={`text-[12px] ${percent >= 100 ? 'text-red-600' : 'text-amber-600'}`}>
            {percent >= 100 ? 'Limit reached' : 'Approaching limit'}
          </span>
          <button className="text-[12px] font-medium text-primary-500 hover:underline">
            Upgrade for more
          </button>
        </div>
      )}
    </div>
  )
}
