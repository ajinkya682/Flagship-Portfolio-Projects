"use client";

import { useState } from "react";
import { ShieldCheck, Globe, X, Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "annual",
  );

  const plans = [
    {
      id: "starter",
      name: "Starter",
      priceMonthly: 99,
      priceAnnual: 79,
      description: "Perfect for small teams hiring their first few employees.",
      features: [
        "3 active jobs",
        "5 team seats",
        "200 AI scores per month",
        "Basic analytics dashboard",
        "Email notifications",
      ],
      ctaText: "Start Free Trial",
      isPopular: false,
    },
    {
      id: "growth",
      name: "Growth",
      priceMonthly: 299,
      priceAnnual: 249, // Shown in your UI image
      description: "Everything you need to scale your hiring process reliably.",
      features: [
        "15 active jobs",
        "20 team seats",
        "1000 AI scores per month",
        "Full AI suite with bias detection",
        "Slack & calendar integrations",
      ],
      ctaText: "Start Free Trial",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      priceMonthly: 999,
      priceAnnual: 899,
      description: "Advanced security and unlimited power for large orgs.",
      features: [
        "Unlimited jobs & seats",
        "Unlimited AI scoring",
        "API access with full docs",
        "SSO & audit logs",
        "Dedicated success manager",
      ],
      ctaText: "Contact Sales",
      isPopular: false,
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-24 md:py-32 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3B58F6]/10 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center">
          {/* Premium Badge Pill */}
          <div className="inline-flex items-center gap-2 h-8 bg-white border border-neutral-200/80 rounded-full px-3.5 shadow-sm mb-6">
            <Tag className="w-3.5 h-3.5 text-[#3B58F6]" />
            <span className="font-body text-[12px] font-bold text-neutral-600 tracking-wider uppercase">
              Transparent Pricing
            </span>
          </div>

          <h2 className="font-display text-[36px] md:text-[48px] font-extrabold text-[#0A101D] mt-2 leading-[1.1] tracking-tight">
            Simple plans that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
              scale with you.
            </span>
          </h2>
          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-6 leading-relaxed max-w-[600px]">
            Choose the right plan for your team size. All plans include core ATS
            features and real-time collaboration.
          </p>

          {/* Custom Animated Pricing Toggle */}
          <div className="mt-10 inline-flex items-center p-1.5 bg-neutral-200/60 rounded-full border border-neutral-200/80 shadow-inner">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "relative w-[120px] h-10 rounded-full font-body text-[14px] font-semibold transition-all duration-300 z-10",
                billingPeriod === "monthly"
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={cn(
                "relative w-[120px] h-10 rounded-full font-body text-[14px] font-semibold transition-all duration-300 z-10 flex items-center justify-center gap-2",
                billingPeriod === "annual"
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              Annually
              {/* Discount Badge */}
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors",
                  billingPeriod === "annual"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-neutral-200 text-neutral-500",
                )}
              >
                -20%
              </span>
            </button>
            {/* Sliding Pill Indicator */}
            <div
              className="absolute w-[120px] h-10 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                transform: `translateX(${billingPeriod === "annual" ? "100%" : "0"})`,
              }}
            />
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1100px] mx-auto items-stretch">
          {plans.map((plan) => {
            const price =
              billingPeriod === "annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-[24px] p-8 md:p-10 flex flex-col h-full transition-all duration-300",
                  plan.isPopular
                    ? "border-2 border-[#3B58F6] shadow-[0_24px_60px_-15px_rgba(59,88,246,0.15)] md:-translate-y-4"
                    : "border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                )}
              >
                {/* "Most Popular" Badge (Exact match to image) */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-8 bg-[#3B58F6] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <h3
                  className={cn(
                    "font-display text-[22px] font-bold tracking-tight",
                    plan.isPopular ? "text-[#3B58F6]" : "text-neutral-900",
                  )}
                >
                  {plan.name}
                </h3>
                <p className="font-body text-[14px] text-neutral-500 mt-2 leading-relaxed min-h-[44px]">
                  {plan.description}
                </p>

                {/* Pricing Display */}
                <div className="mt-6 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[48px] font-extrabold text-[#3B58F6] leading-none tracking-tight">
                      ${price}
                    </span>
                    <span className="font-body text-[15px] font-medium text-neutral-500">
                      /month
                    </span>
                  </div>
                  <p className="font-body text-[13px] font-medium text-neutral-400 mt-2 h-5">
                    {billingPeriod === "annual"
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-8 flex flex-col gap-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10B981] shrink-0 stroke-[2.5]" />
                      <span className="font-body text-[14px] text-neutral-600 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Call to Action Button */}
                <button
                  className={cn(
                    "mt-10 w-full h-12 rounded-xl font-body text-[15px] font-bold transition-all duration-300",
                    plan.isPopular
                      ? "bg-[#3B58F6] text-white hover:bg-[#2e45c7] shadow-[0_4px_14px_rgba(59,88,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,88,246,0.4)] hover:-translate-y-0.5"
                      : "bg-transparent text-[#3B58F6] border border-[#3B58F6]/20 hover:bg-blue-50/50 hover:border-[#3B58F6]/40",
                  )}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Row */}
        <div className="mt-16 pt-8 border-t border-neutral-200/60 flex justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-neutral-400" />
            <span className="font-body text-[14px] font-medium text-neutral-500">
              SOC 2 Type II
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-neutral-400" />
            <span className="font-body text-[14px] font-medium text-neutral-500">
              GDPR Compliant
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <X className="w-5 h-5 text-neutral-400" />
            <span className="font-body text-[14px] font-medium text-neutral-500">
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
