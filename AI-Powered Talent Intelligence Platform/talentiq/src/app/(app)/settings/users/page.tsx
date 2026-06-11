'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import UserRow from '@/components/settings/UserRow'
import InviteUserModal from '@/components/settings/InviteUserModal'

const MOCK_USERS = [
  { id: '1', name: 'Sarah Recruiter', email: 'sarah@acme.com', role: 'Admin', status: 'active' as const, joinedAt: 'Oct 12, 2023' },
  { id: '2', name: 'Alex Manager', email: 'alex@acme.com', role: 'Hiring Manager', status: 'active' as const, joinedAt: 'Oct 15, 2023' },
  { id: '3', name: 'Jordan Lee', email: 'jordan@acme.com', role: 'Recruiter', status: 'active' as const, joinedAt: 'Oct 18, 2023' },
  { id: '4', name: 'Taylor Smith', email: 'taylor@acme.com', role: 'Viewer', status: 'invited' as const, joinedAt: 'Pending' },
]

export default function UsersSettingsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Team Members</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage access and roles for your recruiting team.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} /> Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse font-body">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Role</th>
                <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Joined</th>
                <th className="px-[16px] py-[12px] text-[12px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(user => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  )
}
