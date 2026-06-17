export default function BentoSocialCard() {
  return (
    <div className="bg-[#111827] rounded-[24px] p-8 shadow-xl overflow-hidden relative h-full flex flex-col justify-end min-h-[340px]">
      {/* Radial accent */}
      <div className="absolute -top-[30px] -right-[30px] w-[150px] h-[150px] rounded-full bg-[#10B981]/15 pointer-events-none blur-2xl" />

      <div className="relative z-10 flex flex-col mt-auto">
        <p className="text-[16px] text-white italic max-w-[200px] font-body leading-relaxed">
          &quot;Our time-to-hire dropped by 60% in the first month.&quot;
        </p>
        
        <div className="mt-3">
          <div className="text-[14px] text-white font-semibold font-body">Sarah Chen</div>
          <div className="text-[12px] text-white/70 font-body">VP of People at Momentum Labs</div>
        </div>
        
        <div className="text-[14px] text-white/80 mt-6 underline cursor-pointer hover:text-white transition-colors w-fit font-body">
          See reviews from our users
        </div>
      </div>
    </div>
  )
}
