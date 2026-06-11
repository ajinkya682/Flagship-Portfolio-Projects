import ApplicationForm from '@/components/portal/ApplicationForm'
import { MapPin, Briefcase } from 'lucide-react'

export default function ApplyPage({ params }: { params: { jobId: string } }) {
  return (
    <div className="max-w-[800px] mx-auto px-[24px] py-[48px]">
      
      {/* Job Summary Card */}
      <div className="mb-[32px]">
        <h1 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 leading-tight">
          Senior Frontend Engineer
        </h1>
        <div className="flex items-center gap-[16px] mt-[12px]">
          <div className="flex items-center gap-[6px] text-neutral-500 font-body text-[14px]">
            <MapPin size={16} />
            Remote
          </div>
          <div className="flex items-center gap-[6px] text-neutral-500 font-body text-[14px]">
            <Briefcase size={16} />
            Full-time
          </div>
        </div>
      </div>

      <ApplicationForm />
      
    </div>
  )
}
