import BentoFeatureCard from './BentoFeatureCard'
import BentoStatCard from './BentoStatCard'
import BentoSocialCard from './BentoSocialCard'

export default function BentoGrid() {
  return (
    <section className="bg-[#F9FAFB] pb-20">
      <div className="max-w-[1100px] mx-auto px-5 md:px-20 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4">
          <div className="lg:col-span-1">
            <BentoFeatureCard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 lg:grid-cols-2 gap-4">
            <BentoStatCard 
              stat="50%" 
              label="Faster time-to-hire" 
              description="Average across all customers" 
            />
            <BentoSocialCard />
          </div>
        </div>
      </div>
    </section>
  )
}
