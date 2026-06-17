import { Application } from '@/types/domain.types'

interface ResumeTabProps {
  application: Application
}

export default function ResumeTab({ application }: ResumeTabProps) {
  const hasResume = !!application.candidate.resumeUrl

  return (
    <div className="flex flex-col lg:flex-row h-[800px]">
      {/* PDF Viewer Area - 80% */}
      <div className="flex-[4] border-r border-[#E5E7EB] bg-neutral-100 p-[24px] flex items-center justify-center">
        {hasResume ? (
          <div className="w-full h-full bg-white shadow-sm border border-neutral-200 rounded-md flex items-center justify-center overflow-hidden">
            {/* Real implementation would use iframe or react-pdf */}
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <span className="font-display text-[24px] font-bold text-neutral-300">RESUME PDF</span>
              <span className="font-body text-[14px] mt-[8px]">Preview of {application.candidate.name}'s Resume</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-500">
            <p className="font-body text-[14px]">No resume uploaded for this candidate.</p>
          </div>
        )}
      </div>

      {/* Extracted Entities Area - 20% */}
      <div className="flex-1 min-w-[280px] bg-white p-[24px] flex flex-col gap-[32px] overflow-y-auto">
        <div>
          <h3 className="font-body text-[14px] font-semibold text-neutral-900 mb-[16px]">Extracted Entities</h3>
          <p className="font-body text-[13px] text-neutral-500 mb-[16px]">
            Data automatically extracted from the resume by AI.
          </p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <h4 className="font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Skills</h4>
          <div className="flex flex-wrap gap-[8px]">
            {application.candidate.extractedSkills?.length ? (
              application.candidate.extractedSkills.map((skill, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-[10px] py-[4px] rounded-md font-body text-[12px] font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-neutral-400 italic">No skills extracted</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <h4 className="font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Companies</h4>
          <div className="flex flex-wrap gap-[8px]">
            {application.candidate.extractedCompanies?.length ? (
              application.candidate.extractedCompanies.map((company, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-[10px] py-[4px] rounded-md font-body text-[12px] font-medium">
                  {company}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-neutral-400 italic">No companies extracted</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <h4 className="font-body text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Education</h4>
          <div className="flex flex-wrap gap-[8px]">
            {application.candidate.extractedEducation?.length ? (
              application.candidate.extractedEducation.map((edu, i) => (
                <span key={i} className="bg-purple-100 text-purple-700 px-[10px] py-[4px] rounded-md font-body text-[12px] font-medium">
                  {edu}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-neutral-400 italic">No education extracted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
