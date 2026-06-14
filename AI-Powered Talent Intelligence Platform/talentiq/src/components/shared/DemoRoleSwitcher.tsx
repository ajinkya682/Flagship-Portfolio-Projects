'use client'

import { useState } from 'react'
import { ChevronUp, Users, Check } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { DEMO_USERS, type DemoUser } from '@/mock-data/users'

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  admin:          { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  recruiter:      { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  'hiring-manager': { bg: 'bg-amber-50', text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  viewer:         { bg: 'bg-neutral-50', text: 'text-neutral-700',border: 'border-neutral-200', dot: 'bg-neutral-400'},
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  recruiter: 'Recruiter',
  'hiring-manager': 'Hiring Manager',
  viewer: 'Viewer',
}

export default function DemoRoleSwitcher() {
  const [open, setOpen] = useState(false)
  const { demoRole, switchRole } = useAuthStore()

  const currentRole = demoRole || DEMO_USERS[0]
  const colors = ROLE_COLORS[currentRole.role] || ROLE_COLORS['viewer']

  const handleSwitch = (user: DemoUser) => {
    switchRole(user)
    setOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Expanded Popover */}
      {open && (
        <div className="bg-white rounded-[16px] border border-neutral-200 shadow-2xl w-[280px] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center gap-2">
            <Users size={14} className="text-blue-400" />
            <p className="text-[12px] font-bold text-white">Demo Mode — Switch Role</p>
            <span className="ml-auto text-[10px] font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
              DEMO
            </span>
          </div>

          {/* User List */}
          <div className="py-2">
            {DEMO_USERS.filter(u => u.role !== 'viewer' || u.id !== 'user_5').map(user => {
              const isActive = currentRole.id === user.id
              const uc = ROLE_COLORS[user.role] || ROLE_COLORS['viewer']
              
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitch(user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                    isActive ? 'bg-blue-50' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-[8px] object-cover"
                    />
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                        <Check size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[13px] font-semibold text-neutral-900 truncate">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${uc.dot}`} />
                      <span className="font-body text-[11px] text-neutral-500">{ROLE_LABELS[user.role]}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/50">
            <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
              Switch roles to explore different user perspectives. All data is simulated for demo purposes.
            </p>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full border shadow-lg transition-all hover:shadow-xl active:scale-95 ${colors.bg} ${colors.border}`}
        title="Switch demo role"
      >
        <img
          src={currentRole.avatar}
          alt={currentRole.name}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
        />
        <div className="flex flex-col items-start">
          <span className={`font-body text-[11px] font-bold ${colors.text} leading-none`}>
            {currentRole.name.split(' ')[0]}
          </span>
          <span className={`font-body text-[10px] ${colors.text} opacity-70 leading-none mt-0.5`}>
            {ROLE_LABELS[currentRole.role]}
          </span>
        </div>
        <ChevronUp
          size={12}
          className={`${colors.text} opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}
