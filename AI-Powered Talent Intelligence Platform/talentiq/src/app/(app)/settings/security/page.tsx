import SettingSection from '@/components/settings/SettingSection'
import { ShieldCheck, KeyRound, Smartphone } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div>
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Security</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your account security and authentication methods.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
        
        <SettingSection title="Two-Factor Authentication (2FA)">
          <div className="flex items-center justify-between p-[16px] border border-neutral-200 rounded-lg bg-neutral-50 font-body">
            <div className="flex items-center gap-[16px]">
              <div className="w-[40px] h-[40px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[15px] font-semibold text-neutral-900">2FA is enabled</span>
                <span className="text-[13px] text-neutral-500">Your account is secured with an authenticator app.</span>
              </div>
            </div>
            <button className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 bg-white px-[12px] py-[6px] rounded-md transition-colors">
              Manage
            </button>
          </div>
        </SettingSection>

        <SettingSection title="Single Sign-On (SSO)" description="Available on Enterprise plans.">
          <div className="flex items-center justify-between p-[16px] border border-neutral-200 rounded-lg bg-white font-body opacity-60">
            <div className="flex items-center gap-[16px]">
              <div className="w-[40px] h-[40px] rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[15px] font-semibold text-neutral-900">SAML SSO Configuration</span>
                <span className="text-[13px] text-neutral-500">Not configured. Upgrade to enable.</span>
              </div>
            </div>
            <button className="text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </SettingSection>

      </div>
    </div>
  )
}
