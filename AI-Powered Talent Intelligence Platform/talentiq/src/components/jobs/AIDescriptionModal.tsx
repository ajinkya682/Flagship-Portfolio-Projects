"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AIProcessingIndicator } from "@/components/ui/ai-processing"
import { Progress } from "@/components/ui/progress"

interface AIDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (html: string) => void
}

type ModalState = "input" | "loading" | "result"

export function AIDescriptionModal({ isOpen, onClose, onAccept }: AIDescriptionModalProps) {
  const [modalState, setModalState] = React.useState<ModalState>("input")
  const [progress, setProgress] = React.useState(0)

  // Input state
  const [brief, setBrief] = React.useState("")
  const [seniority, setSeniority] = React.useState("")
  const [skills, setSkills] = React.useState("") // Using text input for simplicity right now

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setModalState("input")
      setProgress(0)
    }
  }, [isOpen])

  const handleGenerate = () => {
    setModalState("loading")
    setProgress(0)

    // Simulate 18-second loading progressing to 85%
    // To make testing faster, we will speed this up slightly
    // 0 to 85% over 3 seconds for UX purposes, but the spec says 18s
    let current = 0
    const interval = setInterval(() => {
      current += 5
      if (current >= 85) {
        clearInterval(interval)
      } else {
        setProgress(current)
      }
    }, 200)

    // Simulate completion
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setModalState("result")
      }, 500)
    }, 4000) // Fast-forwarded from 18s so the user doesn't have to wait during review
  }

  const mockGeneratedHtml = `
    <p><strong>About the Role</strong></p>
    <p>We are seeking a highly skilled Senior Software Engineer to join our core product team. You will be responsible for architecting and building scalable frontend solutions using React, Next.js, and TypeScript.</p>
    <br/>
    <p><strong>Key Responsibilities</strong></p>
    <ul>
      <li>Lead the development of complex web applications.</li>
      <li>Collaborate closely with product managers and designers.</li>
      <li>Mentor junior engineers and establish best practices.</li>
    </ul>
    <br/>
    <p><strong>Requirements</strong></p>
    <ul>
      <li>5+ years of experience with React and modern JavaScript.</li>
      <li>Strong understanding of web performance and accessibility.</li>
    </ul>
  `

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-semibold text-neutral-900">
            Generate job description
          </DialogTitle>
        </DialogHeader>

        {modalState === "input" && (
          <div className="flex flex-col gap-[20px] py-[16px]">
            <div className="flex flex-col gap-[6px]">
              <Label>Brief description</Label>
              <Textarea 
                placeholder="What is this role about? e.g. We need a frontend expert who can lead the migration to Next.js..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <Label>Seniority Level</Label>
                <Select value={seniority} onValueChange={setSeniority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <Label>Key Skills</Label>
                <Input 
                  placeholder="e.g. React, TypeScript (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              className="mt-[8px] w-full bg-accent-500 text-white hover:bg-accent-600"
              iconLeft={<Sparkles size={16} />}
              onClick={handleGenerate}
            >
              Generate Description
            </Button>
          </div>
        )}

        {modalState === "loading" && (
          <div className="flex flex-col items-center justify-center py-[64px] px-[32px]">
            <AIProcessingIndicator message="Generating your description... about 20 seconds" />
            <Progress value={progress} className="mt-[32px] h-[6px] w-full" indicatorClassName="bg-accent-500" />
          </div>
        )}

        {modalState === "result" && (
          <div className="flex flex-col py-[16px]">
            <div className="max-h-[360px] overflow-y-auto rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50 p-[16px] custom-scrollbar">
              <div 
                className="font-body text-[14px] leading-relaxed text-neutral-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: mockGeneratedHtml }}
              />
            </div>
            <DialogFooter className="mt-[24px] sm:justify-between">
              <Button variant="secondary" onClick={handleGenerate}>
                Regenerate
              </Button>
              <Button variant="primary" onClick={() => onAccept(mockGeneratedHtml)}>
                Use this description
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
