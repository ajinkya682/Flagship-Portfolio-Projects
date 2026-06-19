'use client'

import { useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'
import { AIProcessingIndicator } from '@/components/shared/AIProcessingIndicator'
import AIScoreReveal from './AIScoreReveal'

export default function Step4AIScoring({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [uploadState, setUploadState] = useState<'idle' | 'processing' | 'done'>('idle')

  const handleUpload = () => {
    setUploadState('processing')
    setTimeout(() => {
      setUploadState('done')
    }, 2500)
  }

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6 min-h-[400px]">
      
      {uploadState === 'idle' && (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
          <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
            See the AI in action
          </h1>
          <p className="font-body text-[15px] text-neutral-500 mt-[8px] max-w-[400px]">
            Upload a sample resume (or use ours) to see how TalentIQ scores candidates against your new job.
          </p>

          <div 
            onClick={handleUpload}
            className="w-full mt-[32px] border-2 border-dashed border-neutral-200 hover:border-primary-500 hover:bg-primary-50/50 rounded-xl p-[48px] flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-[16px]">
              <UploadCloud className="w-6 h-6 text-primary-600" />
            </div>
            <p className="font-body text-[15px] font-semibold text-neutral-900">
              Drag & drop a resume PDF
            </p>
            <p className="font-body text-[13px] text-neutral-500 mt-[4px]">
              or click to browse
            </p>
          </div>

          <button onClick={handleUpload} className="mt-[24px] flex items-center gap-[8px] text-[14px] font-medium text-accent-600 hover:text-accent-700">
            <FileText size={16} /> Use sample resume instead
          </button>

          <div className="flex gap-[16px] mt-[32px] w-full max-w-[400px]">
            <button onClick={onBack} className="flex-1 h-[48px] border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
              Back
            </button>
            <button onClick={onNext} className="flex-1 h-[48px] bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
              Skip for now
            </button>
          </div>
        </div>
      )}

      {uploadState === 'processing' && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <AIProcessingIndicator message="Parsing unstructured data..." showProgress={true} />
        </div>
      )}

      {uploadState === 'done' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-[24px] font-bold text-neutral-900 text-center mb-[24px]">
            Resume Scored!
          </h1>
          
          <AIScoreReveal />

          <div className="flex items-center gap-[16px] mt-[32px]">
            <button onClick={onBack} className="h-[48px] px-[24px] border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
              Back
            </button>
            <button onClick={onNext} className="flex-1 h-[48px] bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
              Skip for now
            </button>
            <button onClick={onNext} className="flex-1 h-[48px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg">
              Finish Setup
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
