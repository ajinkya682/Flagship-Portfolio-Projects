'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-xl z-[200] transition-transform duration-250 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col">
          <Link
            href="/features"
            onClick={onClose}
            className="flex items-center h-14 w-full border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-800"
          >
            Features
          </Link>
          <Link
            href="/solutions"
            onClick={onClose}
            className="flex items-center h-14 w-full border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-800"
          >
            Solutions
          </Link>
          <Link
            href="/pricing"
            onClick={onClose}
            className="flex items-center h-14 w-full border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-800"
          >
            Pricing
          </Link>
          <Link
            href="/customers"
            onClick={onClose}
            className="flex items-center h-14 w-full font-body text-[16px] font-medium text-neutral-800"
          >
            Customers
          </Link>

          <div className="mt-auto py-6 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center h-12 w-full rounded-lg font-body text-[15px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="flex items-center justify-center h-12 w-full rounded-lg font-body text-[15px] font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
