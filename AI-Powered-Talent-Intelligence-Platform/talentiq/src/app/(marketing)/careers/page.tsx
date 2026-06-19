import connectToDatabase from '@/core/database/mongoose'
import { Job } from '@/core/database/models/Job'
import { Company } from '@/core/database/models/Company'
import GlobalJobBoard from '@/components/marketing/GlobalJobBoard'
import { Hexagon } from 'lucide-react'

// Force dynamic rendering since we want to always fetch the latest published jobs
export const dynamic = 'force-dynamic'

export default async function CareersPage() {
  await connectToDatabase()
  
  // Need to make sure Company model is registered before populate
  Company.schema; 

  // Fetch all published jobs and populate company
  const rawJobs = await Job.find({ status: 'published' })
    .populate('company', 'name logo slug')
    .sort({ createdAt: -1 })
    .lean()
    .exec()

  // Convert ObjectIds to strings to pass to Client Component safely
  const jobs = JSON.parse(JSON.stringify(rawJobs))

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-24 font-body relative overflow-hidden">
      
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-neutral-50 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-purple-100/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Premium Hero Section */}
        <header className="mb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-sm font-semibold text-neutral-700 mb-8">
            <Hexagon size={16} className="text-primary-600 fill-primary-600" />
            TalentIQ Global Job Board
          </div>
          <h1 className="text-5xl md:text-[64px] font-display font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">dream role.</span>
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of open roles from top companies actively hiring on the TalentIQ platform. Apply with one click and let AI highlight your strengths.
          </p>
        </header>

        {/* Client Component for filtering and rendering */}
        <GlobalJobBoard initialJobs={jobs} />

      </div>
    </div>
  )
}
