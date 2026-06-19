import { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Hexagon,
  Building2,
  Users,
  Target,
  ShieldCheck,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col md:flex-row font-body">
      {/* Left Panel - Branding */}
      <div className="w-full md:w-1/2 bg-[#081332] hidden md:flex flex-col justify-between p-[48px] lg:p-[64px] relative overflow-hidden text-white">
        {/* Dot grid pattern top right */}
        <div className="absolute top-10 right-10 opacity-30 pointer-events-none">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Dynamic sweeping wave background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <svg
            viewBox="0 0 800 1000"
            className="absolute right-0 top-0 w-[150%] h-[120%] opacity-40 mix-blend-screen translate-x-[20%] -translate-y-[10%]"
            preserveAspectRatio="none"
          >
            <path
              d="M100,0 C400,300 100,500 600,800 C800,950 800,1000 800,1000 L800,0 Z"
              fill="url(#wave-gradient)"
            />
            <path
              d="M-100,200 C300,400 200,700 800,1000"
              stroke="url(#line-gradient)"
              strokeWidth="3"
              fill="none"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle,_rgba(37,99,235,0.25)_0%,_transparent_60%)] blur-[80px]" />
        </div>

        {/* Top left - Back Link & Logo */}
        <div className="relative z-10 flex flex-col items-start gap-6">
          <Link
            href="/login"
            className="flex items-center gap-2 text-[13px] font-medium text-blue-200 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            Back to Login
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-blue-500 fill-blue-500" />
            <span className="font-display text-[22px] font-bold text-white tracking-tight">
              TalentIQ
            </span>
          </Link>
        </div>

        {/* ── Hero text + illustration ── */}
        <div className="relative z-10 flex-grow flex flex-col mt-[32px] justify-between h-full">
          <div>
            {/* Badge pill */}
            <div className="inline-flex w-fit items-center px-4 py-1.5 rounded-full bg-[#1e3a8a]/40 backdrop-blur-md mb-5 border border-blue-500/30">
              <span className="text-[11px] font-bold tracking-[0.15em] text-blue-300 uppercase">
                FOR BUSINESS OWNERS
              </span>
            </div>

            <h1 className="font-display text-[42px] lg:text-[48px] font-bold leading-[1.15] mb-4 tracking-tight">
              <span className="text-white">Hire better.</span>
              <br />
              <span className="text-blue-400">Grow faster.</span>
            </h1>
            <p className="text-[15px] text-blue-100/70 leading-relaxed max-w-[400px] font-medium">
              Streamline your hiring process, build winning teams, and drive your business forward with TalentIQ.
            </p>
          </div>

          <div className="flex w-full mt-8 flex-grow relative">
            {/* ── Left Column: Features List ── */}
            <div className="w-[48%] flex flex-col gap-5 mt-2 z-20">
              {[
                {
                  icon: <Users className="w-5 h-5 text-blue-300" />,
                  label: "Smart Hiring Pipeline",
                  sub: "Track candidates across every stage of your hiring process.",
                },
                {
                  icon: <Building2 className="w-5 h-5 text-blue-300" />,
                  label: "Collaborate Seamlessly",
                  sub: "Work with your team and make smarter hiring decisions.",
                },
                {
                  icon: <Target className="w-5 h-5 text-blue-300" />,
                  label: "Data-Driven Insights",
                  sub: "Get real-time analytics to improve hiring quality and speed.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-blue-300" />,
                  label: "Flexible & Secure",
                  sub: "Customize settings, roles, and permissions with enterprise-grade security.",
                },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-[14px] bg-[#1e3a8a]/40 backdrop-blur-md border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e3a8a]/60 transition-all">
                    {icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-[14px] font-bold text-white leading-tight mb-1 group-hover:text-blue-200 transition-colors">
                      {label}
                    </p>
                    <p className="text-[12px] text-blue-100/60 leading-[1.4] max-w-[200px]">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right Column: Laptop Illustration ── */}
            <div className="w-[52%] absolute right-0 top-0 bottom-0 pointer-events-none">
              {/* Laptop PNG */}
              <img
                src="/images/laptop-dashboard.png"
                alt="Laptop Dashboard"
                className="absolute z-10 -scale-x-100"
                style={{
                  right: "-20%",
                  top: "15%",
                  width: "160%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.5))",
                }}
              />

              {/* Floating badge: Chart (top right) */}
              <div
                className="absolute z-20 flex items-center justify-center"
                style={{ right: "15%", top: "0%" }}
              >
                <div className="w-14 h-14 bg-blue-500 rounded-[14px] shadow-[0_12px_36px_rgba(37,99,235,0.4)] border border-blue-400/50 flex items-center justify-center relative">
                  <Target className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats and Compliance */}
        <div className="relative z-10 w-full mt-auto pt-8">
          {/* Stats Box */}
          <div className="bg-[#1e3a8a]/30 backdrop-blur-xl border border-white/5 rounded-[20px] p-6 flex justify-between items-center mb-8 shadow-lg">
            <div className="flex flex-col items-center text-center flex-1 border-r border-white/5">
              <Building2 className="w-6 h-6 text-blue-300 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">
                500+
              </p>
              <p className="font-body text-[12px] text-blue-100/60">
                Companies hiring
              </p>
            </div>
            <div className="flex flex-col items-center text-center flex-1 border-r border-white/5">
              <Users className="w-6 h-6 text-blue-300 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">
                2M+
              </p>
              <p className="font-body text-[12px] text-blue-100/60">
                Candidates scored
              </p>
            </div>
            <div className="flex flex-col items-center text-center flex-1">
              <Target className="w-6 h-6 text-blue-300 mb-2" />
              <p className="font-display text-[24px] font-bold text-white leading-none mb-1">
                99%
              </p>
              <p className="font-body text-[12px] text-blue-100/60">
                Parse accuracy
              </p>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">SOC 2</p>
                <p className="text-[10px] text-blue-100/60 leading-tight">
                  Type II
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">GDPR</p>
                <p className="text-[10px] text-blue-100/60 leading-tight">
                  Compliant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white/80" />
              <div className="text-left">
                <p className="text-[12px] font-bold leading-tight">ISO 27001</p>
                <p className="text-[10px] text-blue-100/60 leading-tight">
                  Certified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-[24px] md:p-[48px] bg-white">
        <div className="w-full max-w-[440px] bg-white p-[40px] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/80">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-[32px]">
            <Link href="/" className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-blue-600 fill-blue-600" />
              <span className="font-display text-[22px] font-bold text-neutral-900 tracking-tight">
                TalentIQ
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
