'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import api from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export default function Step2InviteTeam({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { user } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'recruiter' })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users')
      setMembers(data)
    } catch (err) {
      console.error('Failed to fetch team members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.post('/users', inviteForm)
      await fetchMembers()
      setIsInviteOpen(false)
      setInviteForm({ name: '', email: '', role: 'recruiter' })
    } catch (err) {
      console.error('Failed to invite user:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
            Team Members
          </h1>
          <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
            Manage access and roles for your recruiting team.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-[40px] px-4 bg-[#3B58F6] hover:bg-[#2e45c7] text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Invite User
        </button>
      </div>

      {isInviteOpen && (
        <div className="mb-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-900">Invite New User</h3>
            <button onClick={() => setIsInviteOpen(false)} className="text-neutral-400 hover:text-neutral-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleInvite} className="flex flex-col gap-4">
            <p className="text-[14px] text-neutral-500 mb-2">Send an email invitation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-neutral-700">Full Name</label>
                <input
                  required
                  value={inviteForm.name}
                  onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="h-[40px] px-3 border border-neutral-200 rounded-lg text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-neutral-700">Email Address</label>
                <input
                  required
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="jane@company.com"
                  className="h-[40px] px-3 border border-neutral-200 rounded-lg text-[14px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-[13px] font-semibold text-neutral-700">Role</label>
              <select
                value={inviteForm.role}
                onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
                className="h-[40px] px-3 border border-neutral-200 rounded-lg text-[14px] w-full md:w-1/2"
              >
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="h-[40px] px-4 border border-neutral-200 text-neutral-600 font-medium rounded-lg hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[40px] px-6 bg-[#3B58F6] hover:bg-[#2e45c7] text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">User</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Joined</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center"><LoadingSpinner size="md" className="mx-auto text-primary-500" /></td>
                </tr>
              ) : members.map((member) => (
                <tr key={member.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[14px]">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-[15px] text-neutral-900">{member.name || 'Invited User'}</div>
                        <div className="text-[13px] text-neutral-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[14px] text-neutral-700 capitalize">
                    {member.role}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold tracking-wide uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[14px] text-neutral-500">
                    Just now
                  </td>
                  <td className="py-4 px-6 text-right text-[13px] italic text-neutral-400">
                    {member.id === user?.id ? 'Account Creator' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-[16px] mt-8 pt-6 border-t border-neutral-100">
        <button type="button" onClick={onBack} className="h-[48px] px-[24px] border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
          Back
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="flex-1 h-[48px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
