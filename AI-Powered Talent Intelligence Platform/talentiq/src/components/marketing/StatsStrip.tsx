import StatCounter from './StatCounter'

export default function StatsStrip() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-16 relative">
          
          {/* Desktop Dividers */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/4 w-[1px] bg-neutral-100" />
          <div className="hidden lg:block absolute top-0 bottom-0 left-2/4 w-[1px] bg-neutral-100" />
          <div className="hidden lg:block absolute top-0 bottom-0 left-3/4 w-[1px] bg-neutral-100" />
          
          {/* Tablet Dividers */}
          <div className="hidden md:block lg:hidden absolute top-0 bottom-0 left-1/2 w-[1px] bg-neutral-100" />
          <div className="hidden md:block lg:hidden absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-100" />

          {/* Mobile Dividers (except last) */}
          <div className="md:hidden absolute top-1/4 left-0 right-0 h-[1px] bg-neutral-100" />
          <div className="md:hidden absolute top-2/4 left-0 right-0 h-[1px] bg-neutral-100" />
          <div className="md:hidden absolute top-3/4 left-0 right-0 h-[1px] bg-neutral-100" />

          <div className="flex-1 px-4 text-center">
            <StatCounter 
              value={50} 
              suffix="%" 
              label="Faster time-to-hire" 
              sublabel="Average across customers"
              color="#2563EB"
            />
          </div>
          
          <div className="flex-1 px-4 text-center">
            <StatCounter 
              value={70} 
              suffix="%" 
              label="Less time screening" 
              sublabel="With AI pre-scoring"
              color="#2563EB"
            />
          </div>
          
          <div className="flex-1 px-4 text-center">
            <StatCounter 
              value={91} 
              suffix="%" 
              label="AI score accuracy" 
              sublabel="Versus actual hire decisions"
              color="#10B981"
            />
          </div>
          
          <div className="flex-1 px-4 text-center">
            <StatCounter 
              value={24} 
              prefix="$"
              suffix="K" 
              label="Saved per mis-hire" 
              sublabel="Fully loaded cost reduction"
              color="#10B981"
            />
          </div>
          
        </div>
      </div>
    </section>
  )
}
