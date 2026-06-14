// ─── Mock Candidates — 500 realistic applicants ───────────────────

export interface MockCandidate {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  jobId: string
  stage: 'Applied' | 'Screening' | 'Interview' | 'Assessment' | 'Offer' | 'Hired'
  source: string
  location: string
  yearsExp: number
  linkedinUrl: string
  resumeUrl: string
  extractedSkills: string[]
  extractedCompanies: string[]
  extractedEducation: string[]
  scoreBreakdown: { skills: number; experience: number; education: number; keywords: number }
  strengths: string[]
  gaps: string[]
  tags: string[]
  assignedTo: string
  aiScore: number
  daysInStage: number
  appliedAt: string
  notes: { id: string; author: string; text: string; createdAt: string; avatar: string }[]
  timeline: { event: string; date: string; type: 'applied' | 'ai' | 'stage' | 'interview' }[]
  portalToken?: string
  hasPortalAccess?: boolean
}

// Deterministic seeded random to keep data consistent
function seededRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const now = Date.now()
const daysAgo = (d: number) => new Date(now - 86400000 * d).toISOString()

const FIRST_NAMES_M = ['James', 'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Ethan', 'Daniel', 'Matthew', 'Aiden', 'Jackson', 'Sebastian', 'Jack', 'Owen', 'Samuel', 'Mateo', 'Ryan', 'Nathan', 'Tyler', 'Marcus', 'Kevin', 'David', 'Michael', 'Chris', 'Brandon', 'Jordan', 'Kyle', 'Dylan', 'Zach', 'Jake', 'Jason', 'Aaron', 'Justin', 'Derek', 'Connor', 'Raj', 'Arjun', 'Vikram', 'Siddharth', 'Aditya', 'Rohan', 'Wei', 'Jian', 'Huang', 'Takeshi', 'Kenji', 'Carlos', 'Diego', 'Luis', 'Miguel', 'Andre', 'Elias', 'Kofi', 'Kwame', 'Emeka']
const FIRST_NAMES_F = ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe', 'Priya', 'Ananya', 'Neha', 'Divya', 'Sneha', 'Pooja', 'Mei', 'Ling', 'Yuki', 'Aisha', 'Fatima', 'Zara', 'Laila', 'Amira', 'Nina', 'Elena', 'Ingrid', 'Astrid', 'Chidi', 'Amara']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Patel', 'Shah', 'Kumar', 'Singh', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang', 'Kim', 'Park', 'Tanaka', 'Okafor', 'Mensah']

const SOURCES = ['LinkedIn', 'Indeed', 'Referral', 'Direct', 'AngelList', 'Company Website', 'GitHub', 'Glassdoor']
const LOCATIONS = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Remote', 'Chicago, IL', 'Boston, MA', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL', 'Portland, OR', 'Toronto, ON', 'London, UK', 'Berlin, Germany']

const STAGES: MockCandidate['stage'][] = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired']
// Distribution: Applied=35%, Screening=25%, Interview=20%, Assessment=10%, Offer=5%, Hired=5%
const STAGE_DIST = [35, 25, 20, 10, 5, 5]

const SKILLS_BY_DEPT: Record<string, string[][]> = {
  Engineering: [
    ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    ['Go', 'Kubernetes', 'Terraform', 'AWS', 'Linux'],
    ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'Microservices'],
    ['Swift', 'Objective-C', 'UIKit', 'SwiftUI', 'Core Data'],
    ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Firebase'],
    ['Machine Learning', 'PyTorch', 'Python', 'SQL', 'NLP'],
    ['React', 'Vue.js', 'GraphQL', 'Jest', 'Webpack'],
    ['Rust', 'C++', 'Systems Programming', 'Embedded Systems'],
    ['Ruby on Rails', 'PostgreSQL', 'Redis', 'AWS', 'RSpec'],
  ],
  Product: [
    ['Product Strategy', 'Roadmapping', 'A/B Testing', 'SQL', 'Figma'],
    ['Growth Hacking', 'Amplitude', 'JIRA', 'User Research', 'Data Analysis'],
    ['Enterprise Sales', 'API Products', 'Stakeholder Management'],
  ],
  Design: [
    ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
    ['Illustrator', 'After Effects', 'Brand Identity', 'Typography'],
    ['Framer', 'React', 'CSS', 'Animation', 'Design Tokens'],
  ],
  Data: [
    ['Python', 'SQL', 'Machine Learning', 'Scikit-learn', 'Spark'],
    ['dbt', 'Snowflake', 'Airflow', 'Looker', 'Analytics Engineering'],
  ],
  Marketing: [
    ['Content Marketing', 'SEO', 'HubSpot', 'Copywriting', 'Analytics'],
    ['Demand Generation', 'Google Ads', 'LinkedIn Ads', 'Marketo', 'Salesforce'],
  ],
  Sales: [
    ['Enterprise Sales', 'Salesforce', 'Gong', 'Solution Selling', 'Negotiation'],
    ['SDR', 'Outreach', 'Cold Calling', 'LinkedIn Sales Navigator'],
  ],
}

