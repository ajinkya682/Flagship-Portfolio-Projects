'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2 } from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const { addUser } = useDomainStore()
  
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = () => {
    if (!email) return
    setIsSubmitting(true)
    
    // Simulate network request
    setTimeout(() => {
      // Create user
      const name = email.split('@')[0].split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
      
      addUser({
        id: `user_${Math.random().toString(36).substring(2, 10)}`,
        email: email,
        name: name,
        role: role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      })
      
      setIsSubmitting(false)
      setIsSuccess(true)
      
      // Auto close after showing success
      setTimeout(() => {
        handleClose()
      }, 1500)
    }, 800)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setEmail('')
      setRole('viewer')
      setIsSuccess(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[400px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Invite Team Member
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md disabled:opacity-50" disabled={isSubmitting || isSuccess}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] flex flex-col gap-[20px] relative">
            {/* Success Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center animate-in fade-in">
                <CheckCircle2 size={48} className="text-emerald-500 mb-[12px] animate-bounce" />
                <p className="font-display font-bold text-[18px] text-neutral-900">Invite Sent!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[4px] px-[20px]">
                  {email} has been invited to join your team.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>
            
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                disabled={isSubmitting || isSuccess}
              >
                <option value="viewer">Viewer</option>
                <option value="hiring_manager">Hiring Manager</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button 
                className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors w-full sm:w-auto disabled:opacity-50"
                disabled={isSubmitting || isSuccess}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess || !email}
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
