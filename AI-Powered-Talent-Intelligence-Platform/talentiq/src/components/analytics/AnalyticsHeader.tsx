import DateRangePicker from './DateRangePicker'
import { Download } from 'lucide-react'

export default function AnalyticsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[32px]">
      <div>
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
          Analytics
        </h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
          Track key hiring metrics, pipeline health, and team performance.
        </p>
      </div>

      <div className="flex items-center gap-[12px]">
        <DateRangePicker />
        <button className="flex items-center gap-[8px] bg-transparent border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-[16px] py-[8px] rounded-md font-body text-[13px] font-medium transition-colors shadow-sm">
          <Download size={16} className="text-neutral-500" />
          Export CSV
        </button>
      </div>
    </div>
  )
}