const COMPANIES_POOL = ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Stripe', 'Airbnb', 'Uber', 'Netflix', 'Salesforce', 'Twitter/X', 'LinkedIn', 'Spotify', 'Dropbox', 'Slack', 'Figma', 'Notion', 'Vercel', 'Databricks', 'OpenAI', 'Anthropic', 'Coinbase', 'Robinhood', 'DoorDash', 'Lyft', 'Instacart', 'Snowflake', 'Datadog', 'MongoDB', 'Palantir', 'HubSpot', 'Zendesk', 'Twilio', 'Okta', 'CrowdStrike', 'ServiceNow', 'Workday', 'Adobe', 'Intuit']

const EDUCATION_POOL = [
  'B.S. Computer Science, MIT', 'B.S. Computer Science, Stanford', 'M.S. Computer Science, CMU',
  'B.S. Electrical Engineering, UC Berkeley', 'M.S. Machine Learning, Georgia Tech',
  'B.S. Computer Science, University of Washington', 'MBA, Harvard Business School',
  'B.S. Information Systems, NYU', 'M.S. Data Science, Columbia',
  'B.S. Software Engineering, Purdue', 'B.A. Economics, Yale',
  'B.S. Mathematics, Princeton', 'M.S. Statistics, Stanford',
  'B.S. Computer Science, University of Michigan', 'B.S. CS, UT Austin',
  'B.S. Computer Science, UCLA', 'M.S. Human-Computer Interaction, CMU',
  'BFA Graphic Design, Parsons', 'B.S. Computer Science, Cornell',
  'M.S. Cybersecurity, NYU', 'B.S. Computer Engineering, UIUC',
]

const STRENGTHS_POOL = [
  'Strong systems design skills',
  'Excellent communication and stakeholder management',
  'Deep expertise in distributed systems',
  'Track record of shipping at scale',
  'Strong data analysis capabilities',
  'Exceptional product sense',
  'Leadership experience with growing teams',
  'Open source contributions and community involvement',
  'Cross-functional collaboration skills',
  'Strong technical writing and documentation',
  'Experience with high-growth startups',
  'Excellent problem-solving under pressure',
  'Strong portfolio of shipped products',
  'Expertise in performance optimization',
  'Background at top-tier companies aligns well',
]

const GAPS_POOL = [
  'Limited experience with our specific tech stack',
  'No direct experience in our industry vertical',
  'Missing some required cloud certifications',
  'Less experience with enterprise-scale systems',
  'No prior management experience',
  'Less exposure to B2B SaaS products',
  'Limited experience with security best practices',
  'No prior international team experience',
  'Gaps in system design fundamentals',
]

const TAGS_POOL = ['Top-tier', 'Fast Mover', 'Culture Fit', 'Passive Candidate', 'VIP Referral', 'Star Candidate', 'Watch', 'Strong Technical', 'Leadership Potential', 'Overqualified']

const NOTE_TEXTS = [
  'Had a great initial call. Very articulate and clearly passionate about the problem space. Would recommend for next round.',
  'Resume reviewed — strong background. The experience at Google is particularly relevant to our search infrastructure role.',
  'Candidate mentioned competing offer from Stripe. Should move quickly if we want to secure this one.',
  'Great cultural fit based on LinkedIn profile. Lots of overlap with our engineering values.',
  'Strong portfolio review. The case study for redesigning their checkout flow shows excellent product thinking.',
  'Technical assessment submitted on time and scored 95/100. Recommend proceeding to panel interview.',
  'Spoke with their reference at Meta — glowing review. "Best engineer I\'ve worked with in 15 years."',
  'Salary expectation is at the top of our range but might be flexible based on equity.',
  'Excellent system design interview performance. Strong on distributed systems and trade-off analysis.',
  'Declined to proceed — accepted another offer. Keep in network for future roles.',
]

