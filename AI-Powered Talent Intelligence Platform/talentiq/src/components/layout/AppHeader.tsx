'use client'

import { useState } from 'react'
import { Search, Bell, Command, X, Sparkles, GitMerge, Briefcase } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    icon: Sparkles,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    title: '5 new AI matches for Senior Engineer',
    sub: 'Avg score 88 — ready to review',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    icon: GitMerge,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    title: 'Marcus Rodriguez moved to Interview',
    sub: 'by Alex Manager',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    icon: Briefcase,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
    title: 'Product Manager offer accepted',
    sub: 'David Chen accepted your offer 🎉',
    time: '3h ago',
    unread: false,
  },
]

export default function AppHeader() {
  const { user } = useCurrentUser()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between bg-white/80 backdrop-blur-md px-[16px] md:px-[32px] border-b border-neutral-100/80">
      <div className="flex items-center">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-[6px]">
        {/* Search — desktop */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-[8px] h-[36px] px-[12px] bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-[8px] text-[13px] text-neutral-400 transition-colors w-[240px] group"
        >
          <Search size={14} className="text-neutral-400 group-hover:text-neutral-500 shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <div className="flex items-center gap-[2px] shrink-0">
            <kbd className="h-[18px] px-[4px] bg-white border border-neutral-200 rounded-[4px] text-[10px] font-mono text-neutral-400 flex items-center">⌘</kbd>
            <kbd className="h-[18px] px-[4px] bg-white border border-neutral-200 rounded-[4px] text-[10px] font-mono text-neutral-400 flex items-center">K</kbd>
          </div>
        </button>

        {/* Notification Bell */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative w-[36px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-neutral-100 text-neutral-500 transition-colors">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-red-500 border-2 border-white animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[340px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-0 font-body overflow-hidden z-50"
          >
            <div className="px-[16px] py-[12px] border-b border-neutral-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[13px] text-neutral-900">Notifications</p>
                <p className="text-[11px] text-neutral-500 mt-[1px]">{unreadCount} unread</p>
              </div>
              <button className="text-[12px] font-medium text-primary-500 hover:text-primary-600 transition-colors">
                Mark all read
              </button>
            </div>

            <div className="flex flex-col">
              {MOCK_NOTIFICATIONS.map(notif => {
                const Icon = notif.icon
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-[12px] px-[16px] py-[12px] hover:bg-neutral-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className={`w-[34px] h-[34px] rounded-[8px] ${notif.iconBg} ${notif.iconColor} flex items-center justify-center shrink-0 mt-[1px]`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-neutral-900 leading-snug">{notif.title}</p>
                      <p className="text-[11px] text-neutral-500 mt-[2px]">{notif.sub}</p>
                    </div>
                    <div className="flex flex-col items-end gap-[4px] shrink-0">
                      <span className="text-[10px] text-neutral-400">{notif.time}</span>
                      {notif.unread && <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-[16px] py-[10px] border-t border-neutral-100">
              <button className="w-full text-center text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-300/30 overflow-hidden ml-[2px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-[13px] font-bold">
                  {user?.name?.charAt(0) || 'S'}
                </span>
              )}
              <span className="absolute bottom-[1px] right-[1px] w-[7px] h-[7px] rounded-full bg-emerald-400 border-[1.5px] border-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-[4px] font-body z-50 overflow-hidden">
            {/* User info */}
            <div className="px-[12px] py-[10px] mb-[4px]">
              <p className="text-[13px] font-semibold text-neutral-900">{user?.name || 'Sarah Recruiter'}</p>
              <p className="text-[11px] text-neutral-500 mt-[1px]">{user?.email || 'sarah@acme.com'}</p>
              <span className="inline-flex items-center gap-[4px] mt-[6px] text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 rounded-full px-[6px] py-[2px]">
                ⚡ Growth Plan
              </span>
            </div>
            <DropdownMenuSeparator className="my-[4px] bg-neutral-100 h-[1px]" />
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-[6px] px-[8px] py-[7px]">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-[6px] px-[8px] py-[7px]">
              Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-[6px] px-[8px] py-[7px]">
              Billing & Plan
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-[4px] bg-neutral-100 h-[1px]" />
            <DropdownMenuItem
              className="text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-[6px] px-[8px] py-[7px]"
              onClick={() => window.location.href = '/login'}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
