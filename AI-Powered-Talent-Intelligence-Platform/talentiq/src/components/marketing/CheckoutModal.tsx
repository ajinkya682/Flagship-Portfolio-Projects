'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  price: number
  billingPeriod: string
}

export default function CheckoutModal({ isOpen, onClose, planName, price, billingPeriod }: CheckoutModalProps) {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      if (!user?.company?.id) throw new Error('No company found')
      
      const newPlan = planName.toLowerCase() // 'enterprise' or 'growth'
      
      // Call our API to update billing
      const res = await api.patch(`/companies/${user.company.id}`, {
        billing: {
          plan: newPlan,
          billingCycle: billingPeriod === 'annual' ? 'annually' : 'monthly',
          status: 'active'
        }
      })
      
      // Update local state to immediately show new plan globally
      setUser({
        ...user,
        company: {
          ...user.company,
          billing: {
            plan: newPlan,
            status: 'active'
          }
        }
      })
      
      setIsSuccess(true)
      
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(false)
        onClose()
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Payment failed')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[450px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0 bg-neutral-50">
            <div className="flex items-center gap-[8px]">
              <CreditCard size={20} className="text-blue-600" />
              <Dialog.Title className="text-[18px] font-bold text-neutral-900">
                Complete Purchase
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md disabled:opacity-50" disabled={isSubmitting || isSuccess}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] flex flex-col gap-[24px] relative">
            {isSuccess && (
              <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center animate-in fade-in">
                <div className="w-[64px] h-[64px] bg-emerald-100 rounded-full flex items-center justify-center mb-[16px]">
                  <CheckCircle2 size={32} className="text-emerald-500 animate-bounce" />
                </div>
                <p className="font-display font-bold text-[22px] text-neutral-900">Payment Successful!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[8px] max-w-[250px]">
                  Welcome to the {planName} plan. Redirecting you to your dashboard...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-neutral-50 rounded-xl p-[16px] border border-neutral-100">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[14px] font-semibold text-neutral-900">{planName} Plan</span>
                <span className="text-[16px] font-bold text-neutral-900">${price}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-neutral-500 pb-[12px] border-b border-neutral-200 border-dashed">
                <span>Billing Period</span>
                <span className="capitalize">{billingPeriod}</span>
              </div>
              <div className="flex items-center justify-between pt-[12px]">
                <span className="text-[14px] font-bold text-neutral-900">Total Due Today</span>
                <span className="text-[18px] font-extrabold text-blue-600">${price}</span>
              </div>
            </div>

            {/* Mock Payment Details */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Card Information</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="•••• •••• •••• 4242"
                    readOnly
                    className="w-full h-[44px] rounded-md border border-neutral-200 pl-[38px] pr-[12px] text-[14px] text-neutral-600 bg-neutral-50 font-mono focus:outline-none"
                    disabled={isSubmitting || isSuccess}
                  />
                  <CreditCard size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>
              
              <div className="flex gap-[12px]">
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-neutral-700">Expiry</label>
                  <input 
                    type="text" 
                    value="12/25"
                    readOnly
                    className="w-full h-[44px] rounded-md border border-neutral-200 px-[12px] text-[14px] text-neutral-600 bg-neutral-50 font-mono focus:outline-none text-center"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-neutral-700">CVC</label>
                  <input 
                    type="text" 
                    value="123"
                    readOnly
                    className="w-full h-[44px] rounded-md border border-neutral-200 px-[12px] text-[14px] text-neutral-600 bg-neutral-50 font-mono focus:outline-none text-center"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Name on Card</label>
                <input 
                  type="text" 
                  value="Sarah Recruiter"
                  readOnly
                  className="w-full h-[44px] rounded-md border border-neutral-200 px-[12px] text-[14px] text-neutral-600 bg-neutral-50 focus:outline-none"
                  disabled={isSubmitting || isSuccess}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-[6px] justify-center mt-[4px]">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">Payments are secure and encrypted</span>
            </div>
          </div>

          <div className="p-[24px] pt-0 shrink-0">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess}
              className="w-full h-[48px] text-[15px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${price}`
              )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
