'use client'

import { Search, Bell } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AppHeader() {
  const { user } = useCurrentUser()

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between bg-white px-[16px] md:px-[32px] border-b border-[#E5E7EB]">
      <div className="flex items-center">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-[8px]">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-[10px] top-[10px] text-neutral-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="w-[280px] h-[36px] pl-[32px] pr-[12px] bg-neutral-50 hover:bg-neutral-100 border border-transparent focus:border-primary-300 focus:bg-white rounded-md text-[13px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="w-[36px] h-[36px] flex items-center justify-center rounded-md hover:bg-neutral-50 text-neutral-500 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-accent-500 border-2 border-white"></span>
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-[32px] h-[32px] rounded-full bg-neutral-200 border border-neutral-200 overflow-hidden ml-[4px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-neutral-500 text-[12px] font-medium bg-neutral-100">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-white rounded-md shadow-lg border border-neutral-100 p-[4px] font-body z-50">
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-sm px-[8px] py-[6px]">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-sm px-[8px] py-[6px]">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] font-medium text-neutral-700 focus:bg-neutral-50 focus:text-neutral-900 cursor-pointer rounded-sm px-[8px] py-[6px]">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-[4px] bg-neutral-100 h-[1px]" />
            <DropdownMenuItem className="text-[13px] font-medium text-[#DC2626] focus:bg-red-50 focus:text-[#DC2626] cursor-pointer rounded-sm px-[8px] py-[6px]" onClick={() => window.location.href = '/login'}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
