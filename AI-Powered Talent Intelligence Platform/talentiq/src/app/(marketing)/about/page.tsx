export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-body">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="max-w-[800px] mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-neutral-900 mb-6">
            Building the intelligence layer for modern recruiting.
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            TalentIQ was founded on a simple belief: the hiring process is broken. Resume screens are biased, interviews are subjective, and great talent slips through the cracks. We're here to fix that using advanced AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-neutral-100 rounded-3xl h-[400px] w-full object-cover"></div>
          <div>
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-4">Our Mission</h2>
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
              To empower companies to hire the absolute best talent by removing bias and automating the tedious parts of recruiting, allowing human recruiters to focus on what they do best: building relationships.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              We process over 2 million candidate profiles daily, giving enterprise teams the superpowers they need to scale efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
