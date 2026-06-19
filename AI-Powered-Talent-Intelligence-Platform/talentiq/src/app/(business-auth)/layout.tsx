import { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Hexagon,
  Briefcase,
  Users,
  CalendarDays,
  BarChart2,
  ShieldCheck,
  Check,
  Settings,
  Building2
} from "lucide-react";

export default function BusinessAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-[100dvh] overflow-y-auto md:overflow-hidden bg-[#fbfcfd] flex-col md:flex-row font-body">
      {/* ─────────────────────────────────────────
          LEFT PANEL — matches the shared image
      ───────────────────────────────────────── */}
      <div className="w-full md:w-[55%] bg-gradient-to-b from-[#e2f0fd] to-[#b3dafe] hidden md:flex flex-col relative overflow-hidden p-[40px] lg:p-[60px]">
        {/* Dot-grid decoration — top right */}
        <div className="absolute top-8 right-8 opacity-25 pointer-events-none">
          <div className="grid grid-cols-7 gap-[10px]">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="w-[5px] h-[5px] bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-[#67aefa]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[55%] h-[55%] bg-gradient-to-tr from-[#8abafb]/25 to-transparent rounded-full blur-3xl" />

          {/* Wave shapes at the bottom */}
          <svg
            viewBox="0 0 1440 800"
            className="absolute bottom-0 left-0 w-full h-full object-cover opacity-40"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,450 C 320,550 640,350 960,500 C 1200,600 1440,400 1440,400 L1440,800 L0,800 Z"
            />
            <path
              fill="#ffffff"
              opacity="0.6"
              d="M0,550 C 420,680 820,400 1440,580 L1440,800 L0,800 Z"
            />
          </svg>
        </div>

        {/* ── Logo & Back Link ── */}
        <div className="relative z-10 flex flex-col items-start gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-[13px] font-medium text-[#1e3a8a]/70 hover:text-[#1e3a8a] transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            Back to Login
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-[#2563eb] fill-[#2563eb]" />
            <span className="font-display text-[22px] font-bold text-[#0f244a] tracking-tight">
              TalentIQ
            </span>
          </Link>
        </div>

        {/* ── Hero text + illustration ── */}
        <div className="relative z-10 flex-grow flex flex-col mt-[48px] justify-between h-full">
          <div>
            {/* Badge pill */}
            <div className="inline-flex w-fit items-center px-4 py-1.5 rounded-full bg-[#82c1ff]/60 backdrop-blur-sm mb-5 shadow-sm border border-white/40">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#1e40af] uppercase">
                BUSINESS OWNER PORTAL
              </span>
            </div>

            <h1 className="font-display text-[42px] lg:text-[48px] font-bold text-[#0b2148] leading-[1.15] mb-4 tracking-tight">
              Build Winning Teams
              <br />
              With Smarter Hiring
            </h1>
            <p className="text-[15px] text-[#2e4a6b] leading-relaxed max-w-[380px] font-medium">
              Manage your pipeline, jobs, and settings all in one powerful platform.
            </p>
          </div>

          <div className="flex w-full mt-8 flex-grow">
            {/* ── Left Column: Features List ── */}
            <div className="w-[45%] flex flex-col gap-4 mt-4 z-20">
              {[
                {
                  icon: <Briefcase className="w-5 h-5 text-[#2563eb]" />,
                  label: "Manage Jobs",
                  sub: "Create, edit, and manage all your job openings in one place.",
                },
                {
                  icon: <Users className="w-5 h-5 text-[#2563eb]" />,
                  label: "Track Pipeline",
                  sub: "Monitor candidates across every stage of your hiring pipeline.",
                },
                {
                  icon: <CalendarDays className="w-5 h-5 text-[#2563eb]" />,
                  label: "Schedule Interviews",
                  sub: "Schedule and coordinate interviews seamlessly with your team.",
                },
                {
                  icon: <BarChart2 className="w-5 h-5 text-[#2563eb]" />,
                  label: "Data-Driven Insights",
                  sub: "Make better hiring decisions with insights and performance analytics.",
                },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-[14px] bg-white/90 backdrop-blur-sm border border-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)] transition-all">
                    {icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-[14px] font-bold text-[#0b2148] leading-tight mb-1">
                      {label}
                    </p>
                    <p className="text-[11px] text-[#475f7e] leading-[1.4] max-w-[180px]">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right Column: Laptop Illustration ── */}
            <div className="w-[55%] relative h-full">
              {/* Large white circular glow behind the laptop */}
              <div
                className="absolute z-0"
                style={{
                  right: "-20%",
                  top: "20%",
                  width: "100%",
                  paddingBottom: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.35) 60%, transparent 80%)",
                  borderRadius: "50%",
                  filter: "blur(2px)",
                }}
              />

              {/* Laptop PNG */}
              <img
                src="/images/laptop-dashboard.png"
                alt="Laptop Dashboard"
                className="absolute z-10 -scale-x-100"
                style={{
                  right: "-5%",
                  top: "5%",
                  width: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 25px 35px rgba(10,40,100,0.25))",
                }}
              />

              {/* Floating badge: User (top left) */}
              <div
                className="absolute z-20 flex items-center justify-center"
                style={{ left: "-5%", top: "15%" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center relative">
                  <div className="w-9 h-9 bg-[#2563eb] rounded-[10px] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating badge: Settings (left) */}
              <div
                className="absolute z-20 flex items-center justify-center"
                style={{ left: "-15%", top: "45%" }}
              >
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-[14px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center relative">
                  <Settings className="w-6 h-6 text-[#2563eb]" />
                </div>
              </div>

              {/* Floating badge: Chart (top right) */}
              <div
                className="absolute z-20 flex items-center justify-center"
                style={{ right: "-5%", top: "10%" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center relative">
                  <BarChart2 className="w-6 h-6 text-[#2563eb]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom: Stats card ── */}
        <div className="relative z-10 mt-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-[18px] p-5 flex justify-between items-center shadow-[0_6px_24px_rgba(0,0,0,0.05)] border border-white/80">
            {[
              {
                icon: <Users className="w-6 h-6 text-[#2563eb]" />,
                value: "2K+",
                label: "Active Companies",
              },
              {
                icon: <Briefcase className="w-6 h-6 text-[#2563eb]" />,
                value: "25K+",
                label: "Jobs Posted",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#2563eb]" />,
                value: "99.9%",
                label: "Platform Uptime",
              },
            ].map(({ icon, value, label }, index) => (
              <div
                key={label}
                className={`flex items-center gap-3 flex-1 ${
                  index !== 0 ? "pl-4 border-l border-[#2563eb]/10" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-[12px] bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-[18px] font-bold text-[#0b2148] leading-none mb-1">
                    {value}
                  </p>
                  <p className="text-[10px] font-medium text-[#4a637e] leading-none">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          RIGHT PANEL — auth form
      ───────────────────────────────────────── */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-[24px] md:p-[48px] bg-[#fbfcfd] relative border-l border-neutral-100">
        <div className="w-full max-w-[440px] bg-white p-[44px] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100/80 relative z-10">
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
