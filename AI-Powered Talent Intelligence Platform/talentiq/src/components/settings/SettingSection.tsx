import { ReactNode } from 'react'

interface SettingSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export default function SettingSection({ title, description, children }: SettingSectionProps) {
  return (
    <div className="flex flex-col gap-[16px] mb-[32px] pb-[32px] border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0">
      <div className="flex flex-col gap-[4px]">
        <h3 className="font-display text-[18px] font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="font-body text-[14px] text-neutral-500">{description}</p>
        )}
      </div>
      <div className="mt-[8px]">
        {children}
      </div>
    </div>
  )
}
