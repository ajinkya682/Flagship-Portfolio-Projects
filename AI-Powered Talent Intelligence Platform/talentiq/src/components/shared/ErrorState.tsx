import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full h-full min-h-[300px]">
      <AlertTriangle size={40} className="text-amber-500 mb-4" />
      
      <h3 className="font-body text-[15px] font-semibold text-neutral-700">
        {title}
      </h3>
      
      <p className="font-body text-[13px] text-neutral-500 mt-2 max-w-[320px]">
        {description}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 h-9 px-4 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-body text-[13px] font-medium rounded-md transition-colors"
        >
          <RotateCcw size={16} />
          Try again
        </button>
      )}
    </div>
  )
}
