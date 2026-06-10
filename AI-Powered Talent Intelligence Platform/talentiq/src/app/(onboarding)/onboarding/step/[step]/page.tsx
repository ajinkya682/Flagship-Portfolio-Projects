"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { UploadCloud, Plus, Sparkles, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { AIProcessingIndicator } from "@/components/ui/ai-processing"
import { AIScoreDemo } from "@/components/marketing/AIScoreDemo"
// Note: In a real app we'd conditionally import confetti, or use a reliable lib
import confetti from "canvas-confetti"

export default function OnboardingStepPage({ params }: { params: { step: string } }) {
  const step = parseInt(params.step, 10)
  const router = useRouter()

  // State for step 2
  const [invites, setInvites] = React.useState([{ email: "", role: "" }])
  
  // State for step 4
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [showReveal, setShowReveal] = React.useState(false)

  // State for Step 5
  React.useEffect(() => {
    if (step === 5) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#3B82F6', '#34D399']
      })
    }
  }, [step])

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (step < 5) {
      router.push(`/onboarding/step/${step + 1}`)
    } else {
      router.push("/dashboard")
    }
  }

  const handleSimulateUpload = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowReveal(true)
    }, 2000)
  }

  if (step === 1) {
    return (
      <div className="flex flex-col animate-fade-slide-up">
        <h3 className="font-display text-[24px] font-semibold text-neutral-900">
          Tell us about your company
        </h3>
        
        <form onSubmit={handleNext} className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Label>Company name</Label>
            <Input placeholder="Acme Corp" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Company logo</Label>
            <div className="flex h-[80px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-primary-500 hover:bg-primary-50">
              <UploadCloud size={20} className="text-neutral-400" />
              <span className="mt-2 font-body text-[12px] text-neutral-500">
                Click to upload or drag and drop
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <Label>Industry</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label>Company size</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="200+">200+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Timezone</Label>
            <Select required>
              <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                <SelectItem value="et">Eastern Time (ET)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-8">
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="flex flex-col animate-fade-slide-up">
        <h3 className="font-display text-[24px] font-semibold text-neutral-900">
          Bring your team in
        </h3>
        <p className="mt-2 font-body text-[15px] text-neutral-600">
          Hiring is a team sport.
        </p>

        <form onSubmit={handleNext} className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {invites.map((invite, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3">
                <div className="md:w-2/3">
                  <Input 
                    placeholder="colleague@company.com" 
                    value={invite.email}
                    onChange={(e) => {
                      const newInvites = [...invites]
                      newInvites[idx].email = e.target.value
                      setInvites(newInvites)
                    }}
                  />
                </div>
                <div className="md:w-1/3">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex">
            <Button 
              variant="ghost" 
              type="button" 
              iconLeft={<Plus size={16} />}
              onClick={() => setInvites([...invites, { email: "", role: "" }])}
            >
              Add another
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button variant="primary" type="submit" className="w-full">
              Continue
            </Button>
            <button 
              type="button" 
              onClick={() => handleNext()}
              className="font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-700"
            >
              I'll do this later
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="flex flex-col animate-fade-slide-up">
        <h3 className="font-display text-[24px] font-semibold text-neutral-900">
          Create your first job listing
        </h3>

        <form onSubmit={handleNext} className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Label>Job title</Label>
            <Input placeholder="Senior Software Engineer" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <Label>Department</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label>Location</Label>
              <Input placeholder="San Francisco, CA or Remote" required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Employment type</Label>
            <Select required>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="parttime">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between mb-1">
              <Label>Description</Label>
              <Button variant="accent" size="compact" type="button" iconLeft={<Sparkles size={14} />}>
                Generate with AI
              </Button>
            </div>
            <Textarea placeholder="Describe the role..." className="min-h-[120px]" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Required Skills</Label>
            <MultiSelect 
              options={[
                { value: "react", label: "React" },
                { value: "node", label: "Node.js" },
                { value: "ts", label: "TypeScript" },
                { value: "aws", label: "AWS" },
              ]}
              placeholder="Select skills..."
              value={[]}
              onChange={() => {}}
            />
          </div>

          <div className="mt-4 flex">
            <Button variant="primary" type="submit" className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="flex flex-col animate-fade-slide-up">
        <h3 className="font-display text-[24px] font-semibold text-neutral-900 text-center">
          See AI scoring in action
        </h3>
        <p className="mt-2 text-center font-body text-[15px] text-neutral-600">
          Upload any resume and watch TalentIQ score it live.
        </p>

        {!isProcessing && !showReveal && (
          <div className="mt-10 flex flex-col items-center">
            <div 
              onClick={handleSimulateUpload}
              className="flex h-[160px] w-full max-w-[400px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-primary-500 hover:bg-primary-50 shadow-sm"
            >
              <UploadCloud size={32} className="text-primary-500 mb-3" />
              <span className="font-body text-[14px] font-semibold text-neutral-900">
                Drop a resume here
              </span>
              <span className="mt-1 font-body text-[12px] text-neutral-500">
                PDF, DOCX up to 5MB
              </span>
            </div>
            <button 
              onClick={handleSimulateUpload}
              className="mt-6 font-body text-[14px] font-medium text-primary-500 hover:underline"
            >
              Or use a sample resume
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-16 flex flex-col items-center justify-center animate-fade-in">
            <AIProcessingIndicator 
              message="Analyzing resume... usually 5 seconds" 
            />
          </div>
        )}

        {showReveal && (
          <div className="mt-8 flex flex-col items-center">
            {/* The AIScoreDemo component already has the staggered animations built in */}
            <AIScoreDemo />

            <div className="mt-10 w-full max-w-[480px] animate-fade-slide-up" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
              <Button variant="primary" size="large" className="w-full" onClick={handleNext}>
                Explore Your Pipeline
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (step === 5) {
    return (
      <div className="flex flex-col items-center justify-center pt-10 text-center animate-fade-slide-up">
        <div className="animate-spring-in">
          <CheckCircle size={64} className="text-accent-500" strokeWidth={2.5} />
        </div>
        
        <h2 className="mt-8 font-display text-[36px] font-[800] leading-tight text-neutral-900 tracking-tight">
          You're all set.
        </h2>
        <p className="mt-3 font-body text-[18px] text-neutral-600">
          Your pipeline is ready for your first candidates.
        </p>

        <div className="mt-12 flex w-full max-w-[320px] flex-col gap-4">
          <Button variant="primary" size="large" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
          <button 
            className="font-body text-[14px] font-medium text-neutral-500 hover:text-neutral-700 hover:underline"
          >
            Invite teammates first
          </button>
        </div>
      </div>
    )
  }

  return null
}
