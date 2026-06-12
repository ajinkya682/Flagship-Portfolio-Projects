'use client'

import { useState } from 'react'
import { ShieldCheck, Globe, X } from 'lucide-react'
import PricingToggle from './PricingToggle'
import PremiumPricingCard from './PremiumPricingCard'

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section className="bg-[#F9FAFB] py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12">
        
        {/* Header */}
        <div className="max-w-[600px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-neutral-500 tracking-widest uppercase">
            TRANSPARENT PRICING
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 mt-3 leading-tight tracking-tight">
            Simple plans that scale with you.
          </h2>
          <p className="font-body text-[17px] text-neutral-600 mt-4 leading-relaxed">
            Choose the right plan for your team size. All plans include core ATS features and real-time collaboration.
          </p>
          
          <PricingToggle billingPeriod={billingPeriod} onToggle={setBillingPeriod} />
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1100px] mx-auto items-stretch">
          <PremiumPricingCard
            isAnnual={billingPeriod === 'annual'}
            plan={{
              id: 'starter',
              name: "Starter",
              priceMonthly: 99,
              priceAnnual: 79,
              description: "Perfect for small teams hiring their first few employees.",
              features: [
                '3 active jobs',
                '5 team seats',
                '200 AI scores per month',
                'Basic analytics dashboard',
                'Email notifications',
                'Candidate portal',
                'Standard support'
              ],
              ctaText: "Start Free Trial"
            }}
          />
          
          <PremiumPricingCard
            isAnnual={billingPeriod === 'annual'}
            plan={{
              id: 'growth',
              name: "Growth",
              priceMonthly: 299,
              priceAnnual: 249,
              description: "Everything you need to scale your hiring process reliably.",
              isPopular: true,
              features: [
                '15 active jobs',
                '20 team seats',
                '1000 AI scores per month',
                'Full AI suite with bias detection',
                'Slack & calendar integrations',
                'Advanced analytics',
                'Priority support',
                'Custom pipeline stages'
              ],
              ctaText: "Start Free Trial"
            }}
          />
          
          <PremiumPricingCard
            isAnnual={billingPeriod === 'annual'}
            plan={{
              id: 'enterprise',
              name: "Enterprise",
              priceMonthly: 999,
              priceAnnual: 899,
              description: "Advanced security and unlimited power for large organizations.",
              features: [
                'Unlimited jobs & seats',
                'Unlimited AI scoring',
                'API access with full docs',
                'SSO & audit logs',
                'Dedicated success manager',
                'SLA guarantee',
                'Custom integrations'
              ],
              ctaText: "Contact Sales"
            }}
          />
        </div>

        {/* Trust Row */}
        <div className="mt-12 flex justify-center gap-6 md:gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-400" />
            <span className="font-body text-[13px] font-medium text-neutral-500">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-400" />
            <span className="font-body text-[13px] font-medium text-neutral-500">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-neutral-400" />
            <span className="font-body text-[13px] font-medium text-neutral-500">Cancel anytime</span>
          </div>
        </div>

      </div>
    </section>
  )
}
