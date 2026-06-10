import * as React from "react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { Button } from "@/components/ui/button"

export function IntegrationsSection() {
  const integrations = [
    "Slack", "Google Workspace", "Microsoft Teams", "Greenhouse",
    "LinkedIn", "Indeed", "Calendly", "Zoom", 
    "DocuSign", "Workday", "Zapier", "BambooHR"
  ]

  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-white py-[80px]">
        <div className="mx-auto max-w-[1000px] px-5 md:px-10 lg:px-[80px]">
          
          <div className="mx-auto max-w-[600px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-neutral-500">
              WORKS WITH YOUR STACK
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
              Connects to every tool you already use.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {integrations.map((name, i) => (
              <div 
                key={i} 
                className="group flex h-[80px] flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-neutral-200 bg-white shadow-xs transition-all duration-150 hover:border-neutral-300 hover:shadow-md"
              >
                {/* Placeholder for Logo */}
                <div className="h-[32px] w-[32px] rounded-sm bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-400 grayscale transition-all duration-150 group-hover:grayscale-0">
                  Logo
                </div>
                <span className="font-body text-[11px] font-medium text-neutral-500">
                  {name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button variant="ghost">View all 40+ integrations</Button>
          </div>

        </div>
      </section>
    </ScrollEntry>
  )
}
