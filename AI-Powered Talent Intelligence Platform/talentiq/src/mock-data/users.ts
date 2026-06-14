// ─── Demo User Accounts ───────────────────────────────────────────
// 5 pre-built demo personas for role switching

export interface DemoUser {
  id: string
  name: string
  email: string
  password: string // for demo pre-fill
  role: 'admin' | 'recruiter' | 'hiring-manager' | 'viewer'
  avatar: string
  title: string
  department: string
  plan: 'starter' | 'growth' | 'enterprise'
  companyName: string
  bio: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user_1',
    name: 'Sarah Mitchell',
    email: 'sarah@acme.com',
    password: 'demo123',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'Head of Talent Acquisition',
    department: 'People & Culture',
    plan: 'growth',
    companyName: 'Acme Corp',
    bio: 'Building world-class teams for 8+ years. Passionate about data-driven hiring.',
  },
  {
    id: 'user_2',
    name: 'Alex Chen',
    email: 'alex@acme.com',
    password: 'demo123',
    role: 'hiring-manager',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'VP of Engineering',
    department: 'Engineering',
    plan: 'growth',
    companyName: 'Acme Corp',
    bio: 'Leading high-performance engineering teams. Love building products at scale.',
  },
  {
    id: 'user_3',
    name: 'Jordan Lee',
    email: 'jordan@acme.com',
    password: 'demo123',
    role: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    title: 'Senior Technical Recruiter',
    department: 'People & Culture',
    plan: 'growth',
    companyName: 'Acme Corp',
    bio: 'Specializing in technical recruiting for SaaS companies. 5 years of experience.',
  },
  {
    id: 'user_4',
    name: 'Priya Sharma',
    email: 'priya@acme.com',
    password: 'demo123',
    role: 'viewer',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    title: 'HR Business Partner',
    department: 'People & Culture',
    plan: 'growth',
    companyName: 'Acme Corp',
    bio: 'Partnering with business leaders to align talent strategy with company goals.',
  },
  {
    id: 'user_5',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    password: 'demo123',
    role: 'viewer',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    title: 'Engineering Candidate',
    department: 'N/A',
    plan: 'starter',
    companyName: 'TechFlow',
    bio: 'Senior Software Engineer applying for roles at Acme Corp.',
  },
]

export const DEFAULT_USER = DEMO_USERS[0] // Sarah Mitchell - Admin/Recruiter

export function findDemoUser(email: string): DemoUser | undefined {
  return DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
}
