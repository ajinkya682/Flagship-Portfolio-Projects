import Link from "next/link";
import { Blocks, ArrowRight } from "lucide-react";
import IntegrationGrid from "./IntegrationGrid";

export default function IntegrationsSection() {
  return (
    <section className="bg-white py-24 md:py-32 relative overflow-hidden border-t border-neutral-100">
      {/* Subtle Tech Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3B58F6]/10 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        {/* Header Section */}
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center">
          {/* Premium Badge Pill */}
          <div className="inline-flex items-center gap-2 h-8 bg-blue-50 border border-blue-200/60 rounded-full px-3.5 shadow-sm mb-6">
            <Blocks className="w-3.5 h-3.5 text-[#3B58F6]" />
            <span className="font-body text-[12px] font-bold text-[#3B58F6] tracking-wider uppercase">
              Seamless Integrations
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-[36px] md:text-[48px] font-extrabold text-[#0A101D] mt-2 leading-[1.1] tracking-tight">
            Connects to the tools <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
              you already use.
            </span>
          </h2>

          {/* Subheading */}
          <p className="font-body text-[18px] md:text-[20px] text-neutral-600 mt-6 leading-relaxed max-w-[600px]">
            Sync your candidate data, calendars, and communication channels
            instantly. No complex setup or engineering required.
          </p>
        </div>

        {/* Integration Grid Component */}
        <div className="mt-16 md:mt-20">
          <IntegrationGrid />
        </div>

        {/* Elevated "View All" Button */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/integrations"
            className="group inline-flex items-center justify-center px-8 h-[48px] rounded-full bg-white border border-neutral-200/80 shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 text-[15px] font-semibold text-neutral-700 hover:text-[#3B58F6] transition-all duration-300"
          >
            View all 40+ integrations
            <ArrowRight className="w-4 h-4 ml-2 text-neutral-400 group-hover:text-[#3B58F6] group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
