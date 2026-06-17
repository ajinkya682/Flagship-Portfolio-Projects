import { Plus, Sparkles } from 'lucide-react'

export default function BentoFeatureCard() {
  return (
    <div className="bg-[#2563EB] rounded-[24px] p-10 text-white overflow-hidden relative shadow-xl h-full flex flex-col justify-end min-h-[340px]">
      {/* Decorative element */}
      <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start mt-auto">
        <div className="inline-flex items-center bg-white text-primary-500 rounded-full text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wide">
          AI-Powered
        </div>
        
        <Sparkles className="w-7 h-7 text-white mt-5" />
        
        <h3 className="text-[20px] font-bold text-white max-w-[220px] mt-4 leading-tight font-display">
          AI-powered platform for groundbreaking hiring.
        </h3>
        
        <p className="text-[14px] text-white/70 mt-2 font-body">
          Automate scoring, eliminate bias, and find your best candidates faster.
        </p>
        
        <button className="bg-white text-primary-500 rounded-full h-11 px-5 inline-flex items-center gap-2 text-[14px] font-semibold mt-6 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="w-3.5 h-3.5" />
          Learn More
        </button>
      </div>
    </div>
  )
}
