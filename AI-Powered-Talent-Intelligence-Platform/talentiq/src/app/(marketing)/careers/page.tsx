export default function CareersPage() {
  const openRoles = [
    { title: "Senior Backend Engineer", dept: "Engineering", location: "Remote (US)", type: "Full-time" },
    { title: "Product Marketing Manager", dept: "Marketing", location: "San Francisco, CA", type: "Full-time" },
    { title: "Enterprise Account Executive", dept: "Sales", location: "Remote (UK)", type: "Full-time" },
    { title: "Staff Machine Learning Engineer", dept: "AI Lab", location: "Remote", type: "Full-time" },
  ]

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-body">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <header className="mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-neutral-900 mb-6">Come build the future of hiring.</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We are a fast-growing team of engineers, designers, and operators passionate about connecting great companies with great people.
          </p>
        </header>

        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8">Open Roles</h2>
          <div className="flex flex-col gap-4">
            {openRoles.map((role, i) => (
              <a key={i} href="#" className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all group">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">{role.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span>{role.dept}</span>
                    <span>•</span>
                    <span>{role.location}</span>
                    <span>•</span>
                    <span>{role.type}</span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Apply Now →
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
