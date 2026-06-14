// ─── Mock Offers — 100 realistic offer records ──────────────────────

export interface MockOffer {
  id: string
  candidateId: string
  jobId: string
  role: string
  amount: string
  equity: string
  bonus: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
  sentDate: string
  expiryDate: string
  startDate?: string
}

function seededRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const ROLES = [
  'Senior Software Engineer', 'Staff Engineer', 'Engineering Manager',
  'Product Manager', 'Senior Product Manager', 'Senior Product Designer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer',
  'Backend Engineer', 'Frontend Engineer', 'QA Engineer',
  'VP of Marketing', 'Account Executive', 'Customer Success Manager',
]

const SALARY_RANGES: Record<string, [number, number]> = {
  'Senior Software Engineer': [150000, 190000],
  'Staff Engineer': [200000, 260000],
  'Engineering Manager': [185000, 240000],
  'Product Manager': [140000, 175000],
  'Senior Product Manager': [165000, 205000],
  'Senior Product Designer': [140000, 175000],
  'Data Scientist': [145000, 185000],
  'ML Engineer': [175000, 220000],
  'DevOps Engineer': [130000, 165000],
  'Backend Engineer': [120000, 155000],
  'Frontend Engineer': [120000, 155000],
  'QA Engineer': [100000, 130000],
  'VP of Marketing': [200000, 260000],
  'Account Executive': [120000, 300000],
  'Customer Success Manager': [80000, 110000],
}

const STATUSES: MockOffer['status'][] = ['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired']
// Distribution: accepted=30%, sent=20%, viewed=15%, declined=15%, expired=10%, draft=10%
const STATUS_DIST = ['accepted', 'accepted', 'accepted', 'sent', 'sent', 'viewed', 'declined', 'declined', 'expired', 'draft']

const JOB_IDS = Array.from({ length: 36 }, (_, i) => `job_${i + 1}`)
const CANDIDATE_IDS = Array.from({ length: 200 }, (_, i) => `c_${i + 4}`)

function formatOfferDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const now = Date.now()

function generateOffer(idx: number): MockOffer {
  const rand = seededRand(idx * 229 + 13)
  
  const role = ROLES[idx % ROLES.length]
  const [minSalary, maxSalary] = SALARY_RANGES[role] || [100000, 150000]
  const salary = Math.round((minSalary + rand() * (maxSalary - minSalary)) / 1000) * 1000
  
  const sentDaysAgo = 1 + Math.floor(rand() * 60)
  const expiryDaysAfterSent = 7 + Math.floor(rand() * 7)
  
  const sentTimestamp = now - sentDaysAgo * 86400000
  const expiryTimestamp = sentTimestamp + expiryDaysAfterSent * 86400000
  
  const status = STATUS_DIST[idx % STATUS_DIST.length] as MockOffer['status']
  
  const equityPcts = ['0.05%', '0.1%', '0.15%', '0.2%', '0.25%', '0.5%', '1.0%']
  const bonusPcts = ['$10,000', '$15,000', '$20,000', '$25,000', '$30,000', '$50,000']
  
  return {
    id: `off_${idx}`,
    candidateId: CANDIDATE_IDS[idx % CANDIDATE_IDS.length],
    jobId: JOB_IDS[idx % JOB_IDS.length],
    role,
    amount: `$${salary.toLocaleString()}`,
    equity: equityPcts[Math.floor(rand() * equityPcts.length)],
    bonus: bonusPcts[Math.floor(rand() * bonusPcts.length)],
    status,
    sentDate: formatOfferDate(sentTimestamp),
    expiryDate: formatOfferDate(expiryTimestamp),
    startDate: status === 'accepted' ? formatOfferDate(now + 14 * 86400000) : undefined,
  }
}

// First offer is the featured Emily Watson accepted offer
export const MOCK_OFFERS: MockOffer[] = [
  {
    id: 'off_1',
    candidateId: 'c_3',
    jobId: 'job_16',
    role: 'Senior Product Designer',
    amount: '$155,000',
    equity: '0.1%',
    bonus: '$20,000',
    status: 'accepted',
    sentDate: 'Oct 10, 2023',
    expiryDate: 'Oct 17, 2023',
    startDate: 'Nov 1, 2023',
  },
  {
    id: 'off_2',
    candidateId: 'c_2',
    jobId: 'job_13',
    role: 'Senior Product Manager',
    amount: '$175,000',
    equity: '0.15%',
    bonus: '$25,000',
    status: 'sent',
    sentDate: formatOfferDate(now - 3 * 86400000),
    expiryDate: formatOfferDate(now + 4 * 86400000),
  },
  ...Array.from({ length: 98 }, (_, i) => generateOffer(i + 3)),
]
