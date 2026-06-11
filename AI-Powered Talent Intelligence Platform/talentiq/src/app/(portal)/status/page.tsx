import ApplicationStatusTimeline from '@/components/portal/ApplicationStatusTimeline'
import { Calendar, Video } from 'lucide-react'

export default function StatusPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[24px] py-[48px]">
      
      <div className="mb-[40px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Hi Jane,
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
          Here is the status of your application for <strong className="text-neutral-900">Senior Frontend Engineer</strong> at Acme Corp.
        </p>
      </div>

      <ApplicationStatusTimeline />

      <div className="mt-[32px] bg-white border border-neutral-200 rounded-[16px] p-[32px]">
        <h3 className="font-display text-[18px] font-bold text-neutral-900">Next Step: Technical Interview</h3>
        <p className="font-body text-[14px] text-neutral-600 mt-[8px] max-w-[500px] leading-relaxed">
          We&apos;d love to invite you to a 45-minute technical interview with our engineering manager. Please schedule a time that works best for you.
        </p>

        <div className="mt-[24px] flex flex-col sm:flex-row gap-[16px]">
          <button className="flex-1 h-[48px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center gap-[8px] transition-colors">
            <Calendar size={18} /> Schedule Interview
          </button>
          <button className="flex-1 h-[48px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold rounded-lg flex items-center justify-center gap-[8px] transition-colors">
            <Video size={18} /> Test Video Setup
          </button>
        </div>
      </div>

      <div className="mt-[48px] flex justify-center">
        <button className="text-[14px] font-medium text-neutral-500 hover:text-neutral-700 underline">
          Have questions? Contact recruiting
        </button>
      </div>

    </div>
  )
}
