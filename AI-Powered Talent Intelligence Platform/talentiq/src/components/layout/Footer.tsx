import * as React from "react"
import { Twitter, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-[#040D1A] py-[72px] pb-[40px]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
        
        <div className="grid grid-cols-1 gap-[32px] lg:grid-cols-4 lg:gap-[48px]">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm w-fit">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="6" fill="#2563EB"/>
                <path d="M14 6L22 14L14 22L6 14L14 6Z" fill="white"/>
              </svg>
              <span className="font-display text-[20px] font-bold tracking-tight text-white">
                Talent<span className="text-primary-500">IQ</span>
              </span>
            </Link>
            <p className="mt-[12px] font-body text-[14px] text-white/55">
              AI-powered talent intelligence for modern hiring teams.
            </p>
            <div className="mt-[20px] flex gap-[12px]">
              <a href="#" className="flex h-5 w-5 items-center justify-center text-neutral-400 transition-colors hover:text-white" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="flex h-5 w-5 items-center justify-center text-neutral-400 transition-colors hover:text-white" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="flex h-5 w-5 items-center justify-center text-neutral-400 transition-colors hover:text-white" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col">
            <span className="font-body text-[11px] font-bold uppercase tracking-wider text-white/35">
              Product
            </span>
            <div className="mt-[16px] flex flex-col gap-[8px]">
              <Link href="/features" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Features</Link>
              <Link href="/pipeline" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Pipeline</Link>
              <Link href="/ai-scoring" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">AI Scoring</Link>
              <Link href="/integrations" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Integrations</Link>
              <Link href="/pricing" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Pricing</Link>
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col">
            <span className="font-body text-[11px] font-bold uppercase tracking-wider text-white/35">
              Company
            </span>
            <div className="mt-[16px] flex flex-col gap-[8px]">
              <Link href="/about" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">About</Link>
              <Link href="/blog" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Blog</Link>
              <Link href="/careers" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Careers</Link>
              <Link href="/press" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Press</Link>
              <Link href="/contact" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Contact</Link>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col">
            <span className="font-body text-[11px] font-bold uppercase tracking-wider text-white/35">
              Legal
            </span>
            <div className="mt-[16px] flex flex-col gap-[8px]">
              <Link href="/privacy" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Terms of Service</Link>
              <Link href="/gdpr" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">GDPR</Link>
              <Link href="/security" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Security</Link>
              <Link href="/cookies" className="font-body text-[14px] text-white/55 transition-colors duration-120 hover:text-white">Cookie Settings</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-[48px] flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-[24px] md:flex-row">
          <span className="font-body text-[13px] text-white/35">
            © {new Date().getFullYear()} TalentIQ Inc. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="font-body text-[13px] text-white/35 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="font-body text-[13px] text-white/35 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
