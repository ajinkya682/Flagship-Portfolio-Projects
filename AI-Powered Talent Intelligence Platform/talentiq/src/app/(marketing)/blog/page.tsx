export default function BlogPage() {
  const posts = [
    { title: "How AI is changing the technical interview", category: "Engineering", date: "Oct 24, 2023" },
    { title: "Removing unconscious bias from your sourcing pipeline", category: "Diversity", date: "Oct 12, 2023" },
    { title: "Why traditional ATS systems are holding you back", category: "Productivity", date: "Sep 28, 2023" },
    { title: "TalentIQ raises Series B to accelerate AI matching", category: "Company News", date: "Sep 15, 2023" },
    { title: "The ultimate guide to hiring remote product managers", category: "Guides", date: "Sep 02, 2023" },
    { title: "How Acme Corp reduced time-to-hire by 45%", category: "Case Studies", date: "Aug 20, 2023" },
  ]

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-body">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <header className="mb-16">
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-neutral-900 mb-4">The TalentIQ Blog</h1>
          <p className="text-xl text-neutral-600">Insights, guides, and news on the future of hiring.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <a key={i} href="#" className="group flex flex-col gap-4">
              <div className="w-full aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                {/* Image Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
              </div>
              <div>
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className="font-semibold text-primary-600">{post.category}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
