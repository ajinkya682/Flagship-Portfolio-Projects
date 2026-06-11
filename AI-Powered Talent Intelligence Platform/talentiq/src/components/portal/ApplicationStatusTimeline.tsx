import StatusStageItem from './StatusStageItem'

export default function ApplicationStatusTimeline() {
  const stages = [
    { label: 'Applied', status: 'completed' as const },
    { label: 'Screening', status: 'completed' as const },
    { label: 'Interview', status: 'current' as const },
    { label: 'Assessment', status: 'upcoming' as const },
    { label: 'Offer', status: 'upcoming' as const },
  ]

  return (
    <div className="bg-white p-[32px] border border-neutral-200 rounded-[16px] w-full flex flex-col md:flex-row md:justify-between items-start md:items-start relative">
      {stages.map((stage, i) => (
        <StatusStageItem key={i} label={stage.label} status={stage.status} isLast={i === stages.length - 1} />
      ))}
    </div>
  )
}
