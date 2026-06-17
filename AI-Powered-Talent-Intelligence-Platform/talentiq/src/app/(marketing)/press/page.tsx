export default function PressPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-body">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <header className="mb-16">
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-neutral-900 mb-4">Press & Media</h1>
          <p className="text-xl text-neutral-600">Everything you need to write about TalentIQ.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Media Inquiries</h2>
            <p className="text-neutral-600 mb-6">
              For press inquiries, interview requests, or general media questions, please contact our PR team.
            </p>
            <a href="mailto:press@talentiq.com" className="text-primary-600 font-semibold hover:underline">press@talentiq.com</a>
          </div>
          
          <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Brand Assets</h2>
            <p className="text-neutral-600 mb-6">
              Download our official logos, product screenshots, and leadership headshots.
            </p>
            <button className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
              Download Media Kit (.zip)
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8">Recent Coverage</h2>
          <div className="flex flex-col gap-6">
            <div className="pb-6 border-b border-neutral-200">
              <p className="text-sm text-neutral-500 mb-2">TechCrunch — September 15, 2023</p>
              <h3 className="text-xl font-bold text-neutral-900 hover:text-primary-600 cursor-pointer transition-colors">TalentIQ raises $40M Series B to automate technical recruiting</h3>
            </div>
            <div className="pb-6 border-b border-neutral-200">
              <p className="text-sm text-neutral-500 mb-2">Forbes — July 10, 2023</p>
              <h3 className="text-xl font-bold text-neutral-900 hover:text-primary-600 cursor-pointer transition-colors">How AI is finally removing bias from the hiring process</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
