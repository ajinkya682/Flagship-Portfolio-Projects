import * as React from "react"
import { ArrowRight, Shield, CreditCard, Zap } from "lucide-react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { Button } from "@/components/ui/button"

export function FinalCTASection() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-white pb-[96px] pt-[32px]">
        <div className="mx-auto max-w-[900px] px-5 md:px-[80px]">
          
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] p-[60px] md:p-[80px] text-center shadow-lg"
               style={{ background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)" }}>
            
            {/* Decorative circle */}
            <div className="absolute -bottom-[150px] -right-[150px] h-[300px] w-[300px] rounded-full bg-white/[0.06] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-display text-[32px] md:text-[40px] font-[800] leading-tight text-white tracking-tight">
                Ready to transform your hiring?
              </h2>
              <p className="mt-4 font-body text-[18px] md:text-[20px] text-white/85">
                Join 500+ companies making faster, fairer decisions.
              </p>

              <div className="mt-[32px] flex justify-center">
                <Button 
                  size="large" 
                  className="bg-white text-primary-500 hover:bg-neutral-50 hover:scale-[1.02] hover:shadow-lg transition-all"
                  iconRight={<ArrowRight size={16} />}
                >
                  Start Free Trial
                </Button>
              </div>

              <div className="mt-[20px] flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={14} className="text-white" />
                  <span className="font-body text-[12px] text-white/70">No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={14} className="text-white" />
                  <span className="font-body text-[12px] text-white/70">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-white" />
                  <span className="font-body text-[12px] text-white/70">Setup in 30 min</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
