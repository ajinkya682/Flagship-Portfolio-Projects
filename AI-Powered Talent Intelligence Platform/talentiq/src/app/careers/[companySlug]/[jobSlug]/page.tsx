'use client'

import { useDomainStore } from '@/store/domain.store'
import { MapPin, Briefcase, Building2, Calendar } from 'lucide-react'
import ApplicationForm from '@/components/portal/ApplicationForm'
import { notFound } from 'next/navigation'

export default function PublicJobPage({ params }: { params: { companySlug: string, jobSlug: string } }) {
  const { jobs, settings } = useDomainStore()
  
  // In a real app, we would query the backend by companySlug and jobSlug.
  // Here we check if the requested slug matches the store's settings and find the job.
  if (params.companySlug !== settings.companySlug) {
    notFound()
  }

  const job = jobs.find(j => (j.slug === params.jobSlug || j.id === params.jobSlug) && j.status === 'published')
  
  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 font-body pb-[64px]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-[20px]">
        <div className="max-w-[800px] mx-auto px-[24px] flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-display font-bold text-[18px]">
            {settings.companyName.charAt(0)}
          </div>
          <div>
            <h2 className="font-display font-bold text-[18px] text-neutral-900 leading-tight">
              {settings.companyName}
            </h2>
            <p className="text-[13px] text-neutral-500">Career Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-[24px] mt-[48px]">
        {/* Job Header */}
        <div className="mb-[32px]">
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-neutral-900 leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-[16px] mt-[16px]">
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <Building2 size={16} className="text-neutral-400" />
              {job.department}
            </div>
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <MapPin size={16} className="text-neutral-400" />
              {job.location} ({job.remote})
            </div>
            <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
              <Briefcase size={16} className="text-neutral-400" />
              {job.type}
            </div>
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-[6px] text-neutral-600 font-medium text-[14px]">
                <span className="text-emerald-600 font-semibold px-[8px] py-[2px] bg-emerald-50 rounded-full text-[12px]">
                  ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Job Description (Mocked text since store has '...' mostly) */}
        <div className="prose prose-neutral max-w-none mb-[48px] bg-white p-[32px] rounded-[24px] shadow-sm border border-neutral-100">
          <h3 className="font-display text-[18px] font-bold text-neutral-900 mb-[12px]">About the role</h3>
          <p className="text-[15px] text-neutral-600 leading-relaxed mb-[24px]">
            {job.description === '...' ? 'We are looking for an experienced professional to join our team. You will be responsible for driving key initiatives and working closely with cross-functional teams to deliver high-quality results. If you are passionate about what you do and thrive in a fast-paced environment, we want to hear from you.' : job.description}
          </p>

          <h3 className="font-display text-[18px] font-bold text-neutral-900 mb-[12px]">Requirements</h3>
          <ul className="list-disc pl-[20px] text-[15px] text-neutral-600 space-y-[8px]">
            {job.requirements?.map((req, i) => <li key={i}>{req}</li>) || (
              <>
                <li>5+ years of relevant experience.</li>
                <li>Strong communication and collaboration skills.</li>
                <li>Proven track record of delivering results.</li>
              </>
            )}
          </ul>
        </div>

        {/* Application Form Component */}
        <div id="apply">
          <h3 className="font-display text-[24px] font-bold text-neutral-900 mb-[16px]">Apply for this job</h3>
          <ApplicationForm job={job} companySlug={params.companySlug} />
        </div>
      </div>
    </div>
  )
}
