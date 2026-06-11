import { AvatarStack } from '@/components/shared/AvatarStack'
import { Star } from 'lucide-react'

export default function HeroAvatarCluster() {
  const avatars = [
    '/images/avatars/avatar-1.jpg',
    '/images/avatars/avatar-2.jpg',
    '/images/avatars/avatar-3.jpg',
  ]

  return (
    <div className="flex items-center gap-3 mt-6">
      <AvatarStack
        urls={avatars}
        max={3}
        size={36}
        className="border-2 border-white"
      />
      <div className="flex flex-col">
        <span className="font-body text-[13px] font-semibold text-neutral-700 leading-tight">
          +2K recruiters
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
            ))}
          </div>
          <span className="font-body text-[12px] text-neutral-500 ml-1">
            4.9/5
          </span>
        </div>
      </div>
    </div>
  )
}
