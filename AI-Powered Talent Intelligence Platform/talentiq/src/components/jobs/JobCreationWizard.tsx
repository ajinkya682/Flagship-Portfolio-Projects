'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, Sparkles, Briefcase, FileText, ListChecks, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Basic Info', icon: Briefcase },
  { id: 2, label: 'Description', icon: FileText },
  { id: 3, label: 'Requirements', icon: ListChecks },
  { id: 4, label: 'Review', icon: Eye },
]

type JobData = {
  title: string
  department: string
  location: string
  employmentType: string
  salary: string
  description: string
  requirements: string[]
  skills: string[]
}

export default function JobCreationWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    salary: '',
    description: '',
    requirements: [''],
    skills: [],
  })

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleGenerateDescription = async () => {
    if (!jobData.title) return
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setJobData(prev => ({
        ...prev,
        description: `We are looking for a talented ${prev.title} to join our team. In this role, you will be responsible for driving key initiatives, collaborating with cross-functional teams, and delivering exceptional results that align with our company mission.

The ideal candidate brings a strong track record of success, a passion for innovation, and the ability to thrive in a fast-paced, collaborative environment. You will have significant ownership over your work and direct impact on our business outcomes.`
      }))
      setIsGenerating(false)
    }, 1800)
  }

  const handlePublish = () => {
    router.push('/jobs')
  }

  const updateField = <K extends keyof JobData>(field: K, value: JobData[K]) => {
    setJobData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-[32px] font-body">
      {/* Progress Steps */}
      <div className="flex items-center">
        {STEPS.map((s, index) => {
          const Icon = s.icon
          const isCompleted = step > s.id
          const isActive = step === s.id
          
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div 
                onClick={() => step > s.id && setStep(s.id)}
                className={cn(
                  "flex items-center gap-[8px] cursor-default",
                  step > s.id && "cursor-pointer"
                )}
              >
                <div className={cn(
                  "w-[32px] h-[32px] rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isCompleted ? "bg-primary-500 border-primary-500 text-white" :
                  isActive ? "bg-white border-primary-500 text-primary-500" :
                  "bg-neutral-50 border-neutral-200 text-neutral-400"
                )}>
                  {isCompleted ? <Check size={16} /> : <Icon size={14} />}
                </div>
                <span className={cn(
                  "text-[13px] font-medium whitespace-nowrap hidden md:block",
                  isActive ? "text-primary-700" :
                  isCompleted ? "text-neutral-700" : "text-neutral-400"
                )}>
                  {s.label}
                </span>
              </div>
              
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-[2px] mx-[12px] transition-colors duration-300",
                  step > s.id ? "bg-primary-400" : "bg-neutral-200"
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[32px]">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-[24px]">
            <div>
              <h2 className="font-display text-[22px] font-semibold text-neutral-900">Basic Information</h2>
              <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Start with the essentials about this role.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="md:col-span-2 flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Job Title *</label>
                <input
                  type="text"
                  value={jobData.title}
                  onChange={e => updateField('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-[44px] px-[14px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Department *</label>
                <select
                  value={jobData.department}
                  onChange={e => updateField('department', e.target.value)}
                  className="h-[44px] px-[14px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 bg-white transition-all"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Employment Type *</label>
                <select
                  value={jobData.employmentType}
                  onChange={e => updateField('employmentType', e.target.value)}
                  className="h-[44px] px-[14px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 bg-white transition-all"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Location *</label>
                <input
                  type="text"
                  value={jobData.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="h-[44px] px-[14px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">Salary Range</label>
                <input
                  type="text"
                  value={jobData.salary}
                  onChange={e => updateField('salary', e.target.value)}
                  placeholder="e.g. $120,000 - $160,000"
                  className="h-[44px] px-[14px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="flex flex-col gap-[24px]">
            <div>
              <h2 className="font-display text-[22px] font-semibold text-neutral-900">Job Description</h2>
              <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Write a compelling description or let AI generate one.</p>
            </div>

            <div className="flex items-center gap-[12px] p-[16px] bg-accent-50 rounded-lg border border-accent-200">
              <Sparkles size={20} className="text-accent-600 shrink-0" />
              <div className="flex-grow">
                <p className="font-body text-[13px] font-semibold text-neutral-900">AI-Powered Description</p>
                <p className="font-body text-[12px] text-neutral-600 mt-[2px]">
                  Generate a professional job description instantly based on your job title and department.
                </p>
              </div>
              <button
                onClick={handleGenerateDescription}
                disabled={!jobData.title || isGenerating}
                className="bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body text-[13px] font-medium px-[14px] py-[8px] rounded-md transition-colors shrink-0 flex items-center gap-[6px]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Description</label>
              <textarea
                value={jobData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                rows={12}
                className="px-[14px] py-[12px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-all resize-y leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <div className="flex flex-col gap-[24px]">
            <div>
              <h2 className="font-display text-[22px] font-semibold text-neutral-900">Requirements & Skills</h2>
              <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Define what you're looking for in candidates.</p>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Requirements</label>
              <p className="text-[12px] text-neutral-500">List the must-have qualifications, one per line.</p>
              {jobData.requirements.map((req, i) => (
                <div key={i} className="flex gap-[8px] items-center">
                  <span className="w-[6px] h-[6px] rounded-full bg-primary-400 shrink-0" />
                  <input
                    type="text"
                    value={req}
                    onChange={e => {
                      const updated = [...jobData.requirements]
                      updated[i] = e.target.value
                      updateField('requirements', updated)
                    }}
                    placeholder={`Requirement ${i + 1}`}
                    className="flex-1 h-[40px] px-[12px] rounded-md border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-all"
                  />
                  {jobData.requirements.length > 1 && (
                    <button
                      onClick={() => updateField('requirements', jobData.requirements.filter((_, j) => j !== i))}
                      className="text-neutral-400 hover:text-red-500 text-[18px] transition-colors leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => updateField('requirements', [...jobData.requirements, ''])}
                className="text-primary-500 font-body text-[13px] font-medium hover:text-primary-600 transition-colors w-fit mt-[4px]"
              >
                + Add requirement
              </button>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[13px] font-semibold text-neutral-700">Key Skills</label>
              <p className="text-[12px] text-neutral-500">These will be used by AI to score candidates. Click to add.</p>
              <div className="flex flex-wrap gap-[8px]">
                {['TypeScript', 'React', 'Node.js', 'AWS', 'Python', 'SQL', 'System Design', 'Leadership', 'Communication', 'Agile'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      const updated = jobData.skills.includes(skill)
                        ? jobData.skills.filter(s => s !== skill)
                        : [...jobData.skills, skill]
                      updateField('skills', updated)
                    }}
                    className={cn(
                      "px-[12px] py-[6px] rounded-full font-body text-[12px] font-medium transition-all border",
                      jobData.skills.includes(skill)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-600"
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="flex flex-col gap-[24px]">
            <div>
              <h2 className="font-display text-[22px] font-semibold text-neutral-900">Review & Publish</h2>
              <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Review your job posting before publishing.</p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-[20px] flex flex-col gap-[16px] border border-neutral-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-[18px] font-semibold text-neutral-900">
                    {jobData.title || 'Untitled Position'}
                  </h3>
                  <div className="flex gap-[12px] mt-[6px]">
                    {jobData.department && <span className="font-body text-[13px] text-neutral-500">{jobData.department}</span>}
                    {jobData.location && <span className="font-body text-[13px] text-neutral-500">{jobData.location}</span>}
                    {jobData.employmentType && <span className="font-body text-[13px] text-neutral-500">{jobData.employmentType}</span>}
                  </div>
                </div>
                <span className="bg-accent-100 text-accent-700 text-[10px] font-bold px-[10px] py-[3px] rounded-full uppercase tracking-wider">
                  Ready to Publish
                </span>
              </div>

              {jobData.description && (
                <div>
                  <h4 className="font-body text-[13px] font-semibold text-neutral-700 mb-[6px]">Description</h4>
                  <p className="font-body text-[13px] text-neutral-600 leading-relaxed line-clamp-4">
                    {jobData.description}
                  </p>
                </div>
              )}

              {jobData.requirements.filter(r => r.trim()).length > 0 && (
                <div>
                  <h4 className="font-body text-[13px] font-semibold text-neutral-700 mb-[6px]">Requirements</h4>
                  <ul className="flex flex-col gap-[4px]">
                    {jobData.requirements.filter(r => r.trim()).map((req, i) => (
                      <li key={i} className="flex items-start gap-[8px] font-body text-[13px] text-neutral-600">
                        <span className="w-[5px] h-[5px] rounded-full bg-primary-400 mt-[6px] shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {jobData.skills.length > 0 && (
                <div>
                  <h4 className="font-body text-[13px] font-semibold text-neutral-700 mb-[8px]">AI Scoring Skills</h4>
                  <div className="flex flex-wrap gap-[6px]">
                    {jobData.skills.map(skill => (
                      <span key={skill} className="bg-primary-100 text-primary-700 px-[10px] py-[3px] rounded-full text-[11px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-[16px] bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-[12px]">
              <Sparkles size={18} className="text-blue-500 mt-[2px] shrink-0" />
              <div>
                <p className="font-body text-[13px] font-semibold text-neutral-900">AI Scoring Ready</p>
                <p className="font-body text-[12px] text-neutral-600 mt-[2px]">
                  Once published, TalentIQ will automatically score every applicant using your specified skills and requirements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={cn(
            "flex items-center gap-[6px] font-body text-[14px] font-medium px-[16px] py-[10px] rounded-md transition-colors",
            step === 1 
              ? "text-neutral-300 cursor-not-allowed" 
              : "text-neutral-600 hover:bg-neutral-100"
          )}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-[8px]">
          <span className="font-body text-[13px] text-neutral-400">
            Step {step} of {STEPS.length}
          </span>
          
          {step < STEPS.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[20px] py-[10px] rounded-md transition-colors shadow-sm"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex items-center gap-[6px] bg-accent-500 hover:bg-accent-600 text-white font-body text-[14px] font-medium px-[20px] py-[10px] rounded-md transition-colors shadow-sm"
            >
              <Sparkles size={16} />
              Publish Job
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
