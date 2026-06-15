'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Check } from 'lucide-react'
import { useState } from 'react'
import CheckoutModal from '@/components/marketing/CheckoutModal'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[800px] max-h-[90vh] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Upgrade Your Plan
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] overflow-y-auto flex flex-col items-center">
            
            <div className="flex bg-neutral-100 p-[4px] rounded-lg mb-[32px]">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors flex items-center gap-[6px] ${billingCycle === 'annual' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Annually <span className="text-[10px] bg-emerald-100 text-emerald-700 px-[6px] py-[2px] rounded-full uppercase tracking-wider font-bold">Save 20%</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              
              {/* Pro Plan */}
              <div 
                onClick={() => setSelectedPlan('pro')}
                className={`relative rounded-xl border p-[24px] cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/10' : 'border-[#E5E7EB] hover:border-neutral-300'}`}
              >
                <h3 className="text-[18px] font-bold text-neutral-900">Pro</h3>
                <div className="flex items-end gap-[4px] mt-[8px] mb-[16px]">
                  <span className="text-[32px] font-display font-bold text-neutral-900 leading-none">
                    ${billingCycle === 'annual' ? '199' : '249'}
                  </span>
                  <span className="text-[14px] text-neutral-500 mb-[4px]">/mo</span>
                </div>
                <p className="text-[13px] text-neutral-600 mb-[24px]">Perfect for growing teams that need advanced features.</p>
                
                <ul className="flex flex-col gap-[12px]">
                  {['Unlimited Active Jobs', '500 AI Screenings /mo', 'Advanced Analytics', 'Custom Pipelines', 'Slack Integration'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-[10px]">
                      <Check size={16} className="text-primary-500 mt-[2px] shrink-0" />
                      <span className="text-[13px] text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div 
                onClick={() => setSelectedPlan('enterprise')}
                className={`relative rounded-xl border p-[24px] cursor-pointer transition-all ${selectedPlan === 'enterprise' ? 'border-accent-500 ring-1 ring-accent-500 bg-accent-50/10' : 'border-[#E5E7EB] hover:border-neutral-300'}`}
              >
                <div className="absolute top-0 right-0 bg-accent-500 text-white px-[12px] py-[4px] rounded-bl-lg rounded-tr-lg text-[11px] font-bold uppercase tracking-wider">
                  Recommended
                </div>
                <h3 className="text-[18px] font-bold text-neutral-900">Enterprise</h3>
                <div className="flex items-end gap-[4px] mt-[8px] mb-[16px]">
                  <span className="text-[32px] font-display font-bold text-neutral-900 leading-none">
                    ${billingCycle === 'annual' ? '499' : '599'}
                  </span>
                  <span className="text-[14px] text-neutral-500 mb-[4px]">/mo</span>
                </div>
                <p className="text-[13px] text-neutral-600 mb-[24px]">For large organizations requiring maximum security and scale.</p>
                
                <ul className="flex flex-col gap-[12px]">
                  {['Everything in Pro', 'Unlimited AI Screenings', 'Custom AI Scoring Models', 'SSO / SAML', 'Dedicated Success Manager'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-[10px]">
                      <Check size={16} className="text-accent-500 mt-[2px] shrink-0" />
                      <span className="text-[13px] text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <span className="text-[13px] text-neutral-500 font-medium">
              You will be charged ${(selectedPlan === 'pro' ? (billingCycle === 'annual' ? 199 : 249) : (billingCycle === 'annual' ? 499 : 599)) * (billingCycle === 'annual' ? 12 : 1)} / {billingCycle === 'annual' ? 'year' : 'month'}.
            </span>
            <div className="flex items-center gap-[12px]">
              <Dialog.Close asChild>
                <button className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors shadow-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false)
          onClose()
        }}
        planName={selectedPlan === 'pro' ? 'Growth' : 'Enterprise'}
      />
    </Dialog.Root>
  )
}
