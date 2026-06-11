import Image from 'next/image'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  authorName: string
  authorTitle: string
  authorAvatar?: string
  metric: string
}

export default function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  authorAvatar,
  metric,
}: TestimonialCardProps) {
  const initials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2)

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
        ))}
      </div>
      
      <span className="text-[40px] font-extrabold text-[#BFDBFE] leading-none -mb-2 block">
        &quot;
      </span>
      
      <p className="font-body text-[17px] text-neutral-900 italic max-w-[340px] flex-grow leading-relaxed">
        {quote}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full shadow-xs bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
          {authorAvatar ? (
            <Image src={authorAvatar} alt={authorName} width={44} height={44} className="object-cover" />
          ) : (
            <span className="font-display text-[14px] font-bold text-neutral-500">{initials}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-body text-[14px] font-semibold text-neutral-900">{authorName}</span>
          <span className="font-body text-[12px] text-neutral-500">{authorTitle}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100">
        <span className="font-body text-[14px] font-bold text-[#10B981]">
          {metric}
        </span>
      </div>
    </div>
  )
}
