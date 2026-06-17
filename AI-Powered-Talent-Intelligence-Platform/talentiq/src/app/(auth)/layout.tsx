import { ReactNode } from 'react'
import Link from 'next/link'
import { Hexagon, Building2, Users, Target, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col md:flex-row font-body">
      
      {/* Left Panel - Branding */}
      <div className="w-full md:w-1/2 bg-[#0F172A] hidden md:flex flex-col justify-between p-[48px] lg:p-[64px] relative overflow-hidden text-white">
        
        {/* Background Decorative Mesh & Waves */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/20 to-[#4C1D95]/40 mix-blend-overlay"></div>
        <div className="absolute top-[30%] -left-[20%] w-[150%] h-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15),_transparent_60%)] pointer-events-none rounded-full blur-[100px]" />
        
        {/* CSS simulated waves */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] opacity-30 pointer-events-none">
           <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto" preserveAspectRatio="none">
             <path fill="url(#gradient1)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
             <defs>
               <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                 <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
               </linearGradient>
             </defs>
           </svg>
           <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto" preserveAspectRatio="none">
             <path fill="url(#gradient2)" d="M0,128L60,144C120,160,240,192,360,186.7C480,181,600,139,720,149.3C840,160,960,224,1080,229.3C1200,235,1320,181,1380,154.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
             <defs>
               <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
               </linearGradient>
             </defs>
           </svg>
        </div>

        {/* Top left - Back Link & Logo */}
        <div className="relative z-10 flex flex-col items-start gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Website
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-blue-500 fill-blue-500" />
            <span className="font-display text-[22px] font-bold text-white tracking-tight">TalentIQ</span>
          </Link>
        </div>

        {/* Center Quote */}
        <div className="relative z-10 flex-grow flex flex-col justify-center mt-[-40px]">
          <div className="max-w-[480px]">
            <span className="text-[64px] font-extrabold text-blue-400/40 leading-none block -mb-4">
              &quot;
            </span>
            <h2 className="font-display text-[32px] lg:text-[40px] font-bold text-white leading-[1.2] mb-6">
              TalentIQ transformed our hiring process. We reduced time-to-hire by 62% in the first month.
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-lg">
                <span className="text-white font-bold text-[18px]">SJ</span>
              </div>
              <div>
                <p className="font-body text-[16px] font-bold text-white leading-tight">Sarah Jenkins</p>
                <p className="font-body text-[14px] text-white/70 mt-0.5">VP of People, TechFlow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats and Compliance */}
        <div className="relative z-10 w-full mt-auto">
          {/* Stats Box */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex justify-between items-center mb-8">
            <div className="flex flex-col items-center text-center flex-1 border-r border-white/10">
              <Building2 className="w-6 h-6 text-white/80 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">500+</p>
              <p className="font-body text-[12px] text-white/70">Companies hiring</p>
            </div>
            <div className="flex flex-col items-center text-center flex-1 border-r border-white/10">
              <Users className="w-6 h-6 text-white/80 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">2M+</p>
              <p className="font-body text-[12px] text-white/70">Candidates scored</p>
            </div>
            <div className="flex flex-col items-center text-center flex-1">
              <Target className="w-6 h-6 text-white/80 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">99%</p>
              <p className="font-body text-[12px] text-white/70">Parse accuracy</p>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">SOC 2</p>
                <p className="text-[10px] text-white/70 leading-tight">Type II</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">GDPR</p>
                <p className="text-[10px] text-white/70 leading-tight">Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">ISO 27001</p>
                <p className="text-[10px] text-white/70 leading-tight">Certified</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Panel - Auth Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-[24px] md:p-[48px] bg-[#F8FAFC]">
        <div className="w-full max-w-[440px] bg-white p-[40px] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/80">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-[32px]">
            <Link href="/" className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-blue-600 fill-blue-600" />
              <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>

    </div>
  )
}
