import Image from 'next/image'

export default function AIScoreDemo() {
  return (
    <div className="w-full max-w-[480px] mx-auto lg:mx-0 overflow-hidden rounded-xl shadow-lg border border-neutral-100">
      <Image
        src="/images/report.png"
        alt="TalentIQ AI Score Report"
        width={1080}
        height={1200}
        className="w-full h-auto object-cover relative z-0 block"
        priority
      />
    </div>
  )
}