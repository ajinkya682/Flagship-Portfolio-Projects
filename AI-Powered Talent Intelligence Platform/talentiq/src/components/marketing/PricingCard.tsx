import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PricingCardProps {
  planName: string
  price: string
  period?: string
  subLine: string
  features: string[]
  buttonText: string
  isFeatured?: boolean
  className?: string
}

export function PricingCard({
  planName,
  price,
  period = "/month",
  subLine,
  features,
  buttonText,
  isFeatured = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[var(--radius-xl)] p-8",
        isFeatured
          ? "bg-primary-900 text-white shadow-xl lg:scale-105 lg:p-9" // #0A2540
          : "bg-white text-neutral-900 shadow-sm border border-neutral-200",
        className
      )}
    >
      {isFeatured && (
        <div className="absolute -top-3 right-6 rounded-full bg-accent-500 px-3.5 py-1.5 font-body text-[10px] font-semibold tracking-wide text-white uppercase shadow-sm">
          Most Popular
        </div>
      )}

      {/* Header section */}
      <div className="mb-4">
        <h4
          className={cn(
            "font-body text-[11px] font-semibold uppercase tracking-wider",
            isFeatured ? "text-white/70" : "text-neutral-500"
          )}
        >
          {planName}
        </h4>
        <div className="mt-4 flex items-baseline">
          <span className="font-display text-[36px] font-extrabold leading-none tracking-tight">
            {price}
          </span>
          <span
            className={cn(
              "ml-1 font-body text-[15px] font-medium",
              isFeatured ? "text-white/70" : "text-neutral-500"
            )}
          >
            {period}
          </span>
        </div>
        <p
          className={cn(
            "mt-2 font-body text-[14px]",
            isFeatured ? "text-white/70" : "text-neutral-600"
          )}
        >
          {subLine}
        </p>
      </div>

      <div
        className={cn(
          "my-6 h-px w-full",
          isFeatured ? "bg-white/10" : "bg-neutral-100"
        )}
      />

      {/* Features list */}
      <ul className="flex flex-col gap-3 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2
              size={18}
              className={cn(
                "mt-0.5 shrink-0",
                isFeatured ? "text-accent-400" : "text-accent-500"
              )}
            />
            <span
              className={cn(
                "font-body text-[14px]",
                isFeatured ? "text-white" : "text-neutral-700"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={isFeatured ? "secondary" : "primary"}
        size="large"
        className={cn(
          "mt-8 w-full",
          isFeatured &&
            "bg-white text-primary-600 hover:bg-neutral-50 hover:text-primary-700 border-none shadow-sm"
        )}
      >
        {buttonText}
      </Button>
    </div>
  )
}
