import Link from 'next/link';
import { User, Building2, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to TalentIQ | Login',
  description: 'Choose your login portal for TalentIQ',
};

export default function LoginSelectionPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      <div className="mb-[40px] text-center">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-[1.2] mb-[12px]">
          Welcome back to TalentIQ
        </h1>
        <p className="text-[15px] text-neutral-500">
          Please select the portal you want to sign in to.
        </p>
      </div>

      {/* Selection Cards */}
      <div className="flex flex-col gap-[16px]">
        {/* Candidate Portal */}
        <Link
          href="/candidate/login"
          className="group relative w-full flex items-center gap-[20px] p-[20px] sm:p-[24px] rounded-[20px] border-2 border-neutral-100 hover:border-blue-500 bg-white hover:bg-blue-50/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] transition-all duration-300 overflow-hidden"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <User size={24} className="stroke-[2.5]" />
          </div>
          
          <div className="flex-1 text-left relative z-10">
            <h3 className="font-display text-[16px] sm:text-[18px] font-bold text-neutral-900 group-hover:text-blue-700 transition-colors mb-[4px]">
              Candidate Portal
            </h3>
            <p className="text-[12px] sm:text-[13px] text-neutral-500 group-hover:text-neutral-600 transition-colors">
              View applications, interviews, and offers.
            </p>
          </div>
          
          <div className="hidden sm:flex w-[32px] h-[32px] rounded-full bg-neutral-50 items-center justify-center text-neutral-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all duration-300 relative z-10 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </Link>

        {/* Business Portal */}
        <Link
          href="/user/login"
          className="group relative w-full flex items-center gap-[20px] p-[20px] sm:p-[24px] rounded-[20px] border-2 border-neutral-100 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] transition-all duration-300 overflow-hidden"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Building2 size={24} className="stroke-[2.5]" />
          </div>
          
          <div className="flex-1 text-left relative z-10">
            <h3 className="font-display text-[16px] sm:text-[18px] font-bold text-neutral-900 group-hover:text-indigo-700 transition-colors mb-[4px]">
              Business Owner
            </h3>
            <p className="text-[12px] sm:text-[13px] text-neutral-500 group-hover:text-neutral-600 transition-colors">
              Manage your pipeline, jobs, and settings.
            </p>
          </div>
          
          <div className="hidden sm:flex w-[32px] h-[32px] rounded-full bg-neutral-50 items-center justify-center text-neutral-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all duration-300 relative z-10 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Footer Area */}
      <div className="mt-[32px] pt-[24px] border-t border-neutral-100 text-center">
        <p className="text-[13px] text-neutral-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
            Sign up as a business
          </Link>
        </p>
      </div>
    </div>
  );
}
