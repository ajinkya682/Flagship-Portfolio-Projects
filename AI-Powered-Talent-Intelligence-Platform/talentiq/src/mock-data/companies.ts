// ─── Mock Companies ──────────────────────────────────────────────
// 25 realistic demo companies across industries

export interface MockCompany {
  id: string
  name: string
  industry: string
  size: string
  plan: 'starter' | 'growth' | 'enterprise'
  logo: string
  location: string
  founded: number
}

export const MOCK_COMPANIES: MockCompany[] = [
  { id: 'co_1',  name: 'TechFlow',        industry: 'SaaS',          size: '201-500',    plan: 'enterprise', logo: '🌊', location: 'San Francisco, CA', founded: 2015 },
  { id: 'co_2',  name: 'CloudNova',        industry: 'Cloud Infra',   size: '51-200',     plan: 'growth',     logo: '☁️', location: 'Austin, TX',        founded: 2018 },
  { id: 'co_3',  name: 'ScaleForge',       industry: 'DevTools',      size: '201-500',    plan: 'growth',     logo: '⚙️', location: 'Seattle, WA',       founded: 2017 },
  { id: 'co_4',  name: 'PixelWorks',       industry: 'Design',        size: '11-50',      plan: 'starter',    logo: '🎨', location: 'New York, NY',      founded: 2020 },
  { id: 'co_5',  name: 'HireSphere',       industry: 'HR Tech',       size: '51-200',     plan: 'growth',     logo: '🎯', location: 'Chicago, IL',       founded: 2019 },
  { id: 'co_6',  name: 'DataBridge',       industry: 'Analytics',     size: '501-1000',   plan: 'enterprise', logo: '📊', location: 'Boston, MA',        founded: 2014 },
  { id: 'co_7',  name: 'Meridian AI',      industry: 'Artificial Intelligence', size: '51-200', plan: 'growth', logo: '🤖', location: 'Palo Alto, CA',  founded: 2021 },
  { id: 'co_8',  name: 'VaultEdge',        industry: 'FinTech',       size: '201-500',    plan: 'enterprise', logo: '🏦', location: 'New York, NY',      founded: 2016 },
  { id: 'co_9',  name: 'PulseHealth',      industry: 'HealthTech',    size: '51-200',     plan: 'growth',     logo: '💊', location: 'Denver, CO',        founded: 2019 },
  { id: 'co_10', name: 'Orbis Labs',       industry: 'Biotech',       size: '11-50',      plan: 'starter',    logo: '🔬', location: 'Cambridge, MA',     founded: 2022 },
  { id: 'co_11', name: 'NexGen Robotics',  industry: 'Robotics',      size: '51-200',     plan: 'growth',     logo: '🦾', location: 'Detroit, MI',       founded: 2018 },
  { id: 'co_12', name: 'ClearPath',        industry: 'LegalTech',     size: '51-200',     plan: 'growth',     logo: '⚖️', location: 'Washington, DC',    founded: 2017 },
  { id: 'co_13', name: 'Luminary Media',   industry: 'Media',         size: '201-500',    plan: 'enterprise', logo: '📡', location: 'Los Angeles, CA',   founded: 2013 },
  { id: 'co_14', name: 'Apex Commerce',    industry: 'E-Commerce',    size: '501-1000',   plan: 'enterprise', logo: '🛒', location: 'Miami, FL',         founded: 2012 },
  { id: 'co_15', name: 'Terranova Games',  industry: 'Gaming',        size: '51-200',     plan: 'growth',     logo: '🎮', location: 'San Jose, CA',      founded: 2019 },
  { id: 'co_16', name: 'GreenLeaf Energy', industry: 'CleanTech',     size: '51-200',     plan: 'growth',     logo: '🌿', location: 'Portland, OR',      founded: 2018 },
  { id: 'co_17', name: 'Cipher Security',  industry: 'Cybersecurity', size: '201-500',    plan: 'enterprise', logo: '🔐', location: 'Arlington, VA',     founded: 2015 },
  { id: 'co_18', name: 'Logistiq',         industry: 'Supply Chain',  size: '201-500',    plan: 'enterprise', logo: '🚚', location: 'Dallas, TX',        founded: 2014 },
  { id: 'co_19', name: 'EduPath',          industry: 'EdTech',        size: '51-200',     plan: 'growth',     logo: '📚', location: 'San Francisco, CA', founded: 2020 },
  { id: 'co_20', name: 'AeroSync',         industry: 'Aerospace',     size: '51-200',     plan: 'growth',     logo: '✈️', location: 'Houston, TX',       founded: 2017 },
  { id: 'co_21', name: 'Rootline',         industry: 'PropTech',      size: '11-50',      plan: 'starter',    logo: '🏠', location: 'Nashville, TN',     founded: 2021 },
  { id: 'co_22', name: 'SpendWise',        industry: 'FinTech',       size: '51-200',     plan: 'growth',     logo: '💳', location: 'San Francisco, CA', founded: 2020 },
  { id: 'co_23', name: 'Prism Analytics',  industry: 'Analytics',     size: '201-500',    plan: 'enterprise', logo: '🔮', location: 'Atlanta, GA',       founded: 2016 },
  { id: 'co_24', name: 'HealthBridge',     industry: 'HealthTech',    size: '201-500',    plan: 'enterprise', logo: '🏥', location: 'Minneapolis, MN',   founded: 2015 },
  { id: 'co_25', name: 'Acme Corp',        industry: 'SaaS',          size: '201-500',    plan: 'growth',     logo: '🏢', location: 'San Francisco, CA', founded: 2016 },
]

export const DEFAULT_COMPANY = MOCK_COMPANIES[24] // Acme Corp
