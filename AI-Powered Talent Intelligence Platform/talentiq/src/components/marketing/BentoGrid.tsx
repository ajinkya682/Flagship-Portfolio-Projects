import * as React from "react"
import { BentoFeatureCard } from "./BentoFeatureCard"
import { BentoStatCard } from "./BentoStatCard"
import { BentoSocialCard } from "./BentoSocialCard"

export function BentoGrid() {
  return (
    <section className="w-full bg-[#F9FAFB] pb-[80px]">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10 lg:px-[80px]">
        {/* 
          Grid layout matching spec:
          Mobile: all three stack vertically full width
          Tablet: Card A full width / Card B + C in 1fr 1fr grid below
          Desktop: 1.4fr 1fr 1fr
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="md:col-span-2 lg:col-span-1">
            <BentoFeatureCard />
          </div>
          <div className="col-span-1">
            <BentoStatCard />
          </div>
          <div className="col-span-1">
            <BentoSocialCard />
          </div>
        </div>
      </div>
    </section>
  )
}
