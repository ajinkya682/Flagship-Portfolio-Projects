'use client'

import { useState, useEffect } from 'react'
import {
  Calendar, Video, Phone, Users, Clock, Filter,
  CheckCircle2, XCircle, FileText, ChevronRight, Play, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useDomainStore } from '@/store/domain.store'
import { useCandidatesStore } from '@/store/candidates.store'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns'

function InterviewCard({ data, candidate, isToday = false }: { data: any; candidate: any; isToday?: boolean }) {
  const Icon = data.type === 'Video' ? Video : Phone

  if (!candidate) return null

  return (
    <div className={`bg-white rounded-[14px] border transition-all hover:shadow-md ${isToday ? 'border-blue-200/60 shadow-sm' : 'border-neutral-100 shadow-sm'}`}>
      {isToday && (
        <div className="h-[4px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-[14px]" />
      )}
      <div className="p-[16px] md:p-[20px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          {/* Left: Info */}
          <div className="flex items-start gap-[14px] flex-1">
            <div className="w-[44px] h-[44px] rounded-[10px] overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shrink-0 border border-neutral-100">
              <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover bg-neutral-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-[8px] mb-[2px]">
                <h3 className="font-display text-[15px] font-bold text-neutral-900 truncate">
                  {candidate.name}
                </h3>
                <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-full uppercase tracking-wider ${
                  data.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 
                  data.status === 'missed' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {data.status}
                </span>
              </div>
              <p className="font-body text-[12px] text-neutral-600 mb-[6px]">{candidate.role}</p>
              <div className="flex items-center gap-[12px] text-[11px] font-medium text-neutral-500">
                <div className="flex items-center gap-[4px]">
                  <Clock size={12} /> {data.time} ({data.duration})
                </div>
                <div className="flex items-center gap-[4px]">
                  <Icon size={12} /> {data.type}
                </div>
                <div className="flex items-center gap-[4px]">
                  <Users size={12} /> {data.interviewer}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-[8px] shrink-0 border-t border-neutral-50 pt-[12px] md:border-t-0 md:pt-0">
            {data.isJoinable && (
              <Link href={`/portal/interviews/room/${data.id}?role=recruiter`} className="flex items-center gap-[6px] h-[34px] px-[14px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[12px] font-semibold rounded-[8px] shadow-sm transition-colors">
                <Play size={12} fill="currentColor" /> Join
              </Link>
            )}
            {data.isMissed && (
              <Link href={`/applications/${candidate.id}`} className="flex items-center gap-[6px] h-[34px] px-[14px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 font-body text-[12px] font-semibold rounded-[8px] transition-colors">
                <Calendar size={13} /> Reschedule
              </Link>
            )}
            {data.status === 'completed' && data.scorecardStatus === 'pending' && (
              <button className="flex items-center gap-[6px] h-[34px] px-[14px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-body text-[12px] font-semibold rounded-[8px] transition-colors">
                <FileText size={13} /> Complete Scorecard
              </button>
            )}
            {data.status === 'completed' && data.scorecardStatus === 'submitted' && (
              <div className="flex items-center gap-[6px] h-[34px] px-[14px] bg-neutral-50 border border-neutral-200 text-neutral-600 font-body text-[12px] font-semibold rounded-[8px]">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Score: {data.rating || 'Yes'}
              </div>
            )}
            <Link href={`/applications/${candidate.id}`} className="h-[34px] w-[34px] flex items-center justify-center border border-neutral-200 rounded-[8px] text-neutral-500 hover:bg-neutral-50 transition-colors">
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch('/api/interviews')
        if (res.ok) {
          const data = await res.json()
          const mapped = data.map((i: any) => {
            const dateObj = new Date(i.scheduledAt)
            const durationMs = (i.duration || 45) * 60000
            const endTime = new Date(dateObj.getTime() + durationMs)
            const now = new Date()

            let dateStr = format(dateObj, 'MMM d, yyyy')
            if (isToday(dateObj)) dateStr = 'Today'
            else if (isTomorrow(dateObj)) dateStr = 'Tomorrow'
            else if (isYesterday(dateObj)) dateStr = 'Yesterday'
            
            const isMissed = i.status === 'scheduled' && now > endTime
            const hoursSinceStart = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
            const isExpired = isMissed && hoursSinceStart > 24
            // Allow joining 15 minutes before the start time
            const isJoinable = i.status === 'scheduled' && now >= new Date(dateObj.getTime() - 15 * 60000) && now <= endTime

            return {
              id: i._id,
              candidateId: i.candidate?._id,
              candidate: { ...i.candidate, id: i.candidate?._id }, // Populated from backend, add id for Link
              date: dateStr,
              dateObj: dateObj,
              time: format(dateObj, 'h:mm a'),
              duration: `${i.duration}m`,
              type: i.locationType === 'phone' ? 'Phone' : 'Video',
              interviewer: 'Alex M.',
              status: isMissed ? 'missed' : i.status,
              scorecardStatus: i.scorecards && i.scorecards.length > 0 ? 'submitted' : 'pending',
              rating: null,
              isJoinable,
              isMissed,
              isExpired
            }
          }).filter((i: any) => !i.isExpired)
          setInterviews(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch interviews', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  const todayInterviews = interviews.filter(i => i.date === 'Today' && !i.isMissed && i.status !== 'completed')
  const upcomingInterviews = interviews.filter(i => (i.dateObj > new Date() || i.date === 'Tomorrow') && i.status === 'scheduled' && i.date !== 'Today')
  const missedInterviews = interviews.filter(i => i.isMissed)
  const pastInterviews = interviews.filter(i => i.status === 'completed')

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">
      {/* Header */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-neutral-100 bg-white shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px] max-w-[1000px] mx-auto w-full">
          <div>
            <div className="flex items-center gap-[10px] mb-[6px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Calendar size={16} className="text-white" />
              </div>
              <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Interviews</h1>
            </div>
            <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage your schedule and submit scorecards</p>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="bg-neutral-50 border border-neutral-200 rounded-[10px] px-[16px] py-[10px] flex items-center gap-[16px]">
              <div className="text-center border-r border-neutral-200 pr-[16px]">
                <p className="font-display text-[18px] font-bold text-neutral-900">{todayInterviews.length}</p>
                <p className="font-body text-[10px] text-neutral-500 uppercase tracking-wide font-semibold mt-[2px]">Today</p>
              </div>
              <div className="text-center">
                <p className="font-display text-[18px] font-bold text-amber-600">
                  {interviews.filter(i => i.scorecardStatus === 'pending').length}
                </p>
                <p className="font-body text-[10px] text-neutral-500 uppercase tracking-wide font-semibold mt-[2px]">Pending Scorecard</p>
              </div>
            </div>
            <button className="h-[40px] px-[16px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[13px] font-semibold rounded-[10px] transition-colors shadow-sm flex items-center gap-[6px]">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-[16px] md:p-[32px]">
        {interviews.length === 0 ? (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[40px] flex flex-col items-center justify-center text-center max-w-[400px]">
              <div className="w-[48px] h-[48px] bg-primary-50 rounded-full flex items-center justify-center mb-[16px]">
                <Calendar size={24} className="text-primary-600" />
              </div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[8px]">No interviews scheduled</h3>
              <p className="font-body text-[13px] text-neutral-500 mb-[20px]">
                You haven't scheduled any interviews yet. Start scheduling interviews with your top candidates to build your team.
              </p>
              <Link 
                href="/applications"
                className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
              >
                View Candidates
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-[32px]">

            {/* Today */}
            {todayInterviews.length > 0 && (
              <section>
                <div className="flex items-center gap-[10px] mb-[16px]">
                  <h2 className="font-display text-[18px] font-bold text-neutral-900">Today</h2>
                  <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-[8px] py-[2px] rounded-full">
                    {todayInterviews.length}
                  </span>
                </div>
                <div className="flex flex-col gap-[12px]">
                  {todayInterviews.map(int => (
                    <InterviewCard key={int.id} data={int} candidate={int.candidate} isToday />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcomingInterviews.length > 0 && (
              <section>
                <div className="flex items-center gap-[10px] mb-[16px]">
                  <h2 className="font-display text-[18px] font-bold text-neutral-900">Upcoming</h2>
                </div>
                <div className="flex flex-col gap-[12px]">
                  {upcomingInterviews.map((int, i) => (
                    <div key={int.id}>
                      {(i === 0 || upcomingInterviews[i-1].date !== int.date) && (
                        <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[8px] ml-[4px]">{int.date}</p>
                      )}
                      <InterviewCard data={int} candidate={int.candidate} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Missed */}
            {missedInterviews.length > 0 && (
              <section>
                <div className="flex items-center gap-[10px] mb-[16px]">
                  <h2 className="font-display text-[18px] font-bold text-neutral-900">Missed</h2>
                </div>
                <div className="flex flex-col gap-[12px]">
                  {missedInterviews.map((int, i) => (
                    <div key={int.id}>
                      {(i === 0 || missedInterviews[i-1].date !== int.date) && (
                        <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[8px] ml-[4px]">{int.date}</p>
                      )}
                      <InterviewCard data={int} candidate={int.candidate} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past / Completed */}
            {pastInterviews.length > 0 && (
              <section>
                <div className="flex items-center gap-[10px] mb-[16px]">
                  <h2 className="font-display text-[18px] font-bold text-neutral-900">Completed</h2>
                </div>
                <div className="flex flex-col gap-[12px]">
                  {pastInterviews.map((int, i) => (
                    <div key={int.id}>
                      {(i === 0 || pastInterviews[i-1].date !== int.date) && (
                        <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[8px] ml-[4px]">{int.date}</p>
                      )}
                      <InterviewCard data={int} candidate={int.candidate} />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
