interface InterviewEventProps {
  title: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function InterviewEvent({ title, status }: InterviewEventProps) {
  const getBgColor = () => {
    switch (status) {
      case 'scheduled': return 'bg-accent-500'
      case 'completed': return 'bg-neutral-600'
      case 'cancelled': return 'bg-neutral-300'
      default: return 'bg-accent-500'
    }
  }

  return (
    <div className={`h-[24px] rounded-[4px] px-[8px] flex items-center overflow-hidden ${getBgColor()}`}>
      <span className={`text-[12px] text-white font-medium truncate ${status === 'cancelled' ? 'line-through opacity-80' : ''}`}>
        {title}
      </span>
    </div>
  )
}
