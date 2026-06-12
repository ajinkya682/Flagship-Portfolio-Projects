import { ElementType } from "react";
import { CheckCircle2 } from "lucide-react";

interface PersonaCardProps {
  icon: ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  pain: string;
  solution: string;
  bullets: string[];
}

export default function PersonaCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  pain,
  solution,
  bullets,
}: PersonaCardProps) {
  // Clean up the strings to style the prefixes beautifully
  const cleanPain = pain.replace(/Before TalentOS: |Before TalentIQ: /g, "");
  const cleanSolution = solution.replace("Now: ", "");

  return (
    <div className="group relative bg-white rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] border border-neutral-200/60 p-6 sm:p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 overflow-hidden min-w-0 w-full">
      {/* Subtle Premium Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon Container with slight rotate & scale on hover */}
      <div
        className="relative z-10 w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
        style={{ backgroundColor: iconBg }}
      >
        <Icon
          className="w-7 h-7"
          style={{ color: iconColor }}
          strokeWidth={2}
        />
      </div>

      {/* Title */}
      <h3 className="relative z-10 font-display text-[22px] md:text-[24px] font-extrabold text-[#0A101D] mt-6 leading-tight tracking-tight">
        {title}
      </h3>

      {/* Redesigned Before / After Section */}
      <div className="mt-6 flex flex-col gap-3 relative z-10">
        {/* 'Before' State */}
        <div className="flex flex-col gap-1">
          <span className="font-display text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            Before
          </span>
          <p className="font-body text-[14px] text-neutral-500 leading-relaxed pr-2">
            {cleanPain}
          </p>
        </div>

        {/* 'Now' State (Highlighted Box) */}
        <div className="flex flex-col gap-1 mt-1 bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-100/80 group-hover:bg-white group-hover:border-neutral-200/60 transition-colors duration-300">
          <span
            className="font-display text-[10px] font-bold tracking-wider uppercase"
            style={{ color: iconColor }}
          >
            Now
          </span>
          <p className="font-body text-[14px] font-semibold text-neutral-900 leading-relaxed">
            {cleanSolution}
          </p>
        </div>
      </div>

      {/* Faded Divider */}
      <div className="w-full h-px bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 my-6 relative z-10" />

      {/* Bullets */}
      <div className="flex flex-col gap-3.5 mt-auto relative z-10">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2
              className="w-4 h-4 shrink-0 mt-[2px] transition-transform duration-300 group-hover:scale-110"
              style={{ color: iconColor }}
            />
            {/* break-words ensures long text never pushes the card off-screen on mobile */}
            <span className="font-body text-[14px] text-neutral-600 leading-snug break-words">
              {bullet}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
