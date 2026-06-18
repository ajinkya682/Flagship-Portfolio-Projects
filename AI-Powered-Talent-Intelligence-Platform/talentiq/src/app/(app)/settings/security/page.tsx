'use client'

import { useState } from 'react'
import { ShieldCheck, Lock, KeyRound } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import api from '@/lib/api'

export default function SecuritySettingsPage() {
  const { user } = useCurrentUser()
  const isEnterprise = user?.company?.billing?.plan === 'enterprise'

  const [ssoEnabled, setSsoEnabled] = useState(user?.company?.ssoEnabled || false)
  const [savingSso, setSavingSso] = useState(false)
  const [ssoError, setSsoError] = useState<string | null>(null)

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState(false)

  const handleSsoToggle = async () => {
    if (!isEnterprise || !user?.company?.id) return
    
    setSavingSso(true)
    setSsoError(null)
    
    try {
      const newValue = !ssoEnabled
      await api.patch(`/companies/\${user.company.id}`, { ssoEnabled: newValue })
      setSsoEnabled(newValue)
    } catch (err: any) {
      setSsoError(err.message || 'Failed to update SSO settings')
      // revert optimistic update
      setSsoEnabled(!ssoEnabled)
    } finally {
      setSavingSso(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPassError(null)
    setPassSuccess(false)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match')
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters long')
      setIsChangingPassword(false)
      return
    }

    try {
      // Assuming a dedicated endpoint for password changes exists
      await api.post('/auth/change-password', { currentPassword, newPassword })
      setPassSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setPassSuccess(false), 3000)
    } catch (err: any) {
      setPassError(err.response?.data?.error || 'Failed to change password. Please check your current password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="flex flex-col gap-[32px] max-w-[800px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Security</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your account security and authentication methods.</p>
      </div>

      <div className="flex flex-col gap-[24px]">
        
        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] bg-blue-50 rounded-full flex items-center justify-center">
              <KeyRound size={18} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-display text-[18px] font-bold text-neutral-900">Change Password</h2>
              <p className="font-body text-[13px] text-neutral-500">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>
          
          <div className="p-[24px] flex flex-col gap-[20px]">
            {passError && (
              <div className="p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {passError}
              </div>
            )}
            {passSuccess && (
              <div className="p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
                Password updated successfully!
              </div>
            )}

            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Current Password</label>
                <input 
                  name="currentPassword" 
                  type="password" 
                  required 
                  className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="font-body text-[13px] font-semibold text-neutral-700">New Password</label>
                  <input 
                    name="newPassword" 
                    type="password" 
                    required 
                    className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="font-body text-[13px] font-semibold text-neutral-700">Confirm New Password</label>
                  <input 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-[24px] py-[16px] bg-neutral-50 border-t border-neutral-100 flex justify-end">
            <button type="submit" disabled={isChangingPassword} className="h-[38px] px-[20px] bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center gap-[8px]">
              {isChangingPassword && <LoadingSpinner size="sm" />}
              Update Password
            </button>
          </div>
        </form>

        {/* SSO Configuration */}
        <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden mb-[64px]">
          <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] bg-purple-50 rounded-full flex items-center justify-center">
                <ShieldCheck size={18} className="text-purple-500" />
              </div>
              <div>
                <h2 className="font-display text-[18px] font-bold text-neutral-900 flex items-center gap-[8px]">
                  Single Sign-On (SSO)
                  {!isEnterprise && (
                    <span className="px-[6px] py-[2px] bg-blue-50 text-blue-600 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Enterprise</span>
                  )}
                </h2>
                <p className="font-body text-[13px] text-neutral-500">Require members of your workspace to log in using your identity provider.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-[12px]">
              {savingSso && <LoadingSpinner size="sm" />}
              <button 
                onClick={handleSsoToggle}
                disabled={!isEnterprise || savingSso}
                className={`relative w-[44px] h-[24px] rounded-full transition-colors \${
                  !isEnterprise ? 'bg-neutral-200 cursor-not-allowed opacity-50' : 
                  ssoEnabled ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform \${
                  ssoEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
          
          <div className="p-[24px]">
            {ssoError && (
              <div className="mb-[16px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                {ssoError}
              </div>
            )}
            {!isEnterprise ? (
              <div className="p-[16px] bg-neutral-50 border border-neutral-200 rounded-[12px] flex items-center gap-[16px]">
                <Lock size={20} className="text-neutral-400" />
                <div>
                  <p className="font-body text-[14px] font-bold text-neutral-900">Upgrade to Enterprise</p>
                  <p className="font-body text-[13px] text-neutral-500">SSO is only available on the Enterprise plan. Please contact sales to upgrade.</p>
                </div>
              </div>
            ) : ssoEnabled ? (
              <div className="flex flex-col gap-[16px]">
                <p className="font-body text-[14px] text-neutral-600">SSO is currently enabled for your workspace. You can configure your IdP settings below.</p>
                <button className="w-fit h-[36px] px-[16px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-[8px] text-[13px] font-semibold transition-colors shadow-sm">
                  Configure SAML / OIDC
                </button>
              </div>
            ) : (
              <p className="font-body text-[14px] text-neutral-500">SSO is currently disabled. Enable it above to configure your Identity Provider.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
