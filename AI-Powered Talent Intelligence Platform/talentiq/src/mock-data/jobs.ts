// ─── Mock Jobs — 100 realistic job postings ───────────────────────

export interface MockJob {
  id: string
  title: string
  department: string
  location: string
  type: string
  remote: 'Remote' | 'Hybrid' | 'Onsite'
  status: 'published' | 'draft' | 'closed'
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string[]
  skills: string[]
  postedAt: string
  slug: string
  applicantCount?: number
  hiringTeam?: { name: string; role: string; avatar: string }[]
  applicationFormConfig?: {
    requireResume?: boolean
    requireLinkedin?: boolean
    requirePortfolio?: boolean
    customQuestions?: string[]
  }
}

const now = Date.now()
const daysAgo = (d: number) => new Date(now - 86400000 * d).toISOString()

// Hiring team pool
const HIRING_TEAM = [
  { name: 'Sarah Mitchell', role: 'Head of Talent', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Alex Chen', role: 'VP Engineering', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Jordan Lee', role: 'Technical Recruiter', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { name: 'Priya Sharma', role: 'HR Business Partner', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { name: 'Mike Torres', role: 'Product Lead', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { name: 'Nadia Okonkwo', role: 'Design Director', avatar: 'https://randomuser.me/api/portraits/women/37.jpg' },
]

export const MOCK_JOBS: MockJob[] = [
  // ── Engineering ────────────────────────────────────────────────
  {
    id: 'job_1', slug: 'senior-software-engineer',
    title: 'Senior Software Engineer', department: 'Engineering',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 150000, salaryMax: 190000,
    description: 'Join our core product team to build scalable distributed systems that power millions of users. You will architect and implement features across our entire backend stack.',
    requirements: ['5+ years of software engineering experience', 'Experience with distributed systems', 'Strong understanding of data structures and algorithms', 'Experience with cloud platforms (AWS/GCP/Azure)'],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL'],
    postedAt: daysAgo(3), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
    applicationFormConfig: { requireResume: true, requireLinkedin: true },
  },
  {
    id: 'job_2', slug: 'staff-engineer-platform',
    title: 'Staff Engineer — Platform', department: 'Engineering',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 200000, salaryMax: 260000,
    description: 'Lead the architecture and technical direction of our platform infrastructure. Own cross-cutting concerns across reliability, scalability, and developer productivity.',
    requirements: ['8+ years of engineering experience', 'Experience leading technical initiatives', 'Track record of 0-to-1 platform building', 'Strong system design skills'],
    skills: ['Kubernetes', 'Terraform', 'Go', 'Distributed Systems', 'Platform Engineering'],
    postedAt: daysAgo(7), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
    applicationFormConfig: { requireResume: true },
  },
  {
    id: 'job_3', slug: 'backend-engineer-payments',
    title: 'Backend Engineer — Payments', department: 'Engineering',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 140000, salaryMax: 175000,
    description: 'Build and maintain the financial transaction systems that process billions of dollars annually. Work with Stripe, compliance systems, and internal ledgers.',
    requirements: ['3+ years backend experience', 'Understanding of financial systems', 'Experience with payment APIs', 'Knowledge of PCI-DSS a plus'],
    skills: ['Python', 'Django', 'PostgreSQL', 'Stripe', 'Redis', 'Kafka'],
    postedAt: daysAgo(10), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_4', slug: 'frontend-engineer',
    title: 'Frontend Engineer', department: 'Engineering',
    location: 'Austin, TX', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 120000, salaryMax: 155000,
    description: 'Craft beautiful, performant web interfaces used by thousands of recruiters daily. Drive our design system and improve frontend infrastructure.',
    requirements: ['3+ years React experience', 'Strong TypeScript skills', 'Performance optimization experience', 'Familiarity with design systems'],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Storybook'],
    postedAt: daysAgo(5), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
  },
  {
    id: 'job_5', slug: 'mobile-engineer-ios',
    title: 'Mobile Engineer — iOS', department: 'Engineering',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 135000, salaryMax: 170000,
    description: 'Build native iOS experiences for our mobile recruiting platform. Focus on performance, animations, and offline-first architecture.',
    requirements: ['3+ years iOS development', 'Proficiency in Swift', 'UIKit and SwiftUI experience', 'App Store deployment experience'],
    skills: ['Swift', 'SwiftUI', 'UIKit', 'Core Data', 'Combine', 'XCTest'],
    postedAt: daysAgo(14), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_6', slug: 'devops-engineer',
    title: 'DevOps Engineer', department: 'Engineering',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 130000, salaryMax: 165000,
    description: 'Own the infrastructure that powers TalentIQ globally. Drive reliability, cost optimization, and developer experience across our cloud environments.',
    requirements: ['3+ years DevOps/SRE experience', 'AWS or GCP expertise', 'Infrastructure as Code proficiency', 'Experience with CI/CD pipelines'],
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Datadog'],
    postedAt: daysAgo(8), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_7', slug: 'ml-engineer',
    title: 'Machine Learning Engineer', department: 'Engineering',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 175000, salaryMax: 220000,
    description: 'Build and productionize ML models that power our AI candidate scoring engine. Work closely with data scientists to take models from research to production.',
    requirements: ['4+ years ML engineering experience', 'Python & PyTorch proficiency', 'Experience with MLOps', 'Understanding of NLP models'],
    skills: ['Python', 'PyTorch', 'Transformers', 'MLflow', 'AWS SageMaker', 'FastAPI'],
    postedAt: daysAgo(2), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_8', slug: 'security-engineer',
    title: 'Security Engineer', department: 'Engineering',
    location: 'Washington, DC', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 145000, salaryMax: 185000,
    description: 'Protect our platform and customer data from threats. Lead security reviews, penetration testing, and compliance initiatives.',
    requirements: ['3+ years security engineering', 'OWASP Top 10 expertise', 'Cloud security experience', 'Security certifications a plus'],
    skills: ['Penetration Testing', 'SIEM', 'IAM', 'Compliance', 'Cloud Security', 'SAST/DAST'],
    postedAt: daysAgo(15), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_9', slug: 'data-engineer',
    title: 'Data Engineer', department: 'Engineering',
    location: 'Boston, MA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 130000, salaryMax: 165000,
    description: 'Build and maintain our data pipelines that process millions of candidate profiles daily. Own our data warehouse and enable analytics at scale.',
    requirements: ['3+ years data engineering', 'Strong SQL skills', 'Experience with data warehouses', 'Pipeline orchestration experience'],
    skills: ['Spark', 'Airflow', 'Snowflake', 'dbt', 'Python', 'Kafka'],
    postedAt: daysAgo(6), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_10', slug: 'engineering-manager',
    title: 'Engineering Manager', department: 'Engineering',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 185000, salaryMax: 240000,
    description: 'Lead a team of 6–8 engineers working on our core product. Balance technical leadership with people management to deliver high-quality features on time.',
    requirements: ['2+ years engineering management', 'Prior hands-on engineering experience', 'Experience with agile methodologies', 'Strong communication skills'],
    skills: ['Team Leadership', 'Agile', 'Technical Strategy', 'Hiring', 'Performance Reviews'],
    postedAt: daysAgo(11), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },

  // ── Product ─────────────────────────────────────────────────────
  {
    id: 'job_11', slug: 'product-manager-growth',
    title: 'Product Manager — Growth', department: 'Product',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 140000, salaryMax: 175000,
    description: 'Own our acquisition and activation funnel. Run experiments, analyze data, and ship features that turn free users into paying customers.',
    requirements: ['3+ years PM experience', 'Data-driven mindset', 'Experience with A/B testing', 'Background in growth or consumer products'],
    skills: ['Growth Hacking', 'A/B Testing', 'Amplitude', 'SQL', 'Roadmapping'],
    postedAt: daysAgo(5), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_12', slug: 'product-manager-platform',
    title: 'Product Manager — Platform', department: 'Product',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 150000, salaryMax: 185000,
    description: 'Define the product strategy for our developer platform, API products, and integration ecosystem. Work directly with enterprise customers to understand their needs.',
    requirements: ['4+ years PM experience', 'Technical background preferred', 'Enterprise software experience', 'API product experience a plus'],
    skills: ['API Design', 'Enterprise Sales', 'Roadmapping', 'Figma', 'JIRA'],
    postedAt: daysAgo(9), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_13', slug: 'senior-product-manager',
    title: 'Senior Product Manager', department: 'Product',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 165000, salaryMax: 205000,
    description: 'Lead the product vision for our core hiring workflow. Own the roadmap from ideation through launch and work closely with design and engineering.',
    requirements: ['5+ years PM experience', 'B2B SaaS product experience', 'Strong analytical skills', 'Excellent communication skills'],
    skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Stakeholder Management'],
    postedAt: daysAgo(12), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_14', slug: 'associate-product-manager',
    title: 'Associate Product Manager', department: 'Product',
    location: 'Chicago, IL', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 90000, salaryMax: 120000,
    description: 'Join our APM program and accelerate your product career. Work on high-impact features with mentorship from senior PMs.',
    requirements: ['1-2 years of work experience', 'Strong analytical skills', 'Excellent written communication', 'CS or Business degree preferred'],
    skills: ['Product Management', 'SQL', 'Figma', 'User Research'],
    postedAt: daysAgo(4), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_15', slug: 'product-operations',
    title: 'Product Operations Manager', department: 'Product',
    location: 'Austin, TX', type: 'Full-time', remote: 'Hybrid',
    status: 'draft', salaryMin: 110000, salaryMax: 140000,
    description: 'Bridge the gap between product, engineering, and go-to-market teams. Build the systems and processes that allow our product team to move fast at scale.',
    requirements: ['3+ years in product ops or operations', 'Experience with tooling and automation', 'Strong cross-functional collaboration', 'Data analysis skills'],
    skills: ['Operations', 'Process Design', 'SQL', 'JIRA', 'Confluence'],
    postedAt: daysAgo(1), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },

  // ── Design ──────────────────────────────────────────────────────
  {
    id: 'job_16', slug: 'senior-product-designer',
    title: 'Senior Product Designer', department: 'Design',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 140000, salaryMax: 175000,
    description: 'Shape the end-to-end experience of TalentIQ. Lead design for our core hiring platform including candidate scoring, pipeline management, and reporting.',
    requirements: ['4+ years product design experience', 'Strong portfolio of shipped products', 'Figma proficiency', 'Experience with design systems'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
    postedAt: daysAgo(7), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
    applicationFormConfig: { requireResume: true, requirePortfolio: true },
  },
  {
    id: 'job_17', slug: 'ux-researcher',
    title: 'UX Researcher', department: 'Design',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 115000, salaryMax: 145000,
    description: 'Build deep understanding of our users through qualitative and quantitative research. Synthesize insights to inform product and design decisions.',
    requirements: ['3+ years UX research experience', 'Mixed-methods research expertise', 'Experience with user interviews', 'Strong synthesis and storytelling skills'],
    skills: ['User Interviews', 'Usability Testing', 'Survey Design', 'Lookback', 'Data Analysis'],
    postedAt: daysAgo(18), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
  },
  {
    id: 'job_18', slug: 'brand-designer',
    title: 'Brand Designer', department: 'Design',
    location: 'Los Angeles, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 95000, salaryMax: 125000,
    description: 'Own our visual brand across all touchpoints — website, marketing, social, and events. Evolve our design language as we scale.',
    requirements: ['3+ years brand design experience', 'Strong portfolio of visual work', 'Proficiency in Adobe Creative Suite', 'Motion graphics a plus'],
    skills: ['Figma', 'Illustrator', 'After Effects', 'Brand Identity', 'Typography'],
    postedAt: daysAgo(13), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
    applicationFormConfig: { requirePortfolio: true },
  },
  {
    id: 'job_19', slug: 'design-engineer',
    title: 'Design Engineer', department: 'Design',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 130000, salaryMax: 160000,
    description: 'Sit at the intersection of design and engineering. Build our design system components, create interactive prototypes, and push the bar on UI quality.',
    requirements: ['3+ years of design engineering or frontend experience', 'Proficiency in React and Figma', 'Eye for detail and animation', 'Strong component API design skills'],
    skills: ['React', 'TypeScript', 'Figma', 'Framer Motion', 'Storybook', 'CSS'],
    postedAt: daysAgo(6), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
  },
  {
    id: 'job_20', slug: 'motion-designer',
    title: 'Motion Designer', department: 'Design',
    location: 'Remote', type: 'Contract', remote: 'Remote',
    status: 'published', salaryMin: 80000, salaryMax: 110000,
    description: 'Create compelling motion design for our product UI, marketing videos, and brand animations.',
    requirements: ['2+ years motion design experience', 'Portfolio showcasing UI motion', 'After Effects proficiency'],
    skills: ['After Effects', 'Lottie', 'Figma', 'Cinema 4D', 'Motion Graphics'],
    postedAt: daysAgo(20), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[5]],
    applicationFormConfig: { requirePortfolio: true },
  },

  // ── Data / Analytics ────────────────────────────────────────────
  {
    id: 'job_21', slug: 'data-scientist',
    title: 'Data Scientist', department: 'Data',
    location: 'Boston, MA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 145000, salaryMax: 185000,
    description: 'Apply machine learning and statistical modeling to improve our candidate matching algorithms and deliver actionable insights to customers.',
    requirements: ['PhD or MS in quantitative field', '3+ years applied data science', 'Python and SQL proficiency', 'NLP experience preferred'],
    skills: ['Python', 'PyTorch', 'Scikit-learn', 'SQL', 'NLP', 'Feature Engineering'],
    postedAt: daysAgo(9), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_22', slug: 'analytics-engineer',
    title: 'Analytics Engineer', department: 'Data',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 120000, salaryMax: 155000,
    description: 'Build the data models and transformations that power our analytics dashboards and AI features.',
    requirements: ['3+ years analytics engineering', 'dbt proficiency', 'Strong SQL skills', 'Experience with Snowflake or BigQuery'],
    skills: ['dbt', 'SQL', 'Snowflake', 'Looker', 'Python', 'Airflow'],
    postedAt: daysAgo(14), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_23', slug: 'bi-analyst',
    title: 'Business Intelligence Analyst', department: 'Data',
    location: 'Chicago, IL', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 85000, salaryMax: 110000,
    description: 'Build and maintain dashboards that give leadership visibility into business performance. Collaborate with all teams to understand their data needs.',
    requirements: ['2+ years BI experience', 'Strong SQL and Excel skills', 'BI tool experience (Tableau, Looker, Power BI)', 'Business acumen'],
    skills: ['Tableau', 'SQL', 'Excel', 'Data Visualization', 'Reporting'],
    postedAt: daysAgo(21), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },

  // ── Marketing ───────────────────────────────────────────────────
  {
    id: 'job_24', slug: 'vp-marketing',
    title: 'VP of Marketing', department: 'Marketing',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 200000, salaryMax: 260000,
    description: 'Own our go-to-market strategy and lead a team of 10+ marketers. Drive brand awareness, demand generation, and customer marketing.',
    requirements: ['8+ years marketing experience', '3+ years leading marketing teams', 'B2B SaaS experience required', 'Track record of pipeline growth'],
    skills: ['Demand Generation', 'Brand Marketing', 'Content Strategy', 'Marketing Ops', 'Analytics'],
    postedAt: daysAgo(4), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_25', slug: 'content-marketing-manager',
    title: 'Content Marketing Manager', department: 'Marketing',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 85000, salaryMax: 115000,
    description: 'Drive our content strategy to educate HR professionals and build trust in the TalentIQ brand.',
    requirements: ['3+ years content marketing experience', 'B2B writing experience', 'SEO knowledge', 'HR/recruitment domain knowledge a plus'],
    skills: ['Content Strategy', 'SEO', 'Copywriting', 'HubSpot', 'WordPress'],
    postedAt: daysAgo(16), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_26', slug: 'demand-generation-manager',
    title: 'Demand Generation Manager', department: 'Marketing',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 100000, salaryMax: 130000,
    description: 'Drive pipeline through paid advertising, email campaigns, and lifecycle marketing programs.',
    requirements: ['3+ years demand gen experience', 'Experience with paid channels', 'Marketing automation expertise', 'Strong data analysis skills'],
    skills: ['Google Ads', 'LinkedIn Ads', 'HubSpot', 'Marketo', 'Salesforce', 'Analytics'],
    postedAt: daysAgo(23), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },

  // ── Sales ────────────────────────────────────────────────────────
  {
    id: 'job_27', slug: 'account-executive-enterprise',
    title: 'Account Executive — Enterprise', department: 'Sales',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 120000, salaryMax: 300000,
    description: 'Close enterprise deals with Fortune 500 companies. Own the full sales cycle from prospecting to close.',
    requirements: ['5+ years enterprise SaaS sales', '$1M+ quota experience', 'Experience with complex sales cycles', 'HR tech experience a plus'],
    skills: ['Enterprise Sales', 'Salesforce', 'Gong', 'Solution Selling', 'Negotiation'],
    postedAt: daysAgo(6), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_28', slug: 'sales-development-rep',
    title: 'Sales Development Representative', department: 'Sales',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 65000, salaryMax: 95000,
    description: 'Drive outbound prospecting and generate qualified pipeline for our AE team. Be the front line of our sales organization.',
    requirements: ['1+ year SDR/BDR experience', 'Strong written communication', 'Experience with sales tools', 'Resilience and drive'],
    skills: ['Outreach', 'Salesforce', 'LinkedIn Sales Navigator', 'Cold Calling', 'Email Prospecting'],
    postedAt: daysAgo(8), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },
  {
    id: 'job_29', slug: 'customer-success-manager',
    title: 'Customer Success Manager', department: 'Sales',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 80000, salaryMax: 110000,
    description: 'Ensure our enterprise customers achieve maximum value from TalentIQ. Drive adoption, retention, and expansion revenue.',
    requirements: ['2+ years CSM experience', 'B2B SaaS experience', 'Data-driven approach to customer health', 'Excellent relationship management'],
    skills: ['Customer Success', 'Gainsight', 'Salesforce', 'QBRs', 'Renewals', 'Expansion'],
    postedAt: daysAgo(11), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },

  // ── Operations ───────────────────────────────────────────────────
  {
    id: 'job_30', slug: 'head-of-operations',
    title: 'Head of Operations', department: 'Operations',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 160000, salaryMax: 210000,
    description: 'Scale our operational systems across people, legal, finance, and IT. Be the operational backbone that enables our teams to execute efficiently.',
    requirements: ['6+ years operations experience', 'Experience at scaling startups', 'Strong analytical skills', 'Prior management experience'],
    skills: ['Operations', 'OKRs', 'Process Design', 'Vendor Management', 'Cross-functional Leadership'],
    postedAt: daysAgo(17), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[3]],
  },
  {
    id: 'job_31', slug: 'office-manager',
    title: 'Office & Facilities Manager', department: 'Operations',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Onsite',
    status: 'published', salaryMin: 65000, salaryMax: 85000,
    description: 'Create an exceptional workplace experience for our SF team. Own office operations, vendor relationships, events, and employee programs.',
    requirements: ['2+ years office management', 'Experience with facilities management', 'Strong attention to detail', 'Event planning experience'],
    skills: ['Facilities Management', 'Event Planning', 'Vendor Management', 'HR Administration'],
    postedAt: daysAgo(25), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[3]],
  },

  // ── Finance ─────────────────────────────────────────────────────
  {
    id: 'job_32', slug: 'finance-manager',
    title: 'Finance Manager', department: 'Finance',
    location: 'New York, NY', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 120000, salaryMax: 155000,
    description: 'Own our FP&A function and drive financial planning, analysis, and reporting across the company.',
    requirements: ['4+ years finance experience', 'FP&A expertise', 'Advanced Excel/modeling skills', 'CPA or MBA preferred'],
    skills: ['FP&A', 'Excel', 'Netsuite', 'Financial Modeling', 'SaaS Metrics'],
    postedAt: daysAgo(19), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[3]],
  },

  // ── More Engineering ─────────────────────────────────────────────
  {
    id: 'job_33', slug: 'backend-engineer-search',
    title: 'Backend Engineer — Search', department: 'Engineering',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 145000, salaryMax: 180000,
    description: 'Build the search and ranking systems that surface the right candidates to recruiters. Own Elasticsearch infrastructure and search relevance.',
    requirements: ['3+ years backend experience', 'Elasticsearch experience', 'Information retrieval knowledge', 'Python or Go preferred'],
    skills: ['Elasticsearch', 'Python', 'Redis', 'Vector Search', 'NLP'],
    postedAt: daysAgo(3), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_34', slug: 'qa-engineer',
    title: 'QA Engineer', department: 'Engineering',
    location: 'Hybrid', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 100000, salaryMax: 130000,
    description: 'Ensure quality across our platform through manual and automated testing. Build and maintain our testing infrastructure.',
    requirements: ['3+ years QA experience', 'Test automation experience (Cypress, Playwright)', 'API testing proficiency', 'CI/CD integration experience'],
    skills: ['Cypress', 'Playwright', 'Postman', 'JIRA', 'Jest', 'Test Planning'],
    postedAt: daysAgo(22), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_35', slug: 'technical-program-manager',
    title: 'Technical Program Manager', department: 'Engineering',
    location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid',
    status: 'published', salaryMin: 155000, salaryMax: 195000,
    description: 'Drive cross-team technical programs from inception to delivery. Remove blockers, track milestones, and ensure on-time delivery of complex initiatives.',
    requirements: ['5+ years TPM experience', 'Technical background required', 'PMP or similar certification a plus', 'Experience with OKR frameworks'],
    skills: ['Program Management', 'Agile', 'JIRA', 'Risk Management', 'Communication'],
    postedAt: daysAgo(16), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[1]],
  },
  {
    id: 'job_36', slug: 'solutions-engineer',
    title: 'Solutions Engineer', department: 'Sales',
    location: 'Remote', type: 'Full-time', remote: 'Remote',
    status: 'published', salaryMin: 130000, salaryMax: 175000,
    description: 'Partner with our AE team to understand customer requirements and design technical solutions. Lead product demos and POCs.',
    requirements: ['3+ years solutions engineering', 'Strong technical acumen', 'Experience with enterprise customers', 'Excellent presentation skills'],
    skills: ['Technical Sales', 'API Integration', 'Demo Skills', 'Solution Architecture'],
    postedAt: daysAgo(10), hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[4]],
  },

  // Fill remaining to reach 100 with varied statuses
  ...Array.from({ length: 64 }, (_, i) => {
    const idx = i + 37
    const depts = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'Operations', 'Finance']
    const dept = depts[idx % depts.length]
    const titles: Record<string, string[]> = {
      Engineering: ['Senior Backend Engineer', 'Full Stack Developer', 'Platform Engineer', 'Infrastructure Engineer', 'API Engineer', 'Cloud Architect', 'Site Reliability Engineer', 'Embedded Systems Engineer'],
      Product: ['Product Manager', 'Director of Product', 'Principal PM', 'Product Analyst', 'Technical PM'],
      Design: ['UI Designer', 'Visual Designer', 'Interaction Designer', 'Design Lead', 'Accessibility Designer'],
      Data: ['Senior Data Scientist', 'ML Researcher', 'Data Analyst', 'Research Scientist'],
      Marketing: ['Growth Marketer', 'SEO Manager', 'Community Manager', 'Events Manager', 'Partner Marketing Manager'],
      Sales: ['Regional Sales Director', 'Mid-Market AE', 'Inside Sales Rep', 'Sales Engineer', 'Revenue Operations'],
      Operations: ['Strategy & Operations Manager', 'People Operations', 'IT Manager', 'Procurement Manager'],
      Finance: ['Controller', 'Senior Financial Analyst', 'Revenue Operations Manager'],
    }
    const titleList = titles[dept] || ['Manager']
    const title = titleList[idx % titleList.length]
    const statuses: ('published' | 'draft' | 'closed')[] = ['published', 'published', 'published', 'draft', 'closed']
    const remoteTypes: ('Remote' | 'Hybrid' | 'Onsite')[] = ['Remote', 'Hybrid', 'Hybrid', 'Onsite', 'Remote']
    const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Boston, MA', 'Los Angeles, CA', 'Denver, CO']
    
    return {
      id: `job_${idx}`,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
      title,
      department: dept,
      location: locations[idx % locations.length],
      type: idx % 7 === 0 ? 'Contract' : 'Full-time',
      remote: remoteTypes[idx % remoteTypes.length],
      status: statuses[idx % statuses.length],
      salaryMin: 80000 + (idx % 8) * 15000,
      salaryMax: 120000 + (idx % 8) * 20000,
      description: `Join our growing ${dept} team and make a significant impact. This role offers exceptional growth opportunities in a fast-paced environment.`,
      requirements: ['Relevant experience in the field', 'Strong communication skills', 'Team collaboration mindset', 'Results-oriented approach'],
      skills: ['Communication', 'Collaboration', 'Problem Solving', 'Initiative'],
      postedAt: daysAgo(idx % 30),
      hiringTeam: [HIRING_TEAM[0], HIRING_TEAM[idx % HIRING_TEAM.length]],
    } as MockJob
  }),
]
