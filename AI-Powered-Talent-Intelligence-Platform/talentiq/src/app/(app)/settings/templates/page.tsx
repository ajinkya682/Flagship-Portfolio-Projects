'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, FileText, Mail, FileSignature, XCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface Template {
  _id: string
  name: string
  type: string
  subject?: string
  body: string
  isActive: boolean
  updatedAt: string
}

export default function TemplatesSettingsPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    subject: '',
    body: ''
  })

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      if (!res.ok) throw new Error('Failed to fetch templates')
      const data = await res.json()
      setTemplates(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save template')
      const newTemplate = await res.json()
      
      setTemplates([newTemplate, ...templates])
      setIsModalOpen(false)
      setFormData({ name: '', type: 'email', subject: '', body: '' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'email': return <Mail size={16} className="text-blue-500" />
      case 'offer': return <FileSignature size={16} className="text-emerald-500" />
      case 'hire': return <FileText size={16} className="text-purple-500" />
      case 'rejection': return <XCircle size={16} className="text-red-500" />
      default: return <FileText size={16} className="text-neutral-500" />
    }
  }

  return (
    <div className="flex flex-col gap-[32px] max-w-[1000px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-bold text-neutral-900 tracking-tight">Templates</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Manage email and document templates for your hiring workflow.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center justify-center gap-[8px]"
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-[16px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-[40px] flex justify-center"><LoadingSpinner /></div>
        ) : templates.length === 0 ? (
          <div className="p-[60px] flex flex-col items-center justify-center text-center">
            <div className="w-[48px] h-[48px] bg-blue-50 rounded-full flex items-center justify-center mb-[16px]">
              <FileText size={24} className="text-blue-500" />
            </div>
            <h3 className="font-display text-[16px] font-bold text-neutral-900 mb-[4px]">No templates yet</h3>
            <p className="font-body text-[14px] text-neutral-500 mb-[24px] max-w-[300px]">Create standardized email and document templates to speed up your hiring process.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-[36px] px-[16px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors shadow-sm"
            >
              Create First Template
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {templates.map(t => (
              <div key={t._id} className="p-[20px] hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[40px] h-[40px] bg-white border border-neutral-200 rounded-[10px] flex items-center justify-center shadow-sm">
                    {getTypeIcon(t.type)}
                  </div>
                  <div>
                    <h4 className="font-body text-[15px] font-bold text-neutral-900 flex items-center gap-[8px]">
                      {t.name}
                      {!t.isActive && <span className="px-[6px] py-[2px] bg-neutral-100 text-neutral-500 rounded-[4px] text-[10px] uppercase font-bold tracking-wider">Draft</span>}
                    </h4>
                    <p className="font-body text-[13px] text-neutral-500 capitalize">{t.type} Template • Last updated {new Date(t.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="h-[32px] px-[12px] bg-white border border-neutral-200 text-neutral-600 rounded-[6px] text-[12px] font-semibold hover:bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-[6px]">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-[20px]">
          <div className="bg-white rounded-[24px] w-full max-w-[600px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-[24px] border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="font-display text-[20px] font-bold text-neutral-900">Create Template</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-[24px] overflow-y-auto flex-1">
              {error && (
                <div className="mb-[20px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body">
                  {error}
                </div>
              )}
              
              <form id="template-form" onSubmit={handleSave} className="flex flex-col gap-[20px]">
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-body text-[13px] font-semibold text-neutral-700">Template Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required 
                      placeholder="e.g. Initial Interview Invite"
                      className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-body text-[13px] font-semibold text-neutral-700">Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="offer">Offer Letter</option>
                      <option value="hire">Hire Letter</option>
                      <option value="rejection">Rejection</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'email' && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-body text-[13px] font-semibold text-neutral-700">Subject Line</label>
                    <input 
                      type="text" 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      required 
                      placeholder="e.g. Next Steps at {{company_name}}"
                      className="h-[40px] px-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                    />
                  </div>
                )}

                <div className="flex flex-col gap-[6px]">
                  <label className="font-body text-[13px] font-semibold text-neutral-700 flex justify-between">
                    Template Body
                    <span className="text-[11px] font-normal text-neutral-400">Supports variables like {'{{candidate_name}}'}</span>
                  </label>
                  <textarea 
                    value={formData.body}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                    required 
                    placeholder="Hi {{candidate_name}}, ..."
                    className="h-[200px] p-[12px] bg-white border border-neutral-200 rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none font-mono" 
                  />
                </div>
              </form>
            </div>

            <div className="p-[20px] border-t border-neutral-100 bg-neutral-50 flex justify-end gap-[12px]">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-[38px] px-[16px] bg-white border border-neutral-200 text-neutral-700 font-body text-[13px] font-semibold rounded-[8px] hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="template-form"
                disabled={isSaving}
                className="h-[38px] px-[20px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[13px] font-semibold rounded-[8px] shadow-sm transition-colors flex items-center justify-center gap-[8px]"
              >
                {isSaving && <LoadingSpinner size="sm" />} Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
