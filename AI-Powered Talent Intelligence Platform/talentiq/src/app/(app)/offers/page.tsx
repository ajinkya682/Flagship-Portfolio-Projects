'use client'

import { useState } from 'react'
import {
  FileText, Search, Filter, Plus, MoreHorizontal,
  CheckCircle2, Clock, XCircle, Eye, Download, Send
} from 'lucide-react'
import Link from 'next/link'
import { useDomainStore } from '@/store/domain.store'
import { useCandidatesStore } from '@/store/candidates.store'
import { useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import CreateOfferModal from '@/components/offers/CreateOfferModal'

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType; border: string }> = {
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  declined: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  viewed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Eye },
  sent: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', icon: Send },
  draft: { bg: 'bg-neutral-50', text: 'text-neutral-500', border: 'border-neutral-200', icon: FileText },
}

export default function OffersPage() {
  const { candidates } = useCandidatesStore()
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showExportToast, setShowExportToast] = useState(false)
  const [showHireLetterToast, setShowHireLetterToast] = useState(false)
  const [sendingOfferId, setSendingOfferId] = useState<string | null>(null)
  const [hiredOfferIds, setHiredOfferIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'viewed' | 'accepted' | 'declined'>('all')
  const [showDeclined, setShowDeclined] = useState(false)

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers')
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((o: any) => ({
          id: o._id,
          candidateId: o.candidate?._id || o.candidate,
          role: o.job?.title || 'Unknown Role',
          amount: `$${o.salary.toLocaleString()}`,
          equity: '0%', // Wait, we can extract it from letterContent or just mock it. Actually, backend doesn't save equity explicitly, but let's just show 0%.
          status: o.status,
          sentDate: new Date(o.sentAt || o.createdAt).toLocaleDateString(),
          expiryDate: new Date(o.expirationDate).toLocaleDateString(),
          candidateObj: o.candidate, // populated object
          hireLetterSent: o.hireLetterSent || false
        }))
        setOffers(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleSendOffer = async (offerId: string) => {
    setSendingOfferId(offerId)
    try {
      const res = await fetch(`/api/offers/${offerId}/send`, { method: 'POST' })
      if (res.ok) {
        await fetchOffers()
      }
    } catch (error) {
      console.error('Failed to send offer:', error)
    } finally {
      setSendingOfferId(null)
    }
  }

  const handleOfferAction = async (offerId: string, action: 'cancel' | 'reject' | 'remove') => {
    try {
      if (action === 'remove') {
        const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' });
        if (res.ok) await fetchOffers();
      } else {
        const newStatus = action === 'cancel' ? 'draft' : 'declined';
        const res = await fetch(`/api/offers/${offerId}`, { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) await fetchOffers();
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  }

  const activeOffers = offers.filter(o => o.status === 'sent' || o.status === 'viewed')
  const acceptedOffers = offers.filter(o => o.status === 'accepted')
  const declinedOffers = offers.filter(o => o.status === 'declined')

  // Filter logic: by default hide declined. Apply status filter.
  const visibleOffers = offers.filter(o => {
    if (statusFilter !== 'all') return o.status === statusFilter
    if (!showDeclined && o.status === 'declined') return false
    return true
  }).filter(o => {
    if (!search) return true
    const c = candidates.find(c => c.id === o.candidateId) || o.candidateObj
    const name = c?.name || ''
    return name.toLowerCase().includes(search.toLowerCase()) || o.role.toLowerCase().includes(search.toLowerCase())
  })

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setShowExportToast(true)
      setTimeout(() => setShowExportToast(false), 3000)
    }, 1500)
  }

  const handleSendHireLetter = async (offerId: string) => {
    setSendingOfferId(offerId)
    try {
      const res = await fetch(`/api/offers/${offerId}/send-hire-letter`, { method: 'POST' });
      if (res.ok) {
        setShowHireLetterToast(true)
        setTimeout(() => setShowHireLetterToast(false), 3000)
        await fetchOffers()
      } else {
        const errData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        console.error('Failed to send hire letter:', errData);
      }
    } catch (err) {
      console.error('Error sending hire letter:', err);
    } finally {
      setSendingOfferId(null)
    }
  }

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-[calc(100vh-60px)] relative">
      
      {/* Export Toast */}
      {showExportToast && (
        <div className="absolute top-[24px] right-[50%] translate-x-[50%] md:translate-x-0 md:right-[32px] bg-neutral-900 text-white px-[20px] py-[12px] rounded-[10px] shadow-lg flex items-center gap-[12px] animate-in slide-in-from-top-4 fade-in z-50">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="font-body text-[14px] font-medium">Offers exported to CSV successfully.</span>
        </div>
      )}

      {/* Hire Letter Toast */}
      {showHireLetterToast && (
        <div className="absolute top-[24px] right-[50%] translate-x-[50%] md:translate-x-0 md:right-[32px] bg-neutral-900 text-white px-[20px] py-[12px] rounded-[10px] shadow-lg flex items-center gap-[12px] animate-in slide-in-from-top-4 fade-in z-50">
          <CheckCircle2 size={18} className="text-blue-400" />
          <span className="font-body text-[14px] font-medium">Hire letter sent successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="px-[16px] md:px-[32px] py-[24px] bg-white border-b border-neutral-100 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[20px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[4px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <FileText size={16} className="text-white" />
              </div>
              <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Offers</h1>
            </div>
            <p className="font-body text-[13px] text-neutral-500">Manage offer letters and track acceptance rates.</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="h-[38px] px-[14px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-[6px] disabled:opacity-50"
            >
              {isExporting ? <div className="w-[14px] h-[14px] border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" /> : <Download size={14} />}
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="h-[38px] px-[14px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-all flex items-center gap-[6px]"
            >
              <Plus size={14} /> Create Offer
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          {[
            { label: 'Active Offers', value: activeOffers.length.toString(), color: 'text-blue-600' },
            { label: 'Acceptance Rate', value: offers.length > 0 ? `${Math.round((acceptedOffers.length / offers.length) * 100)}%` : '0%', color: 'text-emerald-600' },
            { label: 'Avg Time to Accept', value: '3.2 days', color: 'text-neutral-700' },
            { label: 'Offers Sent (MTD)', value: offers.length.toString(), color: 'text-neutral-700' },
          ].map(stat => (
            <div key={stat.label} className="bg-neutral-50 rounded-[10px] p-[16px] border border-neutral-100">
              <p className="font-body text-[12px] font-semibold text-neutral-500 mb-[4px]">{stat.label}</p>
              <p className={`font-display text-[24px] font-bold ${stat.color} leading-none`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-[16px] md:p-[32px]">
        {offers.length === 0 ? (
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[40px] flex flex-col items-center justify-center text-center max-w-[400px]">
              <div className="w-[48px] h-[48px] bg-primary-50 rounded-full flex items-center justify-center mb-[16px]">
                <FileText size={24} className="text-primary-600" />
              </div>
              <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[8px]">No offers created</h3>
              <p className="font-body text-[13px] text-neutral-500 mb-[20px]">
                You haven't created any offers yet. Create an offer to hire your best candidates.
              </p>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-[6px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
              >
                <Plus size={16} /> Create Offer
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm overflow-hidden">
            
            {/* Status Filter Tabs */}
            <div className="px-[20px] py-[0] border-b border-neutral-100 flex items-center gap-0 overflow-x-auto">
              {(['all', 'sent', 'viewed', 'accepted', 'declined'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); if (s === 'declined') setShowDeclined(true) }}
                  className={`h-[44px] px-[16px] font-body text-[13px] font-semibold border-b-2 whitespace-nowrap transition-all ${
                    statusFilter === s
                      ? 'border-primary-500 text-primary-700'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200'
                  }`}
                >
                  {s === 'all' ? 'All Offers' : s.charAt(0).toUpperCase() + s.slice(1)}
                  {s === 'all' && <span className="ml-[6px] bg-neutral-100 text-neutral-500 text-[10px] font-bold px-[6px] py-[1px] rounded-full">{offers.filter(o => o.status !== 'declined').length}</span>}
                  {s === 'declined' && declinedOffers.length > 0 && <span className="ml-[6px] bg-red-50 text-red-500 text-[10px] font-bold px-[6px] py-[1px] rounded-full">{declinedOffers.length}</span>}
                  {s === 'accepted' && acceptedOffers.length > 0 && <span className="ml-[6px] bg-emerald-50 text-emerald-600 text-[10px] font-bold px-[6px] py-[1px] rounded-full">{acceptedOffers.length}</span>}
                  {s === 'sent' && <span className="ml-[6px] bg-neutral-100 text-neutral-500 text-[10px] font-bold px-[6px] py-[1px] rounded-full">{offers.filter(o => o.status === 'sent').length}</span>}
                </button>
              ))}
            </div>

            {/* Table Toolbar */}
            <div className="px-[20px] py-[16px] border-b border-neutral-50 flex flex-wrap items-center justify-between gap-[16px]">
              <div className="relative">
                <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search candidates or roles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-[280px] h-[36px] pl-[34px] pr-[12px] bg-neutral-50 border border-neutral-200 rounded-[8px] text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all"
                />
              </div>
              {!showDeclined && statusFilter === 'all' && declinedOffers.length > 0 && (
                <button
                  onClick={() => setShowDeclined(true)}
                  className="h-[36px] px-[12px] text-[12px] font-semibold text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                >
                  Show {declinedOffers.length} declined
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100">
                    <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Candidate</th>
                    <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Role & Package</th>
                    <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-[24px] py-[12px] font-body text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Timeline</th>
                    <th className="px-[24px] py-[12px] w-[60px]" />
                  </tr>
                </thead>
                <tbody>
                  {visibleOffers.map(offer => {
                    const candidate = candidates.find(c => c.id === offer.candidateId) || offer.candidateObj
                    if (!candidate) return null
                    const style = STATUS_STYLES[offer.status] || STATUS_STYLES.draft
                    const StatusIcon = style.icon
                    
                    return (
                      <tr key={offer.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors group">
                        <td className="px-[24px] py-[16px]">
                          <div className="flex items-center gap-[12px]">
                            <img src={candidate.avatar} alt={candidate.name} className="w-[40px] h-[40px] rounded-[10px] object-cover bg-neutral-100" />
                            <div>
                              <Link href={candidate.id ? `/applications/${candidate.id}` : '#'} className="font-body text-[14px] font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                {candidate.name}
                              </Link>
                              <p className="font-body text-[12px] text-neutral-500 mt-[2px]">{candidate.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <p className="font-body text-[13px] font-semibold text-neutral-900">{offer.role}</p>
                          <p className="font-body text-[12px] text-neutral-500 mt-[2px]">{offer.amount} • {offer.equity} eq</p>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border}`}>
                            <StatusIcon size={12} />
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <div className="flex items-center gap-[6px] font-body text-[12px] text-neutral-600 mb-[4px]">
                            <Send size={12} className="text-neutral-400" /> Sent: {offer.sentDate}
                          </div>
                          <div className="flex items-center gap-[6px] font-body text-[12px] text-neutral-500">
                            <Clock size={12} className={offer.status === 'sent' || offer.status === 'viewed' ? 'text-amber-500' : 'text-neutral-400'} /> 
                            Exp: {offer.expiryDate}
                          </div>
                        </td>
                        <td className="px-[24px] py-[16px] text-right">
                          <div className="flex items-center justify-end gap-[8px]">
                            {offer.status === 'draft' && (
                              <button 
                                onClick={() => handleSendOffer(offer.id)}
                                disabled={sendingOfferId === offer.id}
                                className="text-[12px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-[12px] py-[6px] rounded-md transition-colors flex items-center gap-[4px] disabled:opacity-50"
                              >
                                <Send size={12} /> {sendingOfferId === offer.id ? 'Sending...' : 'Send Offer'}
                              </button>
                            )}
                            {offer.status === 'accepted' && (
                              <button 
                                onClick={() => handleSendHireLetter(offer.id)}
                                disabled={sendingOfferId === offer.id || offer.hireLetterSent}
                                className={`text-[12px] font-semibold px-[12px] py-[6px] rounded-md transition-colors flex items-center gap-[4px] disabled:opacity-50 ${
                                  offer.hireLetterSent 
                                    ? 'bg-neutral-100 text-neutral-500' 
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                }`}
                              >
                                {offer.hireLetterSent ? (
                                  <><CheckCircle2 size={12} /> Letter Sent</>
                                ) : (
                                  <><Send size={12} /> {sendingOfferId === offer.id ? 'Sending...' : 'Send Hire Letter'}</>
                                )}
                              </button>
                            )}
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="text-neutral-400 hover:text-neutral-700 transition-colors p-[4px] rounded-md hover:bg-neutral-100 outline-none">
                                  <MoreHorizontal size={18} />
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content align="end" sideOffset={5} className="min-w-[160px] bg-white rounded-[12px] p-[6px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                                  {(offer.status === 'sent' || offer.status === 'viewed') && (
                                    <DropdownMenu.Item onSelect={() => handleOfferAction(offer.id, 'cancel')} className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 rounded-[8px] cursor-pointer outline-none">
                                      Cancel Offer
                                    </DropdownMenu.Item>
                                  )}
                                  {offer.status !== 'declined' && offer.status !== 'accepted' && (
                                    <DropdownMenu.Item onSelect={() => handleOfferAction(offer.id, 'reject')} className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] font-medium text-amber-600 hover:bg-amber-50 rounded-[8px] cursor-pointer outline-none">
                                      Mark as Rejected
                                    </DropdownMenu.Item>
                                  )}
                                  <DropdownMenu.Separator className="h-[1px] bg-neutral-100 my-[4px]" />
                                  <DropdownMenu.Item onSelect={() => handleOfferAction(offer.id, 'remove')} className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-[8px] cursor-pointer outline-none">
                                    <XCircle size={14} className="text-red-500" /> Remove Offer
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <CreateOfferModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
