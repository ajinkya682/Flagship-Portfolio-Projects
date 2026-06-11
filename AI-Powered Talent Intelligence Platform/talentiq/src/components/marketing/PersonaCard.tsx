import { ElementType } from 'react'
import { CheckCircle } from 'lucide-react'

interface PersonaCardProps {
  icon: ElementType
  iconColor: string
  iconBg: string
  title: string
  pain: string
  solution: string
  bullets: string[]
}

export default function PersonaCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  pain,
  solution,
  bullets,
}: PersonaCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      
      <h3 className="font-display text-[17px] font-semibold text-neutral-900 mt-4 leading-tight">
        {title}
      </h3>
      
      <p className="font-body text-[13px] text-neutral-500 italic mt-2 leading-relaxed">
        {pain}
      </p>
      
      <p className="font-body text-[13px] font-medium text-neutral-700 mt-2 leading-relaxed">
        {solution}
      </p>
      
      <div className="w-full h-[1px] bg-neutral-100 my-4" />
      
      <div className="flex flex-col gap-2 mt-auto">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-[3px]" />
            <span className="font-body text-[12px] text-neutral-700 leading-snug">{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
