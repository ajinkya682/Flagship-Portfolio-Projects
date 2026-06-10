"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InviteUserModal } from "@/components/settings/InviteUserModal"

export default function TeamSettingsPage() {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)

  const users = [
    { name: "Sarah Chen", email: "sarah@acmecorp.com", role: "Admin", status: "Active", joined: "Oct 12, 2024", avatar: "https://i.pravatar.cc/150?u=a1" },
    { name: "Alex Kumar", email: "alex@acmecorp.com", role: "Recruiter", status: "Active", joined: "Oct 15, 2024", avatar: "https://i.pravatar.cc/150?u=a2" },
    { name: "Jessica Smith", email: "jessica@acmecorp.com", role: "Recruiter", status: "Active", joined: "Oct 16, 2024", avatar: "https://i.pravatar.cc/150?u=a3" },
    { name: "David Kim", email: "david@acmecorp.com", role: "Hiring Manager", status: "Inactive", joined: "Oct 18, 2024", avatar: "https://i.pravatar.cc/150?u=a4" },
  ]

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <div className="flex items-center justify-between mb-[32px]">
        <h1 className="font-display text-[24px] font-bold text-neutral-900">Team Members</h1>
        <Button onClick={() => setIsInviteOpen(true)} iconLeft={<Plus size={16} />}>
          Invite Member
        </Button>
      </div>
      
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white shadow-sm overflow-hidden mb-[32px]">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="py-[12px] px-[20px] text-[12px] font-medium text-neutral-500">User</th>
                <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Role</th>
                <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Status</th>
                <th className="py-[12px] px-[16px] text-[12px] font-medium text-neutral-500">Joined</th>
                <th className="py-[12px] px-[20px] text-[12px] font-medium text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="py-[16px] px-[20px]">
                    <div className="flex items-center gap-[12px]">
                      <img src={user.avatar} className="h-[36px] w-[36px] rounded-full object-cover" />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-neutral-900">{user.name}</span>
                        <span className="text-[13px] text-neutral-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <span className={`inline-flex items-center rounded-full px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-neutral-100 text-neutral-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-[16px] px-[16px] text-[14px] text-neutral-600">{user.joined}</td>
                  <td className="py-[16px] px-[20px] text-right">
                    <div className="flex items-center justify-end gap-[8px]">
                      <Button variant="ghost" className="h-[32px] px-2 text-[13px] font-medium text-neutral-700">Edit</Button>
                      <Button variant="ghost" className="h-[32px] px-2 text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50">Deactivate</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col">
        <h4 className="font-display text-[16px] font-semibold text-neutral-900 mb-[16px]">Pending Invitations</h4>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-neutral-200 bg-white p-[16px]">
            <div className="flex flex-col">
              <span className="font-body text-[14px] font-medium text-neutral-900">mike@acmecorp.com</span>
              <span className="font-body text-[13px] text-neutral-500">Sent Oct 19, 2024</span>
            </div>
            <div className="flex items-center gap-[12px]">
              <button className="font-body text-[13px] font-medium text-primary-600 hover:underline">Resend</button>
              <button className="font-body text-[13px] font-medium text-red-600 hover:underline">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />

    </div>
  )
}
