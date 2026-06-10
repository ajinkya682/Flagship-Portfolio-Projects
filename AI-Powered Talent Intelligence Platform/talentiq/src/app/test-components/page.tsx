"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/toaster"
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { AIProcessingIndicator } from "@/components/ui/ai-processing"
import { Skeleton } from "@/components/ui/skeleton"
import { ScoreRing } from "@/components/score/ScoreRing"
import { BiasWarningPanel } from "@/components/score/BiasWarningPanel"

export default function ComponentsTestPage() {
  const [remountScore, setRemountScore] = React.useState(0)

  // Quick helper to force a remount of the ScoreRings to see animation again
  const triggerScoreAnimation = () => setRemountScore(prev => prev + 1)

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-body pb-32">
      <div className="mx-auto max-w-4xl space-y-12 rounded-xl bg-white p-8 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">UI Components Test</h1>
          <p className="text-neutral-500">Testing Modals, Toasts, AI Indicators, Skeletons, and Score Rings.</p>
        </div>

        {/* 1. Modal Testing */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="font-display text-xl font-semibold">1. Modals</h2>
          <div className="flex flex-wrap gap-4">
            {/* Small Modal */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Small Modal (sm)</Button>
              </ModalTrigger>
              <ModalContent size="sm">
                <ModalHeader title="Small Modal" subtitle="Width 400px" />
                <ModalBody>Perfect for simple confirmations or small forms.</ModalBody>
                <ModalFooter />
              </ModalContent>
            </Modal>

            {/* Medium Modal */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="primary">Standard Modal (md)</Button>
              </ModalTrigger>
              <ModalContent size="md">
                <ModalHeader title="Standard Modal" subtitle="Width 560px. Default size." />
                <ModalBody>
                  <p>This modal includes a standard confirmation layout.</p>
                </ModalBody>
                <ModalFooter onCancel={() => {}} onConfirm={() => {}} />
              </ModalContent>
            </Modal>

            {/* Large Modal */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Large Modal (lg)</Button>
              </ModalTrigger>
              <ModalContent size="lg">
                <ModalHeader title="Large Modal" subtitle="Width 720px" />
                <ModalBody>Used for complex forms or detailed views.</ModalBody>
                <ModalFooter />
              </ModalContent>
            </Modal>

            {/* Full Modal */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="secondary">Full Modal (full)</Button>
              </ModalTrigger>
              <ModalContent size="full">
                <ModalHeader title="Full Screen Modal" subtitle="Width 95vw, Height 95vh" />
                <ModalBody className="h-[2000px] bg-neutral-50 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center m-6">
                  <span className="text-neutral-400">Scrollable Content Area</span>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* 2. Toast Testing */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="font-display text-xl font-semibold">2. Toasts</h2>
          <p className="text-sm text-neutral-500 mb-4">Click to trigger toasts. Max 3 visible at a time. Auto-dismiss timers applied.</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary" 
              className="border-[#10B981] text-[#10B981] hover:bg-[#F0FDF4]"
              onClick={() => toast.success("Candidate added successfully", "They have been moved to the Pipeline.")}
            >
              Success Toast
            </Button>
            <Button 
              variant="secondary"
              className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
              onClick={() => toast.error("Failed to parse resume", "The file format is not supported. Please upload a PDF.")}
            >
              Error Toast (Manual)
            </Button>
            <Button 
              variant="secondary"
              className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#FFFBEB]"
              onClick={() => toast.warning("Missing contact info", "This candidate doesn't have an email address listed.")}
            >
              Warning Toast
            </Button>
            <Button 
              variant="secondary"
              className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF]"
              onClick={() => toast.info("AI Analysis complete", "You can now view the detailed scorecard.")}
            >
              Info Toast
            </Button>
          </div>
        </section>

        {/* 3. AI Processing Indicator */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="font-display text-xl font-semibold">3. AI Processing Indicator</h2>
          <div className="grid gap-8 sm:grid-cols-2 rounded-xl bg-neutral-50 p-8 border border-neutral-200">
            <AIProcessingIndicator message="Analyzing resume skills... usually 5 seconds" />
            <AIProcessingIndicator message="Generating interview questions..." />
          </div>
        </section>

        {/* 4. Skeletons */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="font-display text-xl font-semibold">4. Skeleton Shimmer</h2>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton variant="avatar" />
              <div className="flex flex-col gap-2 w-full max-w-sm">
                <Skeleton variant="heading" />
                <Skeleton variant="text" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Skeleton variant="ring" />
              <Skeleton variant="badge" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          </div>
        </section>

        {/* 5. Score Ring & Bias Warning */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">5. Score Ring & Bias Panel</h2>
            <Button variant="secondary" size="compact" onClick={triggerScoreAnimation}>
              Re-trigger Animation
            </Button>
          </div>
          
          <div key={remountScore} className="flex flex-col gap-8">
            <div className="flex items-end gap-8 bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={92} size="sm" />
                <span className="text-white text-xs">Small (32px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={75} size="md" />
                <span className="text-white text-xs">Medium (72px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={45} size="lg" />
                <span className="text-white text-xs">Large (80px)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={88} size="xl" />
                <span className="text-white text-xs">XL (100px)</span>
              </div>
            </div>

            <BiasWarningPanel 
              severity="high"
              flags={[
                {
                  phrase: "Digital native",
                  category: "Age Bias",
                  suggestion: "Consider using 'Tech-savvy' or 'Proficient with digital tools' instead."
                },
                {
                  phrase: "Cultural fit",
                  category: "Exclusionary",
                  suggestion: "Use 'Values alignment' to focus on objective criteria rather than subjective 'fit'."
                }
              ]}
            />
          </div>
        </section>

      </div>
      
      {/* Global Toaster Instance for Test Page */}
      <Toaster />
    </div>
  )
}
