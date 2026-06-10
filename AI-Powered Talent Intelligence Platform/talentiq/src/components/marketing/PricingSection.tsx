"use client"

import * as React from "react"
import { Shield, Globe, X } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { PricingToggle } from "./PricingToggle"
import { PricingCard } from "./PricingCard"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(true)

  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-neutral-50 py-[96px]">
        <div className="mx-auto max-w-[1040px] px-5 md:px-10 lg:px-[80px]">
          
          <div className="mx-auto max-w-[600px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              TRANSPARENT PRICING
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
              Simple plans that scale with you.
            </h2>
            <p className="mt-4 font-body text-[20px] text-neutral-600 leading-[32px]">
              No hidden fees, no complex tiers. Start free, upgrade when you need to.
            </p>
          </div>

          <div className="mt-8">
            <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
            
            <PricingCard
              planName="Starter"
              price={isAnnual ? "$79" : "$99"}
              subLine="Perfect for small teams starting to scale their hiring."
              features={[
                "Up to 3 active jobs",
                "5 team members",
                "200 AI candidate scores/mo",
                "Basic analytics dashboard"
              ]}
              buttonText="Start free trial"
            />

            {/* Growth Plan - Featured */}
            <div className="relative z-10 md:scale-[1.04]">
              <PricingCard
                planName="Growth"
                price={isAnnual ? "$239" : "$299"}
                subLine="For growing companies that need full AI power."
                features={[
                  "Up to 15 active jobs",
                  "20 team members",
                  "1,000 AI candidate scores/mo",
                  "Explainable AI reasoning",
                  "Slack & Calendar integrations"
                ]}
                buttonText="Start free trial"
                isFeatured={true}
              />
            </div>

            <PricingCard
              planName="Enterprise"
              price="Custom"
              subLine="For large organizations needing custom workflows."
              features={[
                "Unlimited active jobs",
                "Unlimited team members",
                "Unlimited AI candidate scores",
                "Custom API access",
                "SSO (SAML) & Audit logs",
                "Dedicated success manager"
              ]}
              buttonText="Contact sales"
            />

          </div>

          {/* Trust Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-neutral-400" />
              <span className="font-body text-[12px] text-neutral-500">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-neutral-400" />
              <span className="font-body text-[12px] text-neutral-500">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <X size={14} className="text-neutral-400" />
              <span className="font-body text-[12px] text-neutral-500">Cancel anytime</span>
            </div>
          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
