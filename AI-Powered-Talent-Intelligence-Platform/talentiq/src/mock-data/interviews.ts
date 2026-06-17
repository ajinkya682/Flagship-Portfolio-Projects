// ─── Mock Interviews — 300 realistic interview records ─────────────

export interface MockInterview {
  id: string
  candidateId: string
  jobId: string
  type: 'Video' | 'Phone' | 'Onsite'
  duration: string
  date: string
  time: string
  interviewer: string
  interviewerAvatar: string
  status: 'scheduled' | 'completed' | 'cancelled'
  scorecardStatus: 'pending' | 'submitted'
  rating?: string
  joinLink?: string
  notes?: string
}

function seededRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const now = Date.now()
const INTERVIEWERS = [
  { name: 'Alex Chen',      avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sarah Mitchell', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Jordan Lee',     avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { name: 'Priya Sharma',   avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { name: 'Mike Torres',    avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { name: 'Nadia Okonkwo',  avatar: 'https://randomuser.me/api/portraits/women/37.jpg' },
]

const TIMES = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM']
const DURATIONS = ['30m', '45m', '60m', '90m']
const TYPES: MockInterview['type'][] = ['Video', 'Phone', 'Onsite']
const RATINGS = ['Strong Yes', 'Yes', 'Lean Yes', 'Lean No', 'No', 'Strong No']

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const diff = d.getTime() - now
  const daysDiff = Math.round(diff / 86400000)
  
  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Tomorrow'
  if (daysDiff === -1) return 'Yesterday'
  if (daysDiff > 0) return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

// Candidate IDs for interviews — spread across candidates in Screening/Interview stages
// We'll reference candidates that will be in those stages
const CANDIDATE_IDS = Array.from({ length: 200 }, (_, i) => `c_${i + 4}`) // skip c_1,2,3 which are featured
const JOB_IDS = Array.from({ length: 36 }, (_, i) => `job_${i + 1}`)

function generateInterview(idx: number): MockInterview {
  const rand = seededRand(idx * 191 + 77)
  
  const candidateId = CANDIDATE_IDS[idx % CANDIDATE_IDS.length]
  const jobId = JOB_IDS[idx % JOB_IDS.length]
  const interviewer = INTERVIEWERS[Math.floor(rand() * INTERVIEWERS.length)]
  const type = TYPES[Math.floor(rand() * TYPES.length)]
  const duration = DURATIONS[Math.floor(rand() * DURATIONS.length)]
  const time = TIMES[Math.floor(rand() * TIMES.length)]
  
  // Spread across past (50%), today (10%), upcoming (40%)
  const roll = rand()
  let dateTimestamp: number
  let status: MockInterview['status']
  let scorecardStatus: MockInterview['scorecardStatus']
  let rating: string | undefined
  
  if (roll < 0.5) {
    // Past interview
    const daysBack = 1 + Math.floor(rand() * 30)
    dateTimestamp = now - daysBack * 86400000
    status = rand() > 0.15 ? 'completed' : 'cancelled'
    scorecardStatus = status === 'completed' && rand() > 0.3 ? 'submitted' : 'pending'
    if (scorecardStatus === 'submitted') {
      rating = RATINGS[Math.floor(rand() * RATINGS.length)]
    }
  } else if (roll < 0.6) {
    // Today
    dateTimestamp = now
    status = 'scheduled'
    scorecardStatus = 'pending'
  } else {
    // Upcoming
    const daysAhead = 1 + Math.floor(rand() * 14)
    dateTimestamp = now + daysAhead * 86400000
    status = 'scheduled'
    scorecardStatus = 'pending'
  }
  
  return {
    id: `int_${idx}`,
    candidateId,
    jobId,
    type,
    duration,
    date: formatDate(dateTimestamp),
    time,
    interviewer: interviewer.name,
    interviewerAvatar: interviewer.avatar,
    status,
    scorecardStatus,
    rating,
    joinLink: type === 'Video' ? `https://meet.google.com/demo-${idx}` : undefined,
  }
}

// First 3 are pre-built for demo
const FEATURED_INTERVIEWS: MockInterview[] = [
  {
    id: 'int_1',
    candidateId: 'c_1',
    jobId: 'job_1',
    type: 'Video',
    duration: '45m',
    date: 'Today',
    time: '10:00 AM',
    interviewer: 'Alex Chen',
    interviewerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'scheduled',
    scorecardStatus: 'pending',
    joinLink: 'https://meet.google.com/demo-int-1',
  },
  {
    id: 'int_2',
    candidateId: 'c_2',
    jobId: 'job_13',
    type: 'Phone',
    duration: '30m',
    date: 'Tomorrow',
    time: '1:30 PM',
    interviewer: 'Sarah Mitchell',
    interviewerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'scheduled',
    scorecardStatus: 'pending',
  },
  {
    id: 'int_3',
    candidateId: 'c_3',
    jobId: 'job_16',
    type: 'Video',
    duration: '60m',
    date: 'Yesterday',
    time: '2:00 PM',
    interviewer: 'Alex Chen',
    interviewerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'completed',
    scorecardStatus: 'submitted',
    rating: 'Strong Yes',
  },
]

export const MOCK_INTERVIEWS: MockInterview[] = [
  ...FEATURED_INTERVIEWS,
  ...Array.from({ length: 297 }, (_, i) => generateInterview(i + 4)),
]
