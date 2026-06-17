import { Slack, Mail, Calendar, Video, ArrowRight } from 'lucide-react'
import SettingSection from '@/components/settings/SettingSection'

const INTEGRATIONS = [
  { id: 'slack', name: 'Slack', description: 'Receive notifications for new applications and scorecard submissions.', icon: Slack, connected: true },
  { id: 'gcal', name: 'Google Calendar', description: 'Sync interviews and check team availability directly in TalentIQ.', icon: Calendar, connected: true },
  { id: 'zoom', name: 'Zoom', description: 'Automatically generate video links for scheduled interviews.', icon: Video, connected: false },
  { id: 'gmail', name: 'Gmail', description: 'Send and track candidate emails directly from the platform.', icon: Mail, connected: false },
]

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Integrations</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Connect TalentIQ with your favorite tools.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
        <SettingSection title="Connected Apps">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {INTEGRATIONS.map(integration => (
              <div key={integration.id} className="flex items-start gap-[16px] p-[16px] border border-neutral-200 rounded-lg bg-white font-body">
                <div className={`w-[48px] h-[48px] rounded-md flex items-center justify-center shrink-0 ${integration.connected ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
                  <integration.icon size={24} />
                </div>
                <div className="flex flex-col gap-[4px] flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-neutral-900">{integration.name}</span>
                    {integration.connected ? (
                      <span className="px-[8px] py-[2px] rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">Connected</span>
                    ) : null}
                  </div>
                  <p className="text-[13px] text-neutral-500 line-clamp-2 leading-snug">{integration.description}</p>
                  
                  <div className="mt-[12px]">
                    {integration.connected ? (
                      <button className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                        Configure
                      </button>
                    ) : (
                      <button className="text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-[4px]">
                        Connect <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SettingSection>
      </div>
    </div>
  )
}
