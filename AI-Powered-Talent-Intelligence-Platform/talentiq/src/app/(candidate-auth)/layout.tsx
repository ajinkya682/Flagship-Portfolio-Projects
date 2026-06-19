import { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Hexagon,
  Compass,
  FileText,
  CalendarDays,
  Award,
  ShieldCheck,
  Check,
  User,
} from "lucide-react";

export default function CandidateAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    redirect("/candidate/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row font-body">
      {/* ─────────────────────────────────────────
          LEFT PANEL — matches the shared image
      ───────────────────────────────────────── */}
      <div className="w-full md:w-[55%] bg-gradient-to-br from-[#d6ecff] via-[#b8dcff] to-[#85c1fd] hidden md:flex flex-col relative overflow-hidden p-[40px] lg:p-[60px]">
        {/* Dot-grid decoration — top right */}
        <div className="absolute top-6 right-6 opacity-25 pointer-events-none">
          <div className="grid grid-cols-7 gap-[10px]">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="w-[5px] h-[5px] bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[-5%] w-[60%] h-[60%] bg-gradient-to-tl from-[#4f9ef8]/25 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[55%] h-[55%] bg-gradient-to-tr from-[#7ab8fb]/30 to-transparent rounded-full blur-3xl" />

          {/* Wave shapes at the bottom */}
          <svg
            viewBox="0 0 1440 800"
            className="absolute bottom-0 left-0 w-full h-full object-cover opacity-30"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,520 C 320,640 640,400 960,560 C 1200,680 1440,500 1440,500 L1440,800 L0,800 Z"
            />
            <path
              fill="#ffffff"
              opacity="0.55"
              d="M0,620 C 420,760 820,460 1440,660 L1440,800 L0,800 Z"
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
        <div className="relative z-10 flex-grow flex flex-col mt-[48px]">
          {/* Badge pill */}
          <div className="inline-flex w-fit items-center px-4 py-1.5 rounded-full bg-[#7ab4f5]/60 backdrop-blur-sm mb-5 shadow-sm border border-white/20">
            <span className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">
              CANDIDATE PORTAL
            </span>
          </div>

          <h1 className="font-display text-[42px] lg:text-[52px] font-bold text-[#0b2148] leading-[1.1] mb-4 tracking-tight">
            Your Career Journey
            <br />
            Starts Here
          </h1>
          <p className="text-[15px] text-[#2e4a6b] leading-relaxed max-w-[380px] font-medium">
            Discover opportunities, showcase your skills, and take the next step
            toward your dream job with TalentIQ.
          </p>

          {/* ── Illustration box ── */}
          <div className="relative mt-6 w-full flex-grow min-h-[280px]">
            {/* Large white circular glow behind the figure */}
            <div
              className="absolute z-0"
              style={{
                right: "2%",
                top: "0%",
                width: "62%",
                paddingBottom: "62%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.35) 60%, transparent 80%)",
                borderRadius: "50%",
                filter: "blur(2px)",
              }}
            />

            {/* 3D illustrated person with laptop — PNG with transparent BG */}
            <img
              src="/images/boy-laptop.png"
              alt="Candidate using laptop"
              className="absolute z-10 -scale-x-100"
              style={{
                right: "0%",
                bottom: "0%",
                width: "58%",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 30px rgba(30,80,180,0.18))",
              }}
            />

            {/* ── Floating badge: verified user (top right) ── */}
            <div
              className="absolute z-20 flex items-center justify-center"
              style={{ right: "7%", top: "2%" }}
            >
              {/* Dotted circular ring */}
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                className="absolute"
                style={{ opacity: 0.35 }}
              >
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="#3b7de8"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                />
              </svg>
              <div className="w-16 h-16 bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.13)] flex items-center justify-center relative">
                <div className="w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
                  <Check className="w-3 h-3 text-[#2563eb]" />
                </div>
              </div>
            </div>

            {/* Dashed connecting line from badge to figure (decorative) */}
            <svg
              className="absolute z-10 pointer-events-none"
              style={{ right: "14%", top: "12%", width: "12%", height: "20%" }}
              viewBox="0 0 60 80"
              fill="none"
            >
              <path
                d="M55 5 C 55 40, 10 40, 10 75"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            </svg>

            {/* ── Floating card: Applied Jobs ── */}
            <div
              className="absolute z-20 bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2.5 shadow-[0_10px_36px_rgba(0,0,0,0.11)] flex items-center gap-3"
              style={{ left: "0%", top: "28%" }}
            >
              <div className="w-9 h-9 rounded-xl border border-neutral-100 bg-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-800 leading-none">
                  Applied Jobs
                </p>
                <p className="text-[9px] text-neutral-400 mt-0.5 leading-none">
                  Petro
                </p>
              </div>
              <p className="text-[24px] font-bold text-[#2563eb] ml-2 leading-none">
                08
              </p>
            </div>

            {/* ── Floating card: Interviews ── */}
            <div
              className="absolute z-20 bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2.5 shadow-[0_10px_36px_rgba(0,0,0,0.11)] flex items-center gap-3"
              style={{ right: "-2%", top: "42%" }}
            >
              <div className="w-9 h-9 rounded-xl border border-neutral-100 bg-white flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-800 leading-none">
                  Interviews
                </p>
                <p className="text-[9px] text-neutral-400 mt-0.5 leading-none">
                  Innova
                </p>
              </div>
              <p className="text-[24px] font-bold text-[#2563eb] ml-2 leading-none">
                03
              </p>
            </div>

            {/* ── Floating card: Offers ── */}
            <div
              className="absolute z-20 bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2.5 shadow-[0_10px_36px_rgba(0,0,0,0.11)] flex items-center gap-3"
              style={{ right: "10%", bottom: "10%" }}
            >
              <div className="w-9 h-9 rounded-xl border border-neutral-100 bg-white flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-800 leading-none">
                  Offers
                </p>
                <p className="text-[9px] text-neutral-400 mt-0.5 leading-none">
                  Offers
                </p>
              </div>
              <p className="text-[24px] font-bold text-[#2563eb] ml-2 leading-none">
                02
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom: Features card + compliance ── */}
        <div className="relative z-10 mt-auto pt-6">
          {/* Features row */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[18px] p-5 flex justify-between items-start mb-5 shadow-[0_6px_24px_rgba(0,0,0,0.07)] border border-white/80">
            {[
              {
                icon: <Compass className="w-5 h-5 text-[#2563eb]" />,
                label: "Find Jobs",
                sub: "Browse relevant\nopportunities",
              },
              {
                icon: <FileText className="w-5 h-5 text-[#2563eb]" />,
                label: "Apply Easily",
                sub: "Quick and simple\napplication process",
              },
              {
                icon: <CalendarDays className="w-5 h-5 text-[#2563eb]" />,
                label: "Track Progress",
                sub: "Stay updated on\nyour applications",
              },
              {
                icon: <Award className="w-5 h-5 text-[#2563eb]" />,
                label: "Get Hired",
                sub: "Receive offers and\ngrow your career",
              },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center flex-1 gap-0"
              >
                <div className="w-10 h-10 rounded-full border border-neutral-200 bg-white shadow-sm flex items-center justify-center mb-3">
                  {icon}
                </div>
                <p className="text-[12px] font-bold text-neutral-900 mb-1">
                  {label}
                </p>
                <p className="text-[9.5px] text-neutral-500 leading-tight whitespace-pre-line">
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance row */}
          <div className="flex items-center gap-3 text-[10.5px] text-[#4a637e] font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4a637e]" />
              <span>Your data is secure with us</span>
            </div>
            <span className="text-[#8ba5be]">·</span>
            <span>SOC 2 Type II</span>
            <span className="text-[#8ba5be]">·</span>
            <span>GDPR Compliant</span>
            <span className="text-[#8ba5be]">·</span>
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          RIGHT PANEL — auth form (unchanged)
      ───────────────────────────────────────── */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-[24px] md:p-[48px] bg-[#fbfcfd] relative">
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
