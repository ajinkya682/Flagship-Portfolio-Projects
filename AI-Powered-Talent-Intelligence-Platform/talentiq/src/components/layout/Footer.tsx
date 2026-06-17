import Link from 'next/link'
import { Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#040D1A] pt-[72px] pb-[40px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-[20px] font-extrabold text-white tracking-tight">
                Talent<span className="text-primary-400">IQ</span>
              </span>
            </Link>
            <p className="text-[14px] text-white/55 font-body mb-6 max-w-[240px]">
              Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition duration-120" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition duration-120" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition duration-120" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col">
            <h4 className="overline text-[11px] uppercase text-white/35 mb-4">Product</h4>
            <div className="flex flex-col gap-2">
              <Link href="/features" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Features</Link>
              <Link href="/features#pipeline" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Pipeline</Link>
              <Link href="/features#ai-scoring" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">AI Scoring</Link>
              <Link href="/integrations" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Integrations</Link>
              <Link href="/pricing" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Pricing</Link>
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col">
            <h4 className="overline text-[11px] uppercase text-white/35 mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">About</Link>
              <Link href="/blog" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Blog</Link>
              <Link href="/careers" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Careers</Link>
              <Link href="/press" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Press</Link>
              <Link href="/contact" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Contact</Link>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col">
            <h4 className="overline text-[11px] uppercase text-white/35 mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Privacy</Link>
              <Link href="/terms" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Terms</Link>
              <Link href="/gdpr" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">GDPR</Link>
              <Link href="/security" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Security</Link>
              <Link href="/cookies" className="text-[14px] text-white/55 hover:text-white transition duration-120 w-fit">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[13px] text-white/35">
            &copy; {new Date().getFullYear()} TalentIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-body text-[13px] text-white/35 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="font-body text-[13px] text-white/35 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
