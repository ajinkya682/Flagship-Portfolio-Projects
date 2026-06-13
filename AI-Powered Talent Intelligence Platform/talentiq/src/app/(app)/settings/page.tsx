'use client'

import { useState } from 'react'
import {
  Settings as SettingsIcon, Users, CreditCard, Shield,
  Link as LinkIcon, Bell, ChevronRight, Upload, Plus,
  CheckCircle2, AlertTriangle, Blocks
} from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'

const TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'users', label: 'Team & Users', icon: Users },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Blocks },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { settings, updateSettings } = useDomainStore()
  
  const handleSettingsSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    updateSettings({
      companyName: formData.get('companyName') as string,
      companySlug: formData.get('companySlug') as string,
    })
    // Optionally show a toast notification here
  }

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">
      {/* Header */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-neutral-100 bg-white shrink-0">
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Settings</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your workspace, team, and preferences.</p>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="md:w-[240px] bg-white border-r border-neutral-100 p-[16px] overflow-y-auto shrink-0 border-b md:border-b-0 flex md:flex-col gap-[4px]">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-[10px] w-full px-[12px] py-[10px] rounded-[10px] transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon size={16} className={activeTab === tab.id ? 'text-blue-600' : 'text-neutral-400'} />
                <span className="font-body text-[13px]">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-[16px] md:p-[32px]">
          <div className="max-w-[800px] w-full">

            {activeTab === 'general' && (
              <div className="flex flex-col gap-[24px]">
                {/* Logo */}
                <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
                  <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[4px]">Workspace Logo</h3>
                  <p className="font-body text-[13px] text-neutral-500 mb-[16px]">This logo will appear on your career site and emails.</p>
                  <div className="flex items-center gap-[20px]">
                    <div className="w-[80px] h-[80px] rounded-[16px] border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer group">
                      <Upload size={20} className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <button className="h-[34px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[12px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors">
                        Upload Image
                      </button>
                      <p className="font-body text-[11px] text-neutral-400 mt-[8px]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSettingsSave} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
                  <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px]">Workspace Details</h3>
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-body text-[13px] font-semibold text-neutral-700">Workspace Name</label>
                      <input name="companyName" type="text" defaultValue={settings.companyName} className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-body text-[13px] font-semibold text-neutral-700">Career Site URL</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-[12px] bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-[8px] text-[13px] text-neutral-500 font-mono">
                          talentiq.co/careers/
                        </span>
                        <input name="companySlug" type="text" defaultValue={settings.companySlug} className="flex-1 h-[40px] px-[12px] bg-white border border-neutral-200 rounded-r-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[24px] pt-[20px] border-t border-neutral-100">
                    <button type="submit" className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-[20px] border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-neutral-900">Team Members</h3>
                    <p className="font-body text-[13px] text-neutral-500 mt-[2px]">Manage access and roles for your team.</p>
                  </div>
                  <button className="h-[36px] px-[16px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center gap-[6px]">
                    <Plus size={14} /> Invite
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100">
                      <th className="text-left px-[20px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase">User</th>
                      <th className="text-left px-[20px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase">Role</th>
                      <th className="text-right px-[20px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Sarah Recruiter', email: 'sarah@acme.com', role: 'Admin', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
                      { name: 'Alex Manager', email: 'alex@acme.com', role: 'Hiring Manager', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
                      { name: 'Jordan Lee', email: 'jordan@acme.com', role: 'Interviewer', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
                    ].map(u => (
                      <tr key={u.email} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-[20px] py-[16px]">
                          <div className="flex items-center gap-[12px]">
                            <img src={u.avatar} alt="" className="w-[36px] h-[36px] rounded-full" />
                            <div>
                              <p className="font-body text-[13px] font-semibold text-neutral-900">{u.name}</p>
                              <p className="font-body text-[12px] text-neutral-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-[20px] py-[16px]">
                          <span className="px-[10px] py-[4px] rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold">{u.role}</span>
                        </td>
                        <td className="px-[20px] py-[16px] text-right">
                          <span className="text-[12px] text-emerald-600 font-semibold flex items-center justify-end gap-[4px]">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="flex flex-col gap-[24px]">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[16px] p-[24px] text-white shadow-xl">
                  <div className="flex items-start justify-between mb-[24px]">
                    <div>
                      <span className="inline-block px-[10px] py-[4px] rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wide border border-blue-500/30 mb-[8px]">Current Plan</span>
                      <h2 className="font-display text-[28px] font-bold leading-none">Growth</h2>
                      <p className="font-body text-[14px] text-neutral-400 mt-[6px]">Perfect for scaling teams.</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[32px] font-bold leading-none">$299</p>
                      <p className="font-body text-[12px] text-neutral-400 mt-[2px]">per month</p>
                    </div>
                  </div>
                  <div className="mb-[24px]">
                    <div className="flex justify-between font-body text-[13px] mb-[6px]">
                      <span className="text-neutral-300">Active Jobs (12/20)</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <div className="h-[6px] bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <button className="h-[36px] px-[16px] bg-white text-neutral-900 font-body text-[13px] font-bold rounded-[8px] hover:bg-neutral-100 transition-colors">
                      Upgrade Plan
                    </button>
                    <button className="h-[36px] px-[16px] bg-white/10 text-white font-body text-[13px] font-semibold rounded-[8px] hover:bg-white/20 transition-colors border border-white/20">
                      View Invoices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {[
                  { name: 'Slack', desc: 'Get notifications in Slack channels', connected: true, color: 'text-purple-600', bg: 'bg-purple-100' },
                  { name: 'Google Calendar', desc: 'Sync interview schedules', connected: true, color: 'text-blue-500', bg: 'bg-blue-100' },
                  { name: 'Zoom', desc: 'Auto-generate meeting links', connected: false, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { name: 'Greenhouse', desc: 'Sync candidates and jobs', connected: false, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                ].map(int => (
                  <div key={int.name} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[20px] flex flex-col">
                    <div className="flex items-center gap-[12px] mb-[12px]">
                      <div className={`w-[40px] h-[40px] rounded-[10px] ${int.bg} flex items-center justify-center`}>
                        <Blocks size={20} className={int.color} />
                      </div>
                      <div>
                        <h4 className="font-display text-[15px] font-bold text-neutral-900">{int.name}</h4>
                        <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-full uppercase tracking-wider ${int.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {int.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-[12px] text-neutral-500 mb-[20px] flex-1">{int.desc}</p>
                    <button className={`h-[34px] w-full rounded-[8px] font-body text-[12px] font-semibold transition-colors border ${int.connected ? 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}>
                      {int.connected ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
