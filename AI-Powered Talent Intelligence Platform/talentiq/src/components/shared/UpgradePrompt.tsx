import * as React from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UpgradePrompt({ 
  title = "Unlock AI Insights", 
  description = "Upgrade to Pro to unlock advanced AI scoring, automated interview generation, and predictive pipeline analytics.",
  onUpgrade 
}: { 
  title?: string, 
  description?: string, 
  onUpgrade?: () => void 
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-gradient-to-r from-primary-900 to-primary-800 p-6 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-400" />
          <h3 className="font-display text-[16px] font-bold text-white">{title}</h3>
        </div>
        <p className="mt-2 max-w-xl font-body text-[14px] text-primary-200 leading-relaxed">
          {description}
        </p>
      </div>
      <Button 
        variant="primary" 
        className="shrink-0 bg-white text-primary-900 hover:bg-neutral-100"
        iconRight={<ArrowRight size={16} />}
        onClick={onUpgrade}
      >
        Upgrade Now
      </Button>
    </div>
  )
}
