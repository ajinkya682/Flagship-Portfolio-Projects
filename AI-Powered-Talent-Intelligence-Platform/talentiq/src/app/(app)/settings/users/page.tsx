'use client'

import { useState, useEffect } from 'react'
import { UserPlus, MoreVertical, Shield, Mail, Check, X, Plus } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  lastActiveAt?: string
  createdAt?: string
}

export default function TeamMembersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)
    
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
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowInviteModal(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsInviting(false)
    }
  }

  const formatJoined = (dateStr?: string) => {
    if (!dateStr) return 'Just now'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Just now'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 30) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-[32px] max-w-[1000px] mb-[64px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Team Members</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage access and roles for your recruiting team.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="h-[40px] px-[20px] bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] text-[14px] font-medium transition-colors shadow-sm flex items-center justify-center gap-[6px]"
        >
          <Plus size={16} /> Invite User
        </button>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-white">
                <th className="font-body text-[11px] font-bold text-neutral-500 tracking-wider uppercase py-[16px] px-[24px]">USER</th>
                <th className="font-body text-[11px] font-bold text-neutral-500 tracking-wider uppercase py-[16px] px-[24px]">ROLE</th>
                <th className="font-body text-[11px] font-bold text-neutral-500 tracking-wider uppercase py-[16px] px-[24px]">STATUS</th>
                <th className="font-body text-[11px] font-bold text-neutral-500 tracking-wider uppercase py-[16px] px-[24px]">JOINED</th>
                <th className="font-body text-[11px] font-bold text-neutral-500 tracking-wider uppercase py-[16px] px-[24px] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-[48px] text-center">
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-[48px] text-center">
                    <p className="font-body text-[14px] text-neutral-500">No team members found.</p>
                  </td>
                </tr>
              ) : (
                users.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50/50 transition-colors">
                    
                    {/* USER COLUMN */}
                    <td className="py-[16px] px-[24px]">
                      <div className="flex items-center gap-[12px]">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-[36px] h-[36px] rounded-full object-cover border border-neutral-200 shadow-sm shrink-0" 
                          />
                        ) : (
                          <div className="w-[36px] h-[36px] rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="font-display text-[14px] font-bold text-blue-700 uppercase">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-body text-[14px] font-bold text-neutral-900 truncate">{member.name}</span>
                          <span className="font-body text-[13px] text-neutral-500 truncate">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROLE COLUMN */}
                    <td className="py-[16px] px-[24px]">
                      <select 
                        defaultValue={member.role}
                        className="h-[32px] px-[12px] bg-white border border-neutral-200 rounded-[6px] text-[13px] font-medium text-neutral-700 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer"
                      >
                        <option value="admin">Admin</option>
                        <option value="hiring-manager">Hiring Manager</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>

                    {/* STATUS COLUMN */}
                    <td className="py-[16px] px-[24px]">
                      <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold uppercase tracking-wider">
                        ACTIVE
                      </span>
                    </td>

                    {/* JOINED COLUMN */}
                    <td className="py-[16px] px-[24px]">
                      <span className="font-body text-[13px] text-neutral-500">
                        {formatJoined(member.createdAt)}
                      </span>
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="py-[16px] px-[24px] text-right">
                      <div className="flex items-center justify-end gap-[16px]">
                        <button className="font-body text-[13px] text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
                          Edit
                        </button>
                        <button className="font-body text-[13px] text-red-500 hover:text-red-700 font-medium transition-colors">
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[24px] bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[400px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-[24px] border-b border-neutral-100">
              <div>
                <h3 className="font-display text-[18px] font-bold text-neutral-900">Invite New User</h3>
                <p className="font-body text-[13px] text-neutral-500 mt-[2px]">Send an email invitation.</p>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-[24px] flex flex-col gap-[20px]">
              {error && (
                <div className="p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body flex items-start gap-[8px]">
                  <X size={16} className="shrink-0 mt-[2px]" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="p-[12px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-[8px] text-[13px] font-body flex items-start gap-[8px]">
                  <Check size={16} className="shrink-0 mt-[2px]" />
                  <span>Invitation sent successfully!</span>
                </div>
              )}

              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-bold text-neutral-700">Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Jane Doe" 
                  required 
                  className="h-[44px] px-[14px] bg-white border border-neutral-200 hover:border-neutral-300 rounded-[10px] text-[14px] font-body focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-bold text-neutral-700">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="jane@company.com" 
                  required 
                  className="h-[44px] px-[14px] bg-white border border-neutral-200 hover:border-neutral-300 rounded-[10px] text-[14px] font-body focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-bold text-neutral-700">Role</label>
                <select 
                  name="role" 
                  required
                  defaultValue="recruiter"
                  className="h-[44px] px-[14px] bg-white border border-neutral-200 hover:border-neutral-300 rounded-[10px] text-[14px] font-body focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="admin">Admin - Full Access</option>
                  <option value="hiring-manager">Hiring Manager</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="viewer">Viewer - Read Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-[12px] mt-[8px]">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="h-[40px] px-[16px] text-neutral-600 hover:bg-neutral-100 rounded-[8px] text-[14px] font-medium font-body transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isInviting}
                  className="h-[40px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[8px] text-[14px] font-bold font-body transition-colors flex items-center justify-center shadow-sm"
                >
                  {isInviting ? <LoadingSpinner size="sm" /> : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
