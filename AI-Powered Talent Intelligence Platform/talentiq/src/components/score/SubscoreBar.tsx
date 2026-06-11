import { getScoreColor } from '@/lib/score'

export default function SubscoreBar({
  label,
  score,
}: {
  label: string
  score: number
}) {
  const color = getScoreColor(score)

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1 text-[13px]">
        <span className="font-medium text-neutral-700">{label}</span>
        <span className="font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