const JOB_TITLES = [
  'Senior Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
  'Backend Engineer', 'Frontend Engineer', 'Staff Engineer', 'ML Engineer',
  'DevOps Engineer', 'Engineering Manager', 'Senior Product Manager', 'Design Lead',
  'Analytics Engineer', 'Security Engineer', 'Technical Program Manager', 'QA Engineer',
]

const JOB_IDS = Array.from({ length: 36 }, (_, i) => `job_${i + 1}`)

function generateCandidate(idx: number): MockCandidate {
  const rand = seededRand(idx * 137 + 42)
  
  const isFemale = rand() > 0.5
  const firstName = isFemale
    ? FIRST_NAMES_F[Math.floor(rand() * FIRST_NAMES_F.length)]
    : FIRST_NAMES_M[Math.floor(rand() * FIRST_NAMES_M.length)]
  const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx}@email.com`
  
  // Determine stage from distribution
  let stageIdx = 0
  const roll = Math.floor(rand() * 100)
  let cumulative = 0
  for (let i = 0; i < STAGE_DIST.length; i++) {
    cumulative += STAGE_DIST[i]
    if (roll < cumulative) { stageIdx = i; break }
  }
  const stage = STAGES[stageIdx]
  
  // Scores — bimodal: top 20% score 85+, rest 55-84
  let aiScore: number
  if (rand() > 0.8) {
    aiScore = Math.floor(85 + rand() * 15) // 85-99
  } else {
    aiScore = Math.floor(55 + rand() * 30) // 55-84
  }
  
  const skillsKeys = Object.keys(SKILLS_BY_DEPT)
  const skillsKey = skillsKeys[Math.floor(rand() * skillsKeys.length)]
  const skillsList = SKILLS_BY_DEPT[skillsKey]
  const skills = skillsList[Math.floor(rand() * skillsList.length)]
  
  const numCompanies = 1 + Math.floor(rand() * 3)
  const companies: string[] = []
  for (let i = 0; i < numCompanies; i++) {
    companies.push(COMPANIES_POOL[Math.floor(rand() * COMPANIES_POOL.length)])
  }
  
  const yearsExp = 1 + Math.floor(rand() * 14)
  const daysInStage = Math.floor(rand() * 14)
  const appliedDaysAgo = daysInStage + Math.floor(rand() * 20)
  
  const source = SOURCES[Math.floor(rand() * SOURCES.length)]
  const location = LOCATIONS[Math.floor(rand() * LOCATIONS.length)]
  const education = EDUCATION_POOL[Math.floor(rand() * EDUCATION_POOL.length)]
  const jobId = JOB_IDS[Math.floor(rand() * JOB_IDS.length)]
  const role = JOB_TITLES[Math.floor(rand() * JOB_TITLES.length)]
  
  const avatarGender = isFemale ? 'women' : 'men'
  const avatarNum = Math.floor(rand() * 90) + 1
  
  // Score breakdown
  const baseScore = aiScore
  const skillsScore = Math.min(100, baseScore + Math.floor((rand() - 0.5) * 20))
  const expScore = Math.min(100, baseScore + Math.floor((rand() - 0.5) * 20))
  const eduScore = Math.min(100, baseScore + Math.floor((rand() - 0.5) * 15))
  const kwScore = Math.min(100, baseScore + Math.floor((rand() - 0.5) * 18))
  
  // Pick 2-3 strengths
  const numStrengths = 2 + Math.floor(rand() * 2)
  const strengths: string[] = []
  const shuffledStrengths = [...STRENGTHS_POOL].sort(() => rand() - 0.5)
  for (let i = 0; i < numStrengths; i++) strengths.push(shuffledStrengths[i])
  
  // Pick 1-2 gaps
  const numGaps = 1 + Math.floor(rand() * 2)
  const gaps: string[] = []
  const shuffledGaps = [...GAPS_POOL].sort(() => rand() - 0.5)
  for (let i = 0; i < numGaps; i++) gaps.push(shuffledGaps[i])
  
  // Tags for some candidates
  const tags: string[] = []
  if (rand() > 0.7) tags.push(TAGS_POOL[Math.floor(rand() * TAGS_POOL.length)])
  if (aiScore >= 90) tags.push('Star Candidate')
  
  // Timeline
  const timeline: MockCandidate['timeline'] = [
    { event: `Applied via ${source}`, date: `${appliedDaysAgo}d ago`, type: 'applied' },
    { event: 'AI scored resume automatically', date: `${appliedDaysAgo - 1}d ago`, type: 'ai' },
  ]
  if (stageIdx > 0) timeline.push({ event: 'Moved to Screening', date: `${appliedDaysAgo - 2}d ago`, type: 'stage' })
  if (stageIdx > 1) timeline.push({ event: 'Phone screen completed', date: `${Math.max(1, appliedDaysAgo - 5)}d ago`, type: 'interview' })
  if (stageIdx > 2) timeline.push({ event: 'Moved to Interview', date: `${daysInStage + 2}d ago`, type: 'stage' })
  
  // Notes for some candidates
  const notes: MockCandidate['notes'] = []
  if (rand() > 0.6 && stageIdx > 0) {
    notes.push({
      id: `note_${idx}_1`,
      author: 'Sarah Mitchell',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: NOTE_TEXTS[Math.floor(rand() * NOTE_TEXTS.length)],
      createdAt: `${1 + Math.floor(rand() * 5)}d ago`,
    })
  }
  if (rand() > 0.8 && stageIdx > 1) {
    notes.push({
      id: `note_${idx}_2`,
      author: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: NOTE_TEXTS[Math.floor(rand() * NOTE_TEXTS.length)],
      createdAt: `${Math.floor(rand() * 3)}d ago`,
    })
  }
  
  return {
    id: `c_${idx}`,
    name,
    email,
    phone: `555-${String(Math.floor(rand() * 9000) + 1000).padStart(4, '0')}`,
    avatar: `https://randomuser.me/api/portraits/${avatarGender}/${avatarNum}.jpg`,
    role,
    jobId,
    stage,
    source,
    location,
    yearsExp,
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    resumeUrl: '#',
    extractedSkills: skills,
    extractedCompanies: companies,
    extractedEducation: [education],
    scoreBreakdown: {
      skills: Math.max(0, Math.min(100, skillsScore)),
      experience: Math.max(0, Math.min(100, expScore)),
      education: Math.max(0, Math.min(100, eduScore)),
      keywords: Math.max(0, Math.min(100, kwScore)),
    },
    strengths,
    gaps,
    tags,
    assignedTo: rand() > 0.5 ? 'Sarah Mitchell' : 'Jordan Lee',
    aiScore,
    daysInStage,
    appliedAt: daysAgo(appliedDaysAgo),
    notes,
    timeline,
    portalToken: stageIdx >= 2 ? `PORTAL_${idx}` : undefined,
    hasPortalAccess: stageIdx >= 2,
  }
}

