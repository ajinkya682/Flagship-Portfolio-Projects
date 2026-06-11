interface ActivityItemProps {
  text: string
  timestamp: string
  type: 'ai' | 'manual'
  isLast?: boolean
}

export default function ActivityItem({ text, timestamp, type, isLast = false }: ActivityItemProps) {
  const isAi = type === 'ai'
  
  return (
    <div className="h-[40px] flex items-center gap-[12px] px-[8px] hover:bg-neutral-50 rounded-md relative cursor-default group">
      <div className="relative flex items-center justify-center w-[6px] h-[6px] shrink-0">
        <div className={`w-[6px] h-[6px] rounded-full z-10 ${isAi ? 'bg-accent-500' : 'bg-primary-500'}`} />
        {!isLast && (
          <div className="absolute top-[6px] bottom-[-34px] w-[1px] border-l border-dashed border-neutral-200 z-0" />
        )}
      </div>
      
      <span className="font-body text-[13px] text-neutral-900 truncate flex-grow">
        {text}
      </span>
      
      <span className="font-body text-[11px] text-neutral-400 shrink-0 ml-auto">
        {timestamp}
      </span>
    </div>
  )
}
