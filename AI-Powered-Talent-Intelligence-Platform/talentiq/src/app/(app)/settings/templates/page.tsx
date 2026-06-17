import { Plus, Mail, FileText } from 'lucide-react'
import SettingSection from '@/components/settings/SettingSection'

const TEMPLATES = [
  { id: '1', name: 'Initial Screen Invite', subject: 'Interview Request: TalentIQ Technologies', type: 'email' },
  { id: '2', name: 'Rejection (Post-Screen)', subject: 'Update on your application', type: 'email' },
  { id: '3', name: 'Offer Letter (Standard)', subject: 'Offer from TalentIQ', type: 'document' },
]

export default function TemplatesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Templates</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage email and document templates.</p>
        </div>
        <button 
          className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
        <SettingSection title="Active Templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {TEMPLATES.map(template => (
              <div key={template.id} className="border border-neutral-200 rounded-lg p-[16px] font-body hover:border-primary-500 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-[12px]">
                  <div className={`w-[32px] h-[32px] rounded-md flex items-center justify-center ${template.type === 'email' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                    {template.type === 'email' ? <Mail size={16} /> : <FileText size={16} />}
                  </div>
                  <button className="text-neutral-400 hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-all text-[12px] font-medium">Edit</button>
                </div>
                <h4 className="text-[15px] font-bold text-neutral-900 mb-[4px]">{template.name}</h4>
                <p className="text-[13px] text-neutral-500 truncate" title={template.subject}>{template.subject}</p>
              </div>
            ))}
          </div>
        </SettingSection>
      </div>
    </div>
  )
}