// Generate 500 candidates
export const MOCK_CANDIDATES: MockCandidate[] = Array.from({ length: 500 }, (_, i) => generateCandidate(i + 1))

// Override first 3 with rich pre-built profiles for detail page demos
MOCK_CANDIDATES[0] = {
  ...MOCK_CANDIDATES[0],
  id: 'c_1',
  name: 'Jennifer Park',
  email: 'jennifer.park@email.com',
  phone: '555-0101',
  avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  role: 'Senior Software Engineer',
  jobId: 'job_1',
  stage: 'Screening',
  source: 'LinkedIn',
  location: 'San Francisco, CA',
  yearsExp: 7,
  linkedinUrl: 'https://linkedin.com/in/jennifer-park',
  extractedSkills: ['React', 'TypeScript', 'Node.js', 'System Design', 'AWS', 'PostgreSQL'],
  extractedCompanies: ['Google', 'Stripe'],
  extractedEducation: ['B.S. Computer Science, Stanford University'],
  scoreBreakdown: { skills: 94, experience: 90, education: 95, keywords: 88 },
  strengths: ['6+ years at top-tier companies (Google, Stripe)', 'Open source contributor with 2.4k GitHub stars', 'Led team of 5 engineers at Stripe'],
  gaps: ['No direct experience with ML systems', 'Has not worked in B2B SaaS'],
  tags: ['Star Candidate', 'VIP Referral'],
  aiScore: 92,
  daysInStage: 2,
  notes: [
    { id: 'n1', author: 'Sarah Mitchell', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Had a great initial call. Very articulate and clearly passionate about the problem space. Strong recommendation for next round.', createdAt: '1d ago' },
    { id: 'n2', author: 'Alex Chen', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Her Stripe experience is very relevant. The distributed systems work she described aligns perfectly with our roadmap.', createdAt: '2h ago' },
  ],
  timeline: [
    { event: 'Referred by Marcus Rodriguez (Google SWE)', date: '4d ago', type: 'applied' },
    { event: 'AI scored resume: 92/100', date: '4d ago', type: 'ai' },
    { event: 'Moved to Screening', date: '3d ago', type: 'stage' },
    { event: 'Phone screen scheduled with Sarah M.', date: '2d ago', type: 'interview' },
  ],
  appliedAt: daysAgo(4),
  portalToken: 'DEMO123',
  hasPortalAccess: true,
}

MOCK_CANDIDATES[1] = {
  ...MOCK_CANDIDATES[1],
  id: 'c_2',
  name: 'David Chen',
  email: 'david.chen@email.com',
  phone: '555-0102',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'Senior Product Manager',
  jobId: 'job_13',
  stage: 'Interview',
  source: 'Referral',
  location: 'New York, NY',
  yearsExp: 6,
  linkedinUrl: 'https://linkedin.com/in/david-chen-pm',
  extractedSkills: ['Product Strategy', 'Data Analysis', 'A/B Testing', 'SQL', 'Figma', 'User Research'],
  extractedCompanies: ['Airbnb', 'HubSpot'],
  extractedEducation: ['MBA, Wharton School', 'B.S. Computer Science, Cornell'],
  scoreBreakdown: { skills: 88, experience: 92, education: 90, keywords: 82 },
  strengths: ['Led 0-to-1 product launches at Airbnb', 'Strong analytical background with CS degree', 'Shipped products used by millions of users'],
  gaps: ['No prior B2B SaaS product experience', 'Limited experience with enterprise customers'],
  tags: ['Culture Fit', 'Strong Technical'],
  aiScore: 88,
  daysInStage: 4,
  appliedAt: daysAgo(8),
  notes: [{ id: 'n3', author: 'Jordan Lee', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', text: 'David was referred by Mike at Airbnb. The case studies he shared show strong product intuition. Excited about this one.', createdAt: '3d ago' }],
  timeline: [
    { event: 'Referred by Mike Torres', date: '8d ago', type: 'applied' },
    { event: 'AI scored resume: 88/100', date: '8d ago', type: 'ai' },
    { event: 'Moved to Screening', date: '7d ago', type: 'stage' },
    { event: 'Screening call completed', date: '6d ago', type: 'interview' },
    { event: 'Moved to Interview', date: '4d ago', type: 'stage' },
  ],
}

MOCK_CANDIDATES[2] = {
  ...MOCK_CANDIDATES[2],
  id: 'c_3',
  name: 'Emily Watson',
  email: 'emily.watson@email.com',
  phone: '555-0103',
  avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  role: 'Senior Product Designer',
  jobId: 'job_16',
  stage: 'Hired',
  source: 'Direct',
  location: 'San Francisco, CA',
  yearsExp: 8,
  linkedinUrl: 'https://linkedin.com/in/emily-watson-design',
  extractedSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing', 'Motion Design'],
  extractedCompanies: ['Figma', 'Dropbox'],
  extractedEducation: ['M.S. Human-Computer Interaction, CMU', 'B.F.A. Graphic Design, RISD'],
  scoreBreakdown: { skills: 97, experience: 91, education: 96, keywords: 94 },
  strengths: ['8 years of experience building design systems at world-class companies', 'Direct Figma experience is a differentiator', 'Outstanding portfolio with measurable impact metrics'],
  gaps: ['No prior experience at a B2B company'],
  tags: ['Star Candidate', 'Top-tier'],
  aiScore: 94,
  daysInStage: 1,
  appliedAt: daysAgo(21),
  notes: [],
  timeline: [
    { event: 'Applied directly via career site', date: '21d ago', type: 'applied' },
    { event: 'AI scored resume: 94/100', date: '21d ago', type: 'ai' },
    { event: 'Moved to Screening', date: '20d ago', type: 'stage' },
    { event: 'Phone screen with Jordan L.', date: '18d ago', type: 'interview' },
    { event: 'Moved to Interview', date: '16d ago', type: 'stage' },
    { event: 'Panel interview completed', date: '13d ago', type: 'interview' },
    { event: 'Moved to Offer', date: '10d ago', type: 'stage' },
    { event: 'Offer accepted 🎉', date: '1d ago', type: 'stage' },
  ],
}
