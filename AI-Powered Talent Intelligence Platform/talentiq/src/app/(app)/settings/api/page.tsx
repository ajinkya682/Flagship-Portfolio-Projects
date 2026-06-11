import APIKeyDisplay from '@/components/settings/APIKeyDisplay'

export default function APIPage() {
  return (
    <div>
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">API Access</h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your API keys for custom integrations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
        <APIKeyDisplay />
        
        <div className="mt-[32px] pt-[32px] border-t border-neutral-100 font-body max-w-[600px]">
          <h4 className="text-[16px] font-semibold text-neutral-900 mb-[8px]">API Documentation</h4>
          <p className="text-[14px] text-neutral-600 mb-[16px]">
            Explore our comprehensive API documentation to learn how to build custom workflows, sync data, and extend TalentIQ.
          </p>
          <button className="text-[13px] font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors">
            View Documentation &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
