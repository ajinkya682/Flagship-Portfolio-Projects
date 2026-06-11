import { ReactNode } from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col md:flex-row">
      
      {/* Left Panel - Branding */}
      <div className="w-full md:w-1/2 bg-primary-900 hidden md:flex flex-col justify-between p-[48px] lg:p-[64px] relative overflow-hidden">
        
        {/* Background Decorative Mesh */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.2),_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-white fill-white" />
            <span className="font-display text-[22px] font-bold text-white tracking-tight">TalentIQ</span>
          </Link>

          {/* Center Quote */}
          <div className="flex-grow flex items-center mt-[-60px]">
            <div className="max-w-[480px]">
              <span className="text-[64px] font-extrabold text-primary-500/30 leading-none -mb-4 block">
                &quot;
              </span>
              <h2 className="font-display text-[28px] lg:text-[36px] font-bold text-white leading-tight">
                TalentIQ transformed our hiring process. We reduced time-to-hire by 62% in the first month.
              </h2>
              <div className="mt-[24px]">
                <p className="font-body text-[15px] font-semibold text-white">Sarah Jenkins</p>
                <p className="font-body text-[14px] text-white/60 mt-1">VP of People, TechFlow</p>
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-[24px] pt-[40px] border-t border-white/10">
            <div>
              <p className="font-display text-[24px] font-bold text-white leading-none">500+</p>
              <p className="font-body text-[13px] text-white/60 mt-[8px]">Companies hiring</p>
            </div>
            <div>
              <p className="font-display text-[24px] font-bold text-white leading-none">2M+</p>
              <p className="font-body text-[13px] text-white/60 mt-[8px]">Candidates scored</p>
            </div>
            <div>
              <p className="font-display text-[24px] font-bold text-white leading-none">99%</p>
              <p className="font-body text-[13px] text-white/60 mt-[8px]">Parse accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-[24px] md:p-[48px] min-h-[100vh]">
        <div className="w-full max-w-[400px] bg-white p-[32px] md:p-[48px] rounded-[16px] md:rounded-[24px] shadow-sm md:shadow-lg border border-neutral-100/50">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-[32px]">
            <Link href="/" className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-primary-600 fill-primary-600" />
              <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>

    </div>
  )
}
