import Image from 'next/image'

export default function HeroProductMockup() {
  return (
    <div className="relative rounded-[24px] shadow-2xl border border-neutral-200 overflow-hidden transform md:rotate-[1.5deg] rotate-0 transition-transform duration-300 ease-out bg-white">
      {/* Browser Chrome */}
      <div className="h-9 bg-neutral-100 flex items-center px-4 gap-1.5 border-b border-neutral-200">
        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        <div className="flex-grow h-5 bg-neutral-200 rounded-full ml-3 opacity-50" />
      </div>
      
      {/* Product Image */}
      <div className="relative w-full bg-neutral-50" style={{ aspectRatio: '800/600' }}>
        <Image
          src="/images/hero-product.png"
          alt="TalentIQ Kanban Pipeline Dashboard"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
