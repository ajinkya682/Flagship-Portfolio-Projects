'use client'

import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import UserRow from '@/components/settings/UserRow'
import InviteUserModal from '@/components/settings/InviteUserModal'
import { useDomainStore } from '@/store/domain.store'

export default function UsersSettingsPage() {
  const { users } = useDomainStore()
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

      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[40px] flex flex-col items-center justify-center text-center">
          <div className="w-[48px] h-[48px] bg-primary-50 rounded-full flex items-center justify-center mb-[16px]">
            <Users size={24} className="text-primary-600" />
          </div>
          <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[8px]">No team members found</h3>
          <p className="font-body text-[13px] text-neutral-500 max-w-[300px] mb-[20px]">
            Invite your first team member to start collaborating on hiring.
          </p>
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
          >
            <Plus size={16} /> Invite User
          </button>
        </div>
      ) : (
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
                {users.map(user => (
                  <UserRow key={user.id} user={{...user, status: 'active', joinedAt: 'Just now'}} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  )
}
