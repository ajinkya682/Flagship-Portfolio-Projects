'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuthStore } from '@/store/auth.store'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import api from '@/lib/api'

export default function SettingsPage() {
  const { user } = useCurrentUser()
  const { setUser } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSettingsSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.company?.id) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('companyName') as string
    const slug = formData.get('companySlug') as string

    try {
      const { data } = await api.patch(`/companies/${user.company.id}`, { name, slug })
      
      // Update global auth store with new company name/slug
      setUser({
        ...user,
        company: {
          ...user.company,
          name: data.company.name,
          slug: data.company.slug,
        }
      })
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">General Settings</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your workspace preferences.</p>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
        <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[4px]">Workspace Logo</h3>
        <p className="font-body text-[13px] text-neutral-500 mb-[16px]">This logo will appear on your career site and emails.</p>
        <div className="flex items-center gap-[20px]">
          <div className="w-[80px] h-[80px] rounded-[16px] border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer group overflow-hidden">
            <Upload size={20} className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <button className="h-[34px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[12px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors">
              Upload Image
            </button>
            <p className="font-body text-[11px] text-neutral-400 mt-[8px]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSettingsSave} className="bg-white rounded-[16px] border border-neutral-100 shadow-sm p-[24px]">
        <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[20px]">Workspace Details</h3>
        
        {error && (
          <div className="mb-[16px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-[16px] p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body">
            Settings saved successfully!
          </div>
        )}

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Workspace Name</label>
            <input name="companyName" type="text" defaultValue={user?.company?.name || ''} required className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Career Site URL</label>
            <div className="flex">
              <span className="inline-flex items-center px-[12px] bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-[8px] text-[13px] text-neutral-500 font-mono">
                talentiq.co/careers/
              </span>
              <input name="companySlug" type="text" defaultValue={user?.company?.slug || user?.company?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''} required className="flex-1 h-[40px] px-[12px] bg-white border border-neutral-200 rounded-r-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
            </div>
          </div>
        </div>
        <div className="mt-[24px] pt-[20px] border-t border-neutral-100 flex items-center justify-between">
          <button type="submit" disabled={isSaving} className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center gap-[8px]">
            {isSaving && <LoadingSpinner size="sm" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
