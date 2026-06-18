'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuthStore } from '@/store/auth.store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import api from '@/lib/api'

export default function SettingsPage() {
  const { user } = useCurrentUser()
  const { setUser } = useAuthStore()
  
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [workspaceSuccess, setWorkspaceSuccess] = useState(false)
  
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState(user?.company?.logo || '')
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [workspaceName, setWorkspaceName] = useState(user?.company?.name || '')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'avatar') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      if (type === 'logo') setWorkspaceError("Logo must be less than 2MB.")
      else setProfileError("Avatar must be less than 2MB.")
      return
    }

    if (type === 'logo') setIsUploadingLogo(true)
    else setIsUploadingAvatar(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      
      if (type === 'logo') setLogoUrl(data.url)
      else setAvatarUrl(data.url)
    } catch (err) {
      console.error(err)
      if (type === 'logo') setWorkspaceError("Failed to upload logo")
      else setProfileError("Failed to upload avatar")
    } finally {
      if (type === 'logo') setIsUploadingLogo(false)
      else setIsUploadingAvatar(false)
    }
  }

  const handleWorkspaceSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.company?.id) return

    setIsSavingWorkspace(true)
    setWorkspaceError(null)
    setWorkspaceSuccess(false)
    
    // Auto-generate slug from workspace name
    const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    try {
      const { data } = await api.patch(`/companies/${user.company.id}`, { name: workspaceName, slug, logo: logoUrl })
      
      setUser({
        ...user,
        company: {
          ...user.company,
          name: data.company.name,
          slug: data.company.slug,
          logo: data.company.logo,
        }
      })
      
      setWorkspaceSuccess(true)
      setTimeout(() => setWorkspaceSuccess(false), 3000)
    } catch (err: any) {
      setWorkspaceError(err.response?.data?.error || 'Failed to save workspace changes')
    } finally {
      setIsSavingWorkspace(false)
    }
  }

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id) return

    setIsSavingProfile(true)
    setProfileError(null)
    setProfileSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('userName') as string

    try {
      const { data } = await api.patch(`/users/${user.id}`, { name, avatar: avatarUrl })
      
      setUser({
        ...user,
        name: data.name,
        avatar: data.avatar,
      })
      
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Failed to save profile changes')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const derivedSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'company-slug';

  return (
    <div className="flex flex-col gap-[32px] max-w-[800px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">General Settings</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your personal profile and workspace details.</p>
      </div>

      {/* --- WORKSPACE SETTINGS --- */}
      <form onSubmit={handleWorkspaceSave} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-display text-[18px] font-bold text-neutral-900">Workspace Details</h2>
          <p className="font-body text-[13px] text-neutral-500">Update your company name and branding.</p>
        </div>
        
        <div className="p-[24px] flex flex-col gap-[24px]">
          {workspaceError && (
            <div className="p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
              {workspaceError}
            </div>
          )}
          {workspaceSuccess && (
            <div className="p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
              Workspace settings saved successfully!
            </div>
          )}

          <div className="flex flex-col gap-[16px]">
            <h3 className="font-display text-[14px] font-bold text-neutral-900">Workspace Logo</h3>
            <div className="flex items-center gap-[20px]">
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="w-[80px] h-[80px] rounded-[16px] border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer group overflow-hidden relative shrink-0"
              >
                <input 
                  type="file" accept="image/jpeg, image/png, image/svg+xml, image/gif" 
                  className="hidden" ref={logoInputRef} onChange={(e) => handleUpload(e, 'logo')}
                />
                {isUploadingLogo ? (
                  <LoadingSpinner size="sm" />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Workspace Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={20} className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              <div>
                <button 
                  type="button" onClick={() => logoInputRef.current?.click()}
                  className="h-[34px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[12px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors"
                >
                  Upload Image
                </button>
                <p className="font-body text-[11px] text-neutral-400 mt-[8px]">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Workspace Name</label>
            <input 
              name="companyName" 
              type="text" 
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required 
              className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700 flex items-center justify-between">
              Career Site URL
              <span className="text-[11px] font-normal text-neutral-400">Auto-generated</span>
            </label>
            <div className="flex opacity-70">
              <span className="inline-flex items-center px-[12px] bg-neutral-100 border border-r-0 border-neutral-200 rounded-l-[8px] text-[13px] text-neutral-500 font-mono">
                talentiq.co/careers/
              </span>
              <input 
                type="text" 
                value={derivedSlug} 
                disabled 
                className="flex-1 h-[40px] px-[12px] bg-neutral-50 border border-neutral-200 rounded-r-[8px] text-[13px] font-mono text-neutral-500 cursor-not-allowed" 
              />
            </div>
          </div>
        </div>
        
        <div className="px-[24px] py-[16px] bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button type="submit" disabled={isSavingWorkspace} className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center gap-[8px]">
            {isSavingWorkspace && <LoadingSpinner size="sm" />}
            Save Workspace
          </button>
        </div>
      </form>

      {/* --- PROFILE SETTINGS --- */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden mb-[64px]">
        <div className="p-[24px] border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-display text-[18px] font-bold text-neutral-900">Personal Profile</h2>
          <p className="font-body text-[13px] text-neutral-500">Manage your personal account details.</p>
        </div>
        
        <div className="p-[24px] flex flex-col gap-[24px]">
          {profileError && (
            <div className="p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
              Profile settings saved successfully!
            </div>
          )}

          <div className="flex flex-col gap-[16px]">
            <h3 className="font-display text-[14px] font-bold text-neutral-900">Profile Logo</h3>
            <div className="flex items-center gap-[20px]">
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="w-[80px] h-[80px] rounded-full border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer group overflow-hidden relative shrink-0"
              >
                <input 
                  type="file" accept="image/jpeg, image/png, image/svg+xml, image/gif" 
                  className="hidden" ref={avatarInputRef} onChange={(e) => handleUpload(e, 'avatar')}
                />
                {isUploadingAvatar ? (
                  <LoadingSpinner size="sm" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Profile Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={20} className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              <div>
                <button 
                  type="button" onClick={() => avatarInputRef.current?.click()}
                  className="h-[34px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[12px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors"
                >
                  Upload Image
                </button>
                <p className="font-body text-[11px] text-neutral-400 mt-[8px]">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[6px]">
              <label className="font-body text-[13px] font-semibold text-neutral-700">Full Name</label>
              <input 
                name="userName" 
                type="text" 
                defaultValue={user?.name || ''} 
                required 
                className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="font-body text-[13px] font-semibold text-neutral-700 flex items-center justify-between">
                Email Address
                <span className="text-[11px] font-normal text-neutral-400">Read-only</span>
              </label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="h-[40px] px-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-500 cursor-not-allowed" 
              />
            </div>
          </div>
        </div>
        
        <div className="px-[24px] py-[16px] bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button type="submit" disabled={isSavingProfile} className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center gap-[8px]">
            {isSavingProfile && <LoadingSpinner size="sm" />}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}
