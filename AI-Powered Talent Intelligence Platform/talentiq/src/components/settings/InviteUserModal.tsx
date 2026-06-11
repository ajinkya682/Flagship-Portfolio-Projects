'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[400px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Invite Team Member
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Email Address</label>
              <input 
                type="email" 
                placeholder="colleague@company.com" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Role</label>
              <select className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white">
                <option value="viewer">Viewer</option>
                <option value="hiring_manager">Hiring Manager</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors w-full sm:w-auto">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors shadow-sm w-full sm:w-auto"
            >
              Send Invitation
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
