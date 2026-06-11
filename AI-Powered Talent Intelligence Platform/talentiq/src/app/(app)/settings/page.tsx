import SettingSection from '@/components/settings/SettingSection'

export default function GeneralSettingsPage() {
  return (
    <div>
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">General Settings</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your company details and workspace preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
        
        <SettingSection title="Company Information" description="Update your company name, logo, and website.">
          <div className="flex flex-col gap-[20px] max-w-[600px] font-body">
            
            <div className="flex items-start gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <label className="text-[13px] font-semibold text-neutral-700">Company Logo</label>
                <div className="w-[80px] h-[80px] rounded-lg bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer">
                  <span className="text-[12px] font-medium">Upload</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Company Name</label>
              <input 
                type="text" 
                defaultValue="Acme Corp"
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Website URL</label>
              <input 
                type="url" 
                defaultValue="https://acme.com"
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500"
              />
            </div>

          </div>
        </SettingSection>

        <SettingSection title="Localization" description="Set your timezone and preferred currency.">
          <div className="flex flex-col gap-[20px] max-w-[600px] font-body">
            
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Timezone</label>
              <select className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 bg-white">
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Currency</label>
              <select className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 bg-white">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

          </div>
        </SettingSection>

        <div className="flex justify-end pt-[24px] border-t border-neutral-200 mt-[32px]">
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[24px] py-[10px] rounded-md transition-colors shadow-sm">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}
