'use client'

interface InterviewKitSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function InterviewKitSelector({ value, onChange }: InterviewKitSelectorProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[13px] font-semibold text-neutral-700">Interview Kit</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
      >
        <option value="" disabled>Select a kit template</option>
        <option value="technical">Technical Screen</option>
        <option value="culture">Culture Fit</option>
        <option value="system">System Design</option>
        <option value="behavioral">Behavioral</option>
        <option value="executive">Executive Round</option>
      </select>
    </div>
  )
}
