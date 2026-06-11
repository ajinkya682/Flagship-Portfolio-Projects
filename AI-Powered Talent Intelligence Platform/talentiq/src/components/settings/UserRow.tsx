'use client'

interface UserRowProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    status: 'active' | 'inactive' | 'invited'
    joinedAt: string
  }
}

export default function UserRow({ user }: UserRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-[8px] py-[2px] rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">Active</span>
      case 'inactive': return <span className="px-[8px] py-[2px] rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-bold uppercase tracking-wider">Inactive</span>
      case 'invited': return <span className="px-[8px] py-[2px] rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider">Invited</span>
      default: return null
    }
  }

  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors h-[64px]">
      <td className="px-[16px] py-[12px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[36px] h-[36px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[14px]">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-body text-[14px] font-semibold text-neutral-900">{user.name}</span>
            <span className="font-body text-[13px] text-neutral-500">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-[16px] py-[12px]">
        <select 
          defaultValue={user.role}
          className="h-[32px] rounded-md border border-neutral-200 px-[8px] font-body text-[13px] focus:outline-none focus:border-primary-500 bg-white"
        >
          <option value="Viewer">Viewer</option>
          <option value="Hiring Manager">Hiring Manager</option>
          <option value="Recruiter">Recruiter</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
      <td className="px-[16px] py-[12px]">
        {getStatusBadge(user.status)}
      </td>
      <td className="px-[16px] py-[12px] font-body text-[13px] text-neutral-500">
        {user.joinedAt}
      </td>
      <td className="px-[16px] py-[12px]">
        <div className="flex justify-end gap-[8px]">
          <button className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 px-[8px] py-[4px] rounded-md transition-colors">
            Edit
          </button>
          <button className="text-[13px] font-medium text-[#DC2626] hover:text-[#B91C1C] px-[8px] py-[4px] rounded-md transition-colors">
            Deactivate
          </button>
        </div>
      </td>
    </tr>
  )
}
