import AnimatedPipelineFlow from './AnimatedPipelineFlow'
import ParticleField from './ParticleField'

export default function PipelineExplainerSection() {
  return (
    <section className="bg-[#0A2540] py-24 relative overflow-hidden">
      {/* Decorative background mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.15),_transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-[800px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-accent-300 tracking-widest uppercase">
            HOW THE AI WORKS
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-white mt-3 leading-tight tracking-tight">
            From resume to ranked candidate in 90 seconds.
          </h2>
          <p className="font-body text-[17px] text-white/70 mt-4 max-w-[520px] mx-auto leading-relaxed">
            TalentIQ automates the busywork. Our AI pipeline ingests resumes, parses unstructured data, and delivers an objective score instantly.
          </p>
        </div>

        {/* Diagram */}
        <div className="mt-14">
          <AnimatedPipelineFlow />
        </div>

        {/* Stat Callouts */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-white/5 border border-white/10 rounded-lg px-7 py-5 flex items-center gap-3 backdrop-blur-sm">
            <span className="font-display text-[26px] font-bold text-white leading-none">2-8s</span>
            <span className="font-body text-[14px] text-white/65 leading-snug max-w-[100px]">per resume processing</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-7 py-5 flex items-center gap-3 backdrop-blur-sm">
            <span className="font-display text-[26px] font-bold text-white leading-none">99.2%</span>
            <span className="font-body text-[14px] text-white/65 leading-snug max-w-[100px]">parse accuracy across formats</span>
          </div>
        </div>

      </div>
    </section>
  )
}
