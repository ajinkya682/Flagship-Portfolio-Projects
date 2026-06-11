'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { formatDate } from '@/lib/utils'

export default function WelcomeGreeting() {
  const { user } = useCurrentUser()
  const hour = new Date().getHours()
  
  let greeting = 'Good evening'
  if (hour < 12) {
    greeting = 'Good morning'
  } else if (hour < 18) {
    greeting = 'Good afternoon'
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'User'

  return (
    <div className="flex flex-col gap-[4px]">
      <h1 className="font-body text-[14px] text-neutral-500 italic">
        {greeting}, {firstName}
      </h1>
      <span className="font-body text-[14px] text-neutral-500">
        {formatDate(new Date().toISOString())}
      </span>
    </div>
  )
}
