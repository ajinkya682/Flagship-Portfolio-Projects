export default function QuestionSetPreview() {
  return (
    <div className="max-h-[240px] overflow-y-auto border border-neutral-200 rounded-md bg-neutral-50 p-[16px] font-body">
      <div className="flex flex-col gap-[16px]">
        
        <div className="flex flex-col gap-[8px]">
          <h5 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Problem Solving</h5>
          <ul className="flex flex-col gap-[6px]">
            <li className="text-[14px] text-neutral-700 flex items-start gap-[8px]">
              <span className="text-neutral-400 mt-[2px]">•</span>
              Describe a complex technical challenge you faced recently and how you resolved it.
            </li>
            <li className="text-[14px] text-neutral-700 flex items-start gap-[8px]">
              <span className="text-neutral-400 mt-[2px]">•</span>
              How do you approach debugging an issue in production?
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-[8px]">
          <h5 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Architecture</h5>
          <ul className="flex flex-col gap-[6px]">
            <li className="text-[14px] text-neutral-700 flex items-start gap-[8px]">
              <span className="text-neutral-400 mt-[2px]">•</span>
              Walk me through the architecture of a system you built from scratch.
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
