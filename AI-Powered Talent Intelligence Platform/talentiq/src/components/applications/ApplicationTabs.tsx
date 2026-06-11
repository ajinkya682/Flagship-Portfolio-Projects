import { cn } from '@/lib/utils'

export const TABS = [
  'Overview',
  'Resume',
  'AI Assessment',
  'Interviews',
  'Scorecards',
  'Notes',
  'Activity',
  'Emails'
] as const

export type ApplicationTab = typeof TABS[number]

interface ApplicationTabsProps {
  activeTab: ApplicationTab
  onTabChange: (tab: ApplicationTab) => void
}

export default function ApplicationTabs({ activeTab, onTabChange }: ApplicationTabsProps) {
  return (
    <div className="flex border-b border-[#E5E7EB] overflow-x-auto thin-scrollbar bg-white px-[24px]">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "font-body text-[14px] px-[20px] py-[16px] whitespace-nowrap transition-colors border-b-[2px]",
            activeTab === tab
              ? "border-primary-500 text-primary-700 font-medium"
              : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200 font-normal"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
