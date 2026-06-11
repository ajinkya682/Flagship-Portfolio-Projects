import { SkeletonBlock } from '@/components/shared/SkeletonBlock'

export default function KanbanCardSkeleton() {
  return (
    <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm p-[14px] px-[16px] relative h-[106px] flex flex-col justify-between">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px] bg-neutral-200" />
      
      <div className="flex justify-between items-center">
        <SkeletonBlock className="w-[60%] h-[14px]" />
        <div className="w-[32px] h-[32px] rounded-full bg-neutral-100 shrink-0" />
      </div>

      <div className="flex justify-between items-center mt-auto">
        <SkeletonBlock className="w-[40%] h-[12px]" />
        <SkeletonBlock className="w-[60px] h-[20px] rounded-full" />
      </div>
    </div>
  )
}
