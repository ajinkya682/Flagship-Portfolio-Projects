import * as React from "react"

export function WelcomeGreeting({ name }: { name: string }) {
  // Determine greeting based on current time
  const hour = new Date().getHours()
  let greeting = "Good evening"
  if (hour < 12) greeting = "Good morning"
  else if (hour < 17) greeting = "Good afternoon"

  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const today = new Date().toLocaleDateString('en-US', dateOptions)

  return (
    <div className="flex flex-col">
      <span className="font-body text-[14px] italic text-neutral-500">
        {greeting}, {name}.
      </span>
      <h1 className="mt-1 font-display text-[36px] font-bold text-neutral-900 leading-tight">
        Dashboard
      </h1>
      <span className="mt-1 font-body text-[14px] text-neutral-500">
        {today}
      </span>
    </div>
  )
}
