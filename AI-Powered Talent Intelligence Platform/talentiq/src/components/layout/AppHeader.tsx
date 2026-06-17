'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Bell, Sparkles, GitMerge, Briefcase, FileText, ClipboardList, User, X, CheckCircle2 } from 'lucide-react'
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
import { Settings, CreditCard, LogOut, Menu } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from './GlobalSearch'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'

interface AppNotification {
  _id: string
  type: string
  title: string
  message: string
  isRead: boolean
  linkHref?: string
  createdAt: string
}

function getNotifIcon(type: string) {
  switch (type) {
    case 'offer_accepted': return { Icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    case 'offer_declined': return { Icon: X, color: 'text-red-500', bg: 'bg-red-50' }
    case 'offer_sent': return { Icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' }
    case 'candidate_message': return { Icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' }
    case 'hire_accepted': return { Icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' }
    case 'hire_declined': return { Icon: X, color: 'text-orange-500', bg: 'bg-orange-50' }
    case 'assignment_submitted': return { Icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50' }
    case 'new_application': return { Icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    case 'stage_changed': return { Icon: GitMerge, color: 'text-blue-500', bg: 'bg-blue-50' }
    default: return { Icon: Briefcase, color: 'text-neutral-500', bg: 'bg-neutral-50' }
  }
}

function timeAgo(dateStr: string) {
  if (!dateStr) return 'just now'
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AppHeader() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { logout } = useAuth()
  const { setMobileSidebarOpen } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=20')
      if (res.ok) {
        const data = await res.json()
        setNotifications(Array.isArray(data) ? data : [])
      }
    } catch {
      // Silent
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds as fallback
    pollRef.current = setInterval(fetchNotifications, 30000)

    let socket: Socket | null = null;
    fetch('/api/socket/io').finally(() => {
      socket = io({ path: '/api/socket/io' });
      socket.on('new_notification', (notif: AppNotification) => {
        setNotifications(prev => [notif, ...prev.filter(n => n._id !== notif._id)]);
      });
    });

    return () => { 
      if (pollRef.current) clearInterval(pollRef.current)
      if (socket) socket.disconnect();
    }
  }, [])

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/all/read', { method: 'PATCH' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch {}
  }

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between bg-white/80 backdrop-blur-md px-[16px] md:px-[32px] border-b border-neutral-100/80">
        <div className="flex items-center gap-[12px]">
          <button
            className="md:hidden flex items-center justify-center w-[36px] h-[36px] rounded-[8px] hover:bg-neutral-100 text-neutral-500 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
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

          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden flex items-center justify-center w-[36px] h-[36px] rounded-[8px] hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <Search size={18} />
          </button>

          {/* Notification Bell */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative w-[36px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-neutral-100 text-neutral-500 transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-[6px] right-[6px] min-w-[16px] h-[16px] rounded-full bg-red-500 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center px-[2px]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[360px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-0 font-body overflow-hidden z-50"
            >
              <div className="px-[16px] py-[12px] border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[13px] text-neutral-900">Notifications</p>
                  <p className="text-[11px] text-neutral-500 mt-[1px]">{unreadCount} unread</p>
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-[12px] font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Mark all read
                </button>
              </div>

              <div className="flex flex-col max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-[16px] py-[32px] text-center">
                    <Bell size={24} className="text-neutral-200 mx-auto mb-[8px]" />
                    <p className="text-[13px] text-neutral-400">No notifications yet</p>
                  </div>
                ) : notifications.map(notif => {
                  const { Icon, color, bg } = getNotifIcon(notif.type)
                  return (
                    <div
                      key={notif._id}
                      onClick={async () => {
                        handleMarkRead(notif._id)
                        if (notif.linkHref) {
                          setNotifOpen(false)
                          router.push(notif.linkHref)
                        }
                      }}
                      className={`flex items-start gap-[12px] px-[16px] py-[12px] hover:bg-neutral-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-[34px] h-[34px] rounded-[8px] ${bg} ${color} flex items-center justify-center shrink-0 mt-[1px]`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-neutral-900 leading-snug">{notif.title}</p>
                        <p className="text-[11px] text-neutral-500 mt-[2px] line-clamp-2">{notif.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-[4px] shrink-0">
                        <span className="text-[10px] text-neutral-400">{timeAgo(notif.createdAt)}</span>
                        {!notif.isRead && <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="px-[16px] py-[10px] border-t border-neutral-100">
                <button
                  onClick={fetchNotifications}
                  className="w-full text-center text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Refresh notifications
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
            <DropdownMenuContent align="end" className="w-[220px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-0 font-body z-50 overflow-hidden">
              <div className="px-[12px] py-[10px] mb-[4px]">
                <p className="text-[13px] font-semibold text-neutral-900">{user?.name || 'Sarah Recruiter'}</p>
                <p className="text-[11px] text-neutral-500 mt-[1px]">{user?.email || 'sarah@acme.com'}</p>
                <span className="inline-flex items-center gap-[4px] mt-[6px] text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 rounded-full px-[6px] py-[2px]">
                  Growth Plan
                </span>
              </div>
              <DropdownMenuSeparator className="bg-neutral-100 h-[1px] m-0" />

              <div className="p-[4px]">
                <DropdownMenuItem asChild>
                  <Link href="/settings/users" className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer transition-colors outline-none">
                    <User size={14} className="text-neutral-400" /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer transition-colors outline-none">
                    <Settings size={14} className="text-neutral-400" /> Workspace Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/billing" className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer transition-colors outline-none">
                    <CreditCard size={14} className="text-neutral-400" /> Billing and Plan
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-neutral-100 h-[1px] m-0" />

              <div className="p-[4px]">
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] text-[13px] text-red-600 hover:bg-red-50 cursor-pointer transition-colors outline-none text-left"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
