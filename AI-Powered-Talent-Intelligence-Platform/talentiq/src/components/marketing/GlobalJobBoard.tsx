'use client'

import { useState } from 'react'
import { 
  Search, MapPin, Briefcase, Building, ArrowRight, DollarSign, 
  CheckCircle2, Bookmark, User2, ClipboardCheck, Users
} from 'lucide-react'
import Link from 'next/link'

interface PopulatedJob {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  remoteType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  publishedAt?: string;
  closedAt?: string;
  applicantCount?: number;
  slug?: string;
  company: {
    name: string;
    logo?: string;
    slug: string;
  };
}

export default function GlobalJobBoard({ initialJobs }: { initialJobs: PopulatedJob[] }) {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('latest') // 'latest', 'oldest', 'most-applicants'

  // Extract unique filter options
  const departments = ['All', ...Array.from(new Set(initialJobs.map(j => j.department))).filter(Boolean)]
  const locations = ['All', ...Array.from(new Set(initialJobs.map(j => j.location || j.remoteType))).filter(Boolean)]
  const employmentTypes = ['All', ...Array.from(new Set(initialJobs.map(j => j.employmentType))).filter(Boolean)]

  const filteredJobs = initialJobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                            job.company?.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'All' || job.department === deptFilter;
      const matchesType = typeFilter === 'All' || job.employmentType === typeFilter;
      
      const locString = (job.location || '') + ' ' + (job.remoteType || '');
      const matchesLocation = locationFilter === 'All' || locString.includes(locationFilter);

      return matchesSearch && matchesDept && matchesLocation && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.publishedAt || b._id).getTime() - new Date(a.publishedAt || a._id).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt || a._id).getTime() - new Date(b.publishedAt || b._id).getTime();
      }
      if (sortBy === 'most-applicants') {
        return (b.applicantCount || 0) - (a.applicantCount || 0);
      }
      return 0;
    });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="w-full">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-[20px] p-4 shadow-xl shadow-neutral-200/50 border border-neutral-100 mb-12 flex flex-col gap-4 relative z-20">
        
        {/* Top Row: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by job title or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[52px] pl-12 pr-4 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-[15px]"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-[52px] px-4 bg-neutral-50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-[15px] text-neutral-700 cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
            >
              <option value="latest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="most-applicants">Sort: Most Applicants</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full h-[52px] px-4 bg-neutral-50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-[15px] text-neutral-700 cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
            >
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full h-[52px] px-4 bg-neutral-50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-[15px] text-neutral-700 cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
            >
              {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-[52px] px-4 bg-neutral-50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-[15px] text-neutral-700 cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
            >
              {employmentTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Employment Types' : t}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* Results Count */}
      <div className="mb-6 font-medium text-neutral-500">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-100 rounded-[24px] p-12 text-center">
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No jobs found</h3>
          <p className="text-neutral-500">Try adjusting your filters or search term to find what you're looking for.</p>
          <button 
            onClick={() => { setSearch(''); setDeptFilter('All'); setLocationFilter('All'); setTypeFilter('All'); }}
            className="mt-6 text-primary-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => {
            const companySlug = job.company?.slug || 'company';
            const jobSlug = job.slug || job._id;
            const applyUrl = `/careers/${companySlug}/${jobSlug}`;
            
            return (
              <div key={job._id} className="bg-white border border-neutral-200 hover:border-primary-400 rounded-[24px] p-6 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.05)] flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                
                {/* Header Top */}
                <div className="flex items-start justify-between mb-6">
                  {/* Logo & Company Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F4F6FF] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building size={20} className="text-[#3B58F6]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-[15px] tracking-tight line-clamp-1">{job.company?.name || 'Company'}</h4>
                      <p className="text-[12px] text-neutral-500 font-medium lowercase line-clamp-1">{job.department}</p>
                    </div>
                  </div>

                  <button className="w-10 h-10 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0 group-hover:border-primary-200">
                    <Bookmark size={18} className="text-neutral-500 group-hover:text-primary-600" />
                  </button>
                </div>

                {/* Badges: Actively Hiring + Applicant Count */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-semibold text-[#059669]">
                    <CheckCircle2 size={12} />
                    Actively Hiring
                  </div>
                  {(job.applicantCount || 0) > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-[12px] font-semibold text-[#4B5563]">
                      <Users size={12} />
                      {job.applicantCount} {job.applicantCount === 1 ? 'applicant' : 'applicants'}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[22px] font-extrabold text-[#0A101D] leading-[1.2] mb-4 tracking-tight group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[52px]">
                  {job.title}
                </h3>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-[12px] font-medium text-neutral-700">
                    <MapPin size={14} className="text-neutral-400" />
                    {job.location || job.remoteType}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-[12px] font-medium text-neutral-700">
                    <Briefcase size={14} className="text-neutral-400" />
                    {job.employmentType}
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-medium text-[#059669]">
                      <DollarSign size={14} className="text-[#059669]" />
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </div>
                  )}
                </div>

                <div className="h-px w-full bg-neutral-100 mb-6" />

                {/* About the role */}
                <div className="mb-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <User2 size={16} className="text-[#3B58F6]" />
                    <h4 className="text-[14px] font-bold text-neutral-900">About the role</h4>
                  </div>
                  <p className="text-[13px] text-neutral-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Key Responsibilities Preview */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardCheck size={16} className="text-[#3B58F6]" />
                      <h4 className="text-[14px] font-bold text-neutral-900">Responsibilities</h4>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {job.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                          <span className="text-[13px] text-neutral-600 leading-snug line-clamp-2">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-px w-full bg-neutral-100 mb-6 mt-auto" />

                {/* Footer Section */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-neutral-500 font-medium mb-0.5">Posted</p>
                      <p className="text-[13px] font-semibold text-neutral-900">{formatDate(job.publishedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-neutral-500 font-medium mb-0.5">Closes</p>
                      <p className="text-[13px] font-semibold text-neutral-900">{formatDate(job.closedAt)}</p>
                    </div>
                  </div>

                  <Link 
                    href={applyUrl}
                    className="w-full h-[44px] flex items-center justify-center gap-2 bg-[#0A101D] hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <span className="text-[14px]">Apply Now</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
