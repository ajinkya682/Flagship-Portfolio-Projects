'use client'

import { useState, useEffect } from 'react'
import { UserPlus, MoreVertical, Shield, Mail } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

export default function TeamMembersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch team members')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsInviting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to invite user')
      }
      const newUser = await res.json()
      setUsers([newUser, ...users])
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="flex flex-col gap-[32px] max-w-[1000px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Team Members</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Invite and manage your recruiting team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Invite Form */}
        <div className="lg:col-span-1 flex flex-col gap-[24px]">
          <form onSubmit={handleInvite} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
            <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px] flex items-center gap-[8px]">
              <UserPlus size={18} className="text-blue-500" />
              Invite Member
            </h3>
            
            {error && (
              <div className="mb-[16px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Full Name</label>
                <input name="name" type="text" placeholder="Jane Doe" required className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Email Address</label>
                <input name="email" type="email" placeholder="jane@company.com" required className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Role</label>
                <select name="role" defaultValue="recruiter" className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="hiring-manager">Hiring Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            
            <div className="mt-[24px] pt-[20px] border-t border-neutral-100 flex justify-end">
              <button type="submit" disabled={isInviting} className="w-full h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center justify-center gap-[8px]">
                {isInviting ? <LoadingSpinner size="sm" /> : <><Mail size={16} /> Send Invite</>}
              </button>
            </div>
          </form>
        </div>

        {/* Member List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-[20px] border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-neutral-900">Active Members</h3>
              <span className="px-[10px] py-[2px] bg-neutral-200 text-neutral-600 rounded-full text-[12px] font-bold">
                {users.length}
              </span>
            </div>
            
            <div className="divide-y divide-neutral-100">
              {loading ? (
                <div className="p-[40px] flex justify-center"><LoadingSpinner /></div>
              ) : users.length === 0 ? (
                <div className="p-[40px] text-center text-neutral-500 text-[14px]">No team members found.</div>
              ) : (
                users.map(u => (
                  <div key={u.id} className="p-[16px] hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-[16px]">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-[40px] h-[40px] rounded-full object-cover border border-neutral-200" />
                      ) : (
                        <div className="w-[40px] h-[40px] bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200 flex items-center justify-center font-bold uppercase text-[14px]">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-body text-[14px] font-bold text-neutral-900">{u.name}</h4>
                        <p className="font-body text-[13px] text-neutral-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <div className="hidden md:flex items-center gap-[6px] px-[10px] py-[4px] bg-neutral-100 rounded-[6px] text-[12px] font-semibold text-neutral-600 capitalize">
                        {u.role === 'admin' && <Shield size={12} className="text-blue-500" />}
                        {u.role.replace('-', ' ')}
                      </div>
                      <button className="text-neutral-400 hover:text-neutral-700 p-[4px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
