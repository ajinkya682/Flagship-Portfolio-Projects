'use client'

import { Bell, Calendar, Video, Mail, CheckCircle2 } from 'lucide-react'

const INTEGRATIONS = [
  {
    id: 'notifications',
    name: 'Smart Notifications',
    description: 'Receive real-time notifications for new applications, scorecards, and team mentions.',
    icon: <Bell size={24} className="text-amber-500" />,
    color: 'bg-amber-50',
    borderColor: 'border-amber-100',
    status: 'Active'
  },
  {
    id: 'calendar',
    name: 'Calendar & Scheduling',
    description: 'Sync interviews and check team availability directly in TalentIQ.',
    icon: <Calendar size={24} className="text-blue-500" />,
    color: 'bg-blue-50',
    borderColor: 'border-blue-100',
    status: 'Active'
  },
  {
    id: 'video',
    name: 'Video Interview Rooms',
    description: 'Host secure video calls with our built-in interview rooms. No external links needed.',
    icon: <Video size={24} className="text-purple-500" />,
    color: 'bg-purple-50',
    borderColor: 'border-purple-100',
    status: 'Active'
  },
  {
    id: 'email',
    name: 'Email Integration',
    description: 'Send and track candidate emails directly from the platform professionally.',
    icon: <Mail size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    status: 'Active'
  }
]

export default function IntegrationsSettingsPage() {
  return (
    <div className="flex flex-col gap-[32px] max-w-[1000px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Integrations & Features</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your active platform features and external connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px] flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-[16px]">
              <div className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center \${integration.color} border \${integration.borderColor}`}>
                {integration.icon}
              </div>
              <div className="flex items-center gap-[6px] px-[10px] py-[4px] bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold tracking-wide">
                <CheckCircle2 size={14} /> {integration.status}
              </div>
            </div>
            
            <h3 className="font-display text-[18px] font-bold text-neutral-900 mb-[8px]">{integration.name}</h3>
            <p className="font-body text-[14px] text-neutral-500 leading-relaxed mb-[24px] flex-1">
              {integration.description}
            </p>
            
            <div className="pt-[16px] border-t border-neutral-100">
              <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Manage Configuration →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
