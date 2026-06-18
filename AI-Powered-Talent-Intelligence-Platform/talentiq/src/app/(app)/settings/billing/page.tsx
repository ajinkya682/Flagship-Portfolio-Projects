'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { CheckCircle2, Download, CreditCard } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small teams hiring their first few employees.',
    price: '$29',
    period: '/month',
    billed: 'Billed annually',
    features: [
      '3 active jobs',
      '5 team seats',
      '200 AI scores per month',
      'Basic analytics dashboard',
      'Email notifications'
    ],
    buttonText: 'Current Plan',
    buttonClass: 'bg-neutral-100 text-neutral-600 border-neutral-200 cursor-default',
    isPopular: false
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Everything you need to scale your hiring process reliably.',
    price: '$59',
    period: '/month',
    billed: 'Billed annually',
    features: [
      '15 active jobs',
      '20 team seats',
      '1000 AI scores per month',
      'Full AI suite with bias detection',
      'Slack & calendar integrations',
      'Custom Pipelines'
    ],
    buttonText: 'Upgrade to Growth',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Advanced security and unlimited power for large orgs.',
    price: '$99',
    period: '/month',
    billed: 'Billed annually',
    features: [
      'Unlimited jobs & seats',
      'Unlimited AI scoring',
      'API access with full docs',
      'SSO & audit logs',
      'Dedicated success manager'
    ],
    buttonText: 'Contact Sales',
    buttonClass: 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200',
    isPopular: false
  }
]

const BILLING_HISTORY = [
  { id: 'INV-001', date: 'Jun 01, 2026', amount: '$29.00', status: 'Paid', plan: 'Starter Plan' },
  { id: 'INV-002', date: 'May 01, 2026', amount: '$29.00', status: 'Paid', plan: 'Starter Plan' },
  { id: 'INV-003', date: 'Apr 01, 2026', amount: '$29.00', status: 'Paid', plan: 'Starter Plan' },
]

export default function BillingSettingsPage() {
  const { user } = useCurrentUser()
  const currentPlanId = user?.company?.billing?.plan || 'starter'

  return (
    <div className="flex flex-col gap-[48px] max-w-[1100px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Billing & Plans</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your subscription, usage, and invoices.</p>
      </div>

      {/* Plans Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.id
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-[24px] flex flex-col transition-all duration-300
                \${plan.isPopular ? 'border-2 border-blue-500 shadow-lg scale-[1.02]' : 'border border-neutral-200 shadow-sm'}
              `}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-[16px] py-[4px] bg-blue-500 text-white text-[12px] font-bold tracking-wider uppercase rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="p-[32px] border-b border-neutral-100 flex flex-col gap-[16px]">
                <div>
                  <h3 className="font-display text-[22px] font-bold text-neutral-900">{plan.name}</h3>
                  <p className="font-body text-[13px] text-neutral-500 mt-[6px] h-[40px] leading-relaxed">{plan.tagline}</p>
                </div>
                
                <div className="mt-[8px]">
                  <div className="flex items-end gap-[4px]">
                    <span className="font-display text-[40px] font-bold text-neutral-900 leading-none">{plan.price}</span>
                    <span className="font-body text-[14px] text-neutral-500 mb-[6px]">{plan.period}</span>
                  </div>
                  <p className="font-body text-[12px] text-neutral-400 mt-[4px]">{plan.billed}</p>
                </div>
                
                <button 
                  className={`mt-[16px] w-full h-[44px] rounded-[10px] font-body text-[14px] font-bold transition-colors border \${
                    isCurrentPlan ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default' : plan.buttonClass
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
              
              <div className="p-[32px] flex-1">
                <ul className="flex flex-col gap-[16px]">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-[12px]">
                      <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-[2px]" />
                      <span className="font-body text-[14px] text-neutral-700 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment Method & Billing History */}
      <div className="bg-white rounded-[20px] border border-neutral-200 shadow-sm overflow-hidden mb-[64px]">
        <div className="p-[24px] md:p-[32px] border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <div>
            <h2 className="font-display text-[18px] font-bold text-neutral-900">Payment Method</h2>
            <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Securely manage your payment details.</p>
          </div>
          <button className="h-[36px] px-[16px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-[8px] text-[13px] font-semibold transition-colors shadow-sm">
            Update Payment Method
          </button>
        </div>
        
        <div className="p-[24px] md:p-[32px] border-b border-neutral-100 flex items-center gap-[16px]">
          <div className="w-[56px] h-[36px] bg-neutral-50 border border-neutral-200 rounded-[6px] flex items-center justify-center">
            <CreditCard size={24} className="text-neutral-600" />
          </div>
          <div>
            <p className="font-body text-[14px] font-bold text-neutral-900">•••• •••• •••• 4242</p>
            <p className="font-body text-[12px] text-neutral-500">Expires 12/2028</p>
          </div>
        </div>

        <div>
          <div className="p-[24px] md:p-[32px] border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="font-display text-[18px] font-bold text-neutral-900">Billing History</h2>
            <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Download previous invoices.</p>
          </div>
          <div className="divide-y divide-neutral-100">
            {BILLING_HISTORY.map((invoice) => (
              <div key={invoice.id} className="p-[20px] md:px-[32px] hover:bg-neutral-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-[24px]">
                  <div>
                    <p className="font-body text-[14px] font-bold text-neutral-900">{invoice.date}</p>
                    <p className="font-body text-[13px] text-neutral-500">{invoice.plan}</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="px-[10px] py-[4px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-bold tracking-wide uppercase">
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[24px]">
                  <span className="font-body text-[15px] font-semibold text-neutral-900">{invoice.amount}</span>
                  <button className="text-neutral-400 hover:text-blue-600 transition-colors flex items-center gap-[6px]">
                    <Download size={16} />
                    <span className="hidden sm:inline font-body text-[13px] font-medium">Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
